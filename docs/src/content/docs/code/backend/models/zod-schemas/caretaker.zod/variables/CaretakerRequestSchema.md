---
editUrl: false
next: false
prev: false
title: "CaretakerRequestSchema"
---

> `const` **CaretakerRequestSchema**: `ZodArray`\<`ZodObject`\<\{ `adoptionWillingness`: `ZodBoolean`; `birthdate`: `ZodDate`; `cityName`: `ZodString`; `country`: `ZodString`; `employmentType`: `ZodString`; `experience`: `ZodString`; `financialAssistance`: `ZodBoolean`; `floor`: `ZodNumber`; `garden`: `ZodBoolean`; `holidayCare`: `ZodBoolean`; `houseNumber`: `ZodString`; `localityType`: `ZodString`; `maritalStatus`: `ZodString`; `numberKids`: `ZodNumber`; `previousAdoption`: `ZodBoolean`; `residence`: `ZodString`; `space`: `ZodNumber`; `streetName`: `ZodString`; `tenure`: `ZodString`; `zip`: `ZodString`; \}, `"strip"`, `ZodTypeAny`, \{ `adoptionWillingness`: `boolean`; `birthdate`: `Date`; `cityName`: `string`; `country`: `string`; `employmentType`: `string`; `experience`: `string`; `financialAssistance`: `boolean`; `floor`: `number`; `garden`: `boolean`; `holidayCare`: `boolean`; `houseNumber`: `string`; `localityType`: `string`; `maritalStatus`: `string`; `numberKids`: `number`; `previousAdoption`: `boolean`; `residence`: `string`; `space`: `number`; `streetName`: `string`; `tenure`: `string`; `zip`: `string`; \}, \{ `adoptionWillingness`: `boolean`; `birthdate`: `Date`; `cityName`: `string`; `country`: `string`; `employmentType`: `string`; `experience`: `string`; `financialAssistance`: `boolean`; `floor`: `number`; `garden`: `boolean`; `holidayCare`: `boolean`; `houseNumber`: `string`; `localityType`: `string`; `maritalStatus`: `string`; `numberKids`: `number`; `previousAdoption`: `boolean`; `residence`: `string`; `space`: `number`; `streetName`: `string`; `tenure`: `string`; `zip`: `string`; \}\>, `"many"`\>

Defined in: home4strays-backend/src/models/zod-schemas/caretaker.zod.ts:157

Represents a schema for an array of caretaker request data.
This schema is used to validate incoming requests that require caretaker information.
Each item in the array conforms to the CaretakerSchema definition.

## See

CaretakerSchema
