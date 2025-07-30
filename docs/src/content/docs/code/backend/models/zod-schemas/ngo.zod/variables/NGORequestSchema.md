---
editUrl: false
next: false
prev: false
title: "NGORequestSchema"
---

> `const` **NGORequestSchema**: `ZodObject`\<\{ `country`: `ZodString`; `email`: `ZodOptional`\<`ZodString`\>; `memberCount`: `ZodOptional`\<`ZodString`\>; `mission`: `ZodOptional`\<`ZodString`\>; `name`: `ZodString`; `phoneNumber`: `ZodOptional`\<`ZodString`\>; `website`: `ZodOptional`\<`ZodArray`\<`ZodOptional`\<`ZodString`\>, `"many"`\>\>; \}, `"strip"`, `ZodTypeAny`, \{ `country`: `string`; `email?`: `string`; `memberCount?`: `string`; `mission?`: `string`; `name`: `string`; `phoneNumber?`: `string`; `website?`: (`undefined` \| `string`)[]; \}, \{ `country`: `string`; `email?`: `string`; `memberCount?`: `string`; `mission?`: `string`; `name`: `string`; `phoneNumber?`: `string`; `website?`: (`undefined` \| `string`)[]; \}\>

Defined in: home4strays-backend/src/models/zod-schemas/ngo.zod.ts:95

Represents the data structure for an NGO request payload.
This schema defines the attributes and validation rules for creating or updating an NGO.
