---
editUrl: false
next: false
prev: false
title: "NGOMemberResponseSchema"
---

> `const` **NGOMemberResponseSchema**: `ZodObject`\<\{ `isAdmin`: `ZodDefault`\<`ZodBoolean`\>; `ngoId`: `ZodOptional`\<`ZodString`\>; `userId`: `ZodString`; \}, `"strip"`, `ZodTypeAny`, \{ `isAdmin`: `boolean`; `ngoId?`: `string`; `userId`: `string`; \}, \{ `isAdmin?`: `boolean`; `ngoId?`: `string`; `userId`: `string`; \}\> = `NGOMemberSchema`

Defined in: home4strays-backend/src/models/zod-schemas/ngo-member.zod.ts:95

Schema representing a standard NGO member response
This schema is used for API responses containing NGO member data
