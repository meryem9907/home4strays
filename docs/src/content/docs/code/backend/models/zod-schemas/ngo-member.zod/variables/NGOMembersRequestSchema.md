---
editUrl: false
next: false
prev: false
title: "NGOMembersRequestSchema"
---

> `const` **NGOMembersRequestSchema**: `ZodObject`\<\{ `ngoId`: `ZodString`; \}, `"strip"`, `ZodTypeAny`, \{ `ngoId`: `string`; \}, \{ `ngoId`: `string`; \}\>

Defined in: home4strays-backend/src/models/zod-schemas/ngo-member.zod.ts:117

Schema defining the structure of a request to retrieve members associated with an NGO.
This schema includes the NGO ID used to filter members, typically for GET operations.
