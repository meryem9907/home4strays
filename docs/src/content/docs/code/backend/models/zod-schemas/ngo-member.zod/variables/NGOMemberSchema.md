---
editUrl: false
next: false
prev: false
title: "NGOMemberSchema"
---

> `const` **NGOMemberSchema**: `ZodObject`\<\{ `isAdmin`: `ZodDefault`\<`ZodBoolean`\>; `ngoId`: `ZodOptional`\<`ZodString`\>; `userId`: `ZodString`; \}, `"strip"`, `ZodTypeAny`, \{ `isAdmin`: `boolean`; `ngoId?`: `string`; `userId`: `string`; \}, \{ `isAdmin?`: `boolean`; `ngoId?`: `string`; `userId`: `string`; \}\>

Defined in: home4strays-backend/src/models/zod-schemas/ngo-member.zod.ts:8

Schema defining the structure of an NGO member with core attributes.
This schema represents a member's association with an NGO, including their user ID,
NGO ID, and administrative privileges.
