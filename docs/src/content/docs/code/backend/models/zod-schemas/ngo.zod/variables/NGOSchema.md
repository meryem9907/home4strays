---
editUrl: false
next: false
prev: false
title: "NGOSchema"
---

> `const` **NGOSchema**: `ZodObject`\<\{ `country`: `ZodString`; `email`: `ZodNullable`\<`ZodOptional`\<`ZodString`\>\>; `memberCount`: `ZodNullable`\<`ZodOptional`\<`ZodNumber`\>\>; `mission`: `ZodNullable`\<`ZodOptional`\<`ZodString`\>\>; `name`: `ZodString`; `ngoHours`: `ZodOptional`\<`ZodArray`\<`ZodObject`\<\{ `endTime`: `ZodString`; `startTime`: `ZodString`; `weekday`: `ZodString`; \}, `"strip"`, `ZodTypeAny`, \{ `endTime`: `string`; `startTime`: `string`; `weekday`: `string`; \}, \{ `endTime`: `string`; `startTime`: `string`; `weekday`: `string`; \}\>, `"many"`\>\>; `phoneNumber`: `ZodNullable`\<`ZodOptional`\<`ZodString`\>\>; `website`: `ZodNullable`\<`ZodOptional`\<`ZodArray`\<`ZodOptional`\<`ZodString`\>, `"many"`\>\>\>; \}, `"strip"`, `ZodTypeAny`, \{ `country`: `string`; `email?`: `null` \| `string`; `memberCount?`: `null` \| `number`; `mission?`: `null` \| `string`; `name`: `string`; `ngoHours?`: `object`[]; `phoneNumber?`: `null` \| `string`; `website?`: `null` \| (`undefined` \| `string`)[]; \}, \{ `country`: `string`; `email?`: `null` \| `string`; `memberCount?`: `null` \| `number`; `mission?`: `null` \| `string`; `name`: `string`; `ngoHours?`: `object`[]; `phoneNumber?`: `null` \| `string`; `website?`: `null` \| (`undefined` \| `string`)[]; \}\>

Defined in: home4strays-backend/src/models/zod-schemas/ngo.zod.ts:31

Represents the comprehensive data structure for an NGO entity.
This schema defines all the attributes and validation rules for an NGO's detailed information.
