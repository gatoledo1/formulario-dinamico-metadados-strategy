---
skill_id: dynamic-form-pattern-conditionalrendering
name: Dynamic Form — Conditional Rendering Pattern
version: 1.0
type: pattern-skill
extends: dynamic-form-knowledge
requires: [Extensions/Conditions.md]
priority: medium
language: pt-BR
domain: frontend-engineering
tags: [react, conditional-rendering, ux-pattern, dynamic-form]
---

# ConditionalRendering.md — Estratégias de Esconder/Mostrar/Habilitar/Desabilitar

## 1. Missão
Apresentar, como decisão de UX, quando usar cada uma das quatro estratégias de exibição condicional disponíveis na arquitetura.

## 2. Dependências
- `Extensions/Conditions.md`

## 3. Objetivo
Evitar o uso indiscriminado de `condition: false` quando `disabled: true` seria mais adequado para a experiência do usuário, e vice-versa.

## 4. Modelo Mental
| Estratégia | Quando usar |
|---|---|
| **Esconder** (`condition: false`) | O campo é completamente irrelevante no contexto atual (ex: "passaporte" quando a nacionalidade é Brasil) |
| **Mostrar** (`condition: true` / `undefined`) | Caso padrão |
| **Habilitar** (`disabled: false`) | O campo é relevante e o usuário deve preenchê-lo agora |
| **Desabilitar** (`disabled: true`) | O campo é relevante para o contexto, mas só pode ser preenchido após outra ação (ex: "inscrição estadual" desabilitada até o regime tributário ser "CONTRIBUINTE") |

## 5. Exemplo — Esconder
```js
{ name: 'passaPorte', condition: formik.values.nacionalidade?.nome !== 'BRASIL' }
```

## 6. Exemplo — Desabilitar (mantendo visível)
```js
{
  name: 'pessoa.pessoaFisica.inscricaoEstadual',
  condition: formik.values.pessoa?.pessoaFisica?.regimeTributarioIcms === 'CONTRIBUINTE',
  disabled: formik.values.pessoa?.pessoaFisica?.regimeTributarioIcms !== 'CONTRIBUINTE',
}
```
Aqui o campo aparece desabilitado quando o regime não é "CONTRIBUINTE" — uma escolha de UX que sinaliza ao usuário que o campo existe, mas depende de outra seleção.

## 7. Regras Obrigatórias
- Usar `condition: false` quando o campo não faz sentido algum no contexto (evita ruído visual).
- Usar `disabled: true` quando o campo faz sentido mas depende de um pré-requisito ainda não satisfeito (evita "campo que desaparece e reaparece" de forma confusa).
- Nunca combinar `condition: false` com `disabled` simultaneamente de forma redundante — se o campo está oculto, `disabled` é irrelevante.

## 8. Processo de Decisão
1. O campo é irrelevante no contexto atual (não voltará a ser preenchido tão cedo)? → `condition: false`.
2. O campo é relevante, mas depende de uma escolha anterior do próprio usuário na mesma tela? → manter visível, usar `disabled`.
3. Há ambiguidade entre as duas opções? → prefira manter visível e desabilitado quando a ausência repentina do campo puder confundir o usuário sobre "onde foi aquele campo".

## 9. Anti-Padrões
```js
// Redundante — condition false já remove o campo, disabled não tem efeito
{ condition: false, disabled: true }
```

## 10. Never Do
- Nunca esconder um campo que o usuário already started preenchendo sem aviso — prefira desabilitar e explicar via `helperText`.
- Nunca usar apenas estilo visual (CSS) para simular `disabled`/`condition` — sempre usar as props reais, que também afetam validação e foco.

## 11. Quando NÃO Utilizar Esta Skill
- Para a implementação técnica de `condition`/`paisHomologado` → `Extensions/Conditions.md`.

## 12. Output Contract
A escolha entre esconder e desabilitar deve ser justificada pela relevância do campo no contexto, não aplicada de forma arbitrária.

## 13. Checklist Final
- [ ] A escolha entre `condition` e `disabled` foi deliberada, não arbitrária?
- [ ] Não há combinação redundante de `condition: false` com `disabled`?
- [ ] Campos parcialmente preenchidos não são escondidos abruptamente?
