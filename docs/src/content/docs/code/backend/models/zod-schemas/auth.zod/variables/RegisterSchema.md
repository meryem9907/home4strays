---
editUrl: false
next: false
prev: false
title: "RegisterSchema"
---

> `const` **RegisterSchema**: `ZodObject`\<\{ `email`: `ZodString`; `firstName`: `ZodOptional`\<`ZodString`\>; `isAdmin`: `ZodDefault`\<`ZodBoolean`\>; `isNgoUser`: `ZodDefault`\<`ZodBoolean`\>; `lastName`: `ZodOptional`\<`ZodString`\>; `password`: `ZodString`; \}, `"strip"`, `ZodTypeAny`, \{ `email`: `string`; `firstName?`: `string`; `isAdmin`: `boolean`; `isNgoUser`: `boolean`; `lastName?`: `string`; `password`: `string`; \}, \{ `email`: `string`; `firstName?`: `string`; `isAdmin?`: `boolean`; `isNgoUser?`: `boolean`; `lastName?`: `string`; `password`: `string`; \}\>

Defined in: home4strays-backend/src/models/zod-schemas/auth.zod.ts:7

Schema defining the structure and validation rules for a user registration request.
This schema ensures that all required fields are present and meet specific criteria.
