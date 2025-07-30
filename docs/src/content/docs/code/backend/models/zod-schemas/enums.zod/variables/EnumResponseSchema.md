---
editUrl: false
next: false
prev: false
title: "EnumResponseSchema"
---

> `const` **EnumResponseSchema**: `ZodArray`\<`ZodString`, `"many"`\>

Defined in: home4strays-backend/src/models/zod-schemas/enums.zod.ts:22

Schema representing a list of enum values, ensuring at least one valid enum entry is provided.
This schema is used to validate arrays of enum identifiers in API responses.
The minimum length requirement ensures the response contains at least one enum value.
