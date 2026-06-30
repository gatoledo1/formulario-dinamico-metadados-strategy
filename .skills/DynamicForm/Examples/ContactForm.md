---
skill_id: dynamic-form-example-contactform
name: Dynamic Form — Contact Form Example
version: 1.0
type: example-skill
extends: dynamic-form-knowledge
requires: [Knowledge.md]
priority: low
language: pt-BR
domain: frontend-engineering
tags: [react, example, contact-form, dynamic-form]
---

# ContactForm.md — Exemplo: Formulário de Contato

## 1. Missão
Servir como exemplo de referência mínimo e completo, do metadado ao componente, sem nenhuma extensão avançada (sem steps, sem async complexo).

## 2. Dependências
- `Knowledge.md`

## 3. Objetivo
Ser o primeiro exemplo a consultar ao criar um formulário novo do zero.

## 4. Metadado
```js
export const contactInputs = (form) => [
  { type: 'section', name: 'Seus dados' },
  {
    type: 'inputTextOrNumber',
    name: 'nome',
    label: 'Nome completo *',
    value: form.values.nome || '',
    onChange: (e) => form.setFieldValue('nome', e.target.value),
    onBlur: form.handleBlur,
    validate: (v) => (!v ? 'Campo obrigatório' : ''),
    error: form.touched?.nome && Boolean(form.errors?.nome),
    helperText: form.touched?.nome && form.errors?.nome,
    xs: 12, sm: 6,
  },
  {
    type: 'inputTextOrNumber',
    name: 'email',
    label: 'E-mail *',
    value: form.values.email || '',
    onChange: (e) => form.setFieldValue('email', e.target.value),
    onBlur: form.handleBlur,
    validate: (v) => {
      if (!v) return 'Campo obrigatório';
      if (!/\S+@\S+\.\S+/.test(v)) return 'E-mail inválido';
      return '';
    },
    error: form.touched?.email && Boolean(form.errors?.email),
    helperText: form.touched?.email && form.errors?.email,
    xs: 12, sm: 6,
  },
  {
    type: 'select',
    name: 'assunto',
    label: 'Assunto',
    value: form.values.assunto || '',
    options: [
      { value: 'SUPORTE', label: 'Suporte técnico' },
      { value: 'COMERCIAL', label: 'Comercial' },
      { value: 'OUTRO', label: 'Outro' },
    ],
    onChange: (e) => form.setFieldValue('assunto', e.target.value),
    xs: 12, sm: 4,
  },
  {
    type: 'inputTextOrNumber',
    name: 'assuntoCustom',
    label: 'Descreva o assunto',
    condition: form.values.assunto === 'OUTRO',
    value: form.values.assuntoCustom || '',
    onChange: (e) => form.setFieldValue('assuntoCustom', e.target.value),
    validate: (v) => (form.values.assunto === 'OUTRO' && !v ? 'Campo obrigatório' : ''),
    xs: 12, sm: 8,
  },
  {
    type: 'textArea',
    name: 'mensagem',
    placeholder: 'Sua mensagem...',
    value: form.values.mensagem || '',
    onChange: (e) => form.setFieldValue('mensagem', e.target.value),
    minRows: 4,
    xs: 12,
  },
];
```

## 5. Orquestrador
```jsx
const ContactForm = () => {
  const [stateSnack, setStateSnack] = useState({ open: false, message: '' });
  const errors = {};

  const formik = useFormik({
    initialValues: { nome: '', email: '', assunto: '', assuntoCustom: '', mensagem: '' },
    validate: (values) => {
      contactInputs(formik).forEach((field) => {
        const value = getNestedFormikValue(values, field.name);
        const error = validateField(field.name, value, contactInputs(formik));
        if (error) errors[field.name] = error;
      });
      return errors;
    },
    onSubmit: (values) => {
      post('/api/contato', values).then(() => {
        setStateSnack({ open: true, message: 'Mensagem enviada!' });
      });
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <DynamicForm dataFields={contactInputs(formik)} />
      <Button type="submit" variant="contained">Enviar</Button>
    </form>
  );
};
```

## 6. O que este exemplo demonstra
- Campo condicional simples (`assuntoCustom` só aparece se `assunto === 'OUTRO'`).
- Validação local por campo, incluindo validação dependente de outro campo.
- Fluxo completo Metadado → Orquestrador → Renderer sem nenhuma extensão avançada.

## 7. Quando NÃO Utilizar Esta Skill
- Para formulários com múltiplas etapas → `Examples/WizardExample.md`.
- Para formulários com busca de endereço/autocomplete remoto → `Examples/AddressLookup.md`.

## 8. Checklist Final
- [ ] O exemplo roda sem nenhuma extensão avançada (steps, async complexo)?
- [ ] O campo condicional reflete o padrão de `Extensions/Conditions.md`?
