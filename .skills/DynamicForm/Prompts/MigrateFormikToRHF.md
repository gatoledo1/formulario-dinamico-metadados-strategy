---
skill_id: dynamic-form-prompt-migrateformiktorhf
name: Dynamic Form — Migrate Formik to RHF Prompt
version: 1.0
type: prompt-skill
extends: dynamic-form-agent
requires: [Knowledge.md, Agent.md, Extensions/StateManagers.md]
priority: low
language: pt-BR
domain: frontend-engineering
tags: [react, prompt, migration, formik, react-hook-form, dynamic-form]
---

# MigrateFormikToRHF.md — Migrar de Formik para React Hook Form

## 1. Missão
Guiar o agente na migração de um Orquestrador baseado em Formik para React Hook Form, sem alterar Metadado ou Renderer.

## 2. Dependências
- `Knowledge.md`
- `Agent.md`
- `Extensions/StateManagers.md`

## 3. Objetivo
Provar, na prática, que a arquitetura é agnóstica ao gerenciador de estado, migrando apenas a camada de Orquestração.

## 4. Processo
1. Criar a função adaptadora `metaFormRHF(methods)` que traduz a API do React Hook Form para a interface mínima esperada pelo Metadado (`values`, `setFieldValue`, `touched`, `errors`) — ver `Extensions/StateManagers.md`, seção 6.
2. No Orquestrador, substituir `useFormik(...)` por `useForm(...)` + `metaFormRHF(methods)`.
3. Substituir `formik.handleSubmit` por `methods.handleSubmit(onSubmit)`.
4. Substituir o `validate` síncrono do Formik por validações equivalentes via `register`/`resolver` do RHF, mantendo a mesma fonte de verdade: o `validate` de cada campo do metadado deve continuar sendo chamado a partir do resolver, não duplicado.
5. Confirmar que o array de metadado (`inputsMetadado(formManager)`) não foi alterado em nenhuma linha.
6. Confirmar que nenhum `case` do Renderer foi alterado.
7. Testar cada campo: valor inicial, alteração, erro de validação, submit.

## 5. Regras Obrigatórias
- O Metadado não deve ser alterado — apenas o objeto `formManager` que ele recebe muda de origem.
- O Renderer não deve ser alterado em nenhuma hipótese.
- O `validate` de cada campo deve continuar sendo a única fonte de verdade da regra — o resolver do RHF deve chamá-lo, não duplicá-lo.

## 6. Anti-Padrões
- Reescrever as regras de validação direto em um schema do RHF (ex: Yup/Zod) duplicando o que já existe em `field.validate`.
- Alterar `name` dos campos para se adequar a alguma convenção do RHF — `getNestedFormikValue` já é agnóstico e não exige isso.

## 7. Never Do
- Nunca duplicar validação entre `field.validate` e um schema externo do RHF.
- Nunca alterar o Renderer "só para essa migração".
- Nunca deixar a migração parcial — formulário com parte dos campos em Formik e parte em RHF simultaneamente.

## 8. Quando NÃO Utilizar Esta Skill
- Para entender a interface mínima de qualquer gerenciador (não só RHF) → `Extensions/StateManagers.md`.

## 9. Output Contract
Ao final da migração, o Metadado e o Renderer devem ser bit-a-bit idênticos aos da versão Formik — toda a diferença real fica isolada no Orquestrador e no adaptador `metaFormRHF`.

## 10. Checklist Final
- [ ] O Metadado permanece inalterado?
- [ ] O Renderer permanece inalterado?
- [ ] O `validate` de cada campo continua sendo a única fonte de verdade?
- [ ] A migração foi concluída integralmente, sem campos híbridos?
