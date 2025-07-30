---
editUrl: false
next: false
prev: false
title: "MessageResponseSchema"
---

> `const` **MessageResponseSchema**: `ZodObject`\<\{ `message`: `ZodString`; \}, `"strip"`, `ZodTypeAny`, \{ `message`: `string`; \}, \{ `message`: `string`; \}\>

Defined in: home4strays-backend/src/models/zod-schemas/pet.zod.ts:269

Generic message response schema used for simple operations.
This schema defines the structure of responses that only require a message field.
It is commonly used for operations that do not return specific data.
