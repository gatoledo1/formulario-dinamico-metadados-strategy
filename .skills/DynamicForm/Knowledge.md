---
skill_id: dynamic-form-knowledge
name: Dynamic Form Architecture — Knowledge Base
version: 1.0
type: knowledge-skill
extends: null
requires: []
priority: critical
language: pt-BR
domain: frontend-engineering
tags: [react, forms, metadata-driven-ui, factory-pattern, strategy-pattern, architecture]
---

# Knowledge.md — Dynamic Form Architecture

> Esta é a **fonte de verdade** da arquitetura. Todas as demais Skills (Extensions, Components, Patterns, Examples, Prompts) assumem este documento como base e não devem redefinir ou contradizer o que está aqui descrito.

Este documento descreve **o quê** é a arquitetura e **como** ela funciona estruturalmente. Ele não contém instruções de comportamento para agentes — para isso, consulte `Agent.md`.

---

## 1. Missão

Descrever de forma completa e autocontida a arquitetura de formulários dinâmicos baseada em metadados, para que qualquer agente ou desenvolvedor consiga entender o sistema sem depender de nenhuma outra Skill.

---

## 2. Dependências

Nenhuma. Este é o documento raiz da biblioteca.

---

## 3. Objetivo

Estabelecer o vocabulário, as camadas, o fluxo de dados e os contratos que toda extensão, componente, padrão e exemplo desta biblioteca deve respeitar.

---

## 4. Modelo Mental

A arquitetura existe para resolver um problema específico: **descrever formulários como dados, não como JSX.**

```
Metadado  →  Renderer  →  UI
(o quê)      (como)       (resultado)
```

Três camadas, com responsabilidades estritamente separadas:

| Camada | Papel | Conhece negócio? | Conhece UI? | Conhece estado? |
|---|---|---|---|---|
| **Metadado** | Descreve cada campo (tipo, validação, condição, requisições) | Sim | Não | Lê/escreve via funções injetadas |
| **Renderer** (`DynamicForm`) | Itera o metadado e instancia o componente visual correspondente | Não | Sim | Não |
| **Orquestrador** | Instancia o gerenciador de estado e conecta Metadado ↔ Renderer | Parcial (efeitos de página) | Não | Sim |

---

## 5. Responsabilidades

### Pertence a esta Skill
- Definição das três camadas e seus contratos.
- Anatomia de um campo de metadado.
- Catálogo resumido de tipos de campo (detalhado em `Components/FieldTypes.md`).
- Regras de exibição condicional (`condition`, `paisHomologado`).
- Validação por campo.
- Independência do gerenciador de estado.
- Fluxo de dados unidirecional.

### Não pertence a esta Skill
- Comportamento do agente de IA → `Agent.md`.
- Detalhamento de extensões (steps, async, performance) → `Extensions/*`.
- Exemplos completos de implementação → `Examples/*`.
- Prompts operacionais → `Prompts/*`.

---

## 6. Anatomia de um Campo de Metadado

```js
{
  type: 'inputTextOrNumber',        // qual componente renderizar
  name: 'pessoa.nome',              // caminho dot-notation no estado
  label: 'Nome *',
  value: formManager.values.pessoa?.nome || '',
  onChange: (e) => formManager.setFieldValue('pessoa.nome', e.target.value),
  onBlur: formManager.handleBlur,
  validate: (value) => (!value ? 'Campo obrigatório' : ''),
  error: formManager.touched?.pessoa?.nome && Boolean(formManager.errors?.['pessoa.nome']),
  helperText: formManager.touched?.pessoa?.nome && formManager.errors?.['pessoa.nome'],
  condition: undefined,             // exibição condicional (ver seção 8)
  xs: 12, sm: 6, md: 4, lg: 4,       // grid responsivo
  disabled: false,
}
```

| Propriedade | Papel |
|---|---|
| `type` | Seleciona o `case` no Renderer |
| `name` | Caminho do valor no estado (dot-notation) |
| `value` / `onChange` / `onBlur` | Conectam o campo ao gerenciador de estado |
| `validate` | Validação própria e local do campo |
| `condition` / `paisHomologado` | Regras de exibição |
| `error` / `helperText` | Feedback visual de erro |
| `xs/sm/md/lg` | Layout responsivo (Grid) |

