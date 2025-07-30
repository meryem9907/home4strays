---
editUrl: false
next: false
prev: false
title: "NGOHoursSchema"
---

> `const` **NGOHoursSchema**: `ZodObject`\<\{ `endTime`: `ZodString`; `startTime`: `ZodString`; `weekday`: `ZodString`; \}, `"strip"`, `ZodTypeAny`, \{ `endTime`: `string`; `startTime`: `string`; `weekday`: `string`; \}, \{ `endTime`: `string`; `startTime`: `string`; `weekday`: `string`; \}\>

Defined in: home4strays-backend/src/models/zod-schemas/ngo.zod.ts:7

Represents the operating hours of an NGO for a specific weekday.
This schema defines the time range and day of the week when the NGO is operational.
