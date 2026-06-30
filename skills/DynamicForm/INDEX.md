# DynamicForm — Skills Library

Biblioteca modular de conhecimento arquitetural sobre a **Dynamic Form Architecture**, organizada para ser carregada parcialmente por agentes de IA conforme a tarefa em execução.

## Estrutura

```
.skills/DynamicForm/
├── Knowledge.md          # Fonte de verdade da arquitetura — carregar sempre primeiro
├── Agent.md               # Manual operacional do agente — carregar sempre em seguida
│
├── Components/            # As três camadas da arquitetura, em detalhe
│   ├── Renderer.md
│   ├── Metadata.md
│   ├── Orchestrator.md
│   └── FieldTypes.md
│
├── Extensions/             # Capacidades adicionais, uma por arquivo
│   ├── Steps.md
│   ├── Validation.md
│   ├── Async.md
│   ├── Conditions.md
│   ├── StateManagers.md
│   ├── Performance.md
│   └── Accessibility.md
│
├── Patterns/                # Soluções reutilizáveis, combinando extensões
│   ├── Wizard.md
│   ├── CascadingFields.md
│   ├── DerivedValues.md
│   ├── ConditionalRendering.md
│   └── RemoteAutocomplete.md
│
├── Examples/                 # Implementações de referência, prontas para copiar
│   ├── ContactForm.md
│   ├── CompanyForm.md
│   ├── WizardExample.md
│   └── AddressLookup.md
│
└── Prompts/                   # Fluxos operacionais especializados
    ├── CreateForm.md
    ├── AddField.md
    ├── RefactorForm.md
    ├── MigrateFormikToRHF.md
    └── ReviewArchitecture.md
```

## Ordem de Carregamento

```
Knowledge.md
    ↓
Agent.md
    ↓
Extensões necessárias para a tarefa
    ↓
Componentes necessários para a tarefa
    ↓
Padrões necessários para a tarefa
    ↓
Exemplos (quando útil como referência copiável)
```

`Knowledge.md` e `Agent.md` são as únicas Skills sem dependência prévia — todas as demais declaram, em seu frontmatter (`requires`), quais Skills devem estar carregadas antes.

## Mapa de Dependências por Skill

| Skill | Requer |
|---|---|
| `Knowledge.md` | — |
| `Agent.md` | `Knowledge.md` |
| `Components/Renderer.md` | `Knowledge.md` |
| `Components/Metadata.md` | `Knowledge.md` |
| `Components/Orchestrator.md` | `Knowledge.md` |
| `Components/FieldTypes.md` | `Knowledge.md`, `Components/Renderer.md` |
| `Extensions/Steps.md` | `Knowledge.md`, `Components/Orchestrator.md` |
| `Extensions/Validation.md` | `Knowledge.md`, `Components/Metadata.md` |
| `Extensions/Async.md` | `Knowledge.md`, `Components/Metadata.md` |
| `Extensions/Conditions.md` | `Knowledge.md`, `Components/Metadata.md`, `Components/Renderer.md` |
| `Extensions/StateManagers.md` | `Knowledge.md`, `Components/Orchestrator.md` |
| `Extensions/Performance.md` | `Knowledge.md`, `Components/Renderer.md` |
| `Extensions/Accessibility.md` | `Knowledge.md`, `Components/Renderer.md` |
| `Patterns/Wizard.md` | `Extensions/Steps.md` |
| `Patterns/CascadingFields.md` | `Extensions/Async.md`, `Extensions/Conditions.md` |
| `Patterns/DerivedValues.md` | `Extensions/Conditions.md` |
| `Patterns/ConditionalRendering.md` | `Extensions/Conditions.md` |
| `Patterns/RemoteAutocomplete.md` | `Extensions/Async.md` |
| `Examples/ContactForm.md` | `Knowledge.md` |
| `Examples/CompanyForm.md` | `Knowledge.md`, `Patterns/ConditionalRendering.md` |
| `Examples/WizardExample.md` | `Patterns/Wizard.md` |
| `Examples/AddressLookup.md` | `Patterns/RemoteAutocomplete.md`, `Patterns/CascadingFields.md` |
| `Prompts/CreateForm.md` | `Knowledge.md`, `Agent.md` |
| `Prompts/AddField.md` | `Knowledge.md`, `Agent.md`, `Components/Metadata.md` |
| `Prompts/RefactorForm.md` | `Knowledge.md`, `Agent.md` |
| `Prompts/MigrateFormikToRHF.md` | `Knowledge.md`, `Agent.md`, `Extensions/StateManagers.md` |
| `Prompts/ReviewArchitecture.md` | `Knowledge.md`, `Agent.md` |

## Princípio de Uso

Cada Skill possui responsabilidade única. Nenhuma Skill complementar substitui ou duplica o conteúdo de `Knowledge.md` — cada documento acrescenta apenas um novo conjunto de capacidades, mantendo uma única fonte de verdade por conceito arquitetural.

Ao carregar Skills para uma tarefa, carregue apenas as estritamente necessárias (`Knowledge.md` + `Agent.md` + as listadas na coluna "Requer" da Skill de interesse) — isso é o que torna esta biblioteca eficiente em termos de contexto.
