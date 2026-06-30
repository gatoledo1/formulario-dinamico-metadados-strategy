---
skill_id: dynamic-form-pattern-remoteautocomplete
name: Dynamic Form — Remote Autocomplete Pattern
version: 1.0
type: pattern-skill
extends: dynamic-form-knowledge
requires: [Extensions/Async.md]
priority: medium
language: pt-BR
domain: frontend-engineering
tags: [react, autocomplete, infinite-scroll, pattern, dynamic-form]
---

# RemoteAutocomplete.md — Autocomplete Conectado à API

## 1. Missão
Documentar o padrão completo de um campo de autocomplete remoto, com paginação infinita e mapeamento de resposta da API para o formato do estado.

## 2. Dependências
- `Extensions/Async.md`

## 3. Objetivo
Padronizar como toda busca remota paginada é configurada via metadado, sem exigir alteração no Renderer para cada nova fonte de dados.

## 4. Modelo Mental
```
getUrl(term)          → monta a URL com base no termo digitado
fetchFunction(url)    → função HTTP injetada (get, post, etc.)
initialOptions(term)  → carrega a primeira página ao montar o campo
onChange(e, value)    → mapeia a opção selecionada para o formato do estado
```

## 5. Exemplo de Referência
```js
{
  type: 'infiniteScrollAutocomplete',
  name: 'pessoa.nacionalidade',
  freeSolo: false,
  size: 'small',
  value: formik.values?.nacionalidade,
  TextField: { label: 'Nacionalidade *', size: 'small' },
  getOptionLabel: (option) => option?.nome || option?.label || '',
  isOptionEqualToValue: (option, value) => option.value === value?.id,
  onChange: (e, value) => formik.setFieldValue('nacionalidade', { id: value?.value || null, nome: value?.label || '' }),
  noOptionsText: 'Nenhum registro encontrado',
  fetchFunction: get,
  getUrl: (term) => `/tecnico/pais?term=${term || ''}`,
  initialOptions: (term) => get(`/tecnico/pais?term=${term || formik.values?.nacionalidade?.id || ''}&pagina=0`),
  validate: (value) => (!value ? 'Campo obrigatório' : ''),
}
```

## 6. Regras Obrigatórias
- `onChange` deve sempre normalizar a opção selecionada para o formato esperado pelo restante do formulário (`{ id, nome }`, por exemplo), nunca gravar o objeto bruto retornado pela API.
- `getOptionLabel` e `isOptionEqualToValue` devem ser definidos explicitamente — não confiar no comportamento padrão do componente para objetos complexos.
- `initialOptions` deve sempre considerar o valor já existente no estado (útil em telas de edição), não apenas o termo digitado.
- Toda busca deve ter `noOptionsText` configurado, para feedback claro de "nenhum resultado".

## 7. Processo de Decisão
1. A lista de opções é pequena e estática? → não use este padrão, use `select`/`autocomplete` local.
2. A lista é grande e vem de uma API paginada? → use este padrão completo.
3. O autocomplete depende de outro campo (ex: cidade depende de UF)? → combine com `Patterns/CascadingFields.md` (`dependencyValueToUpdate`).

## 8. Anti-Padrões
```js
// Proibido — gravar o objeto bruto da API sem normalizar
onChange: (e, value) => formik.setFieldValue('nacionalidade', value)
```

## 9. Never Do
- Nunca deixar `onChange` gravar a resposta crua da API sem mapeamento explícito.
- Nunca omitir `isOptionEqualToValue` ao trabalhar com objetos — isso quebra a seleção/exibição do valor já salvo.
- Nunca esquecer de tratar o caso "nenhum resultado" via `noOptionsText`.

## 10. Quando NÃO Utilizar Esta Skill
- Para campos com dependência cruzada entre si → `Patterns/CascadingFields.md`.
- Para opções fixas pequenas → use `select`/`autocomplete` local (`Components/FieldTypes.md`).

## 11. Output Contract
Todo autocomplete remoto novo deve normalizar o valor selecionado, definir `getOptionLabel`/`isOptionEqualToValue` e considerar o valor pré-existente em `initialOptions`.

## 12. Checklist Final
- [ ] `onChange` normaliza o valor para o formato do estado?
- [ ] `getOptionLabel` e `isOptionEqualToValue` estão definidos?
- [ ] `initialOptions` considera o valor já existente (modo edição)?
- [ ] `noOptionsText` está configurado?
