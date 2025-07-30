---
editUrl: false
next: false
prev: false
title: "NGOMemberRequestSchema"
---

> `const` **NGOMemberRequestSchema**: `ZodObject`\<\{ `isAdmin`: `ZodDefault`\<`ZodBoolean`\>; `ngoId`: `ZodOptional`\<`ZodString`\>; `userId`: `ZodString`; \}, `"strip"`, `ZodTypeAny`, \{ `isAdmin`: `boolean`; `ngoId?`: `string`; `userId`: `string`; \}, \{ `isAdmin?`: `boolean`; `ngoId?`: `string`; `userId`: `string`; \}\> = `NGOMemberSchema`

Defined in: home4strays-backend/src/models/zod-schemas/ngo-member.zod.ts:102

Schema defining the structure of a request for an NGO member.
This schema is identical to the NGOMemberSchema and is used when receiving
member data from the client (e.g., for creation or update operations).
