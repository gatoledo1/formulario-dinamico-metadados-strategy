---
skill_id: dynamic-form-agent
name: Dynamic Form Architecture — Agent Manual
version: 2.0
type: agent-skill
extends: dynamic-form-knowledge
requires: [Knowledge.md]
priority: critical
language: pt-BR
domain: frontend-engineering
tags: [react, forms, agent-behavior, decision-process, factory-pattern, strategy-pattern]
---

# Agent.md — Manual Operacional do Agente

> Antes de executar qualquer ação, carregue e consulte `Knowledge.md`. Em caso de conflito de regras, `Knowledge.md` tem prioridade. Este documento **não explica a arquitetura** — apenas como o agente deve decidir, agir e responder dentro dela.

---

## 1. Missão

Capacitar um agente de IA a projetar, manter, evoluir e gerar formulários dinâmicos baseados em metadados, preservando a separação de responsabilidades entre configuração, renderização e orquestração.

---

## 2. Dependências

- `Knowledge.md` (obrigatório, sempre carregado primeiro).
- Conforme a tarefa, o agente deve carregar adicionalmente a Skill de `Extensions/`, `Components/`, `Patterns/` ou `Examples/` relevante (ver `Prompts/` para combinações recomendadas).

---

## 3. Objetivo

Definir o modelo de decisão, as regras de comportamento e os critérios de qualidade que o agente deve aplicar sempre que receber uma solicitação relacionada a esta arquitetura.

---

## 4. Modelo Mental Obrigatório

Sempre enxergar o sistema como:

```
Metadado → Renderer → UI
```

e

```
Estado → Orquestrador → Metadado → Renderer
```

Nunca inverter esse fluxo, independentemente de como a solicitação foi formulada.

---

## 5. Responsabilidades

### Pertence a esta Skill
- Processo de decisão sobre em qual camada uma mudança deve ocorrer.
- Critérios para aceitar ou recusar uma solicitação que viole a arquitetura.
- Checklist de revisão antes de entregar qualquer código.

### Não pertence a esta Skill
- Definição de arquitetura (está em `Knowledge.md`).
- Detalhes de implementação de uma extensão específica (estão em `Extensions/*`).

---

## 6. Entradas Esperadas

O agente pode receber:

```js
// Metadado
[{ type: "inputTextOrNumber", name: "pessoa.nome" }]
```

```jsx
// Renderer
<DynamicForm dataFields={fields} />
```

```jsx
// Orquestrador
const formik = useFormik(...)
```

Ou solicitações em linguagem natural: "adicione um campo CPF", "crie um novo tipo de componente", "adicione validação", "integre busca por CEP", "migre para RHF".

---

## 7. Regras Obrigatórias (Processo de Decisão)

### Passo 1 — Identificar a camada
Pergunta: *"Isso pertence ao Metadado, ao Renderer ou ao Orquestrador?"*

| Pedido | Camada |
|---|---|
| Novo campo, nova validação, nova condição, nova requisição | Metadado |
| Novo tipo visual de componente | Renderer |
| Navegação, efeitos de página, integração com o estado | Orquestrador |

### Passo 2 — Avaliar acoplamento
Pergunta: *"A mudança obriga outra camada a conhecer algo que não deveria?"*
Se a resposta for sim, redesenhar a solução antes de implementar.

### Passo 3 — Verificar extensibilidade
Pergunta: *"Um próximo campo semelhante poderá reutilizar isso sem duplicar código?"*

### Passo 4 — Verificar compatibilidade
Pergunta: *"Formik, React Hook Form e `useState` continuam sendo opções válidas depois desta mudança?"*

---

## 8. Regras de Implementação

**Regra 1 — Renderer não conhece negócio.**
Permitido: `switch(field.type)`. Proibido: `if(cliente.tipo === "VIP")`.

**Regra 2 — Validações pertencem ao campo.**
Permitido: `validate: (v) => !v ? "Obrigatório" : ""`. Proibido: `if(field.name === "nome")` dentro de um validador genérico.

**Regra 3 — APIs configuradas pelo metadado.**
Permitido: `iconActionBtn: buscarCep`. Proibido: `fetch("/api")` dentro do Renderer.

**Regra 4 — Campos ocultos não geram erro.**
`condition: false` implica `validate` ignorado.

**Regra 5 — Adicionar campo não exige alteração estrutural.**
Apenas um novo objeto no array de metadado.

**Regra 6 — Adicionar novo componente exige apenas:**
novo `type` no metadado + novo `case` no Renderer. Nada mais.

---

## 9. Anti-Padrões

- Regra de negócio no Renderer: `if(usuario.vip)` dentro do `switch`.
- API dentro do Renderer: `fetch(...)` no componente visual.
- Campo hardcoded: `<TextField />` direto no JSX quando deveria vir do metadado.
- Validação espalhada: `if(nome) if(email) if(cpf)` fora dos próprios campos.

---

## 10. Never Do

- Nunca colocar regra de negócio no Renderer.
- Nunca alterar o `DynamicForm` para resolver um problema de domínio específico.
- Nunca duplicar validações.
- Nunca mover lógica do Metadado para a UI.
- Nunca assumir Formik como dependência obrigatória ao escrever exemplos genéricos.

---

## 11. Quando NÃO Utilizar Esta Skill

- Para consultar a definição da arquitetura em si → use `Knowledge.md` diretamente.
- Para gerar um formulário completo a partir de um prompt pronto → use a Skill correspondente em `Prompts/`.

---

## 12. Output Contract

Antes de responder, o agente deve confirmar:
- a arquitetura foi preservada;
- nenhuma responsabilidade foi movida de camada;
- não houve aumento de acoplamento;
- o Renderer permaneceu genérico;
- o Metadado continua sendo a fonte da verdade;
- a solução permanece compatível com diferentes gerenciadores de estado;
- impactos arquiteturais relevantes foram explicados ao usuário.

---

## 13. Checklist Final

- [ ] Renderer continua genérico?
- [ ] Metadado continua sendo a fonte da verdade?
- [ ] Validação está próxima do campo?
- [ ] Campo oculto não valida?
- [ ] Novo componente exige apenas novo `case`?
- [ ] Nenhuma regra de negócio vazou para a UI?
- [ ] Continua compatível com múltiplos gerenciadores de estado?
