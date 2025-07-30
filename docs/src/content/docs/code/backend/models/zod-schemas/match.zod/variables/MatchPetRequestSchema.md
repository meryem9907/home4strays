---
editUrl: false
next: false
prev: false
title: "MatchPetRequestSchema"
---

> `const` **MatchPetRequestSchema**: `ZodObject`\<\{ `petId`: `ZodString`; \}, `"strip"`, `ZodTypeAny`, \{ `petId`: `string`; \}, \{ `petId`: `string`; \}\>

Defined in: home4strays-backend/src/models/zod-schemas/match.zod.ts:13

Schema defining the structure of a request to match a pet.
This schema is used to validate the input when initiating a pet matching request.
It requires a valid UUID for the pet ID to ensure proper identification.
