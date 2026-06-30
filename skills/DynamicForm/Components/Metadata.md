---
skill_id: dynamic-form-metadata
name: Dynamic Form — Metadata Component
version: 1.0
type: component-skill
extends: dynamic-form-knowledge
requires: [Knowledge.md]
priority: high
language: pt-BR
domain: frontend-engineering
tags: [react, metadata-driven-ui, contracts, dynamic-form]
---

# Metadata.md — Contrato do Metadado

## 1. Missão
Definir o formato, as propriedades obrigatórias/opcionais e os contratos que todo array de metadado deve respeitar.

## 2. Dependências
- `Knowledge.md`

## 3. Objetivo
Garantir que qualquer metadado novo, escrito por qualquer dev ou agente, seja imediatamente compatível com o Renderer e o Orquestrador existentes.

## 4. Modelo Mental
O metadado é uma **função** que recebe o gerenciador de estado e retorna um array de objetos já conectados a ele:

```js
export const inputsMetadado = (formManager, setStateSnack) => {
  return [
    {
      type: 'inputTextOrNumber',
      name: 'pessoa.nome',
      value: formManager.values.pessoa?.nome || '',
      onChange: (e) => formManager.setFieldValue('pessoa.nome', e.target.value),
    },
    // ...
  ];
};
```

Ser uma função (e não um objeto estático) é o que permite reavaliar `value`, `condition` e `validate` a cada render, refletindo o estado atual.

## 5. Responsabilidades

**Pertence ao Metadado:**
- Definir `type`, `name`, `label`, `value`, `onChange`, `onBlur`.
- Definir `validate` (ver `Extensions/Validation.md`).
- Definir `condition` / `paisHomologado` (ver `Extensions/Conditions.md`).
- Definir integrações HTTP (`onBlur`, `inputRef`, `iconActionBtn`, `fetchFunction` — ver `Extensions/Async.md`).
- Definir layout (`xs/sm/md/lg`).

**Não pertence ao Metadado:**
- Decidir como renderizar visualmente o campo (isso é do Renderer).
- Gerenciar navegação entre etapas (isso é do Orquestrador, ver `Extensions/Steps.md`).

## 6. Contrato Mínimo de um Campo

| Propriedade | Obrigatória? | Tipo |
|---|---|---|
| `type` | Sim | `string` |
| `name` | Sim | `string` (dot-notation) |
| `value` | Sim | `any` |
| `onChange` | Sim (exceto `section`) | `function` |
| `label` | Recomendado | `string` |
| `validate` | Opcional | `function(value) => string` |
| `condition` | Opcional | `boolean \| undefined` |
| `paisHomologado` | Opcional | `string` |
| `xs/sm/md/lg` | Opcional | `number` |

## 7. Regras Obrigatórias
- `name` deve ser único dentro do array (ou dentro do array da etapa, se usado com Steps).
- `name` segue dot-notation e deve ser resolvível por `getNestedFormikValue`.
- `value` nunca deve ser `undefined` sem fallback (`|| ''`), sob risco de warnings de componente não controlado.
- Toda função (`onChange`, `validate`, `onBlur`) deve ser pura em relação ao Renderer — não deve manipular o DOM diretamente.

## 8. Processo de Decisão
Ao adicionar um campo novo:
1. Definir `type` a partir do catálogo existente (`Components/FieldTypes.md`).
2. Definir `name` em dot-notation coerente com o restante do estado.
3. Conectar `value`/`onChange` ao gerenciador de estado recebido como parâmetro.
4. Adicionar `validate` se o campo tiver regra de obrigatoriedade/formato.
5. Adicionar `condition`/`paisHomologado` apenas se a exibição for de fato condicional.

## 9. Anti-Padrões
```js
// Proibido — valor fixo sem conexão com o estado
{ type: 'inputTextOrNumber', name: 'nome', value: 'João' }

// Proibido — lógica de domínio dentro do validate genérico
validate: (value) => {
  if (field.name === 'cpf') { /* ... */ }
}
```

## 10. Never Do
- Nunca deixar `name` divergente do caminho real no objeto de estado.
- Nunca colocar `fetch` direto inline sem isolar em uma função nomeada (dificulta reuso e teste).
- Nunca tornar `value` dependente de efeitos colaterais não rastreáveis.

## 11. Quando NÃO Utilizar Esta Skill
- Para saber qual `type` usar para um caso específico → `Components/FieldTypes.md`.
- Para detalhar `validate` → `Extensions/Validation.md`.

## 12. Output Contract
Todo campo novo deve ser válido segundo a tabela da seção 6 e não deve exigir nenhuma alteração no Renderer (a menos que o `type` seja novo).

## 13. Checklist Final
- [ ] `name` é único e resolvível via dot-notation?
- [ ] `value` tem fallback seguro?
- [ ] `onChange` está conectado ao gerenciador de estado correto?
- [ ] `validate`, se presente, é local e não depende de outros campos via `if(field.name)`?
