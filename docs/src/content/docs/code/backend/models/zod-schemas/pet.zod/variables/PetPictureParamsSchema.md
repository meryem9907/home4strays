---
editUrl: false
next: false
prev: false
title: "PetPictureParamsSchema"
---

> `const` **PetPictureParamsSchema**: `ZodObject`\<\{ `petId`: `ZodString`; `pictureLink`: `ZodString`; \}, `"strip"`, `ZodTypeAny`, \{ `petId`: `string`; `pictureLink`: `string`; \}, \{ `petId`: `string`; `pictureLink`: `string`; \}\>

Defined in: home4strays-backend/src/models/zod-schemas/pet.zod.ts:172

Schema for pet picture parameters used in routes requiring both pet and picture identification.
This schema is used to validate and document the parameters for pet picture operations.
