---
editUrl: false
next: false
prev: false
title: "UserSuccessResponseSchema"
---

> `const` **UserSuccessResponseSchema**: `ZodObject`\<`Omit`\<\{ `email`: `ZodOptional`\<`ZodString`\>; `firstName`: `ZodOptional`\<`ZodString`\>; `id`: `ZodOptional`\<`ZodString`\>; `isAdmin`: `ZodDefault`\<`ZodBoolean`\>; `isNgoUser`: `ZodDefault`\<`ZodBoolean`\>; `lastName`: `ZodOptional`\<`ZodString`\>; `password`: `ZodOptional`\<`ZodString`\>; `phoneNumber`: `ZodNullable`\<`ZodOptional`\<`ZodString`\>\>; `profilePictureLink`: `ZodNullable`\<`ZodOptional`\<`ZodString`\>\>; `profilePicturePath`: `ZodNullable`\<`ZodOptional`\<`ZodString`\>\>; \}, `"password"`\>, `"strip"`, `ZodTypeAny`, \{ `email?`: `string`; `firstName?`: `string`; `id?`: `string`; `isAdmin`: `boolean`; `isNgoUser`: `boolean`; `lastName?`: `string`; `phoneNumber?`: `null` \| `string`; `profilePictureLink?`: `null` \| `string`; `profilePicturePath?`: `null` \| `string`; \}, \{ `email?`: `string`; `firstName?`: `string`; `id?`: `string`; `isAdmin?`: `boolean`; `isNgoUser?`: `boolean`; `lastName?`: `string`; `phoneNumber?`: `null` \| `string`; `profilePictureLink?`: `null` \| `string`; `profilePicturePath?`: `null` \| `string`; \}\> = `PublicUserSchema`

Defined in: home4strays-backend/src/models/zod-schemas/user.zod.ts:131

Schema for representing a successful user operation response.
This schema is used when returning user data without sensitive information.
