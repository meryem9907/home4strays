---
editUrl: false
next: false
prev: false
title: "UserQueryResultSchema"
---

> `const` **UserQueryResultSchema**: `ZodArray`\<`ZodObject`\<\{ `email`: `ZodOptional`\<`ZodString`\>; `firstName`: `ZodOptional`\<`ZodString`\>; `id`: `ZodOptional`\<`ZodString`\>; `isAdmin`: `ZodDefault`\<`ZodBoolean`\>; `isNgoUser`: `ZodDefault`\<`ZodBoolean`\>; `lastName`: `ZodOptional`\<`ZodString`\>; `password`: `ZodOptional`\<`ZodString`\>; `phoneNumber`: `ZodNullable`\<`ZodOptional`\<`ZodString`\>\>; `profilePictureLink`: `ZodNullable`\<`ZodOptional`\<`ZodString`\>\>; `profilePicturePath`: `ZodNullable`\<`ZodOptional`\<`ZodString`\>\>; \}, `"strip"`, `ZodTypeAny`, \{ `email?`: `string`; `firstName?`: `string`; `id?`: `string`; `isAdmin`: `boolean`; `isNgoUser`: `boolean`; `lastName?`: `string`; `password?`: `string`; `phoneNumber?`: `null` \| `string`; `profilePictureLink?`: `null` \| `string`; `profilePicturePath?`: `null` \| `string`; \}, \{ `email?`: `string`; `firstName?`: `string`; `id?`: `string`; `isAdmin?`: `boolean`; `isNgoUser?`: `boolean`; `lastName?`: `string`; `password?`: `string`; `phoneNumber?`: `null` \| `string`; `profilePictureLink?`: `null` \| `string`; `profilePicturePath?`: `null` \| `string`; \}\>, `"many"`\>

Defined in: home4strays-backend/src/models/zod-schemas/user.zod.ts:125

Schema for querying multiple user records.
This schema defines the structure of a response containing an array of user data.
