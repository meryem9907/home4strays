---
editUrl: false
next: false
prev: false
title: "GetInvitesResponseSchema"
---

> `const` **GetInvitesResponseSchema**: `ZodArray`\<`ZodObject`\<\{ `email`: `ZodString`; `ngoId`: `ZodString`; `userId`: `ZodString`; \}, `"strip"`, `ZodTypeAny`, \{ `email`: `string`; `ngoId`: `string`; `userId`: `string`; \}, \{ `email`: `string`; `ngoId`: `string`; `userId`: `string`; \}\>, `"many"`\>

Defined in: home4strays-backend/src/models/zod-schemas/invite.ts:7

Schema defining the structure of a GET /invites response.
This schema enforces strict validation for the array of invite records.
Each invite object contains a user ID, NGO ID, and email address.
