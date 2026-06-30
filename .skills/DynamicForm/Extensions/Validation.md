---
skill_id: dynamic-form-ext-validation
name: Dynamic Form — Validation Extension
version: 1.0
type: extension-skill
extends: dynamic-form-knowledge
requires: [Knowledge.md, Components/Metadata.md]
priority: high
language: pt-BR
domain: frontend-engineering
tags: [react, validation, forms, dynamic-form]
---

# Validation.md — Estratégias de Validação

## 1. Missão
Detalhar exclusivamente como validações são escritas, orquestradas e como evitar validações inconsistentes ou duplicadas.

## 2. Dependências
- `Knowledge.md`
- `Components/Metadata.md`

## 3. Objetivo
Garantir que toda validação nova siga o padrão local-declarativo já estabelecido, sem introduzir schemas paralelos.

## 4. Modelo Mental
```
field.validate(value) → string (mensagem de erro) | '' (sem erro)
```
A validação é uma função pura, executada pelo orquestrador via `validateField`, nunca pelo Renderer.

## 5. Responsabilidades

**Pertence a esta extensão:**
- Sintaxe de `validate`.
- `validateField` e `getNestedFormikValue`.
- Validações condicionais (campo só é obrigatório se outro campo tiver determinado valor).
- Validações compostas (mais de uma regra no mesmo campo).
- Validações assíncronas (ex: checar duplicidade via API).

**Não pertence a esta extensão:**
- Exibição condicional do campo em si (`condition`) → `Extensions/Conditions.md`.

## 6. Sintaxe Base
```js
validate: (value) => {
  if (!value) return 'Campo obrigatório';
  return '';
}
```

## 7. Orquestração
```js
export const validateField = (name, value, validations) => {
  const validation = validations.find((val) => val.name === name);
  return validation?.condition !== false ? validation.validate?.(value) : '';
};
```
Campos com `condition === false` são automaticamente isentos de validação — não é necessário tratar isso dentro de cada `validate`.

## 8. Validações Compostas
```js
validate: (value) => {
  if (!value) return 'Campo obrigatório';
  if (value.length < 3) return 'Nome muito curto';
  if (!/^[a-zA-ZÀ-ÿ\s]+$/.test(value)) return 'Caracteres inválidos';
  return '';
}
```

## 9. Validações Condicionais (entre campos)
```js
{
  name: 'certidaoNascimento',
  condition: formik.values?.idade < 18,
  validate: (value) => (formik.values?.idade < 18 && !value ? 'Obrigatório para menores' : ''),
}
```
Repare que a regra de obrigatoriedade reflete a mesma condição de exibição — evita exigir um campo que está oculto.

## 10. Validações Assíncronas
A arquitetura síncrona de `validate` não suporta `Promise` diretamente. O padrão recomendado é usar `onBlur` para disparar a checagem e gravar o resultado em um campo auxiliar do estado, que então é lido por um `validate` síncrono:
```js
onBlur: async (e) => {
  const exists = await post(`/api/isCpfJaExistente?documento=${e.target.value}`);
  formik.setFieldValue('cpfDuplicado', exists);
},
validate: (value) => (formik.values?.cpfDuplicado ? 'CPF já cadastrado' : ''),
```

## 11. Regras Obrigatórias
- `validate` nunca deve depender de `field.name` dentro de um validador genérico compartilhado — cada campo tem seu próprio `validate`.
- Mensagens de erro devem ser strings simples (ou chaves de i18n), nunca objetos complexos.
- Validação assíncrona nunca deve bloquear a digitação do usuário — sempre via `onBlur`, nunca via `onChange` síncrono.

## 12. Anti-Padrões
```js
// Proibido — validador genérico com if por nome de campo
const validateGenerico = (field, value) => {
  if (field.name === 'cpf') return validaCPF(value) ? '' : 'CPF inválido';
  if (field.name === 'email') return validaEmail(value) ? '' : 'Email inválido';
};
```

## 13. Never Do
- Nunca criar um arquivo de "schema de validação" centralizado e desacoplado dos campos.
- Nunca tornar `validate` assíncrono diretamente (`async (value) => ...`) — o ciclo de validação do gerenciador de estado não espera Promises corretamente nesta arquitetura.
- Nunca duplicar a mesma regra de validação em dois campos diferentes sem extrair uma função utilitária compartilhada e pura.

## 14. Quando NÃO Utilizar Esta Skill
- Para regras de exibição (não de validação) → `Extensions/Conditions.md`.
- Para requisições em geral → `Extensions/Async.md`.

## 15. Output Contract
Toda validação nova deve ser local ao campo, síncrona em sua assinatura (`(value) => string`) e não deve introduzir um schema paralelo de validação.

## 16. Checklist Final
- [ ] `validate` está co-localizado no próprio campo?
- [ ] Validações assíncronas usam o padrão `onBlur` + campo auxiliar?
- [ ] Nenhum `if(field.name === ...)` foi introduzido em validador genérico?
- [ ] Mensagens de erro são strings simples?
