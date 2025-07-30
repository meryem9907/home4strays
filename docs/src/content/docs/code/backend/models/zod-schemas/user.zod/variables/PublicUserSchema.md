---
editUrl: false
next: false
prev: false
title: "PublicUserSchema"
---

> `const` **PublicUserSchema**: `ZodObject`\<`Omit`\<\{ `email`: `ZodOptional`\<`ZodString`\>; `firstName`: `ZodOptional`\<`ZodString`\>; `id`: `ZodOptional`\<`ZodString`\>; `isAdmin`: `ZodDefault`\<`ZodBoolean`\>; `isNgoUser`: `ZodDefault`\<`ZodBoolean`\>; `lastName`: `ZodOptional`\<`ZodString`\>; `password`: `ZodOptional`\<`ZodString`\>; `phoneNumber`: `ZodNullable`\<`ZodOptional`\<`ZodString`\>\>; `profilePictureLink`: `ZodNullable`\<`ZodOptional`\<`ZodString`\>\>; `profilePicturePath`: `ZodNullable`\<`ZodOptional`\<`ZodString`\>\>; \}, `"password"`\>, `"strip"`, `ZodTypeAny`, \{ `email?`: `string`; `firstName?`: `string`; `id?`: `string`; `isAdmin`: `boolean`; `isNgoUser`: `boolean`; `lastName?`: `string`; `phoneNumber?`: `null` \| `string`; `profilePictureLink?`: `null` \| `string`; `profilePicturePath?`: `null` \| `string`; \}, \{ `email?`: `string`; `firstName?`: `string`; `id?`: `string`; `isAdmin?`: `boolean`; `isNgoUser?`: `boolean`; `lastName?`: `string`; `phoneNumber?`: `null` \| `string`; `profilePictureLink?`: `null` \| `string`; `profilePicturePath?`: `null` \| `string`; \}\>

Defined in: home4strays-backend/src/models/zod-schemas/user.zod.ts:101

Represents a user entity with sensitive information removed.
This schema is used for public-facing user data where password fields should be excluded.
