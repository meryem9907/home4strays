---
editUrl: false
next: false
prev: false
title: "VerificationRequestResponseSchema"
---

> `const` **VerificationRequestResponseSchema**: `ZodObject`\<\{ `logoPictureLink`: `ZodOptional`\<`ZodString`\>; `ngoId`: `ZodString`; `status`: `ZodString`; `verificationDocumentLink`: `ZodString`; \}, `"strip"`, `ZodTypeAny`, \{ `logoPictureLink?`: `string`; `ngoId`: `string`; `status`: `string`; `verificationDocumentLink`: `string`; \}, \{ `logoPictureLink?`: `string`; `ngoId`: `string`; `status`: `string`; `verificationDocumentLink`: `string`; \}\>

Defined in: home4strays-backend/src/models/zod-schemas/verification.zod.ts:66

Schema for the response when an NGO verification request is processed.
This schema defines the structure of the response containing the NGO ID,
verification document link, optional logo picture link, and verification status.
