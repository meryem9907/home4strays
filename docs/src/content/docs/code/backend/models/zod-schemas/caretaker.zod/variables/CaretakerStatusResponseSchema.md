---
editUrl: false
next: false
prev: false
title: "CaretakerStatusResponseSchema"
---

> `const` **CaretakerStatusResponseSchema**: `ZodObject`\<\{ `hasCaretakerProfile`: `ZodBoolean`; `isCaretakerUser`: `ZodBoolean`; `needsCaretakerProfile`: `ZodBoolean`; \}, `"strip"`, `ZodTypeAny`, \{ `hasCaretakerProfile`: `boolean`; `isCaretakerUser`: `boolean`; `needsCaretakerProfile`: `boolean`; \}, \{ `hasCaretakerProfile`: `boolean`; `isCaretakerUser`: `boolean`; `needsCaretakerProfile`: `boolean`; \}\>

Defined in: home4strays-backend/src/models/zod-schemas/caretaker.zod.ts:175

Represents a schema for a caretaker status response object.
This schema defines the structure of a response that indicates the user's caretaker status
and related profile information. Each field serves a specific purpose:
- `isCaretakerUser`: Indicates whether the user has been authenticated as a caretaker.
- `needsCaretakerProfile`: Indicates whether a caretaker profile is required for the user.
- `hasCaretakerProfile`: Indicates whether the user has an existing caretaker profile.
