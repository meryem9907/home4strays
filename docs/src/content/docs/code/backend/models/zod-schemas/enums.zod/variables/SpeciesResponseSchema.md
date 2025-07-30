---
editUrl: false
next: false
prev: false
title: "SpeciesResponseSchema"
---

> `const` **SpeciesResponseSchema**: `ZodArray`\<`ZodString`, `"many"`\>

Defined in: home4strays-backend/src/models/zod-schemas/enums.zod.ts:8

Schema representing a list of species names, ensuring at least one valid species is provided.
This schema is used to validate arrays of species identifiers in API responses.
The minimum length requirement ensures the response contains at least one species entry.
