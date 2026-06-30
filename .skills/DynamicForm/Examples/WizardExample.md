---
skill_id: dynamic-form-example-wizard
name: Dynamic Form — Wizard Example
version: 1.0
type: example-skill
extends: dynamic-form-knowledge
requires: [Patterns/Wizard.md]
priority: low
language: pt-BR
domain: frontend-engineering
tags: [react, example, wizard, steps, dynamic-form]
---

# WizardExample.md — Exemplo: Formulário em Etapas

## 1. Missão
Apresentar um exemplo mínimo e completo de wizard de 3 etapas, aplicando exatamente o padrão de `Patterns/Wizard.md` e `Extensions/Steps.md`.

## 2. Dependências
- `Patterns/Wizard.md`

## 3. Objetivo
Servir de ponto de partida copiável para qualquer formulário que precise de Stepper.

## 4. Metadado
```js
export const wizardInputs = (formik) => [
  {
    step: 1,
    title: 'Dados Pessoais',
    fields: [
      { type: 'section', name: 'Dados Pessoais' },
      {
        type: 'inputTextOrNumber',
        name: 'nome',
        label: 'Nome completo *',
        value: formik.values?.nome || '',
        onChange: (e) => formik.setFieldValue('nome', e.target.value),
        validate: (v) => (!v ? 'Campo obrigatório' : ''),
        xs: 12,
      },
    ],
  },
  {
    step: 2,
    title: 'Endereço',
    fields: [
      { type: 'section', name: 'Endereço' },
      {
        type: 'inputTextOrNumber',
        name: 'cep',
        label: 'CEP *',
        value: formik.values?.cep || '',
        onChange: (e) => formik.setFieldValue('cep', e.target.value),
        validate: (v) => (!v ? 'Campo obrigatório' : ''),
        xs: 12, sm: 6,
      },
    ],
  },
  {
    step: 3,
    title: 'Confirmação',
    fields: [
      { type: 'section', name: 'Revise seus dados' },
      {
        type: 'textArea',
        name: 'observacao',
        label: 'Observações (opcional)',
        value: formik.values?.observacao || '',
        onChange: (e) => formik.setFieldValue('observacao', e.target.value),
        xs: 12,
      },
    ],
  },
];
```

## 5. Orquestrador (núcleo)
```jsx
const [activeStep, setActiveStep] = useState(0);
const errors = {};

const formik = useFormik({
  initialValues: { nome: '', cep: '', observacao: '' },
  validate: (values) => {
    const fields = wizardInputs(formik).find((s) => s.step === activeStep + 1)?.fields;
    fields?.forEach((field) => {
      const error = validateField(field.name, getNestedFormikValue(values, field.name), fields);
      if (error) errors[field.name] = error;
    });
    return errors;
  },
  onSubmit: (values) => {
    if (activeStep === wizardInputs(formik).length - 1) {
      post('/api/cadastro', values);
    }
  },
});

const currentStepData = wizardInputs(formik).find((s) => s.step === activeStep + 1);
const isLastStep = activeStep === wizardInputs(formik).length - 1;
```

```jsx
<DynamicForm dataFields={currentStepData.fields} />
```

## 6. O que este exemplo demonstra
- Estrutura `{ step, title, fields }` aplicada na prática.
- Validação escopada por etapa.
- `isLastStep` derivado do tamanho do array, nunca hardcoded.

## 7. Quando NÃO Utilizar Esta Skill
- Para formulários pequenos sem necessidade de etapas → `Examples/ContactForm.md`.

## 8. Checklist Final
- [ ] `isLastStep` é derivado de `wizardInputs(formik).length`?
- [ ] A validação está filtrada por `activeStep`?
