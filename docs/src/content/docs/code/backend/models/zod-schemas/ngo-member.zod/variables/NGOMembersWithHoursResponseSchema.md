---
editUrl: false
next: false
prev: false
title: "NGOMembersWithHoursResponseSchema"
---

> `const` **NGOMembersWithHoursResponseSchema**: `ZodArray`\<`ZodObject`\<\{ `ngoMember`: `ZodObject`\<\{ `email`: `ZodOptional`\<`ZodString`\>; `firstName`: `ZodOptional`\<`ZodString`\>; `isAdmin`: `ZodDefault`\<`ZodBoolean`\>; `isNgoUser`: `ZodDefault`\<`ZodBoolean`\>; `lastName`: `ZodOptional`\<`ZodString`\>; `ngoId`: `ZodOptional`\<`ZodString`\>; `phoneNumber`: `ZodNullable`\<`ZodOptional`\<`ZodString`\>\>; `profilePictureLink`: `ZodNullable`\<`ZodOptional`\<`ZodString`\>\>; `userId`: `ZodString`; \}, `"strip"`, `ZodTypeAny`, \{ `email?`: `string`; `firstName?`: `string`; `isAdmin`: `boolean`; `isNgoUser`: `boolean`; `lastName?`: `string`; `ngoId?`: `string`; `phoneNumber?`: `null` \| `string`; `profilePictureLink?`: `null` \| `string`; `userId`: `string`; \}, \{ `email?`: `string`; `firstName?`: `string`; `isAdmin?`: `boolean`; `isNgoUser?`: `boolean`; `lastName?`: `string`; `ngoId?`: `string`; `phoneNumber?`: `null` \| `string`; `profilePictureLink?`: `null` \| `string`; `userId`: `string`; \}\>; `ngoMemberHours`: `ZodOptional`\<`ZodArray`\<`ZodObject`\<\{ `endTime`: `ZodString`; `startTime`: `ZodString`; `weekday`: `ZodString`; \}, `"strip"`, `ZodTypeAny`, \{ `endTime`: `string`; `startTime`: `string`; `weekday`: `string`; \}, \{ `endTime`: `string`; `startTime`: `string`; `weekday`: `string`; \}\>, `"many"`\>\>; \}, `"strip"`, `ZodTypeAny`, \{ `ngoMember`: \{ `email?`: `string`; `firstName?`: `string`; `isAdmin`: `boolean`; `isNgoUser`: `boolean`; `lastName?`: `string`; `ngoId?`: `string`; `phoneNumber?`: `null` \| `string`; `profilePictureLink?`: `null` \| `string`; `userId`: `string`; \}; `ngoMemberHours?`: `object`[]; \}, \{ `ngoMember`: \{ `email?`: `string`; `firstName?`: `string`; `isAdmin?`: `boolean`; `isNgoUser?`: `boolean`; `lastName?`: `string`; `ngoId?`: `string`; `phoneNumber?`: `null` \| `string`; `profilePictureLink?`: `null` \| `string`; `userId`: `string`; \}; `ngoMemberHours?`: `object`[]; \}\>, `"many"`\>

Defined in: home4strays-backend/src/models/zod-schemas/ngo-member.zod.ts:109

Schema defining the structure of a response containing multiple NGO members with their hours.
This schema is an array of NGOMemberWithMemberHoursSchema objects, used when returning
a list of members along with their associated hours data.
