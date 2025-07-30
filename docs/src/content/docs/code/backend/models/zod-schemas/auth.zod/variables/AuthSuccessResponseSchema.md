---
editUrl: false
next: false
prev: false
title: "AuthSuccessResponseSchema"
---

> `const` **AuthSuccessResponseSchema**: `ZodObject`\<\{ `id`: `ZodString`; `token`: `ZodString`; \}, `"strip"`, `ZodTypeAny`, \{ `id`: `string`; `token`: `string`; \}, \{ `id`: `string`; `token`: `string`; \}\>

Defined in: home4strays-backend/src/models/zod-schemas/auth.zod.ts:78

Schema defining the structure of a successful authentication response.
This schema ensures that the response contains valid identifiers and tokens.
