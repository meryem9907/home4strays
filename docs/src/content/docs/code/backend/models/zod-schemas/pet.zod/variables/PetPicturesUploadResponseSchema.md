---
editUrl: false
next: false
prev: false
title: "PetPicturesUploadResponseSchema"
---

> `const` **PetPicturesUploadResponseSchema**: `ZodObject`\<\{ `message`: `ZodString`; `pictureLinks`: `ZodArray`\<`ZodString`, `"many"`\>; \}, `"strip"`, `ZodTypeAny`, \{ `message`: `string`; `pictureLinks`: `string`[]; \}, \{ `message`: `string`; `pictureLinks`: `string`[]; \}\>

Defined in: home4strays-backend/src/models/zod-schemas/pet.zod.ts:194

Response schema for pet picture upload operations.
This schema defines the structure of the response when uploading a pet picture.
It includes a message and an array of picture links.
