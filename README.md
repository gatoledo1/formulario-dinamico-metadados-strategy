# Dynamic Form Architecture (Metadata Driven UI)

Uma arquitetura para construção de formulários dinâmicos em React baseada em três camadas: **Metadado**, **Renderer (Factory)** e **Orquestrador (Strategy)**. O objetivo é centralizar toda a configuração do formulário — campos, validações, comportamentos, requisições e regras de exibição — em um único arquivo de metadado, mantendo o componente visual completamente desacoplado.

### [Documentação para formulário com etapas](https://github.com/gatoledo1/formulario-dinamico-metadados-strategy/blob/main/README-form-steps.md)

### [Documentação sobre as Skills para IA](https://github.com/gatoledo1/formulario-dinamico-metadados-strategy/blob/main/.skills/DynamicForm/INDEX.md)

---


## Conceito Central

Em vez de criar campos diretamente no JSX, você descreve cada campo como um objeto JavaScript. O `DynamicForm` lê esse array de objetos e decide o que renderizar. Isso significa que adicionar, remover ou condicionar campos é uma alteração de dados, não de estrutura visual.

```
inputsMetadado.js   →   DynamicForm (index.js)   →   UI renderizada
   (O quê)                   (Como)                    (Resultado)
```

<img width="1394" height="1056" alt="image" src="https://github.com/user-attachments/assets/cc127448-15c2-4dc1-8e04-0df6107ff871" />

---

## Estrutura de Arquivos

```
/form
├── DynamicForm/
│   └── index.jsx              # Renderer: recebe o array e renderiza os campos
├── validatorFieldsValues.js   # Utilitários de validação e acesso a valores aninhados
├── inputsMetadado.js          # Metadado: define cada campo do formulário
├── formikMetadado.js          # Config do gerenciador de estado (Formik, RHF, etc.)
└── pessoaForm.js              # Orquestrador: conecta tudo e monta o formulário
```

---

## As Três Camadas

### 1. Metadado (`inputsMetadado.js`)

É um array de objetos, onde cada objeto é a descrição completa de um campo. O metadado é uma **função** que recebe o gerenciador de formulário (formik, ou qualquer outro) e retorna os campos já conectados ao estado.

```js
export const inputsMetadado = (formManager, setStateSnack) => {
  return [
    {
      type: 'inputTextOrNumber',
      name: 'pessoa.nome',
      label: 'Nome *',
      value: formManager.values.pessoa?.nome || '',
      onChange: (e) => formManager.setFieldValue('pessoa.nome', e.target.value),
      validate: (value) => (!value ? 'Campo obrigatório' : ''),
      error: formManager.touched?.pessoa?.nome && Boolean(formManager.errors?.['pessoa.nome']),
      helperText: formManager.touched?.pessoa?.nome && formManager.errors?.['pessoa.nome'],
      xs: 12, sm: 6, md: 4, lg: 4,
    },
  ];
};
```

### 2. Renderer — `DynamicForm`

Recebe `dataFields` (o array de metadado) e faz `.map()` sobre ele, passando cada item para `renderFormField(field)`. Essa função contém um `switch/case` no `field.type` que decide qual componente instanciar. Ele não sabe nada sobre regras de negócio — apenas lê as props do objeto e as repassa para o componente adequado.

```jsx
const DynamicForm = ({ dataFields, props }) => {

  const renderFormField = (field) => {
    // Calcula se o campo deve aparecer (condition + paisHomologado)
    const shouldDisplayField = /* ... lógica de condition */ true;

    switch (field.type) {
      case 'inputTextOrNumber':
        return shouldDisplayField && (
          <Grid item xs={field.xs} sm={field.sm} md={field.md} lg={field.lg}>
            <TextField
              name={field.name}
              value={field.value}
              label={field.label}
              onChange={field.onChange}
              onBlur={field.onBlur}
              error={field.error}
              helperText={field.helperText}
              disabled={field.disabled}
              inputProps={field.inputProps}
            />
          </Grid>
        );

      case 'select':
        return shouldDisplayField && (
          <Grid item xs={field.xs} sm={field.sm}>
            <Select value={field.value} onChange={field.onChange}>
              {field.options.map((opt) => (
                <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
              ))}
            </Select>
          </Grid>
        );

      // ... demais cases

      default:
        return null;
    }
  };

  return (
    <Grid container spacing={2}>
      {dataFields?.map((field, index) => (
        <React.Fragment key={field.name + index}>
          {renderFormField(field)}   {/* ← aqui acontece o dispatch por tipo */}
        </React.Fragment>
      ))}
    </Grid>
  );
};
```

