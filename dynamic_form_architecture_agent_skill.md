---
skill_id: dynamic-form-architecture
name: Dynamic Form Architecture
version: 2.0
type: agent-skill
language: pt-BR
domain: frontend-engineering
tags:
  - react
  - forms
  - metadata-driven-ui
  - formik
  - react-hook-form
  - factory-pattern
  - strategy-pattern
---

- _Antes de executar qualquer ação, carregue e consulte a skill de conhecimento (knowledge skill) `dynamic_form_architecture_skill.md`, se houver conflito de regras, o knowledge skill tem prioridade._
- _Sempre consulte a skill de conhecimento para decisões técnicas e regras_


# Dynamic Form Architecture

## Missão

Capacitar um agente de IA a projetar, manter, evoluir e gerar formulários dinâmicos baseados em metadados, preservando separação de responsabilidades entre configuração, renderização e orquestração.

---

# Contexto

Esta arquitetura utiliza três camadas independentes:

1. Metadado
2. Renderer (Factory)
3. Orquestrador (Strategy)

O objetivo é garantir que regras de negócio, validações, exibição condicional e integrações sejam descritas como dados, e não espalhadas pela camada visual.

---

# Objetivos da Skill

Ao utilizar esta Skill, o agente deve ser capaz de:

- criar novos formulários dinâmicos;
- adicionar novos tipos de campo;
- implementar validações;
- criar exibições condicionais;
- integrar APIs;
- trocar gerenciadores de estado;
- identificar violações arquiteturais;
- propor melhorias sem aumentar acoplamento.

---

# Entradas Esperadas

O agente pode receber:

### Metadados

```js
[
  {
    type: "inputTextOrNumber",
    name: "pessoa.nome"
  }
]
```

### Renderer

```jsx
<DynamicForm dataFields={fields} />
```

### Orquestrador

```jsx
const formik = useFormik(...)
```

### Solicitações

Exemplos:

- "adicione um campo CPF"
- "crie um novo tipo de componente"
- "adicione validação"
- "integre busca por CEP"
- "migre para RHF"

---

# Saídas Esperadas

O agente deve produzir:

- código aderente à arquitetura;
- metadados consistentes;
- novos tipos de campo;
- validações;
- refatorações;
- documentação;
- análises arquiteturais.

---

# Modelo Mental Obrigatório

Sempre enxergar o sistema como:

```text
Metadado
    ↓
Renderer
    ↓
UI
```

e

```text
Estado
    ↓
Orquestrador
    ↓
Metadado
    ↓
Renderer
```

Nunca inverter esse fluxo.

---

# Regras Arquiteturais

## Regra 1

Renderer não conhece negócio.

Permitido:

```jsx
switch(field.type)
```

Proibido:

```jsx
if(cliente.tipo === "VIP")
```

---

## Regra 2

Validações pertencem ao campo.

Permitido:

```js
validate: (v) => !v ? "Obrigatório" : ""
```

Proibido:

```js
if(field.name === "nome")
```

em validadores genéricos.

---

## Regra 3

APIs devem ser configuradas pelo metadado.

Permitido:

```js
iconActionBtn: buscarCep
```

Proibido:

```jsx
fetch("/api")
```

dentro do Renderer.

---

## Regra 4

Campos ocultos não devem gerar erro.

```js
condition: false
```

Implica:

```js
validate === ignorado
```

---

## Regra 5

Adicionar campo não deve exigir alteração estrutural.

Apenas:

- novo objeto no metadado.

---

## Regra 6

Adicionar novo componente exige:

- novo type;
- novo case no renderer.

Nada mais.

---

# Processo de Raciocínio

Quando receber uma alteração:

## Passo 1

Identificar a camada.

Pergunta:

"Isso pertence ao metadado, renderer ou orquestrador?"

---

## Passo 2

Avaliar acoplamento.

Pergunta:

"A mudança obriga outra camada a conhecer algo que não deveria?"

---

## Passo 3

Verificar extensibilidade.

Pergunta:

"Um próximo campo semelhante poderá reutilizar isso?"

---

## Passo 4

Verificar compatibilidade.

Pergunta:

"Formik, RHF e useState continuam possíveis?"

---

# Estratégias de Exibição

## Condition

```js
condition: valor === true
```

## Combinação

```js
condition
```

---

# Estratégias de Validação

Validação deve ser:

- local;
- declarativa;
- independente.

Exemplo:

```js
validate: (value) => {
  if (!value) return "Obrigatório";
  return "";
}
```

---

# Estratégias de Integração

## OnBlur

Validação assíncrona.

## InputRef

Carga inicial.

## Action Button

Ação explícita do usuário.

## Infinite Scroll

Busca paginada.

---

# Anti-Padrões

O agente deve evitar:

### Regra de negócio no Renderer

```jsx
if(usuario.vip)
```

### API dentro do Renderer

```jsx
fetch(...)
```

### Campo hardcoded

```jsx
<TextField />
```

quando deveria vir do metadado.

### Validação espalhada

```js
if(nome)
if(email)
if(cpf)
```

fora dos próprios campos.

---

# Checklist de Revisão

Antes de finalizar alterações:

- [ ] Renderer continua genérico?
- [ ] Metadado continua sendo a fonte da verdade?
- [ ] Validação está próxima do campo?
- [ ] Campo oculto não valida?
- [ ] Novo componente exige apenas novo case?
- [ ] Nenhuma regra de negócio vazou para UI?
- [ ] Continua compatível com múltiplos gerenciadores?

---

# Critérios de Qualidade

Uma implementação é considerada correta quando:

- adiciona funcionalidades sem aumentar acoplamento;
- mantém fluxo unidirecional;
- preserva separação de responsabilidades;
- reduz duplicação;
- continua extensível.

---

# Resposta Esperada do Agente

Ao receber solicitações relacionadas a formulários:

1. Identificar a camada afetada.
2. Aplicar a alteração na camada correta.
3. Preservar o fluxo Metadado → Renderer → UI.
4. Evitar lógica de negócio no Renderer.
5. Priorizar configuração por dados.
6. Explicar impactos arquiteturais quando necessário.
