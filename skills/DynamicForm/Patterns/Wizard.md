---
skill_id: dynamic-form-pattern-wizard
name: Dynamic Form — Wizard Pattern
version: 1.0
type: pattern-skill
extends: dynamic-form-knowledge
requires: [Extensions/Steps.md]
priority: medium
language: pt-BR
domain: frontend-engineering
tags: [react, wizard, pattern, dynamic-form]
---

# Wizard.md — Padrão Multi-Etapas

## 1. Missão
Apresentar o padrão completo de wizard como solução reutilizável, combinando `Extensions/Steps.md` com decisões de UX comuns (Stepper, debounce, scroll to error).

## 2. Dependências
- `Extensions/Steps.md`

## 3. Objetivo
Servir de referência rápida para "quando e como" aplicar um wizard, sem repetir o detalhamento técnico já presente em `Extensions/Steps.md`.

## 4. Modelo Mental
Use um Wizard quando o formulário tem **grupos de campos logicamente independentes** que se beneficiam de revisão isolada (ex: Dados Pessoais → Endereço → Observações), e quando a quantidade total de campos tornaria uma tela única sobrecarregada.

## 5. Responsabilidades
**Pertence a este padrão:** decisão de quando usar wizard, composição entre Stepper visual e estado `activeStep`, estratégia de validação por etapa, submit condicional.
**Não pertence:** implementação detalhada de `validate` por campo (`Extensions/Validation.md`).

## 6. Estrutura de Referência
```js
[
  { step: 1, title: 'Dados Pessoais', fields: [...] },
  { step: 2, title: 'Endereço', fields: [...] },
  { step: 3, title: 'Observações', fields: [...] },
]
```

## 7. Regras Obrigatórias
- Cada etapa deve ser navegável de forma independente, sem exigir que campos de etapas futuras estejam preenchidos.
- O título de cada etapa (`title`) deve ser curto e descritivo o suficiente para aparecer no `Stepper` sem quebra de layout.
- A última etapa deve sempre ser a única que dispara o `onSubmit` real.

## 8. Processo de Decisão
1. O formulário tem mais de ~8 campos visíveis simultaneamente? → considerar wizard.
2. Os campos têm agrupamento temático claro? → uma etapa por grupo.
3. Existe dependência forte entre grupos (ex: etapa 2 depende de decisão da etapa 1)? → ainda assim, mantenha a validação escopada por etapa; resolva a dependência via leitura do estado global dentro do `condition`/`validate` da etapa dependente.

## 9. Anti-Padrões
- Wizard com uma única etapa (não há ganho sobre o formulário plano).
- Etapas com 1 campo cada (granularidade excessiva, prejudica a experiência).

## 10. Never Do
- Nunca permitir submit real fora da última etapa.
- Nunca bloquear o avanço por erro em campo de outra etapa.

## 11. Quando NÃO Utilizar Esta Skill
- Formulário pequeno e coeso (≤ 8 campos) → mantenha plano, sem wizard.

## 12. Output Contract
A decisão de usar wizard deve ser justificada por volume/agrupamento de campos, não aplicada por padrão.

## 13. Checklist Final
- [ ] Há justificativa real (volume ou agrupamento temático) para o wizard?
- [ ] A validação está escopada por etapa?
- [ ] O submit real só ocorre na última etapa?
