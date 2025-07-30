---
editUrl: false
next: false
prev: false
title: "NGORegisterSchema"
---

> `const` **NGORegisterSchema**: `ZodObject`\<\{ `country`: `ZodString`; `email`: `ZodOptional`\<`ZodString`\>; `memberCount`: `ZodOptional`\<`ZodString`\>; `mission`: `ZodOptional`\<`ZodString`\>; `name`: `ZodString`; `phoneNumber`: `ZodOptional`\<`ZodString`\>; `website`: `ZodOptional`\<`ZodArray`\<`ZodOptional`\<`ZodString`\>, `"many"`\>\>; \}, `"strip"`, `ZodTypeAny`, \{ `country`: `string`; `email?`: `string`; `memberCount?`: `string`; `mission?`: `string`; `name`: `string`; `phoneNumber?`: `string`; `website?`: (`undefined` \| `string`)[]; \}, \{ `country`: `string`; `email?`: `string`; `memberCount?`: `string`; `mission?`: `string`; `name`: `string`; `phoneNumber?`: `string`; `website?`: (`undefined` \| `string`)[]; \}\> = `NGORequestSchema`

Defined in: home4strays-backend/src/models/zod-schemas/verification.zod.ts:20

Schema for registering a new NGO.
This schema is an alias for NGORequestSchema and represents the structure
required for NGO registration requests.
