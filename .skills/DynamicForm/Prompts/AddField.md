---
skill_id: dynamic-form-prompt-addfield
name: Dynamic Form — Add Field Prompt
version: 1.0
type: prompt-skill
extends: dynamic-form-agent
requires: [Knowledge.md, Agent.md, Components/Metadata.md]
priority: medium
language: pt-BR
domain: frontend-engineering
tags: [react, prompt, add-field, dynamic-form]
---

# AddField.md — Adicionar um Campo a um Formulário Existente

## 1. Missão
Guiar o agente na adição de um campo novo a um metadado já existente, sem alterar o Renderer nem o Orquestrador, salvo necessidade real.

## 2. Dependências
- `Knowledge.md`
- `Agent.md`
- `Components/Metadata.md`

## 3. Objetivo
Garantir que "adicionar um campo" permaneça, na prática, "adicionar um objeto ao array" — a operação mais barata da arquitetura.

## 4. Processo
1. Confirmar o `type` necessário (`Components/FieldTypes.md`); se nenhum existente serve, seguir `Components/Renderer.md` seção 7 antes de prosseguir.
2. Definir `name` em dot-notation coerente com a estrutura de estado já usada no restante do formulário.
3. Conectar `value`/`onChange` ao gerenciador de estado já em uso (não introduzir um segundo gerenciador).
4. Avaliar se o campo precisa de `validate`, `condition`, `paisHomologado` ou alguma integração (`Extensions/Async.md`).
5. Inserir o objeto no array existente, na posição lógica (próximo de campos relacionados).
6. Confirmar que nenhuma alteração foi necessária no Renderer (a menos que o `type` seja novo) nem no Orquestrador (a menos que o campo precise de um efeito de página específico).

## 5. Regras Obrigatórias
- Se o `type` já existe, a única camada tocada deve ser o Metadado.
- O novo campo deve seguir exatamente o contrato do seu `type` (`Components/FieldTypes.md`).

## 6. Anti-Padrões
- Adicionar um campo e, "de brinde", refatorar partes não relacionadas do Renderer ou do Orquestrador.
- Adicionar um campo com `name` que não segue o padrão dot-notation do restante do formulário.

## 7. Never Do
- Nunca alterar o Renderer para adicionar um campo de um `type` já existente.
- Nunca esquecer de adicionar `validate` quando o usuário sinalizar que o campo é obrigatório.

## 8. Quando NÃO Utilizar Esta Skill
- Para criar um formulário do zero → `Prompts/CreateForm.md`.
- Para criar um `type` inteiramente novo → `Components/Renderer.md`.

## 9. Output Contract
A adição do campo não deve exigir alteração estrutural fora do Metadado, salvo quando o `type` for genuinamente novo.

## 10. Checklist Final
- [ ] O campo segue o contrato do `type` escolhido?
- [ ] `name` está coerente com o restante do formulário?
- [ ] Nenhuma alteração desnecessária foi feita no Renderer/Orquestrador?
