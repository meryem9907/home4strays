---
editUrl: false
next: false
prev: false
title: "PublicUserQueryResultSchema"
---

> `const` **PublicUserQueryResultSchema**: `ZodArray`\<`ZodObject`\<`Omit`\<\{ `email`: `ZodOptional`\<`ZodString`\>; `firstName`: `ZodOptional`\<`ZodString`\>; `id`: `ZodOptional`\<`ZodString`\>; `isAdmin`: `ZodDefault`\<`ZodBoolean`\>; `isNgoUser`: `ZodDefault`\<`ZodBoolean`\>; `lastName`: `ZodOptional`\<`ZodString`\>; `password`: `ZodOptional`\<`ZodString`\>; `phoneNumber`: `ZodNullable`\<`ZodOptional`\<`ZodString`\>\>; `profilePictureLink`: `ZodNullable`\<`ZodOptional`\<`ZodString`\>\>; `profilePicturePath`: `ZodNullable`\<`ZodOptional`\<`ZodString`\>\>; \}, `"password"`\>, `"strip"`, `ZodTypeAny`, \{ `email?`: `string`; `firstName?`: `string`; `id?`: `string`; `isAdmin`: `boolean`; `isNgoUser`: `boolean`; `lastName?`: `string`; `phoneNumber?`: `null` \| `string`; `profilePictureLink?`: `null` \| `string`; `profilePicturePath?`: `null` \| `string`; \}, \{ `email?`: `string`; `firstName?`: `string`; `id?`: `string`; `isAdmin?`: `boolean`; `isNgoUser?`: `boolean`; `lastName?`: `string`; `phoneNumber?`: `null` \| `string`; `profilePictureLink?`: `null` \| `string`; `profilePicturePath?`: `null` \| `string`; \}\>, `"many"`\>

Defined in: home4strays-backend/src/models/zod-schemas/user.zod.ts:107

Schema for querying multiple public user records.
This schema defines the structure of a response containing an array of public user data.
