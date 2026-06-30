---
skill_id: dynamic-form-pattern-cascading
name: Dynamic Form — Cascading Fields Pattern
version: 1.0
type: pattern-skill
extends: dynamic-form-knowledge
requires: [Extensions/Async.md, Extensions/Conditions.md]
priority: medium
language: pt-BR
domain: frontend-engineering
tags: [react, cascading-fields, dependent-fields, pattern, dynamic-form]
---

# CascadingFields.md — Campos que Atualizam Outros Campos

## 1. Missão
Documentar o padrão de um campo "pai" que, ao mudar, atualiza ou reseta campos "filhos" dependentes.

## 2. Dependências
- `Extensions/Async.md`
- `Extensions/Conditions.md`

## 3. Objetivo
Padronizar como múltiplos campos relacionados são atualizados de forma atômica e consistente.

## 4. Modelo Mental
```
Campo pai muda
     ↓
dispara busca/cálculo
     ↓
formManager.setValues({ ...valores atuais, filho1, filho2, filho3 })
```

## 5. Exemplo de Referência — Busca de CEP
```js
{
  type: 'inputTextWithButtonInside',
  name: 'cep',
  iconActionBtn: async () => {
    try {
      const dataCep = await get(`https://viacep.com.br/ws/${formik.values?.cep}/json/`);
      if (dataCep) {
        const { logradouro, complemento, bairro, localidade, uf } = dataCep;
        const cidadeResidencia = await get(`/cidade/findCidadeByNomeAndUf?cidade=${localidade}&uf=${uf}&pagina=0`);
        formik.setValues({ ...formik.values, cidadeResidencia, logradouro, complemento, bairro });
      }
    } catch (error) {
      console.log(error);
    }
  },
}
```

## 6. Exemplo de Referência — Autocomplete Dependente
```js
{
  type: 'infiniteScrollAutocomplete',
  name: 'cidadeResidencia',
  getUrl: (term) => {
    const idUf = formik.values?.cidadeResidencia?.unidadeFederativa?.id;
    return `/cidade/findByUnidadeFederativaAutocomplete?term=${term}&idUf=${idUf}`;
  },
  dependencyValueToUpdate: formik.values?.cidadeResidencia?.unidadeFederativa,
}
```
`dependencyValueToUpdate` é repassado ao componente para que ele reinicie sua busca/opções quando o valor "pai" mudar.

## 7. Regras Obrigatórias
- Atualizações de múltiplos campos relacionados devem usar `setValues` (atômico), nunca `setFieldValue` sequencial.
- Todo ponto de cascata assíncrona deve ter tratamento de erro.
- Quando o campo pai muda para um valor que invalida o filho, o filho deve ser explicitamente resetado (não deixado com um valor obsoleto).

## 8. Processo de Decisão
1. A atualização cascateia 2+ campos de uma vez vindos de uma única resposta de API? → `setValues` em lote.
2. A atualização é apenas "recarregar opções" de um autocomplete dependente? → `dependencyValueToUpdate`.
3. A mudança do pai invalida o valor atual do filho? → resetar explicitamente o filho dentro do mesmo `onChange`/`iconActionBtn` do pai.

## 9. Anti-Padrões
```js
// Proibido — múltiplos setFieldValue sequenciais para campos relacionados
formik.setFieldValue('logradouro', data.logradouro);
formik.setFieldValue('bairro', data.bairro);
formik.setFieldValue('complemento', data.complemento);
```

## 10. Never Do
- Nunca deixar um campo filho com valor obsoleto quando o pai muda para algo incompatível.
- Nunca encadear `setFieldValue` quando os valores podem ser agrupados em um único `setValues`.

## 11. Quando NÃO Utilizar Esta Skill
- Para autocomplete remoto em si (sem dependência de outro campo) → `Patterns/RemoteAutocomplete.md`.

## 12. Output Contract
Toda atualização em cascata deve ser atômica e resetar explicitamente valores filhos que se tornaram inválidos.

## 13. Checklist Final
- [ ] A atualização usa `setValues` em lote quando múltiplos campos mudam juntos?
- [ ] Há tratamento de erro na cascata assíncrona?
- [ ] Campos filhos são resetados quando o pai muda para um valor incompatível?