O `DynamicForm` nunca importa `formik`, nunca faz `fetch`, nunca conhece o domínio. Toda a inteligência vem de fora, dentro dos objetos do array.

### 3. Orquestrador — `pessoaForm.js`

É o único ponto que conhece tudo: instancia o gerenciador de estado, chama `inputsMetadado` passando esse gerenciador, e entrega o array resultante para o `DynamicForm`. Também é aqui que vivem os efeitos de página — tabs, snackbar, scroll para o primeiro erro — que não pertencem nem ao metadado nem ao renderer.

```jsx
const PessoaForm = ({ closeModal, inputValue }) => {
  const [stateSnack, setStateSnack] = useState({ open: false, message: '' });
  const errors = {};

  // 1. Cria o gerenciador de estado
  const formik = useFormik({
    ...metaPessoaFormik(closeModal, setStateSnack, stateSnack),
    validate: (values) => {
      // 2. Usa o metadado para saber quais campos validar
      inputsMetadado(formik).forEach((field) => {
        const value = getNestedFormikValue(values, field.name);
        const error = validateField(field.name, value, inputsMetadado(formik));
        if (error) errors[field.name] = error;
      });
      return errors;
    },
  });

  // 3. Monta o array de campos já conectados ao estado
  const arrayFormData = inputsMetadado(formik, setStateSnack);

  return (
    <form onSubmit={formik.handleSubmit}>
      {/* 4. Entrega o array para o renderer — ele só sabe exibir */}
      <DynamicForm dataFields={arrayFormData} />
    </form>
  );
};
```

O fluxo de dados é sempre unidirecional:

```
formik (estado)
    ↓
inputsMetadado(formik)  →  array de objetos com values, handlers e validate já embutidos
    ↓
DynamicForm             →  map + switch/case → componentes MUI
```

---

## Anatomia de um Campo

Todo campo é um objeto plano. As propriedades mais comuns:

| Propriedade | Tipo | Descrição |
|---|---|---|
| `type` | `string` | Tipo do componente a renderizar (ver seção abaixo) |
| `name` | `string` | Caminho dot-notation do valor no estado (`'pessoa.endereco.cep'`) |
| `label` | `string` | Label exibida ao usuário |
| `value` | `any` | Valor atual vindo do estado |
| `onChange` | `function` | Handler de mudança — conecta ao estado |
| `onBlur` | `function` | Handler de blur |
| `validate` | `function` | Função de validação própria do campo |
| `error` | `boolean` | Se o campo está em estado de erro |
| `helperText` | `string` | Mensagem de erro exibida abaixo do campo |
| `condition` | `boolean \| undefined` | Regra de exibição do campo |
| `paisHomologado` | `string \| undefined` | Filtra exibição por país configurado no sistema |
| `xs/sm/md/lg` | `number` | Colunas do Grid responsivo (MUI Grid) |
| `disabled` | `boolean` | Desabilita o campo (pode ser reativo ao estado) |
| `inputProps` | `object` | Atributos HTML nativos (`maxLength`, `id-robot`, etc.) |

---

## Tipos de Campo (`type`)

O `DynamicForm` suporta os seguintes tipos out-of-the-box:

| `type` | Componente renderizado |
|---|---|
| `section` | Separador visual com título de seção |
| `inputTextOrNumber` | `TextField` padrão (texto ou número) |
| `inputTextWithButtonInside` | `TextField` com botão de ação embutido (ex: busca de CEP) |
| `autocomplete` | `Autocomplete` com opções locais |
| `AutocompleteUsarInfiniteScroll` | Autocomplete com paginação infinita e fetch próprio |
| `select` | `Select` com lista de opções fixas |
| `datepicker` | `DatePicker` com localização |
| `radioGroup` | Grupo de `Radio` buttons |
| `switch` | Toggle `Switch` com label |
| `textArea` | `TextareaAutosize` |
| `fileUpload` | Componente de upload de arquivos |

