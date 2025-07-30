---
editUrl: false
next: false
prev: false
title: "NGOMemberWithMemberHoursSchema"
---

> `const` **NGOMemberWithMemberHoursSchema**: `ZodObject`\<\{ `ngoMember`: `ZodObject`\<\{ `email`: `ZodOptional`\<`ZodString`\>; `firstName`: `ZodOptional`\<`ZodString`\>; `isAdmin`: `ZodDefault`\<`ZodBoolean`\>; `isNgoUser`: `ZodDefault`\<`ZodBoolean`\>; `lastName`: `ZodOptional`\<`ZodString`\>; `ngoId`: `ZodOptional`\<`ZodString`\>; `phoneNumber`: `ZodNullable`\<`ZodOptional`\<`ZodString`\>\>; `profilePictureLink`: `ZodNullable`\<`ZodOptional`\<`ZodString`\>\>; `userId`: `ZodString`; \}, `"strip"`, `ZodTypeAny`, \{ `email?`: `string`; `firstName?`: `string`; `isAdmin`: `boolean`; `isNgoUser`: `boolean`; `lastName?`: `string`; `ngoId?`: `string`; `phoneNumber?`: `null` \| `string`; `profilePictureLink?`: `null` \| `string`; `userId`: `string`; \}, \{ `email?`: `string`; `firstName?`: `string`; `isAdmin?`: `boolean`; `isNgoUser?`: `boolean`; `lastName?`: `string`; `ngoId?`: `string`; `phoneNumber?`: `null` \| `string`; `profilePictureLink?`: `null` \| `string`; `userId`: `string`; \}\>; `ngoMemberHours`: `ZodOptional`\<`ZodArray`\<`ZodObject`\<\{ `endTime`: `ZodString`; `startTime`: `ZodString`; `weekday`: `ZodString`; \}, `"strip"`, `ZodTypeAny`, \{ `endTime`: `string`; `startTime`: `string`; `weekday`: `string`; \}, \{ `endTime`: `string`; `startTime`: `string`; `weekday`: `string`; \}\>, `"many"`\>\>; \}, `"strip"`, `ZodTypeAny`, \{ `ngoMember`: \{ `email?`: `string`; `firstName?`: `string`; `isAdmin`: `boolean`; `isNgoUser`: `boolean`; `lastName?`: `string`; `ngoId?`: `string`; `phoneNumber?`: `null` \| `string`; `profilePictureLink?`: `null` \| `string`; `userId`: `string`; \}; `ngoMemberHours?`: `object`[]; \}, \{ `ngoMember`: \{ `email?`: `string`; `firstName?`: `string`; `isAdmin?`: `boolean`; `isNgoUser?`: `boolean`; `lastName?`: `string`; `ngoId?`: `string`; `phoneNumber?`: `null` \| `string`; `profilePictureLink?`: `null` \| `string`; `userId`: `string`; \}; `ngoMemberHours?`: `object`[]; \}\>

Defined in: home4strays-backend/src/models/zod-schemas/ngo-member.zod.ts:76

Schema representing a NGO member with additional member hours information
This schema extends the basic NGO member schema to include working hours data
