---
skill_id: dynamic-form-ext-accessibility
name: Dynamic Form — Accessibility Extension
version: 1.0
type: extension-skill
extends: dynamic-form-knowledge
requires: [Knowledge.md, Components/Renderer.md]
priority: medium
language: pt-BR
domain: frontend-engineering
tags: [react, a11y, accessibility, forms, dynamic-form]
---

# Accessibility.md — Acessibilidade

## 1. Missão
Documentar exclusivamente como manter acessibilidade (a11y) ao adicionar campos via metadado, sem exigir alterações estruturais no Renderer.

## 2. Dependências
- `Knowledge.md`
- `Components/Renderer.md`

## 3. Objetivo
Garantir que toda nova entrada de metadado inclua os atributos mínimos de acessibilidade já suportados pelo Renderer.

## 4. Modelo Mental
Acessibilidade nesta arquitetura é **dado, não código**: atributos como `label`, `aria-*`, `id-robot` (identificador para automação/QA) e mensagens de erro associadas (`helperText`) já fazem parte do contrato do campo — o trabalho do agente é garantir que eles sejam preenchidos, não inventar marcação nova no Renderer.

## 5. Recomendações

### Toda entrada deve ter `label` legível
```js
{ type: 'inputTextOrNumber', name: 'pessoa.nome', label: 'Nome completo *' }
```
O asterisco (`*`) como convenção textual de obrigatoriedade deve ser acompanhado de um atributo real de obrigatoriedade no componente (`required`), nunca apenas visual.

### Erros devem estar associados ao campo via `helperText`
```js
{
  error: formik.touched?.pessoa?.nome && Boolean(formik.errors?.['pessoa.nome']),
  helperText: formik.touched?.pessoa?.nome && formik.errors?.['pessoa.nome'],
}
```
O MUI já associa `helperText` ao input via `aria-describedby` internamente — não recriar essa associação manualmente.

### `scrollToError` deve mover o foco, não apenas a viewport
```js
const inputDOM = document.querySelector(`[name='${keys[0]}']`);
inputDOM?.focus();
inputDOM?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
```
`focus()` é o que garante que leitores de tela anunciem o campo com erro — `scrollIntoView` por si só não é suficiente.

### Identificadores de automação não substituem rótulos semânticos
```js
inputProps: { 'id-robot': 'cpf' }  // uso interno de QA/automação
label: 'CPF *'                      // rótulo real, lido por leitores de tela
```

### Campos condicionalmente ocultos devem ser removidos do DOM, não apenas escondidos visualmente
O Renderer já resolve isso ao retornar `null`/`false` em vez de aplicar `display: none` — um campo com `condition === false` não deve permanecer focável.

## 6. Regras Obrigatórias
- Todo campo obrigatório deve ter indicação textual (`label` com `*`) e booleana (`required`/`validate`) simultaneamente.
- Toda mensagem de erro deve estar conectada via `helperText`/`error`, nunca exibida apenas em um snackbar genérico desconectado do campo.
- O foco programático (`scrollToError`) deve sempre usar `.focus()`, nunca apenas scroll.
- Campos ocultos por `condition` devem ser de fato removidos da árvore (não apenas estilizados como invisíveis).

## 7. Processo de Decisão
1. O campo é obrigatório? → garantir `label` com indicação + `validate` real.
2. O campo pode falhar validação? → garantir `error`/`helperText` conectados.
3. O formulário tem múltiplos campos com erro? → garantir que `scrollToError` foque o primeiro, não apenas o que aparece visualmente primeiro na tela.

## 8. Anti-Padrões
```js
// Proibido — erro exibido só em snackbar, sem helperText no campo
catch((err) => setStateSnack({ open: true, message: err }))
// e nenhum helperText/error é setado no campo correspondente
```

## 9. Never Do
- Nunca remover `helperText`/`error` de um campo em favor de exibir o erro apenas em um toast/snackbar.
- Nunca usar `display: none` manual para ocultar um campo — sempre delegar ao retorno condicional do Renderer.
- Nunca usar apenas `scrollIntoView` sem `.focus()` na navegação para erro.

## 10. Quando NÃO Utilizar Esta Skill
- Para a lógica de exibição condicional em si → `Extensions/Conditions.md`.

## 11. Output Contract
Todo campo novo deve manter rótulo semântico, associação de erro e foco programático funcionando, independentemente do `type` escolhido.

## 12. Checklist Final
- [ ] Todo campo obrigatório tem indicação textual e validação real?
- [ ] Erros estão conectados via `error`/`helperText`?
- [ ] `scrollToError` usa `.focus()`?
- [ ] Campos ocultos são removidos da árvore, não apenas estilizados?
