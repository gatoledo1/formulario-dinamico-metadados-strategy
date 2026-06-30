---
skill_id: dynamic-form-fieldtypes
name: Dynamic Form — Field Types Catalog
version: 1.0
type: component-skill
extends: dynamic-form-knowledge
requires: [Knowledge.md, Components/Renderer.md]
priority: medium
language: pt-BR
domain: frontend-engineering
tags: [react, field-types, catalog, dynamic-form]
---

# FieldTypes.md — Catálogo Oficial de Tipos

## 1. Missão
Listar, para cada `type` suportado pelo Renderer, suas propriedades, comportamento e limitações.

## 2. Dependências
- `Knowledge.md`
- `Components/Renderer.md`

## 3. Objetivo
Ser a referência única de consulta ao decidir qual `type` usar para um campo novo, evitando reinvenção de tipos já existentes.

## 4. Modelo Mental
Cada `type` é um contrato: um conjunto fixo de props que o Renderer espera para aquele `case`. Adicionar um campo nunca deve exigir adivinhar propriedades — apenas seguir o contrato do tipo escolhido.

## 5. Catálogo

### `section`
Separador visual, não é um input.
```js
{ type: 'section', name: 'Dados Pessoais', sectionMargin: '0', className: 'none', fontSize: '0.875rem' }
```
Limitação: não possui `value`/`onChange`; suporta `condition`/`paisHomologado` para ocultar a seção junto com seus campos.

### `inputTextOrNumber`
Campo de texto ou número padrão (MUI `TextField`).
```js
{
  type: 'inputTextOrNumber', name: 'pessoa.nome', value, onChange, onBlur,
  validate, error, helperText, inputProps: { maxLength: 150 },
}
```
Limitação: não faz máscara automaticamente — use `onInput` para sanitizar (`e.target.value.replace(/[^0-9]/g, '')`).

### `inputTextWithButtonInside`
Texto com botão de ação embutido (ex: busca de CEP).
```js
{ type: 'inputTextWithButtonInside', name: 'endereco.cep', iconActionBtn: async () => { /* fetch */ } }
```
Ver `Patterns/RemoteAutocomplete.md` e `Patterns/CascadingFields.md` para o padrão completo.

### `autocomplete`
Autocomplete com opções locais (array já carregado).
```js
{ type: 'autocomplete', name: 'pessoa.genero', options: [...], onChange }
```
Limitação: não pagina — para listas grandes ou remotas, use `infiniteScrollAutocomplete`.

### `infiniteScrollAutocomplete`
Autocomplete remoto com paginação infinita.
```js
{
  type: 'infiniteScrollAutocomplete', name: 'pessoa.nacionalidade',
  fetchFunction: get, getUrl: (term) => `/api/paises?term=${term}`,
  initialOptions: (term) => get(`/api/paises?term=${term}&pagina=0`),
  dependencyValueToUpdate: /* valor de outro campo que força reload */,
}
```
Ver `Extensions/Async.md` e `Patterns/RemoteAutocomplete.md`.

### `select`
Lista de opções fixas (MUI `Select`).
```js
{ type: 'select', name: 'meioTransporte', options: [{ value: 'AVIAO', label: 'Avião' }], onChange }
```

### `datepicker`
Seletor de data.
```js
{ type: 'datepicker', name: 'dataNascimento', value, onChange, maxDate: () => moment().toDate(), validate }
```
Limitação: depende de uma lib de datas (ex: `moment`/`dayjs`) ser injetada via `onChange`/`maxDate` — o Renderer não formata datas internamente.

### `radioGroup`
Grupo de opções exclusivas.
```js
{ type: 'radioGroup', name: 'boolPessoaFisica', options: [{ value: 'on', label: 'Física' }] }
```

### `switch`
Toggle booleano.
```js
{ type: 'switch', name: 'titular', value, onChange, label: 'É titular?' }
```

### `textArea`
Texto multi-linha.
```js
{ type: 'textArea', name: 'observacao', value, onChange, minRows: 3 }
```

### `fileUpload`
Upload de arquivos.
```js
{ type: 'fileUpload', name: 'anexos', onChange, accept: '.pdf,.jpg' }
```

## 6. Regras Obrigatórias
- Nunca usar um `type` para um propósito diferente do contrato documentado aqui.
- Ao criar um `type` novo, documentá-lo neste catálogo antes de considerar a tarefa concluída.

## 7. Processo de Decisão
1. O dado é uma lista fixa pequena? → `select` ou `radioGroup`.
2. O dado vem de uma busca remota paginada? → `infiniteScrollAutocomplete`.
3. O campo precisa de uma ação lateral (buscar CEP, gerar código)? → `inputTextWithButtonInside`.
4. Nenhum tipo existente atende? → criar novo `type` (ver `Components/Renderer.md`, seção 7).

## 8. Anti-Padrões
- Usar `autocomplete` (local) para uma lista que na verdade deveria ser paginada remotamente — gera carregamento de payload gigante.
- Usar `inputTextOrNumber` com máscara manual para um caso que o `datepicker` já resolveria nativamente.

## 9. Never Do
- Nunca adicionar propriedades não documentadas a um `type` existente sem atualizar este catálogo.
- Nunca reaproveitar `iconActionBtn` para lógica que não seja uma ação explícita do usuário.

## 10. Quando NÃO Utilizar Esta Skill
- Para implementar a lógica interna de um novo `case` no Renderer → `Components/Renderer.md`.

## 11. Output Contract
Toda escolha de `type` deve corresponder exatamente ao contrato listado aqui, sem props inventadas.

## 12. Checklist Final
- [ ] O `type` escolhido é o mais específico disponível para o caso?
- [ ] As props usadas estão todas documentadas no contrato do tipo?
- [ ] Caso um novo tipo tenha sido criado, ele foi adicionado a este catálogo?
