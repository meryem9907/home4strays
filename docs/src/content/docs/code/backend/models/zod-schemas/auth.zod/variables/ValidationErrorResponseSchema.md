---
editUrl: false
next: false
prev: false
title: "ValidationErrorResponseSchema"
---

> `const` **ValidationErrorResponseSchema**: `ZodObject`\<\{ `errors`: `ZodRecord`\<`ZodString`, `ZodUnknown`\>; `status`: `ZodLiteral`\<`"Validation failed"`\>; \}, `"strip"`, `ZodTypeAny`, \{ `errors`: `Record`\<`string`, `unknown`\>; `status`: `"Validation failed"`; \}, \{ `errors`: `Record`\<`string`, `unknown`\>; `status`: `"Validation failed"`; \}\>

Defined in: home4strays-backend/src/models/zod-schemas/auth.zod.ts:95

Schema defining the structure of a validation error response.
This schema ensures that error responses follow a consistent format.
