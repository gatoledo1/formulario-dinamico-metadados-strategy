---
skill_id: dynamic-form-orchestrator
name: Dynamic Form — Orchestrator Component
version: 1.0
type: component-skill
extends: dynamic-form-knowledge
requires: [Knowledge.md]
priority: high
language: pt-BR
domain: frontend-engineering
tags: [react, strategy-pattern, orchestrator, lifecycle, dynamic-form]
---

# Orchestrator.md — Componente de Página

## 1. Missão
Documentar o papel do Orquestrador: o único componente que conhece o gerenciador de estado, o metadado e o Renderer simultaneamente.

## 2. Dependências
- `Knowledge.md`

## 3. Objetivo
Centralizar, em um único documento, tudo que diz respeito a ciclo de vida, efeitos de página e integração entre as outras duas camadas.

## 4. Modelo Mental
```
formManager (estado)
     ↓
inputsMetadado(formManager)  →  array de campos já conectados
     ↓
<DynamicForm dataFields={array} />
```

O Orquestrador é o ponto de composição. Ele não sabe renderizar campos e não sabe validar regras específicas — ele apenas conecta as peças.

## 5. Responsabilidades

**Pertence ao Orquestrador:**
- Instanciar o gerenciador de estado (`useFormik`, `useForm`, `useState`, etc.).
- Chamar a função de metadado passando o gerenciador.
- Implementar a função `validate` que itera o metadado e coleta erros.
- Efeitos de página: carregar dados iniciais, popular `setFieldValue` via `useEffect`, exibir snackbar, gerenciar tabs.
- Scroll/foco no primeiro campo com erro após submit.

**Não pertence ao Orquestrador:**
- Decidir como cada campo é desenhado (isso é do Renderer).
- Definir a validação interna de um campo específico (isso é do Metadado).

## 6. Exemplo de Referência

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

## 7. Regras Obrigatórias
- O Orquestrador é o único lugar autorizado a importar o gerenciador de estado (Formik, RHF, etc.).
- A função `validate` deve sempre delegar a regra real para `field.validate` — nunca reimplementar validação ali.
- Efeitos de página (`useEffect`) vivem aqui, nunca no Metadado nem no Renderer.

## 8. Processo de Decisão
Ao receber um pedido de "adicionar um efeito ao carregar o formulário" (ex: popular um campo com dado da API):
1. Verificar se o efeito é de **carregamento inicial de um campo específico** → prefira `inputRef` no Metadado (`Extensions/Async.md`).
2. Verificar se o efeito é de **página como um todo** (ex: carregar configuração do sistema) → implemente no Orquestrador via `useEffect`.

## 9. Anti-Padrões
```jsx
// Proibido — Orquestrador reimplementando validação de campo
validate: (values) => {
  if (!values.pessoa.nome) errors['pessoa.nome'] = 'Obrigatório'; // duplica o que já está em field.validate
}
```

## 10. Never Do
- Nunca duplicar uma validação que já existe no campo.
- Nunca passar lógica de exibição condicional para o Orquestrador — isso é do Metadado.
- Nunca importar componentes MUI de input diretamente no Orquestrador para "ganhar tempo" — sempre passe pelo Renderer.

## 11. Quando NÃO Utilizar Esta Skill
- Para entender como o array de campos é montado → `Components/Metadata.md`.
- Para entender wizard/multi-etapas → `Extensions/Steps.md`.

## 12. Output Contract
Toda alteração no Orquestrador deve preservar a delegação total da validação e da renderização para Metadado e Renderer, respectivamente.

## 13. Checklist Final
- [ ] O Orquestrador delega validação para `field.validate`?
- [ ] Os efeitos de página estão isolados em `useEffect` no Orquestrador, não no Metadado?
- [ ] Nenhum componente visual é importado diretamente fora do Renderer?
