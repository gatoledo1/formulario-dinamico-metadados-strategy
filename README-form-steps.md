# Extensão: Formulários com Steps (Wizard)

Este documento complementa o [README principal](./README.md) da arquitetura de formulários dinâmicos. Aqui é descrita uma extensão que permite dividir um formulário grande em **etapas (steps)**, sem alterar nada da camada `DynamicForm` (Renderer). A mudança acontece inteiramente na forma como o **metadado** é estruturado e como o **orquestrador** consome esse metadado.

---

## Ideia Central

Em vez do metadado ser um array plano de campos, ele passa a ser um **array de etapas**, onde cada etapa contém seu próprio array de campos:

```
inputsMetadado.js (flat)          stepFormMetadados.js (com steps)
[ campo, campo, campo ]    →      [
                                     { step: 1, title: '...', fields: [campo, campo] },
                                     { step: 2, title: '...', fields: [campo] },
                                     { step: 3, title: '...', fields: [campo] },
                                   ]
```

O `DynamicForm` continua recebendo apenas `dataFields` — um array de campos. A única diferença é que agora esse array é **filtrado pela etapa ativa** antes de chegar até ele:

```jsx
const currentStepData = stepFormMetadados(formik).find((step) => step.step === activeStep + 1);

<DynamicForm dataFields={currentStepData.fields} />
```

Ou seja: **o Renderer não sabe que existem steps.** Ele recebe sempre um array de campos comum, exatamente como antes. Toda a complexidade de navegação fica isolada no orquestrador.

---

## Anatomia de uma Etapa

```js
{
  step: 1,                         // identificador numérico da etapa (1-indexed)
  title: jQuery.i18n.prop('label.dados.pessoais'), // label exibida no Stepper
  fields: [
    { type: 'section', name: '...' },
    { type: 'inputTextOrNumber', name: 'nome', /* ... */ },
    { type: 'datepicker', name: 'dataNascimento', /* ... */ },
    // ...
  ],
}
```

Cada `field` dentro de `fields` segue exatamente as mesmas regras já documentadas no README principal (`type`, `condition`, `validate`, `onChange`, etc.). Nada muda na escrita de um campo individual — a única novidade é o agrupamento em etapas.

---

## Orquestrador com Steps — `FormSteps` (`index.js`)

### Estado da etapa ativa

```js
const [activeStep, setActiveStep] = useState(0);
const [skipped, setSkipped] = useState(new Set());

const steps = stepFormMetadados(formik).map((item) => item.title);
const isLastStep = activeStep === steps.length - 1;
const currentStepData = stepFormMetadados(formik).find((step) => step.step === activeStep + 1);
```

- `activeStep` guarda o índice da etapa atual (0-indexed), enquanto `step` no metadado é 1-indexed — por isso o `+1` na busca.
- `steps` é usado apenas para alimentar o componente visual `Stepper`.
- `currentStepData.fields` é o array que efetivamente vai para o `DynamicForm`.

### Renderização do indicador de progresso (Stepper)

```jsx
<Stepper activeStep={activeStep}>
  {stepFormMetadados(formik).map((step, index) => (
    <Step key={index}>
      <StepLabel>{step.title}</StepLabel>
    </Step>
  ))}
</Stepper>
```

O `Stepper` é só uma representação visual — ele não controla a navegação, apenas reflete o `activeStep`.

---

## Validação Escopada por Etapa

Esse é o ponto mais importante da extensão. Diferente da versão flat (que valida **todos** os campos do formulário de uma vez), aqui a validação (com o Formik como exemplo) filtra **apenas os campos da etapa ativa**:

```js
const formik = useFormik({
  ...metaFormik(closeModal, data?.ficha),
  validate: (values) => {
    const fields = stepFormMetadados(formik)
      .find((step) => step.step === activeStep + 1)
      ?.fields;

    fields?.forEach((field) => {
      const error = validateField(
        field.name,
        getNestedFormikValue(values, field.name),
        fields
      );
      if (error) errors[field.name] = error;
    });

    return errors;
  },
});
```

