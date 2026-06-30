---
skill_id: dynamic-form-pattern-derivedvalues
name: Dynamic Form — Derived Values Pattern
version: 1.0
type: pattern-skill
extends: dynamic-form-knowledge
requires: [Extensions/Conditions.md]
priority: low
language: pt-BR
domain: frontend-engineering
tags: [react, derived-values, pattern, dynamic-form]
---

# DerivedValues.md — Valores Auxiliares Calculados

## 1. Missão
Documentar o padrão de gravar, no próprio estado do formulário, um valor calculado que não corresponde a nenhum campo visual, apenas para servir de gatilho de `condition` ou `validate` de outro campo.

## 2. Dependências
- `Extensions/Conditions.md`

## 3. Objetivo
Evitar duplicação de cálculo (ex: idade a partir da data de nascimento) em múltiplos lugares do metadado.

## 4. Modelo Mental
```
Data nascimento
     ↓
idade (valor derivado, sem campo visual)
     ↓
condition de outro campo
```

## 5. Exemplo de Referência
```js
{
  type: 'datepicker',
  name: 'dataNascimento',
  onChange: (value) => {
    const valorFormatado = moment(value).format('DD/MM/YYYY');
    formik.setFieldValue('dataNascimento', valorFormatado);
    formik.setFieldValue('idade', moment().diff(moment(valorFormatado, 'DD/MM/YYYY'), 'years'));
  },
}
```
```js
{
  type: 'inputTextOrNumber',
  name: 'certidaoNascimento',
  condition: formik.values.nacionalidade?.nome?.includes('BRASIL') && formik.values?.idade < 18,
}
```

## 6. Regras Obrigatórias
- O valor derivado deve ser calculado em um único ponto (o `onChange` do campo de origem), nunca recalculado de forma inconsistente em múltiplos campos.
- O nome do valor derivado deve ser autoexplicativo (`idade`, não `aux1`).
- Valores derivados não devem ser confundidos com campos do payload de submit, salvo se o backend realmente precisar deles — nesse caso, documentar essa intenção no próprio metadado com um comentário.

## 7. Processo de Decisão
1. O valor é usado em mais de uma `condition`/`validate`? → vale a pena derivá-lo e gravar no estado.
2. O valor é usado uma única vez? → ainda assim, prefira derivá-lo no `onChange` da origem em vez de recalcular inline na expressão de `condition`, para manter rastreabilidade.

## 8. Anti-Padrões
```js
// Proibido — recalcular a mesma fórmula em múltiplos lugares
condition: moment().diff(moment(formik.values?.dataNascimento, 'DD/MM/YYYY'), 'years') < 18
// repetido em 3 campos diferentes, com risco de divergência
```

## 9. Never Do
- Nunca duplicar a mesma fórmula de cálculo em mais de uma `condition`.
- Nunca deixar um valor derivado desatualizado (ex: esquecer de recalcular `idade` quando `dataNascimento` muda por outro fluxo, como preenchimento automático via API).

## 10. Quando NÃO Utilizar Esta Skill
- Quando o valor já existe diretamente no estado (não precisa de cálculo) → usar `condition` direto sobre o campo existente (`Extensions/Conditions.md`).

## 11. Output Contract
Todo valor derivado deve ter uma única fonte de cálculo e ser reutilizado, nunca recalculado de forma divergente.

## 12. Checklist Final
- [ ] O valor derivado é calculado em um único ponto?
- [ ] O nome do valor é autoexplicativo?
- [ ] O valor é recalculado sempre que sua origem muda, mesmo via fluxos automáticos (API)?
