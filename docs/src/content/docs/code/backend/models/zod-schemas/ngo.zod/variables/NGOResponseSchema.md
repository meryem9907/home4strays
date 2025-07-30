---
editUrl: false
next: false
prev: false
title: "NGOResponseSchema"
---

> `const` **NGOResponseSchema**: `ZodArray`\<`ZodObject`\<\{ `country`: `ZodString`; `email`: `ZodNullable`\<`ZodOptional`\<`ZodString`\>\>; `memberCount`: `ZodNullable`\<`ZodOptional`\<`ZodNumber`\>\>; `mission`: `ZodNullable`\<`ZodOptional`\<`ZodString`\>\>; `name`: `ZodString`; `ngoHours`: `ZodOptional`\<`ZodArray`\<`ZodObject`\<\{ `endTime`: `ZodString`; `startTime`: `ZodString`; `weekday`: `ZodString`; \}, `"strip"`, `ZodTypeAny`, \{ `endTime`: `string`; `startTime`: `string`; `weekday`: `string`; \}, \{ `endTime`: `string`; `startTime`: `string`; `weekday`: `string`; \}\>, `"many"`\>\>; `phoneNumber`: `ZodNullable`\<`ZodOptional`\<`ZodString`\>\>; `website`: `ZodNullable`\<`ZodOptional`\<`ZodArray`\<`ZodOptional`\<`ZodString`\>, `"many"`\>\>\>; \}, `"strip"`, `ZodTypeAny`, \{ `country`: `string`; `email?`: `null` \| `string`; `memberCount?`: `null` \| `number`; `mission?`: `null` \| `string`; `name`: `string`; `ngoHours?`: `object`[]; `phoneNumber?`: `null` \| `string`; `website?`: `null` \| (`undefined` \| `string`)[]; \}, \{ `country`: `string`; `email?`: `null` \| `string`; `memberCount?`: `null` \| `number`; `mission?`: `null` \| `string`; `name`: `string`; `ngoHours?`: `object`[]; `phoneNumber?`: `null` \| `string`; `website?`: `null` \| (`undefined` \| `string`)[]; \}\>, `"many"`\>

Defined in: home4strays-backend/src/models/zod-schemas/ngo.zod.ts:147

Represents the data structure for an array of NGO responses.
This schema defines the format for returning multiple NGO records in a single response.