---

## 7. Catálogo Resumido de Tipos

| `type` | Componente |
|---|---|
| `section` | Separador visual de seção |
| `inputTextOrNumber` | Campo de texto/número |
| `inputTextWithButtonInside` | Texto com botão de ação embutido |
| `autocomplete` | Autocomplete com opções locais |
| `infiniteScrollAutocomplete` | Autocomplete paginado/remoto |
| `select` | Lista de opções fixas |
| `datepicker` | Seletor de data |
| `radioGroup` | Grupo de rádio |
| `switch` | Toggle |
| `textArea` | Área de texto |
| `fileUpload` | Upload de arquivos |

Detalhamento completo (props, exemplos, limitações) em `Components/FieldTypes.md`.

---

## 8. Regras Obrigatórias

### Regra 1 — Fluxo unidirecional
```
Estado → Orquestrador → Metadado → Renderer → UI
```
Nunca inverter. O Renderer não escreve no estado; ele apenas dispara os handlers que o metadado já injetou.

### Regra 2 — Exibição condicional
```js
condition: <expressão booleana avaliada com o estado atual>
paisHomologado: <string do país, comparada ao país do sistema>
```
Quando ambos estão presentes, os dois precisam ser verdadeiros. Quando `condition === false`, o campo é ocultado **e sua validação é ignorada automaticamente**.

### Regra 3 — Validação local
Cada campo carrega sua própria função `validate`. Não existe schema externo centralizado nem `if (field.name === 'x')` em validadores genéricos.

### Regra 4 — Requisições desacopladas
Toda chamada HTTP vive no metadado (`inputRef`, `onBlur`, `iconActionBtn`, `fetchFunction`). O Renderer nunca importa um client HTTP.

### Regra 5 — Independência do gerenciador de estado
O Metadado e o Renderer dependem apenas de uma interface mínima: `values`, `setFieldValue`, `touched`, `errors`. Qualquer lib que exponha isso é compatível (Formik, React Hook Form, `useState`).

---

## 9. Anti-Padrões

- Lógica de negócio dentro do Renderer (`if (cliente.tipo === 'VIP')` dentro do `switch`).
- `fetch`/`axios` chamado diretamente dentro do componente `DynamicForm`.
- Validações centralizadas fora do campo (`if(nome) ... if(email) ...`).
- Campos hardcoded em JSX quando deveriam vir do metadado.
- Acoplamento direto a uma lib de formulário específica dentro do Renderer.

---

## 10. Never Do

- Nunca misturar regra de negócio com renderização.
- Nunca validar um campo oculto (`condition === false`).
- Nunca duplicar a mesma validação em múltiplos lugares.
- Nunca fazer o Renderer conhecer a forma do estado (Formik, RHF, etc.).
- Nunca criar um novo tipo de campo sem registrar seu `case` no Renderer.

---

## 11. Quando NÃO Utilizar Esta Skill

- Para decidir como o agente deve se comportar ou redigir respostas → use `Agent.md`.
- Para aprender uma extensão específica (steps, validação assíncrona, performance) → use a Skill de `Extensions/` correspondente.
- Para copiar um exemplo pronto → use `Examples/`.

---

## 12. Output Contract

Qualquer alteração ou explicação baseada nesta Skill deve preservar:
- as três camadas e seus limites de responsabilidade;
- o fluxo unidirecional de dados;
- a regra de que campo oculto não valida;
- a independência do gerenciador de estado;
- o metadado como única fonte de verdade sobre os campos.

---

## 13. Checklist Final

- [ ] As três camadas (Metadado, Renderer, Orquestrador) permanecem com responsabilidades isoladas?
- [ ] O fluxo de dados continua unidirecional?
- [ ] A exibição condicional segue `condition` / `paisHomologado`?
- [ ] A validação está co-localizada com o campo?
- [ ] Não há dependência direta de uma lib de estado específica no Renderer?