Isso significa que:

- O usuário só é bloqueado pelos campos que ele está vendo na tela naquele momento.
- Campos de etapas futuras (ainda não preenchidos) não geram erro prematuramente.
- Campos de etapas já preenchidas e validadas não são revalidados a cada submit de etapas seguintes (a menos que o usuário volte a elas).

> **Importante**: como `validate` do Formik roda sobre `values` inteiro (todas as etapas), o filtro por `activeStep` é essencial — sem ele, qualquer campo obrigatório de uma etapa futura impediria o avanço da etapa atual.

---

## Navegação Entre Etapas

### Avançar (`handleNext`)

O avanço só ocorre se a validação da etapa atual não retornar erros. Isso é feito em duas fases assíncronas, usando `setTimeout` para aguardar o ciclo de validação do Formik:

```js
const handleNext = () => {
  let newSkipped = skipped;
  if (isStepSkipped(activeStep)) {
    newSkipped = new Set(newSkipped.values());
    newSkipped.delete(activeStep);
  }
  setActiveStep((prev) => prev + 1);
  setSkipped(newSkipped);
};
```

```jsx
<DebouncedButton
  type="submit"
  debounceTime={500}
  onClick={() => {
    setTimeout(() => scrollToError(), 0);

    setTimeout(() => {
      if (Object.keys(errors).length === 0) {
        handleNext();
      }
    }, 300);
  }}
>
  {jQuery.i18n.prop('label.continuar')}
</DebouncedButton>
```

O fluxo é:

1. `type="submit"` dispara o `formik.handleSubmit`, que por sua vez executa o `validate` (escopado à etapa atual).
2. Após o ciclo de validação rodar (`setTimeout(..., 300)`), verifica-se se `errors` está vazio.
3. Se sim, avança para a próxima etapa com `handleNext()`.
4. Se não, `scrollToError()` já foi disparado antes, levando o foco ao primeiro campo inválido.

### Voltar (`handleBack`)

Não há validação ao retroceder — o usuário pode sempre revisar etapas anteriores livremente:

```js
const handleBack = () => {
  setActiveStep((prev) => prev - 1);
};
```

```jsx
<Button disabled={activeStep === 0} onClick={handleBack}>
  {jQuery.i18n.prop('label.voltar')}
</Button>
```

### Finalizar (última etapa)

Quando `isLastStep` é verdadeiro, o botão muda de label/comportamento — em vez de chamar `handleNext`, o `submit` do Formik dispara o `onSubmit` real, processando o payload completo:

```jsx
{isLastStep ? (
  <DebouncedButton
    type="submit"
    onClick={() => setTimeout(() => scrollToError(), 200)}
  >
    {jQuery.i18n.prop('label.finalizar')}
  </DebouncedButton>
) : (
  <DebouncedButton type="submit" /* ... handleNext ... */>
    {jQuery.i18n.prop('label.continuar')}
  </DebouncedButton>
)}
```

```js
onSubmit: (values) => {
  if (isLastStep) {
    submitficha(values, data, closeModal);
  }
},
```

O `onSubmit` do Formik só executa a lógica de envio real quando está na última etapa — em etapas intermediárias, o "submit" serve apenas para disparar a validação e avançar.

---

## `DebouncedButton`: Evitando Duplo Clique

Como `handleNext` e o submit final dependem de `setTimeout` em cascata, existe risco de o usuário clicar múltiplas vezes antes da validação assíncrona terminar. Por isso os botões de navegação usam um componente com debounce embutido (`debounceTime={500}`) em vez do `Button` padrão do MUI — garantindo que múltiplos cliques rápidos não disparem múltiplas validações/avanços simultâneos.

---

## Resetando Campos Dependentes (Cascata)

Quando o usuário muda um campo "pai" (ex: nacionalidade), pode ser necessário limpar campos "filhos" que perderam o sentido. O padrão usado é o `formik.setValues` com múltiplos campos de uma vez, dentro do próprio `onChange`/`iconActionBtn` do campo disparador:

