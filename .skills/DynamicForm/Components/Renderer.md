---
skill_id: dynamic-form-renderer
name: Dynamic Form — Renderer Component
version: 1.0
type: component-skill
extends: dynamic-form-knowledge
requires: [Knowledge.md]
priority: high
language: pt-BR
domain: frontend-engineering
tags: [react, factory-pattern, renderer, dynamic-form]
---

# Renderer.md — DynamicForm

## 1. Missão
Documentar exclusivamente o componente `DynamicForm`: como ele itera o metadado, decide o que renderizar e onde estão seus limites.

## 2. Dependências
- `Knowledge.md`

## 3. Objetivo
Garantir que qualquer agente que precise tocar no Renderer entenda seu contrato sem precisar reler toda a arquitetura.

## 4. Modelo Mental
O Renderer é uma **Factory**: recebe `dataFields` (array de objetos) e, para cada item, decide — via `field.type` — qual componente visual instanciar.

```jsx
const DynamicForm = ({ dataFields }) => {
  const renderFormField = (field) => {
    const shouldDisplayField = /* avalia condition + paisHomologado */ true;

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
            />
          </Grid>
        );
      case 'select':
        return shouldDisplayField && (/* ... */);
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

## 5. Responsabilidades

**Pertence ao Renderer:**
- `.map()` sobre `dataFields`.
- `switch/case` por `field.type`.
- Avaliação de `condition` / `paisHomologado` para decidir exibir ou não.
- Repasse de props (`value`, `onChange`, `error`, `xs/sm/md/lg`, etc.) ao componente MUI correspondente.

**Não pertence ao Renderer:**
- Qualquer `if` de regra de negócio.
- Chamadas HTTP.
- Conhecimento sobre Formik, RHF ou qualquer gerenciador de estado.
- Definição de valores iniciais ou validações (isso vem pronto no campo).

## 6. Regras Obrigatórias
- Cada `type` novo exige exatamente um novo `case`. Nada além disso.
- O Renderer nunca lê `formik.values` diretamente — ele só lê `field.value`, que já foi resolvido pelo Metadado.
- A decisão de exibir/ocultar (`shouldDisplayField`) é a única lógica condicional permitida dentro do Renderer, e ela opera sobre propriedades do próprio campo (`condition`, `paisHomologado`), nunca sobre regras de domínio.

## 7. Processo de Decisão
Ao receber um pedido de "adicionar um novo tipo de campo":
1. Confirmar que o campo não pode ser composto a partir de um `type` já existente.
2. Adicionar o `case` no `switch`.
3. Garantir que o novo `case` só lê propriedades do objeto `field` — nunca importa serviços externos.

## 8. Anti-Padrões
```jsx
// Proibido — regra de negócio dentro do Renderer
case 'inputTextOrNumber':
  if (cliente.tipo === 'VIP') { /* ... */ }

// Proibido — fetch dentro do Renderer
case 'autocomplete':
  useEffect(() => { fetch('/api/opcoes') }, []);
```

## 9. Never Do
- Nunca importar `useFormik` ou qualquer hook de gerenciador de estado dentro do Renderer.
- Nunca fazer fetch dentro do Renderer.
- Nunca tomar decisão de exibição que não venha de `field.condition` ou `field.paisHomologado`.

## 10. Quando NÃO Utilizar Esta Skill
- Para entender como o metadado é montado → `Components/Metadata.md`.
- Para entender o ciclo de vida da página/formulário → `Components/Orchestrator.md`.

## 11. Output Contract
Qualquer alteração no Renderer deve manter:
- compatibilidade com qualquer gerenciador de estado;
- ausência total de regra de negócio;
- extensibilidade via `type` + `case`, sem refatoração estrutural.

## 12. Checklist Final
- [ ] O novo `case` lê apenas propriedades de `field`?
- [ ] Nenhum `fetch`/`axios` foi introduzido no Renderer?
- [ ] A exibição condicional usa apenas `condition`/`paisHomologado`?
- [ ] O Renderer continua agnóstico ao gerenciador de estado?
