---
editUrl: false
next: false
prev: false
title: "UserSchema"
---

> `const` **UserSchema**: `ZodObject`\<\{ `email`: `ZodOptional`\<`ZodString`\>; `firstName`: `ZodOptional`\<`ZodString`\>; `id`: `ZodOptional`\<`ZodString`\>; `isAdmin`: `ZodDefault`\<`ZodBoolean`\>; `isNgoUser`: `ZodDefault`\<`ZodBoolean`\>; `lastName`: `ZodOptional`\<`ZodString`\>; `password`: `ZodOptional`\<`ZodString`\>; `phoneNumber`: `ZodNullable`\<`ZodOptional`\<`ZodString`\>\>; `profilePictureLink`: `ZodNullable`\<`ZodOptional`\<`ZodString`\>\>; `profilePicturePath`: `ZodNullable`\<`ZodOptional`\<`ZodString`\>\>; \}, `"strip"`, `ZodTypeAny`, \{ `email?`: `string`; `firstName?`: `string`; `id?`: `string`; `isAdmin`: `boolean`; `isNgoUser`: `boolean`; `lastName?`: `string`; `password?`: `string`; `phoneNumber?`: `null` \| `string`; `profilePictureLink?`: `null` \| `string`; `profilePicturePath?`: `null` \| `string`; \}, \{ `email?`: `string`; `firstName?`: `string`; `id?`: `string`; `isAdmin?`: `boolean`; `isNgoUser?`: `boolean`; `lastName?`: `string`; `password?`: `string`; `phoneNumber?`: `null` \| `string`; `profilePictureLink?`: `null` \| `string`; `profilePicturePath?`: `null` \| `string`; \}\>

Defined in: home4strays-backend/src/models/zod-schemas/user.zod.ts:8

Represents a user entity with core authentication and profile information.
This schema defines the structure of a user in the system, including optional fields
for flexibility while maintaining type safety through Zod validation.
