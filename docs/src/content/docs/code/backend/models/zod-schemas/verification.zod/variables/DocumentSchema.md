---
editUrl: false
next: false
prev: false
title: "DocumentSchema"
---

> `const` **DocumentSchema**: `ZodObject`\<\{ `destination`: `ZodString`; `encoding`: `ZodString`; `fieldname`: `ZodString`; `filename`: `ZodString`; `mimetype`: `ZodEffects`\<`ZodString`, `string`, `string`\>; `originalname`: `ZodString`; `path`: `ZodString`; `size`: `ZodNumber`; \}, `"strip"`, `ZodTypeAny`, \{ `destination`: `string`; `encoding`: `string`; `fieldname`: `string`; `filename`: `string`; `mimetype`: `string`; `originalname`: `string`; `path`: `string`; `size`: `number`; \}, \{ `destination`: `string`; `encoding`: `string`; `fieldname`: `string`; `filename`: `string`; `mimetype`: `string`; `originalname`: `string`; `path`: `string`; `size`: `number`; \}\>

Defined in: home4strays-backend/src/models/zod-schemas/verification.zod.ts:45

Schema defining the structure of an uploaded document file.
This schema validates the properties of a file upload for NGO documents,
ensuring it meets the required format and type constraints.
