---
editUrl: false
next: false
prev: false
title: "NGOMemberHoursSchema"
---

> `const` **NGOMemberHoursSchema**: `ZodObject`\<\{ `endTime`: `ZodString`; `startTime`: `ZodString`; `weekday`: `ZodString`; \}, `"strip"`, `ZodTypeAny`, \{ `endTime`: `string`; `startTime`: `string`; `weekday`: `string`; \}, \{ `endTime`: `string`; `startTime`: `string`; `weekday`: `string`; \}\>

Defined in: home4strays-backend/src/models/zod-schemas/ngo-member.zod.ts:23

Schema defining the structure of NGO member hours with time and weekday information.
This schema represents the working hours of an NGO member, including start and end times
and the specific weekday these hours apply to.