Para adicionar um novo tipo, basta inserir um novo `case` no `switch` dentro de `DynamicForm`.

---

## Regras de Exibição Condicional

Campos podem ser exibidos ou ocultados de forma reativa usando duas propriedades independentes que podem ser combinadas.

### `condition`

Expressão booleana avaliada em tempo de execução. Como o metadado é uma função que roda a cada render, ela tem acesso ao estado atual do formulário.

```js
// Exibe o campo "passaporte" apenas se a nacionalidade NÃO for Brasil
{
  type: 'inputTextOrNumber',
  name: 'pessoa.pessoaFisica.passaPorte',
  condition: formik.values.pessoa?.nacionalidade?.nome !== 'BRASIL',
  // ...
}

// Exibe "inscrição estadual" apenas se o regime for "CONTRIBUINTE"
{
  type: 'inputTextOrNumber',
  name: 'pessoa.pessoaFisica.inscricaoEstadual',
  condition: formik.values.pessoa?.pessoaFisica?.regimeTributarioIcms === 'CONTRIBUINTE',
  disabled: formik.values.pessoa?.pessoaFisica?.regimeTributarioIcms !== 'CONTRIBUINTE',
  // ...
}
```

Quando `condition` é `undefined`, o campo é exibido por padrão. Quando é `false`, o campo é ocultado **e sua validação é ignorada** automaticamente.

### `paisHomologado`

Filtra o campo com base no país configurado no sistema (variável global `paisHomologado`). Útil para campos exclusivos de um país (CPF para Brasil, NIF para Portugal, etc.).

```js
// Campo visível apenas no Brasil
{
  type: 'inputTextOrNumber',
  name: 'pessoa.pessoaFisica.cpf',
  paisHomologado: 'Brasil',
  // ...
}

// Campo visível apenas em Portugal
{
  type: 'inputTextOrNumber',
  name: 'pessoa.nif',
  paisHomologado: 'Portugal',
  // ...
}
```

### Combinando os dois

Quando ambos estão presentes, **os dois precisam ser verdadeiros** para o campo aparecer:

```js
// Aparece apenas SE for Brasil E SE o país selecionado no formulário for Brasil
{
  name: 'pessoa.pessoaFisica.cedulaIdentidade',
  paisHomologado: 'Brasil',
  condition: formik.values.pessoa?.nacionalidade?.nome?.includes('BRASIL'),
  // ...
}
```

A lógica completa no `DynamicForm`:

```js
if (hasCondition && hasPaisHomologado) {
  shouldDisplayField = field.condition && paisHomologado.nome.includes(field.paisHomologado);
} else {
  shouldDisplayField = condition ?? paisHomologadoMatch;
}
```

---

## Validação por Campo

Cada campo carrega sua própria função `validate`. Isso mantém a regra de validação co-localizada com a definição do campo, sem precisar de um schema externo (Yup, Zod, etc.).

```js
{
  name: 'pessoa.razaoNome',
  validate: (value) => {
    if (!value) return 'Campo obrigatório';
    if (value.length < 3) return 'Nome muito curto';
    return ''; // sem erro
  },
}
```

### Como a validação é orquestrada

O `pessoaForm.js` passa uma função `validate` para o gerenciador de formulário que itera todos os campos e coleta os erros:

```js
const formik = useFormik({
  ...metaPessoaFormik(closeModal, setStateSnack, stateSnack),
  validate: (values) => {
    const errors = {};
    inputsMetadado(formik).forEach((field) => {
      const fieldValue = getNestedFormikValue(values, field.name);
      const error = validateField(field.name, fieldValue, inputsMetadado(formik));
      if (error) errors[field.name] = error;
    });
    return errors;
  },
});
```

### `validateField` e `getNestedFormikValue`

```js
// validatorFieldsValues.js

// Executa a função validate do campo, mas só se ele estiver visível (condition !== false)
export const validateField = (name, value, validations) => {
  const validation = validations.find((val) => val.name === name);
  return validation?.condition !== false ? validation.validate?.(value) : '';
};

// Acessa valores aninhados por dot-notation: 'pessoa.endereco.cep'
export const getNestedFormikValue = (obj, path) => {
  const keys = path?.split('.');
  return keys?.reduce((acc, key) => acc && acc[key], obj) || null;
};
```

