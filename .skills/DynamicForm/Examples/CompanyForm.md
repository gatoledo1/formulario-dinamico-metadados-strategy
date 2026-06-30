---
skill_id: dynamic-form-example-companyform
name: Dynamic Form — Company Form Example
version: 1.0
type: example-skill
extends: dynamic-form-knowledge
requires: [Knowledge.md, Patterns/ConditionalRendering.md]
priority: low
language: pt-BR
domain: frontend-engineering
tags: [react, example, company-form, conditional-rendering, dynamic-form]
---

# CompanyForm.md — Exemplo: Cadastro de Empresa

## 1. Missão
Demonstrar um formulário com múltiplas regras condicionais combinadas (`condition` + `paisHomologado` + `disabled`), em um cenário de cadastro de pessoa jurídica.

## 2. Dependências
- `Knowledge.md`
- `Patterns/ConditionalRendering.md`

## 3. Objetivo
Servir de referência para formulários onde regime tributário, país e tipo de inscrição interagem entre si.

## 4. Metadado (trecho relevante)
```js
export const companyInputs = (form) => [
  {
    type: 'inputTextOrNumber',
    name: 'razaoSocial',
    label: 'Razão Social *',
    value: form.values.razaoSocial || '',
    onChange: (e) => form.setFieldValue('razaoSocial', e.target.value),
    validate: (v) => (!v ? 'Campo obrigatório' : ''),
    xs: 12, sm: 8,
  },
  {
    type: 'inputTextOrNumber',
    name: 'cnpj',
    label: 'CNPJ *',
    paisHomologado: 'Brasil',
    value: form.values.cnpj || '',
    onChange: (e) => form.setFieldValue('cnpj', e.target.value),
    validate: (v) => (!v ? 'Campo obrigatório' : ''),
    xs: 12, sm: 4,
  },
  {
    type: 'select',
    name: 'regimeTributario',
    label: 'Regime Tributário',
    paisHomologado: 'Brasil',
    value: form.values.regimeTributario || '',
    options: [
      { value: 'SIMPLES', label: 'Simples Nacional' },
      { value: 'CONTRIBUINTE', label: 'Contribuinte ICMS' },
      { value: 'NAO_CONTRIBUINTE', label: 'Não Contribuinte' },
    ],
    onChange: (e) => form.setFieldValue('regimeTributario', e.target.value),
    xs: 12, sm: 6,
  },
  {
    // Visível apenas no Brasil. Habilitado apenas se for CONTRIBUINTE.
    type: 'inputTextOrNumber',
    name: 'inscricaoEstadual',
    label: 'Inscrição Estadual',
    paisHomologado: 'Brasil',
    condition: form.values.regimeTributario === 'CONTRIBUINTE',
    disabled: form.values.regimeTributario !== 'CONTRIBUINTE',
    value: form.values.inscricaoEstadual || '',
    onChange: (e) => form.setFieldValue('inscricaoEstadual', e.target.value),
    xs: 12, sm: 6,
  },
  {
    // Visível apenas fora do Brasil — equivalente internacional de identificação fiscal
    type: 'inputTextOrNumber',
    name: 'taxId',
    label: 'Tax ID',
    condition: form.values.pais?.nome !== 'BRASIL',
    value: form.values.taxId || '',
    onChange: (e) => form.setFieldValue('taxId', e.target.value),
    xs: 12, sm: 6,
  },
];
```

## 5. O que este exemplo demonstra
- Combinação de `paisHomologado` (CNPJ só no Brasil) com `condition` simples (Tax ID só fora do Brasil).
- A diferença prática entre ocultar (`taxId`/`inscricaoEstadual` no país errado) e desabilitar mantendo visível (`inscricaoEstadual` quando o regime não é CONTRIBUINTE) — ver `Patterns/ConditionalRendering.md`.

## 6. Quando NÃO Utilizar Esta Skill
- Para o padrão geral de esconder vs. desabilitar → consultar `Patterns/ConditionalRendering.md` antes de copiar este exemplo.

## 7. Checklist Final
- [ ] `paisHomologado` e `condition` não estão sendo usados de forma redundante no mesmo campo sem necessidade?
- [ ] A escolha entre ocultar e desabilitar segue a justificativa de `Patterns/ConditionalRendering.md`?
