# Skill Complementar: Formulários com Steps (Wizard)

> Extende a Skill Dynamic Form Architecture.

## Missão
Adicionar suporte a formulários multi-etapas (Wizard) preservando integralmente a arquitetura base.

## Princípios

- O Renderer (`DynamicForm`) NÃO conhece Steps.
- Toda navegação pertence ao Orquestrador.
- O metadado passa a ser um array de etapas.
- Apenas os campos da etapa ativa chegam ao Renderer.

## Modelo Mental

stepFormMetadados
→ currentStep
→ currentStep.fields
→ DynamicForm
→ UI

## Estrutura do Metadado

```js
[
  {
    step: 1,
    title: "Dados pessoais",
    fields: [
      { type: "inputTextOrNumber", name: "nome" }
    ]
  }
]
```

## Responsabilidades

### Metadado
- Organizar campos em etapas.
- Definir títulos.

### Renderer
- Apenas renderizar `currentStep.fields`.

### Orquestrador
- activeStep
- Stepper
- handleNext
- handleBack
- submit
- validação escopada

## Regras

1. Nunca alterar o DynamicForm para suportar Steps.
2. Sempre filtrar `currentStep.fields` antes do Renderer.
3. Validar apenas a etapa ativa.
4. Submit real apenas na última etapa.
5. handleBack nunca valida.
6. Stepper apenas representa estado.

## Navegação

Continuar:
submit → validate → sem erros → activeStep++

Voltar:
activeStep--

Finalizar:
submit → validate → onSubmit

## Validação

Sempre validar apenas:

```js
currentStep.fields.forEach(...)
```

Nunca validar todas as etapas.

## Atualizações em Cascata

Quando um campo altera vários outros:

Preferir:

```js
formik.setValues(...)
```

## Campos Derivados

Valores auxiliares (ex.: idade) podem existir apenas para alimentar `condition`, sem componente visual.

## Debounce

Botões de navegação devem utilizar debounce para evitar múltiplos submits.

## Anti-padrões

- Stepper dentro do Renderer
- activeStep no DynamicForm
- Validar todas as etapas
- Submit antes da última etapa
- Lógica de navegação no metadado

## Checklist

- DynamicForm permanece inalterado.
- Apenas currentStep.fields chega ao Renderer.
- Apenas etapa ativa valida.
- Submit apenas na última etapa.
- handleBack não valida.
- Debounce preservado.

## Resposta Esperada do Agente

Quando solicitado um Wizard:

1. Usar `stepFormMetadados()`.
2. Organizar `{ step, title, fields }`.
3. Criar `activeStep`.
4. Filtrar `currentStep.fields`.
5. Não alterar `DynamicForm`.
6. Validar apenas a etapa ativa.
7. Finalizar apenas na última etapa.
