---
skill_id: dynamic-form-prompt-reviewarchitecture
name: Dynamic Form — Review Architecture Prompt
version: 1.0
type: prompt-skill
extends: dynamic-form-agent
requires: [Knowledge.md, Agent.md]
priority: high
language: pt-BR
domain: frontend-engineering
tags: [react, prompt, code-review, architecture-review, dynamic-form]
---

# ReviewArchitecture.md — Revisar Aderência Arquitetural

## 1. Missão
Guiar o agente na revisão de um Pull Request ou trecho de código, identificando violações da arquitetura sem reescrever o código por conta própria, salvo solicitação explícita.

## 2. Dependências
- `Knowledge.md`
- `Agent.md`

## 3. Objetivo
Produzir uma revisão objetiva, camada por camada, apontando violações concretas e sugerindo a correção mínima necessária.

## 4. Processo
1. Identificar, no código sob revisão, qual trecho pertence a cada camada (Metadado, Renderer, Orquestrador).
2. Para o Renderer: verificar se há `if`/lógica de negócio, `fetch` direto, ou dependência de uma lib de estado específica (`Components/Renderer.md`).
3. Para o Metadado: verificar se `validate` está local e declarativo, se `condition`/`paisHomologado` seguem o padrão, se `name` é coerente (`Components/Metadata.md`, `Extensions/Validation.md`, `Extensions/Conditions.md`).
4. Para o Orquestrador: verificar se a validação delega corretamente para `field.validate`, se efeitos de página estão isolados, se (quando aplicável) a validação por etapa está corretamente escopada (`Components/Orchestrator.md`, `Extensions/Steps.md`).
5. Verificar requisições: toda chamada HTTP deve seguir um dos quatro padrões de `Extensions/Async.md`.
6. Verificar performance básica: debounce em buscas livres, proteção contra disparo duplicado em `inputRef` (`Extensions/Performance.md`).
7. Verificar acessibilidade básica: `label`, `error`/`helperText` conectados, foco programático em erro (`Extensions/Accessibility.md`).
8. Consolidar os achados em uma lista de violações, cada uma com: camada afetada, regra violada, sugestão de correção.

## 5. Regras Obrigatórias
- A revisão deve ser objetiva e referenciar a regra específica violada (citando a Skill correspondente), não uma opinião genérica de estilo.
- Toda violação apontada deve vir acompanhada de uma sugestão de correção mínima — não exigir reescrita total quando uma correção pontual resolve.

## 6. Anti-Padrões
- Apontar "melhorias" de estilo pessoal que não são, de fato, violações de regra arquitetural documentada.
- Misturar feedback de performance/acessibilidade com violações estruturais sem separar as categorias.

## 7. Never Do
- Nunca aprovar um código com `fetch` direto no Renderer, mesmo que o restante esteja correto.
- Nunca ignorar validação duplicada entre Metadado e Orquestrador.
- Nunca silenciar uma violação de "campo oculto sendo validado" — esse é um bug funcional, não apenas estético.

## 8. Quando NÃO Utilizar Esta Skill
- Para efetivamente corrigir as violações encontradas → `Prompts/RefactorForm.md`.

## 9. Output Contract
A revisão deve produzir uma lista clara de violações (camada, regra, sugestão), sem reescrever o código a menos que solicitado.

## 10. Checklist Final
- [ ] Cada violação aponta a camada correta?
- [ ] Cada violação referencia a regra/Skill correspondente?
- [ ] Há sugestão de correção mínima para cada item?
- [ ] Itens de performance/acessibilidade estão separados de violações estruturais?
