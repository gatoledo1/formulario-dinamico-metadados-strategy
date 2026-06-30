---
skill_id: dynamic-form-prompt-refactorform
name: Dynamic Form — Refactor Form Prompt
version: 1.0
type: prompt-skill
extends: dynamic-form-agent
requires: [Knowledge.md, Agent.md]
priority: medium
language: pt-BR
domain: frontend-engineering
tags: [react, prompt, refactor, dynamic-form]
---

# RefactorForm.md — Refatorar um Formulário Existente

## 1. Missão
Guiar o agente na refatoração de um formulário que viola a arquitetura (campos hardcoded em JSX, validação espalhada, fetch no Renderer, etc.) de volta para o padrão.

## 2. Dependências
- `Knowledge.md`
- `Agent.md`

## 3. Objetivo
Migrar um formulário "fora do padrão" para a arquitetura de metadado sem quebrar comportamento existente.

## 4. Processo
1. Mapear cada campo atualmente em JSX e listar: tipo visual, regras de validação atuais, regras de exibição condicional atuais, integrações HTTP envolvidas.
2. Para cada campo mapeado, criar a entrada equivalente no array de metadado (`Components/Metadata.md`), usando o `type` mais próximo do catálogo (`Components/FieldTypes.md`).
3. Mover toda validação encontrada espalhada pelo componente para o `validate` do campo correspondente (`Extensions/Validation.md`).
4. Mover toda `condition`/exibição condicional encontrada em JSX (`{condicao && <Campo />}`) para a propriedade `condition` do metadado (`Extensions/Conditions.md`).
5. Mover toda chamada HTTP encontrada dentro do componente visual para o padrão apropriado (`inputRef`, `onBlur`, `iconActionBtn`, `fetchFunction` — `Extensions/Async.md`).
6. Substituir o JSX antigo pelo `<DynamicForm dataFields={...} />`.
7. Revalidar comportamento: cada campo deve continuar validando e exibindo exatamente como antes.

## 5. Regras Obrigatórias
- A refatoração não deve alterar o comportamento observável pelo usuário, apenas a estrutura interna.
- Toda regra de negócio encontrada no Renderer/JSX deve ser identificada e relocada — nunca apenas "envolvida" em uma função e deixada no mesmo lugar.

## 6. Anti-Padrões
- Refatorar parcialmente, deixando alguns campos em JSX direto e outros já migrados para metadado no mesmo formulário, sem um plano de conclusão.

## 7. Never Do
- Nunca remover uma validação existente durante a refatoração sem confirmar com o usuário que ela não é mais necessária.
- Nunca introduzir um novo `type` durante a refatoração sem necessidade — preferir mapear para um `type` já existente.

## 8. Quando NÃO Utilizar Esta Skill
- Para revisar (sem alterar) a aderência arquitetural → `Prompts/ReviewArchitecture.md`.

## 9. Output Contract
Ao final, o formulário deve estar 100% descrito via metadado, sem nenhum campo hardcoded em JSX, validação espalhada ou fetch dentro do componente visual.

## 10. Checklist Final
- [ ] Todos os campos foram mapeados para o metadado?
- [ ] Toda validação está em `validate` local?
- [ ] Toda exibição condicional está em `condition`/`paisHomologado`?
- [ ] Nenhuma chamada HTTP permanece no componente visual?
- [ ] O comportamento observável permanece idêntico ao anterior?
