---
skill_id: dynamic-form-ext-conditions
name: Dynamic Form — Conditions Extension
version: 1.0
type: extension-skill
extends: dynamic-form-knowledge
requires: [Knowledge.md, Components/Metadata.md, Components/Renderer.md]
priority: high
language: pt-BR
domain: frontend-engineering
tags: [react, conditional-rendering, hidden-fields, dynamic-form]
---

# Conditions.md — Exibição Condicional

## 1. Missão
Documentar exclusivamente `condition`, `paisHomologado`, campos derivados usados como gatilho de condição e a regra de que campo oculto não valida.

## 2. Dependências
- `Knowledge.md`
- `Components/Metadata.md`
- `Components/Renderer.md`

## 3. Objetivo
Garantir que toda nova regra de exibição condicional siga o mesmo padrão, sem introduzir lógica de visibilidade fora do metadado.

## 4. Modelo Mental
```js
condition: <expressão booleana> | undefined
```
`undefined` → campo sempre visível. `false` → campo oculto e validação ignorada. `true` → campo visível e validado normalmente.

## 5. `condition`
```js
// Exibe "passaporte" apenas se a nacionalidade NÃO for Brasil
{
  name: 'pessoa.pessoaFisica.passaPorte',
  condition: formik.values.pessoa?.nacionalidade?.nome !== 'BRASIL',
}
```

## 6. `paisHomologado`
```js
// Campo visível apenas no Brasil
{ name: 'pessoa.pessoaFisica.cpf', paisHomologado: 'Brasil' }

// Campo visível apenas em Portugal
{ name: 'pessoa.nif', paisHomologado: 'Portugal' }
```

## 7. Combinação
Quando ambos estão presentes, os dois precisam ser verdadeiros:
```js
{
  name: 'pessoa.pessoaFisica.cedulaIdentidade',
  paisHomologado: 'Brasil',
  condition: formik.values.pessoa?.nacionalidade?.nome?.includes('BRASIL'),
}
```
Lógica no Renderer:
```js
if (hasCondition && hasPaisHomologado) {
  shouldDisplayField = field.condition && paisHomologado.nome.includes(field.paisHomologado);
} else {
  shouldDisplayField = condition ?? paisHomologadoMatch;
}
```

## 8. Campos Derivados Usados em Condição
Valores auxiliares (não visuais) podem ser gravados no estado só para servir de gatilho de outra condição:
```js
onChange: (value) => {
  const valorFormatado = moment(value).format('DD/MM/YYYY');
  formik.setFieldValue('dataNascimento', valorFormatado);
  formik.setFieldValue('idade', moment().diff(moment(valorFormatado, 'DD/MM/YYYY'), 'years'));
},
```
```js
{ name: 'certidaoNascimento', condition: formik.values?.idade < 18 }
```
Ver `Patterns/DerivedValues.md` para o padrão completo.

## 9. Regras Obrigatórias
- `condition === false` sempre implica `validate` ignorado (regra aplicada automaticamente por `validateField`, ver `Extensions/Validation.md`).
- Seções (`type: 'section'`) também respeitam `condition`/`paisHomologado` — uma seção pode ser ocultada junto com o bloco de campos que ela apresenta.
- A expressão de `condition` deve ser reavaliada a cada render — por isso o metadado precisa ser uma função, nunca um objeto estático memoizado incorretamente.

## 10. Processo de Decisão
1. A regra depende apenas do país do sistema? → `paisHomologado`.
2. A regra depende de outro campo do formulário? → `condition`.
3. A regra depende de um cálculo (ex: idade)? → gravar valor derivado no estado e usá-lo em `condition` (`Patterns/DerivedValues.md`).
4. A regra precisa valer para múltiplos campos ao mesmo tempo? → aplicar a mesma expressão de `condition` em cada um, ou agrupar sob uma `section` condicional.

## 11. Anti-Padrões
```jsx
// Proibido — lógica de visibilidade dentro do Renderer, fora de condition/paisHomologado
case 'inputTextOrNumber':
  if (usuario.permissao === 'admin') { /* exibir campo */ }
```

## 12. Never Do
- Nunca tomar decisão de exibição fora de `condition`/`paisHomologado`.
- Nunca validar um campo com `condition === false`.
- Nunca esquecer de tornar a `condition` de um campo "filho" coerente com a `condition`/valor do campo "pai" que a originou.

## 13. Quando NÃO Utilizar Esta Skill
- Para estratégias mais amplas (esconder vs. desabilitar vs. exigir confirmação) → `Patterns/ConditionalRendering.md`.

## 14. Output Contract
Toda nova regra de exibição deve usar exclusivamente `condition`/`paisHomologado`, manter a coerência entre exibição e validação, e nunca introduzir lógica condicional no Renderer.

## 15. Checklist Final
- [ ] A condição está expressa via `condition`/`paisHomologado`, nunca dentro do Renderer?
- [ ] Campo oculto não é validado?
- [ ] Seções condicionais também respeitam a mesma regra que os campos que agrupam?
