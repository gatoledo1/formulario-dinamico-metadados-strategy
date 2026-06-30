---
skill_id: dynamic-form-ext-async
name: Dynamic Form — Async Extension
version: 1.0
type: extension-skill
extends: dynamic-form-knowledge
requires: [Knowledge.md, Components/Metadata.md]
priority: high
language: pt-BR
domain: frontend-engineering
tags: [react, async, fetch, autocomplete, debounce, dynamic-form]
---

# Async.md — Requisições e Integrações Remotas

## 1. Missão
Documentar exclusivamente os padrões de requisição HTTP usados dentro do metadado, mantendo o Renderer livre de qualquer chamada externa.

## 2. Dependências
- `Knowledge.md`
- `Components/Metadata.md`

## 3. Objetivo
Garantir que toda integração remota nova siga um dos padrões já estabelecidos (`inputRef`, `onBlur`, `iconActionBtn`, `fetchFunction`), evitando fetch espalhado.

## 4. Modelo Mental
Toda requisição é uma função injetada no campo pelo metadado. O Renderer apenas dispara o evento (`onBlur`, clique, montagem) — ele nunca conhece a URL ou o client HTTP usado.

## 5. Padrões Suportados

### `inputRef` — carga ao montar o campo
```js
{
  type: 'inputTextOrNumber',
  name: 'pessoa.codigo',
  inputRef: (input) => {
    if (input && !input.requestMade) {
      input.requestMade = true;
      get('/api/getCodigoSequencial').then((res) => {
        formManager.setFieldValue('pessoa.codigo', res);
      });
    }
  },
}
```
A flag `requestMade` no próprio elemento evita disparos duplicados em re-renders.

### `onBlur` — ao sair do campo
```js
{
  name: 'pessoa.pessoaFisica.cpf',
  onBlur: (e) => {
    if (e.target.value.length > 10) {
      post('/api/isCpfJaExistente?documento=' + e.target.value).then((exists) => {
        if (exists) showSnack('CPF já cadastrado');
      });
    }
  },
}
```

### `iconActionBtn` — ação explícita do usuário
```js
{
  type: 'inputTextWithButtonInside',
  name: 'endereco.cep',
  iconActionBtn: async () => {
    const data = await get(`https://viacep.com.br/ws/${formManager.values.endereco?.cep}/json/`);
    formManager.setFieldValue('endereco.logradouro', data.logradouro);
  },
}
```

### `fetchFunction` + `getUrl` — autocomplete remoto paginado
```js
{
  type: 'infiniteScrollAutocomplete',
  name: 'pessoa.nacionalidade',
  fetchFunction: get,
  getUrl: (term) => `/api/paises?term=${term}`,
  initialOptions: (term) => get(`/api/paises?term=${term}&pagina=0`),
}
```

## 6. Regras Obrigatórias
- Toda função de requisição deve ser nomeada e injetada via metadado — nunca inline anônima e espalhada em múltiplos campos copiados.
- `inputRef` deve sempre ter proteção contra disparo duplicado (flag local).
- `iconActionBtn` deve sempre tratar erros (`try/catch`) e nunca deixar a Promise rejeitar silenciosamente sem feedback ao usuário.
- O cliente HTTP (`get`, `post`, etc.) é sempre injetado de fora — o metadado recebe ou importa a função, mas o Renderer nunca a conhece.

## 7. Processo de Decisão
1. A requisição deve ocorrer assim que o campo aparece? → `inputRef`.
2. A requisição depende do valor já digitado, disparada ao perder foco? → `onBlur`.
3. A requisição é uma ação explícita (botão)? → `iconActionBtn`.
4. A requisição alimenta uma lista de opções pesquisável e paginada? → `fetchFunction` + `getUrl` + `initialOptions`.

## 8. Anti-Padrões
```jsx
// Proibido — fetch direto no Renderer
case 'autocomplete':
  useEffect(() => { fetch('/api/opcoes').then(setOptions) }, []);
```
```js
// Proibido — requisição sem tratamento de erro
iconActionBtn: () => { get('/api/cep').then((data) => formManager.setFieldValue('cep', data)) }
```

## 9. Never Do
- Nunca fazer fetch dentro do Renderer.
- Nunca deixar uma `iconActionBtn` sem `try/catch`.
- Nunca duplicar a mesma chamada de API em múltiplos `inputRef` sem extrair uma função compartilhada.
- Nunca disparar requisição pesada em `onChange` sem debounce.

## 10. Quando NÃO Utilizar Esta Skill
- Para o padrão específico de cascata entre dois campos dependentes → `Patterns/CascadingFields.md`.
- Para autocomplete remoto detalhado → `Patterns/RemoteAutocomplete.md`.

## 11. Output Contract
Qualquer integração nova deve se encaixar em um dos quatro padrões já existentes, mantendo o Renderer livre de qualquer chamada HTTP.

## 12. Checklist Final
- [ ] A requisição está em um dos quatro padrões documentados?
- [ ] Há tratamento de erro?
- [ ] `inputRef`, se usado, protege contra disparo duplicado?
- [ ] O Renderer permanece sem nenhuma chamada HTTP?
