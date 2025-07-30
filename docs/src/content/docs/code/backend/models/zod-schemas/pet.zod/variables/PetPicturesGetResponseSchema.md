---
editUrl: false
next: false
prev: false
title: "PetPicturesGetResponseSchema"
---

> `const` **PetPicturesGetResponseSchema**: `ZodObject`\<\{ `pictureLinks`: `ZodArray`\<`ZodString`, `"many"`\>; \}, `"strip"`, `ZodTypeAny`, \{ `pictureLinks`: `string`[]; \}, \{ `pictureLinks`: `string`[]; \}\>

Defined in: home4strays-backend/src/models/zod-schemas/pet.zod.ts:222

Response schema for retrieving multiple pet pictures.
This schema defines the structure of the response when fetching multiple pet pictures.
It includes an array of picture URLs.