A validação é **automaticamente pulada** para campos com `condition: false`, porque o campo está oculto e não faz sentido validá-lo.


---

## Campos com Dependência entre Si (`dependencyValueToUpdate`)

Para autocompletes que dependem do valor de outro campo (ex: cidade depende da UF selecionada):

```js
{
  type: 'infiniteScrollAutocomplete',
  name: 'cidadeResidencia',
  getUrl: (term) => {
    const idUf = formik.values?.cidadeResidencia?.unidadeFederativa?.id;
    return `/cidade/findByUnidadeFederativaAutocomplete?term=${term}&idUf=${idUf}`;
  },
  // Quando a UF mudar, o componente sabe que precisa resetar/recarregar suas opções
  dependencyValueToUpdate: formik.values?.cidadeResidencia?.unidadeFederativa,
}
```

`dependencyValueToUpdate` é repassado ao componente de autocomplete (geralmente usado como dependência de um `useEffect` interno) para que ele dispare uma nova busca sempre que o valor "pai" mudar — sem precisar acoplar essa lógica ao `DynamicForm`.

Por exemplo, o componente `InfiniteScrollAutocomplete.js` utiliza essa verificação de dependência:

```js
useEffect(() => {
 (async () => {
   try {
     const response = await initialOptions?.(term) || []
     setFetchOptions(response)
   } catch (error) {
     console.error("error", error)
   }
 })()
}, [term, dependencyValueToUpdate])
```

---

## Requisições Desacopladas do Componente

Um dos pontos mais fortes da arquitetura é que **requisições HTTP ficam no metadado**, não no componente. O `DynamicForm` nunca faz `fetch` diretamente.

### Requisição no `inputRef` (ao montar o campo)

Ideal para popular um campo com um valor inicial vindo da API assim que ele aparece na tela:

```js
{
  type: 'inputTextOrNumber',
  name: 'pessoa.codigo',
  inputRef: (input) => {
    if (input && !input.requestMade) {
      input.requestMade = true; // evita requisições duplicadas
      get('/api/getCodigoSequencial').then((res) => {
        input.value = res;
        formManager.setFieldValue('pessoa.codigo', res);
      });
    }
  },
}
```

### Requisição no `onBlur` (ao sair do campo)

Ideal para validações assíncronas (ex: verificar duplicidade) ou para buscar dados com base no valor digitado:

```js
{
  name: 'pessoa.pessoaFisica.cpf',
  onBlur: (e) => {
    if (e.target.value.length > 10) {
      post('/api/isCpfJaExistente?documento=' + e.target.value).then((exists) => {
        if (exists) showSnack('CPF já cadastrado');
      });
    }
  },
}
```

### Requisição no `iconActionBtn` (botão de ação dentro do campo)

Usado no tipo `inputTextWithButtonInside`. O botão dispara uma ação — no exemplo, busca de endereço por CEP:

```js
{
  type: 'inputTextWithButtonInside',
  name: 'endereco.cep',
  iconActionBtn: async () => {
    const data = await get(`https://viacep.com.br/ws/${formManager.values.endereco?.cep}/json/`);
    formManager.setFieldValue('endereco.logradouro', data.logradouro);
    formManager.setFieldValue('endereco.bairro', data.bairro);
  },
}
```

### Autocomplete com fetch configurável

Para o tipo `AutocompleteUsarInfiniteScroll`, a URL e a função de busca são passadas como props no metadado — o componente não precisa saber nada sobre a API:

```js
{
  type: 'AutocompleteUsarInfiniteScroll',
  name: 'pessoa.nacionalidade',
  fetchFunction: get,  // qualquer função que retorna uma Promise
  getUrl: (term) => `/api/paises?term=${term}`,
  initialOptions: (term) => get(`/api/paises?term=${term}&pagina=0`),
  onChange: (e, value) => formManager.setFieldValue('pessoa.nacionalidade', { id: value?.id, nome: value?.label }),
}
```

---

## Independência do Gerenciador de Estado

O metadado e o `DynamicForm` não têm dependência direta do Formik. Eles esperam um objeto que expõe `values`, `setFieldValue`, `handleBlur` e `touched/errors` — qualquer lib que forneça isso funciona.

### Com React Hook Form

```js
// formRHFMetadado.js
export const metaFormRHF = (methods) => {
  const { watch, setValue, formState: { errors, touchedFields } } = methods;

  // Adapta a interface para o mesmo formato esperado pelo metadado
  const formManager = {
    values: watch(),
    setFieldValue: (path, value) => setValue(path, value),
    handleBlur: () => {},
    touched: touchedFields,
    errors,
  };

  return formManager;
};
```

```jsx
// No componente
const methods = useForm({ defaultValues: { ... } });
const formManager = metaFormRHF(methods);
const fields = inputsMetadado(formManager);

