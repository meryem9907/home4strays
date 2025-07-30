---
editUrl: false
next: false
prev: false
title: "NGOMemberPOSTRequestSchema"
---

> `const` **NGOMemberPOSTRequestSchema**: `ZodObject`\<\{ `firstName`: `ZodOptional`\<`ZodString`\>; `hours`: `ZodArray`\<`ZodObject`\<\{ `endTime`: `ZodString`; `startTime`: `ZodString`; `weekday`: `ZodString`; \}, `"strip"`, `ZodTypeAny`, \{ `endTime`: `string`; `startTime`: `string`; `weekday`: `string`; \}, \{ `endTime`: `string`; `startTime`: `string`; `weekday`: `string`; \}\>, `"many"`\>; `lastName`: `ZodOptional`\<`ZodString`\>; `phoneNumber`: `ZodNullable`\<`ZodOptional`\<`ZodString`\>\>; \}, `"strip"`, `ZodTypeAny`, \{ `firstName?`: `string`; `hours`: `object`[]; `lastName?`: `string`; `phoneNumber?`: `null` \| `string`; \}, \{ `firstName?`: `string`; `hours`: `object`[]; `lastName?`: `string`; `phoneNumber?`: `null` \| `string`; \}\>

Defined in: home4strays-backend/src/models/zod-schemas/ngo-member.zod.ts:123

Schema defining the structure of a request to create an NGO member with their hours.
This schema includes an array of NGOMemberHoursSchema objects representing the member's working hours.
