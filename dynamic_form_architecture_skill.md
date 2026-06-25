---
name: Dynamic Form Architecture Skill
description: Skill para entender, projetar e manter formulários dinâmicos em React com arquitetura em três camadas: Metadado, Renderer e Orquestrador.
language: pt-BR
audience: agentic-ai
version: 1.0
---

# Skill: Dynamic Form Architecture

## Objetivo

Esta Skill descreve uma arquitetura para construção de formulários dinâmicos em React baseada em **três camadas**:

1. **Metadado** — define o que o formulário contém.
2. **Renderer (Factory)** — decide como cada campo é renderizado.
3. **Orquestrador (Strategy)** — conecta estado, validações, efeitos colaterais e submissão.

A regra central é: **toda a inteligência do formulário deve morar fora do componente visual**. O renderer apenas recebe dados e exibe.

---

## Quando aplicar esta Skill

Use esta Skill quando precisar:

- criar formulários dinâmicos em React;
- centralizar campos, validações e regras em um único arquivo de configuração;
- suportar múltiplos tipos de campos com uma única camada de renderização;
- esconder/mostrar campos por condição;
- desacoplar a UI da lógica de negócio;
- reaproveitar a mesma estrutura com Formik, React Hook Form ou `useState`.

---

## Princípios fundamentais

### 1) Separação de responsabilidades

- **Metadado** define campos, regras e comportamento.
- **Renderer** traduz o metadado em componentes visuais.
- **Orquestrador** coordena estado, chamadas assíncronas, efeitos de página e envio.

### 2) Configuração dirigida por dados

Campos não devem ser hardcoded no JSX.  
O formulário deve ser montado a partir de um array de objetos.

### 3) Baixo acoplamento

O renderer não deve conhecer domínio, API, Formik, RHF ou regras específicas da aplicação.

### 4) Extensibilidade previsível

Adicionar um novo tipo de campo deve exigir, no máximo:

- um novo objeto no metadado;
- um novo `case` no renderer.

---

## Visão geral da arquitetura

```text
inputsMetadado.js   ->   DynamicForm (renderer)   ->   UI renderizada
   (O quê)                 (Como)                    (Resultado)
```

### Fluxo de dados

```text
estado do formulário
        ↓
inputsMetadado(formManager)
        ↓
array de objetos com values, handlers, validações e regras
        ↓
DynamicForm
        ↓
componentes visuais
```

---

## Estrutura esperada de arquivos

```text
/form
├── DynamicForm/
│   └── index.jsx              # Renderer: faz map + switch por type
├── validatorFieldsValues.js    # Utilitários de validação e acesso a valores aninhados
├── inputsMetadado.js          # Metadado: define os campos do formulário
├── formikMetadado.js          # Adaptações do gerenciador de estado
└── pessoaForm.js              # Orquestrador: conecta tudo e monta o formulário
```

---

## Camada 1 — Metadado

O metadado é um **array de objetos**. Cada objeto descreve um campo.

### Características obrigatórias do metadado

- Deve ser legível como configuração.
- Deve expor `type`, `name`, `label`, `value`, `onChange` e propriedades de layout.
- Pode incluir `validate`, `condition`, `disabled`, `error`, `helperText`, `inputProps`, `options`, `fetchFunction`, `getUrl`, `iconActionBtn`, entre outros.

