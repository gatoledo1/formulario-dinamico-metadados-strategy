---
skill_id: dynamic-form-ext-performance
name: Dynamic Form — Performance Extension
version: 1.0
type: extension-skill
extends: dynamic-form-knowledge
requires: [Knowledge.md, Components/Renderer.md]
priority: medium
language: pt-BR
domain: frontend-engineering
tags: [react, performance, memoization, debounce, dynamic-form]
---

# Performance.md — Recomendações de Performance

## 1. Missão
Centralizar exclusivamente recomendações de performance aplicáveis a esta arquitetura, sem repetir conceitos gerais de otimização React.

## 2. Dependências
- `Knowledge.md`
- `Components/Renderer.md`

## 3. Objetivo
Evitar re-renders excessivos causados pela natureza "metadado como função recalculada a cada render" desta arquitetura.

## 4. Modelo Mental
Como `inputsMetadado(formik)` é uma função chamada a cada render (necessário para refletir `condition`/`value` atualizados), o ponto de atenção de performance está em **não recalcular o array inteiro mais vezes do que necessário**, e em **não disparar requisições redundantes**.

## 5. Recomendações

### Evitar múltiplas chamadas do metadado no mesmo render
```js
// Evitar
inputsMetadado(formik).forEach(...)   // chamada 1
inputsMetadado(formik).map(...)       // chamada 2 (recalcula tudo de novo)

// Preferir
const fields = inputsMetadado(formik);
fields.forEach(...)
fields.map(...)
```

### Debounce em campos que disparam requisição a cada tecla
```js
{
  name: 'busca',
  onChange: debounce((e) => {
    get(`/api/busca?term=${e.target.value}`).then(setResults);
  }, 300),
}
```

### Proteção contra disparo duplicado em `inputRef`
```js
inputRef: (input) => {
  if (input && !input.requestMade) {
    input.requestMade = true;
    get('/api/dado-inicial').then((res) => formManager.setFieldValue('campo', res));
  }
},
```

### Memoização de opções estáticas de `select`/`radioGroup`
```js
const opcoesMeioTransporte = useMemo(() => ([
  { value: 'AVIAO', label: 'Avião' },
  { value: 'AUTOMOVEL', label: 'Automóvel' },
]), []);
```
Evita recriar o array de opções a cada render quando ele não depende do estado.

### Atualização em lote de campos relacionados
```js
// Evitar múltiplos setFieldValue sequenciais
formik.setFieldValue('logradouro', data.logradouro);
formik.setFieldValue('bairro', data.bairro);
formik.setFieldValue('complemento', data.complemento);

// Preferir uma atualização atômica
formik.setValues({ ...formik.values, logradouro: data.logradouro, bairro: data.bairro, complemento: data.complemento });
```

## 6. Regras Obrigatórias
- Toda requisição disparada por `onChange` de texto livre deve ter debounce.
- `inputRef` deve sempre ter proteção contra disparo duplicado.
- Opções estáticas (que não dependem do estado) devem ser memoizadas fora da função de metadado ou via `useMemo` no Orquestrador.
- Atualizações de múltiplos campos relacionados devem ser agrupadas em uma única chamada (`setValues`), não em chamadas sequenciais de `setFieldValue`.

## 7. Processo de Decisão
1. O campo dispara requisição a cada tecla? → aplicar debounce.
2. O campo popula vários outros campos de uma vez (ex: busca de CEP)? → usar `setValues` em lote.
3. As opções de um `select` são fixas e não dependem do estado? → memoizar fora do array de metadado.
4. Há suspeita de re-render excessivo? → revisar se `inputsMetadado(formik)` está sendo chamado múltiplas vezes redundantemente no mesmo ciclo.

## 8. Anti-Padrões
```js
// Proibido — fetch a cada tecla sem debounce
onChange: (e) => get(`/api/busca?term=${e.target.value}`).then(setResults)
```

## 9. Never Do
- Nunca disparar requisição síncrona a cada `onChange` de texto sem debounce.
- Nunca recriar arrays de opções estáticas a cada render sem memoização quando o array é grande.
- Nunca atualizar múltiplos campos relacionados via `setFieldValue` sequencial quando `setValues` resolve em uma única operação.

## 10. Quando NÃO Utilizar Esta Skill
- Para o detalhamento de como uma requisição específica deve ser estruturada → `Extensions/Async.md`.

## 11. Output Contract
Toda otimização aplicada deve ser justificada por um cenário real de re-render ou requisição redundante — performance não deve ser otimizada de forma especulativa a ponto de complicar a leitura do metadado.

## 12. Checklist Final
- [ ] Campos de busca livre têm debounce?
- [ ] `inputRef` está protegido contra disparo duplicado?
- [ ] Opções estáticas estão memoizadas?
- [ ] Atualizações relacionadas usam `setValues` em lote?
