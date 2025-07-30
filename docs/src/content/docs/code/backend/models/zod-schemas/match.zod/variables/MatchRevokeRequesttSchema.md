---
editUrl: false
next: false
prev: false
title: "MatchRevokeRequesttSchema"
---

> `const` **MatchRevokeRequesttSchema**: `ZodObject`\<\{ `petId`: `ZodString`; \}, `"strip"`, `ZodTypeAny`, \{ `petId`: `string`; \}, \{ `petId`: `string`; \}\>

Defined in: home4strays-backend/src/models/zod-schemas/match.zod.ts:21

Schema defining the structure of a request to revoke a pet match.
This schema is used to validate the input when revoking a previously matched pet.
It requires a valid UUID for the pet ID to ensure proper identification.
Note: The schema name contains a typo ("RequesttSchema") which should be corrected to "RequestSchema".