```js
{
  type: 'inputTextWithButtonInside',
  name: 'cep',
  iconActionBtn: async () => {
    const dataCep = await get(`https://viacep.com.br/ws/${formik.values?.cep}/json/`);
    if (dataCep) {
      const { logradouro, complemento, bairro, localidade, uf } = dataCep;
      const cidadeResidencia = await get(`/cidade/findCidadeByNomeAndUf?cidade=${localidade}&uf=${uf}&pagina=0`);

      // Atualiza múltiplos campos relacionados em uma única chamada
      formik.setValues({
        ...formik.values,
        cidadeResidencia,
        logradouro,
        complemento,
        bairro,
      });
    }
  },
}
```

Esse padrão evita múltiplas chamadas sequenciais de `setFieldValue` (que poderiam gerar re-renders intermediários inconsistentes) e mantém a atualização da "cascata" atômica.

---

## Campos Condicionados a Cálculos Derivados

Outro padrão que aparece nesta versão é calcular um valor derivado dentro do próprio `onChange` de um campo, para uso em `condition` de outros campos da mesma etapa:

```js
{
  type: 'datepicker',
  name: 'dataNascimento',
  onChange: (value) => {
    const valorFormatado = moment(value).format('DD/MM/YYYY');
    formik.setFieldValue('dataNascimento', valorFormatado);

    // Calcula idade e guarda no estado — usada como condição em outro campo
    formik.setFieldValue(
      'idade',
      moment().diff(moment(valorFormatado, 'DD/MM/YYYY'), 'years')
    );
  },
}
```

```js
{
  // Campo de certidão de nascimento só aparece se for menor de idade
  type: 'inputTextOrNumber',
  name: 'certidaoNascimento',
  condition:
    formik.values.nacionalidade?.nome?.includes('BRASIL') &&
    formik.values?.idade < 18,
}
```

`idade` não existe como campo visual — é um valor auxiliar guardado no `values` do Formik apenas para alimentar a `condition` de outro campo. Esse padrão evita duplicar a lógica de cálculo em múltiplos lugares.

---

## Diagrama do Fluxo com Steps

```
stepFormMetadados(formik)
        │
        ▼
[ {step:1, fields:[...]}, {step:2, fields:[...]}, {step:3, fields:[...]} ]
        │
        │  currentStepData = steps.find(s => s.step === activeStep + 1)
        ▼
   currentStepData.fields
        │
        ▼
  <DynamicForm dataFields={currentStepData.fields} />   ← Renderer não muda em nada
        │
        ▼
  Componentes MUI da etapa atual

Navegação:
  [Continuar] → valida fields da etapa atual → sem erro → activeStep++
  [Voltar]    → activeStep--  (sem validação)
  [Finalizar] → valida última etapa → sem erro → onSubmit real (submitficha)
```

---

## Resumo das Diferenças vs. Versão Flat

| Aspecto | Flat (`inputsMetadado`) | Com Steps (`stepFormMetadados`) |
|---|---|---|
| Formato do metadado | Array de campos | Array de `{ step, title, fields }` |
| Quem filtra os campos | Nenhum filtro — tudo renderiza junto | Orquestrador filtra por `activeStep` |
| Escopo da validação | Todos os campos do formulário | Apenas os campos da etapa ativa |
| Navegação | Não existe | `handleNext` / `handleBack` controlados pelo orquestrador |
| Submit real | Direto no clique de "Salvar" | Só executa quando `isLastStep === true` |
| `DynamicForm` (Renderer) | Sem alteração | Sem alteração — continua recebendo um array simples de campos |

A principal lição arquitetural aqui é que **a complexidade de "etapas" nunca vaza para o Renderer**. Ele continua sendo um componente que recebe `dataFields` e desenha. Toda a orquestração de navegação, validação escopada e submit condicional vive exclusivamente no componente de página (`FormSteps`), reaproveitando 100% do `DynamicForm` já existente.