### Exemplo

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
      xs: 12,
      sm: 6,
      md: 4,
      lg: 4,
    },
  ];
};
```

### Regra para agentes

Quando gerar ou alterar um campo, preserve a lógica no metadado e evite mover regra de negócio para o renderer.

---

## Camada 2 — Renderer (`DynamicForm`)

O renderer recebe `dataFields` e faz `map()` sobre o array.  
A decisão de qual componente exibir acontece com base em `field.type`.

### Responsabilidade do renderer

- renderizar campos;
- respeitar `condition`;
- propagar as props recebidas;
- manter a camada visual simples e sem regra de negócio.

### Exemplo de estrutura

```jsx
const DynamicForm = ({ dataFields }) => {
  const renderFormField = (field) => {
    const shouldDisplayField = true; // aplicar a lógica de condition

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
                <MenuItem key={opt.value} value={opt.value}>
                  {opt.label}
                </MenuItem>
              ))}
            </Select>
          </Grid>
        );

      default:
        return null;
    }
  };

  return (
    <Grid container spacing={2}>
      {dataFields?.map((field, index) => (
        <React.Fragment key={field.name + index}>
          {renderFormField(field)}
        </React.Fragment>
      ))}
    </Grid>
  );
};
```

### Regra para agentes

Nunca faça o renderer conhecer API, Formik, React Hook Form, validação de domínio ou regras de negócio específicas.

---

## Camada 3 — Orquestrador

O orquestrador é o ponto onde vivem:

- criação do gerenciador de estado;
- montagem do array de metadados;
- efeitos colaterais de página;
- tratamento de snackbar;
- scroll para o primeiro erro;
- submissão do formulário.

### Responsabilidades

- instanciar `useFormik`, `useForm` ou `useState`;
- adaptar a interface do gerenciador para o metadado;
- passar o gerenciador para `inputsMetadado`;
- entregar os campos para `DynamicForm`;
- tratar validação final e submit.

### Exemplo

```jsx
const PessoaForm = ({ closeModal, inputValue }) => {
  const [stateSnack, setStateSnack] = useState({ open: false, message: '' });
  const errors = {};

  const formik = useFormik({
    ...metaPessoaFormik(closeModal, setStateSnack, stateSnack),
    validate: (values) => {
      inputsMetadado(formik).forEach((field) => {
        const value = getNestedFormikValue(values, field.name);
        const error = validateField(field.name, value, inputsMetadado(formik));
        if (error) errors[field.name] = error;
      });
      return errors;
    },
  });

  const arrayFormData = inputsMetadado(formik, setStateSnack);

  return (
    <form onSubmit={formik.handleSubmit}>
      <DynamicForm dataFields={arrayFormData} />
    </form>
  );
};
```

---

## Estrutura de um campo

Cada campo é um objeto plano.

| Propriedade | Tipo | Finalidade |
|---|---|---|
| `type` | `string` | Define qual componente será renderizado |
| `name` | `string` | Caminho do valor no estado em dot-notation |
| `label` | `string` | Rótulo exibido ao usuário |
| `value` | `any` | Valor atual do campo |
| `onChange` | `function` | Atualiza o estado |
| `onBlur` | `function` | Marca blur e/ou dispara lógica associada |
| `validate` | `function` | Regra local de validação |
| `error` | `boolean` | Estado visual de erro |
| `helperText` | `string` | Texto auxiliar / mensagem de erro |
| `condition` | `boolean` | Controla exibição condicional |
| `xs/sm/md/lg` | `number` | Layout responsivo no Grid |
| `disabled` | `boolean` | Desabilita o campo |
| `inputProps` | `object` | Atributos nativos do input |

---

### Regra para agentes

Ao adicionar um novo tipo:

1. defina o campo no metadado;
2. adicione o `case` correspondente no renderer;
3. não altere as demais camadas, salvo necessidade real.

---

## Regras de exibição condicional

A arquitetura suporta duas regras independentes de visibilidade:

### `condition`

Expressão booleana avaliada no runtime.

```js
{
  type: 'inputTextOrNumber',
  name: 'pessoa.pessoaFisica.passaPorte',
  condition: formik.values.pessoa?.nacionalidade?.nome !== 'BRASIL',
}
```

### Combinação das duas regras

Quando ambas existem, as duas devem ser verdadeiras para o campo aparecer.

### Regra para agentes

Se um campo estiver oculto, sua validação deve ser ignorada.

---

## Validação por campo

Cada campo pode conter sua própria função `validate`.

### Exemplo

```js
{
  name: 'pessoa.razaoNome',
  validate: (value) => {
    if (!value) return 'Campo obrigatório';
    if (value.length < 3) return 'Nome muito curto';
    return '';
  },
}
```

### Estratégia de validação

O orquestrador percorre os campos e coleta os erros.

```js
const formik = useFormik({
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

### Utilitários esperados

```js
export const validateField = (name, value, validations) => {
  const validation = validations.find((val) => val.name === name);
  return validation?.condition !== false ? validation.validate?.(value) : '';
};

export const getNestedFormikValue = (obj, path) => {
  const keys = path?.split('.');
  return keys?.reduce((acc, key) => acc && acc[key], obj) || null;
};
```

---

## Requisições desacopladas do componente

A arquitetura permite que chamadas assíncronas fiquem no metadado.

### Requisição no `inputRef`

Útil para buscar dados assim que o campo aparece.

```js
{
  type: 'inputTextOrNumber',
  name: 'pessoa.codigo',
  inputRef: (input) => {
    if (input && !input.requestMade) {
      input.requestMade = true;
      get('/api/getCodigoSequencial').then((res) => {
        input.value = res;
        formManager.setFieldValue('pessoa.codigo', res);
      });
    }
  },
}
```

### Requisição no `onBlur`

Útil para validações assíncronas.

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

### Requisição em botão de ação

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

### Regra para agentes

Se a ação depende do contexto do campo, ela deve ficar no metadado, não no renderer.

---

## Independência do gerenciador de estado

O modelo não depende exclusivamente de Formik.  
O importante é expor uma interface compatível:

- `values`
- `setFieldValue`
- `handleBlur`
- `touched`
- `errors`

### Exemplo com React Hook Form

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

### Exemplo com `useState`

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

### Regra para agentes

Qualquer gerenciador de estado é aceitável desde que preserve a interface mínima esperada pelo metadado.

---

## Seções visuais

O tipo `section` representa separadores visuais, e não inputs.

### Uso

```js
{
  type: 'section',
  name: 'Dados Pessoais',
  className: 'section-title',
  sectionMargin: 2,
}
```

### Regra para agentes

Se a seção agrupa campos ocultos, ela também deve respeitar a visibilidade condicional quando necessário.

---

## Scroll para o primeiro erro

Após submit inválido, o orquestrador pode localizar o primeiro erro e rolar até ele.

```js
const scrollToError = () => {
  const keys = Object.keys(errors);
  if (!keys.length) return;
  const inputDOM = document.querySelector(`[name='${keys[0]}']`);
  inputDOM?.focus();
  inputDOM?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
};
```

---

## Como adicionar um novo tipo de campo

### Passo 1 — Definir no metadado

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

### Passo 2 — Adicionar no renderer

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

### Regra para agentes

Nenhuma outra camada deve ser alterada sem necessidade real.

---

## Exemplo mínimo de formulário de contato

```js
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
    xs: 12,
    sm: 6,
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
    xs: 12,
    sm: 6,
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
    xs: 12,
    sm: 4,
  },
];
```

---

## Checklist operacional para agentes

Antes de alterar esta arquitetura, verifique:

- o campo pertence ao metadado?
- a regra pertence ao renderer?
- o efeito colateral pertence ao orquestrador?
- a validação deve ser ignorada quando o campo estiver oculto?
- o novo tipo exige somente um novo `case`?
- a mudança pode ser feita sem acoplar UI ao domínio?

---

## Padrão recomendado de decisão

- **Campo / regra / fetch / validação local** → metadado
- **Mapeamento visual** → renderer
- **Estado / submit / efeitos laterais** → orquestrador

---

## Resumo para IA

Esta Skill ensina a construir formulários dinâmicos em React com foco em:

- configuração por dados;
- baixa dependência entre camadas;
- validação colocalizada;
- renderização genérica;
- extensibilidade controlada;
- compatibilidade com diferentes gerenciadores de estado.

Ao operar sobre este padrão, preserve a separação entre **descrição do campo**, **exibição do campo** e **coordenação do fluxo**.
