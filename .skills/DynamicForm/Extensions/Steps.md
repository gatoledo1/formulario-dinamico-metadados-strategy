---
skill_id: dynamic-form-ext-steps
name: Dynamic Form — Steps Extension
version: 1.0
type: extension-skill
extends: dynamic-form-knowledge
requires: [Knowledge.md, Components/Orchestrator.md]
priority: high
language: pt-BR
domain: frontend-engineering
tags: [react, wizard, stepper, steps, dynamic-form]
---

# Steps.md — Wizard / Multi-Etapas

## 1. Missão
Documentar exclusivamente a capacidade de dividir um formulário em etapas (steps), sem alterar o Renderer.

## 2. Dependências
- `Knowledge.md`
- `Components/Orchestrator.md`

## 3. Objetivo
Permitir que o agente adicione ou modifique formulários com Stepper sem reescrever a arquitetura base.

## 4. Modelo Mental
O metadado passa de array plano para array de etapas:
```js
[
  { step: 1, title: 'Dados Pessoais', fields: [ /* campos */ ] },
  { step: 2, title: 'Viagens', fields: [ /* campos */ ] },
]
```
O Renderer continua recebendo um array simples — apenas os `fields` da etapa ativa:
```jsx
const currentStepData = stepFormMetadados(formik).find((s) => s.step === activeStep + 1);
<DynamicForm dataFields={currentStepData.fields} />
```

## 5. Responsabilidades

**Pertence a esta extensão:**
- Estrutura `{ step, title, fields }`.
- Estado `activeStep` no Orquestrador.
- Validação escopada à etapa ativa.
- Navegação (`handleNext`/`handleBack`) e submit condicional (`isLastStep`).

**Não pertence a esta extensão:**
- Renderização dos campos em si (Renderer não muda).
- Definição de cada campo individual (Metadata).

## 6. Validação Escopada por Etapa
```js
validate: (values) => {
  const fields = stepFormMetadados(formik).find((s) => s.step === activeStep + 1)?.fields;
  fields?.forEach((field) => {
    const error = validateField(field.name, getNestedFormikValue(values, field.name), fields);
    if (error) errors[field.name] = error;
  });
  return errors;
},
```
Sem esse filtro por `activeStep`, qualquer campo obrigatório de uma etapa futura bloquearia o avanço da etapa atual.

## 7. Navegação
```js
const handleNext = () => setActiveStep((prev) => prev + 1);
const handleBack = () => setActiveStep((prev) => prev - 1);
const isLastStep = activeStep === steps.length - 1;
```
- "Continuar": dispara `submit` → valida etapa atual → sem erro → `handleNext()`.
- "Voltar": não valida — usuário pode revisar livremente.
- "Finalizar": só executa o `onSubmit` real quando `isLastStep === true`.

## 8. Regras Obrigatórias
- O Renderer nunca deve saber que existem etapas.
- A validação do Formik (ou equivalente) deve sempre filtrar pelos `fields` da etapa ativa.
- O avanço de etapa só ocorre se `Object.keys(errors).length === 0` após o ciclo de validação.
- Use debounce nos botões de navegação para evitar avanços duplicados por duplo clique.

## 9. Processo de Decisão
Ao receber "adicione mais uma etapa":
1. Adicionar um novo objeto `{ step: N, title, fields: [] }` ao array.
2. Não tocar no Renderer.
3. Garantir que `steps.length` (usado em `isLastStep`) reflita o novo total automaticamente (deve ser derivado do array, nunca hardcoded).

## 10. Anti-Padrões
```js
// Proibido — validar todos os campos do formulário, ignorando a etapa atual
validate: (values) => { allFields.forEach(...) }

// Proibido — hardcode do número de etapas
const isLastStep = activeStep === 2; // deveria ser steps.length - 1
```

## 11. Never Do
- Nunca validar campos de etapas que não estão visíveis.
- Nunca permitir múltiplos avanços de etapa por clique duplo sem debounce.
- Nunca acoplar o Renderer ao conceito de `activeStep`.

## 12. Quando NÃO Utilizar Esta Skill
- Para formulários de uma única tela → use a arquitetura base sem esta extensão.
- Para exemplo completo de wizard → `Examples/WizardExample.md` e `Patterns/Wizard.md`.

## 13. Output Contract
A introdução de steps não deve exigir nenhuma alteração no Renderer, apenas no Metadado (estrutura de etapas) e no Orquestrador (estado de navegação e validação escopada).

## 14. Checklist Final
- [ ] A validação está escopada à etapa ativa?
- [ ] `isLastStep` é derivado do array, não hardcoded?
- [ ] O Renderer continua recebendo um array simples de campos?
- [ ] Os botões de navegação têm proteção contra duplo clique?
