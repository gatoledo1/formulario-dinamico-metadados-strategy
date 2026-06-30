---
skill_id: dynamic-form-example-addresslookup
name: Dynamic Form — Address Lookup Example
version: 1.0
type: example-skill
extends: dynamic-form-knowledge
requires: [Patterns/RemoteAutocomplete.md, Patterns/CascadingFields.md]
priority: low
language: pt-BR
domain: frontend-engineering
tags: [react, example, address-lookup, cep, autocomplete, dynamic-form]
---

# AddressLookup.md — Exemplo: Busca de Endereço por CEP

## 1. Missão
Demonstrar, em um único exemplo, a combinação de `Patterns/RemoteAutocomplete.md` (autocomplete de UF/cidade) com `Patterns/CascadingFields.md` (preenchimento em cascata a partir do CEP).

## 2. Dependências
- `Patterns/RemoteAutocomplete.md`
- `Patterns/CascadingFields.md`

## 3. Objetivo
Servir de referência copiável para qualquer formulário de endereço.

## 4. Metadado
```js
export const addressInputs = (formik) => [
  {
    type: 'inputTextWithButtonInside',
    name: 'cep',
    label: 'CEP *',
    value: formik.values?.cep || '',
    onInput: (e) => (e.target.value = e.target.value.replace(/[^0-9]/g, '')),
    onChange: (e) => formik.setFieldValue('cep', e.target.value),
    iconActionBtn: async () => {
      try {
        const dataCep = await get(`https://viacep.com.br/ws/${formik.values?.cep}/json/`);
        if (dataCep) {
          const { logradouro, bairro, localidade, uf } = dataCep;
          const cidade = await get(`/cidade/findCidadeByNomeAndUf?cidade=${localidade}&uf=${uf}`);
          formik.setValues({ ...formik.values, cidade, logradouro, bairro });
        }
      } catch (error) {
        console.log(error);
      }
    },
    validate: (v) => (!v ? 'Campo obrigatório' : ''),
    xs: 12, sm: 4,
  },
  {
    type: 'inputTextOrNumber',
    name: 'logradouro',
    label: 'Logradouro',
    value: formik.values?.logradouro || '',
    onChange: (e) => formik.setFieldValue('logradouro', e.target.value),
    xs: 12, sm: 8,
  },
  {
    type: 'inputTextOrNumber',
    name: 'bairro',
    label: 'Bairro',
    value: formik.values?.bairro || '',
    onChange: (e) => formik.setFieldValue('bairro', e.target.value),
    xs: 12, sm: 6,
  },
  {
    type: 'infiniteScrollAutocomplete',
    name: 'cidade',
    value: formik.values?.cidade,
    TextField: { label: 'Cidade' },
    getOptionLabel: (option) => option?.nome || option?.label || '',
    isOptionEqualToValue: (option, value) => option.value === value?.id,
    onChange: (e, value) => formik.setFieldValue('cidade', { id: value?.value, nome: value?.label }),
    fetchFunction: get,
    getUrl: (term) => `/cidade/autocomplete?term=${term || ''}`,
    initialOptions: (term) => get(`/cidade/autocomplete?term=${term || ''}&pagina=0`),
    xs: 12, sm: 6,
  },
];
```

## 5. O que este exemplo demonstra
- `iconActionBtn` disparando uma busca em cadeia (CEP → dados do ViaCEP → busca da cidade na base interna).
- `setValues` atômico para os três campos resultantes (`cidade`, `logradouro`, `bairro`).
- Autocomplete remoto (`cidade`) coexistindo com os campos preenchidos automaticamente, permitindo correção manual pelo usuário.

## 6. Quando NÃO Utilizar Esta Skill
- Para um autocomplete remoto isolado, sem botão de ação nem cascata → usar apenas `Patterns/RemoteAutocomplete.md`.

## 7. Checklist Final
- [ ] A atualização dos três campos resultantes da busca usa `setValues` atômico?
- [ ] `iconActionBtn` trata erros via `try/catch`?
- [ ] O usuário ainda pode corrigir manualmente os campos preenchidos automaticamente?
