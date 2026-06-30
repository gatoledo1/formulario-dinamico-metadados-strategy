---
skill_id: dynamic-form-prompt-createform
name: Dynamic Form — Create Form Prompt
version: 1.0
type: prompt-skill
extends: dynamic-form-agent
requires: [Knowledge.md, Agent.md]
priority: medium
language: pt-BR
domain: frontend-engineering
tags: [react, prompt, create-form, dynamic-form]
---

# CreateForm.md — Criar um Formulário Novo

## 1. Missão
Guiar o agente na criação de um formulário completo e aderente à arquitetura, a partir de uma descrição em linguagem natural.

## 2. Dependências
- `Knowledge.md`
- `Agent.md`

## 3. Objetivo
Padronizar a sequência de passos para que qualquer formulário novo nasça já seguindo a arquitetura, sem retrabalho.

## 4. Modelo Mental / Processo
1. Levantar os campos necessários junto ao usuário (nome, tipo de dado, obrigatoriedade, dependências entre campos).
2. Decidir se o formulário precisa de Wizard (`Patterns/Wizard.md`) com base no volume/agrupamento de campos.
3. Escrever o array de metadado (`Components/Metadata.md`), um campo por vez, escolhendo o `type` mais específico (`Components/FieldTypes.md`).
4. Adicionar `validate` em cada campo que exigir (`Extensions/Validation.md`).
5. Adicionar `condition`/`paisHomologado` onde a exibição for condicional (`Extensions/Conditions.md`).
6. Escrever o Orquestrador, conectando o gerenciador de estado escolhido ao metadado (`Components/Orchestrator.md`).
7. Validar mentalmente o checklist de `Agent.md` antes de entregar.

## 5. Regras Obrigatórias
- Nunca pular a etapa de levantamento de campos — não assumir estrutura de dados sem confirmação quando ambígua.
- Sempre verificar `Components/FieldTypes.md` antes de propor um `type` novo.
- Sempre aplicar o checklist final de `Agent.md` antes de considerar a tarefa concluída.

## 6. Anti-Padrões
- Escrever campos diretamente em JSX "para ganhar tempo" e prometer migrar para metadado depois.
- Criar um `type` novo sem verificar se um existente já resolve o caso.

## 7. Never Do
- Nunca entregar um formulário sem ao menos uma validação de campo obrigatório quando o usuário sinalizar campos obrigatórios.
- Nunca ignorar a possibilidade de Wizard quando o volume de campos é alto (> 8 campos visíveis simultaneamente).

## 8. Quando NÃO Utilizar Esta Skill
- Para adicionar um único campo a um formulário já existente → `Prompts/AddField.md`.

## 9. Output Contract
O formulário entregue deve respeitar as três camadas, usar tipos do catálogo existente sempre que possível, e incluir validações para os campos sinalizados como obrigatórios.

## 10. Checklist Final
- [ ] Os campos foram levantados e confirmados com o usuário?
- [ ] A decisão de usar ou não Wizard foi justificada?
- [ ] Todo campo obrigatório tem `validate`?
- [ ] O checklist de `Agent.md` foi aplicado?
