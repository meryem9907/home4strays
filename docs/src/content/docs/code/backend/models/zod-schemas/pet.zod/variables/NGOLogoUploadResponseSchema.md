---
editUrl: false
next: false
prev: false
title: "NGOLogoUploadResponseSchema"
---

> `const` **NGOLogoUploadResponseSchema**: `ZodObject`\<\{ `logoPictureLink`: `ZodString`; `message`: `ZodString`; \}, `"strip"`, `ZodTypeAny`, \{ `logoPictureLink`: `string`; `message`: `string`; \}, \{ `logoPictureLink`: `string`; `message`: `string`; \}\>

Defined in: home4strays-backend/src/models/zod-schemas/pet.zod.ts:250

Response schema for NGO logo upload operations.
This schema defines the structure of the response when uploading an NGO logo.
It includes a message and the URL of the uploaded logo.
