---
editUrl: false
next: false
prev: false
title: "BreedResponseSchema"
---

> `const` **BreedResponseSchema**: `ZodArray`\<`ZodString`, `"many"`\>

Defined in: home4strays-backend/src/models/zod-schemas/enums.zod.ts:15

Schema representing a list of breed names, ensuring at least one valid breed is provided.
This schema is used to validate arrays of breed identifiers in API responses.
The minimum length requirement ensures the response contains at least one breed entry.