return (
  <FormProvider {...methods}>
    <form onSubmit={methods.handleSubmit(onSubmit)}>
      <DynamicForm dataFields={fields} />
    </form>
  </FormProvider>
);
```

### Com useState puro

```js
const [values, setValues] = useState({ pessoa: { nome: '' } });

const formManager = {
  values,
  setFieldValue: (path, value) => {
    setValues((prev) => {
      const next = { ...prev };
      // set aninhado por dot-notation
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

---

## Seções Visuais

O tipo `section` não é um input — é um separador que agrupa campos visualmente. Suporta estilos customizados via `className` e `fontSize`:

```js
{
  type: 'section',
  name: 'Dados Pessoais',
  className: 'section-title',        // classe padrão
  sectionMargin: 2,                  // margem vertical
},
{
  type: 'section',
  name: 'Atenção: revise os dados',
  className: 'section-title highlight', // com fundo destacado
  fontSize: '0.875rem',
},
```

Seções também suportam `condition` e `paisHomologado` — se o bloco de campos que ela apresenta está oculto, a seção pode ser ocultada junto.

---

## Scroll para o Primeiro Erro

O orquestrador implementa navegação automática para o primeiro campo com erro após tentativa de submit:

```js
const scrollToError = () => {
  const keys = Object.keys(errors);
  if (!keys.length) return;
  const inputDOM = document.querySelector(`[name='${keys[0]}']`);
  inputDOM?.focus();
  inputDOM?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
};

// Botão de submit
<Button
  type="submit"
  onClick={() => setTimeout(scrollToError, 200)} // aguarda o ciclo de validação
>
  Salvar
</Button>
```

---

## Adicionando um Novo Tipo de Campo

1. Defina o novo `type` no metadado com as props necessárias:

```js
{
  type: 'colorPicker',
  name: 'preferencias.cor',
  value: formManager.values.preferencias?.cor || '#000000',
  onChange: (color) => formManager.setFieldValue('preferencias.cor', color),
  label: 'Cor favorita',
  xs: 6,
}
```

2. Adicione o `case` no `DynamicForm`:

```jsx
case 'colorPicker':
  return (
    shouldDisplayField && (
      <Grid item xs={field.xs} sm={field.sm} md={field.md} lg={field.lg}>
        <label>{field.label}</label>
        <input
          type="color"
          name={field.name}
          value={field.value}
          onChange={(e) => field.onChange(e.target.value)}
        />
      </Grid>
    )
  );
```

Nenhuma outra parte do código precisa mudar.

---

## Exemplo Completo: Formulário de Contato

```js
// contactInputsMetadado.js
export const contactInputs = (form) => [
  {
    type: 'section',
    name: 'Seus dados',
  },
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
    // Campo condicional: só aparece se assunto for "OUTRO"
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

```jsx
// ContactForm.jsx
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

---

## Pontos de Extensão

- **Novo tipo de campo**: adicionar `case` no `DynamicForm` e definir o objeto no metadado.
- **Nova regra de exibição**: além de `condition` e `paisHomologado`, o `DynamicForm` pode ser estendido com qualquer propriedade (ex: `role`, `featureFlag`).
- **Novo gerenciador de estado**: qualquer lib que exponha `values`, `setFieldValue` e `errors` é compatível com o metadado sem alterar o `DynamicForm`.
- **Múltiplos formulários / tabs**: basta ter arrays de metadado separados e alternar qual é passado para o `DynamicForm` conforme a tab ativa.

```jsx
const arrayFormData  = inputsMetadadoPessoaFisica(formik);
const arrayFormData2 = inputsMetadadoPessoaJuridica(formik);

<DynamicForm dataFields={tab === 0 ? arrayFormData : arrayFormData2} />
```
