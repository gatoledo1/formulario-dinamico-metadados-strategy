---
skill_id: dynamic-form-ext-statemanagers
name: Dynamic Form — State Managers Extension
version: 1.0
type: extension-skill
extends: dynamic-form-knowledge
requires: [Knowledge.md, Components/Orchestrator.md]
priority: medium
language: pt-BR
domain: frontend-engineering
tags: [react, formik, react-hook-form, usestate, state-management, dynamic-form]
---

# StateManagers.md — Independência do Gerenciador de Estado

## 1. Missão
Documentar exclusivamente como adaptar a arquitetura para diferentes gerenciadores de estado (Formik, React Hook Form, `useState` puro, ou outro).

## 2. Dependências
- `Knowledge.md`
- `Components/Orchestrator.md`

## 3. Objetivo
Garantir que qualquer migração de gerenciador de estado afete somente o Orquestrador, nunca o Metadado (estruturalmente) nem o Renderer.

## 4. Modelo Mental
O Metadado e o Renderer dependem apenas de uma interface mínima — não de uma lib específica:
```ts
interface FormManager {
  values: object;
  setFieldValue: (path: string, value: any) => void;
  touched?: object;
  errors?: object;
  handleBlur?: (e: any) => void;
}
```
Qualquer objeto que implemente essa interface é "plugável" na arquitetura.

## 5. Com Formik (referência)
```js
const formik = useFormik({ initialValues, onSubmit, validate });
const fields = inputsMetadado(formik);
```

## 6. Com React Hook Form
```js
export const metaFormRHF = (methods) => {
  const { watch, setValue, formState: { errors, touchedFields } } = methods;
  return {
    values: watch(),
    setFieldValue: (path, value) => setValue(path, value),
    handleBlur: () => {},
    touched: touchedFields,
    errors,
  };
};
```
```jsx
const methods = useForm({ defaultValues: { /* ... */ } });
const formManager = metaFormRHF(methods);
const fields = inputsMetadado(formManager);

<FormProvider {...methods}>
  <form onSubmit={methods.handleSubmit(onSubmit)}>
    <DynamicForm dataFields={fields} />
  </form>
</FormProvider>
```

## 7. Com `useState` puro
```js
const [values, setValues] = useState({ pessoa: { nome: '' } });

const formManager = {
  values,
  setFieldValue: (path, value) => {
    setValues((prev) => {
      const next = { ...prev };
      path.split('.').reduce((obj, key, i, arr) => {
        if (i === arr.length - 1) obj[key] = value;
        else obj[key] = { ...obj[key] };
        return obj[key];
      }, next);
      return next;
    });
  },
  handleBlur: () => {},
  touched: {},
  errors: {},
};
```

## 8. Regras Obrigatórias
- O Metadado deve sempre receber `formManager` como parâmetro — nunca importar `formik`/`methods` diretamente de um módulo global.
- O Renderer nunca deve ser alterado ao trocar de gerenciador de estado.
- A função `getNestedFormikValue` (apesar do nome histórico) é agnóstica e funciona com qualquer `values` em formato de objeto aninhado — não é exclusiva do Formik.

## 9. Processo de Decisão (Migração)
1. Criar a função adaptadora (`metaFormRHF`, `metaUseState`, etc.) que traduz a API da nova lib para a interface `FormManager`.
2. Substituir, no Orquestrador, a instância antiga pela nova + adaptador.
3. Reexecutar o Metadado (`inputsMetadado(formManager)`) sem alterar seu código interno.
4. Confirmar que nenhum `case` do Renderer faz referência a `formik.*` diretamente (isso seria uma violação preexistente a corrigir).

## 10. Anti-Padrões
```js
// Proibido — metadado importando formik diretamente em vez de recebê-lo como parâmetro
import { useFormikContext } from 'formik';
export const inputsMetadado = () => {
  const formik = useFormikContext(); // acopla o metadado ao Formik
  // ...
};
```

## 11. Never Do
- Nunca importar uma lib de gerenciamento de estado dentro do Renderer.
- Nunca acoplar o Metadado a uma lib específica via `useContext`/hook proprietário — sempre receber `formManager` por parâmetro.
- Nunca deixar uma migração "pela metade", com alguns campos usando a interface adaptada e outros chamando a lib antiga diretamente.

## 12. Quando NÃO Utilizar Esta Skill
- Para o prompt operacional completo de migração → `Prompts/MigrateFormikToRHF.md`.

## 13. Output Contract
Após qualquer migração, o Metadado e o Renderer devem permanecer exatamente como estavam — toda mudança real fica isolada no Orquestrador e no adaptador.

## 14. Checklist Final
- [ ] O Metadado recebe `formManager` por parâmetro, sem import direto da lib?
- [ ] O Renderer não foi alterado?
- [ ] O adaptador implementa toda a interface mínima (`values`, `setFieldValue`, `touched`, `errors`)?
