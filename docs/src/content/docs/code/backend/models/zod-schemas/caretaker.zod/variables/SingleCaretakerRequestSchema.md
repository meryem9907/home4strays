---
editUrl: false
next: false
prev: false
title: "SingleCaretakerRequestSchema"
---

> `const` **SingleCaretakerRequestSchema**: `ZodObject`\<\{ `adoptionWillingness`: `ZodBoolean`; `birthdate`: `ZodDate`; `cityName`: `ZodString`; `country`: `ZodString`; `employmentType`: `ZodString`; `experience`: `ZodString`; `financialAssistance`: `ZodBoolean`; `floor`: `ZodNumber`; `garden`: `ZodBoolean`; `holidayCare`: `ZodBoolean`; `houseNumber`: `ZodString`; `localityType`: `ZodString`; `maritalStatus`: `ZodString`; `numberKids`: `ZodNumber`; `previousAdoption`: `ZodBoolean`; `residence`: `ZodString`; `space`: `ZodNumber`; `streetName`: `ZodString`; `tenure`: `ZodString`; `zip`: `ZodString`; \}, `"strip"`, `ZodTypeAny`, \{ `adoptionWillingness`: `boolean`; `birthdate`: `Date`; `cityName`: `string`; `country`: `string`; `employmentType`: `string`; `experience`: `string`; `financialAssistance`: `boolean`; `floor`: `number`; `garden`: `boolean`; `holidayCare`: `boolean`; `houseNumber`: `string`; `localityType`: `string`; `maritalStatus`: `string`; `numberKids`: `number`; `previousAdoption`: `boolean`; `residence`: `string`; `space`: `number`; `streetName`: `string`; `tenure`: `string`; `zip`: `string`; \}, \{ `adoptionWillingness`: `boolean`; `birthdate`: `Date`; `cityName`: `string`; `country`: `string`; `employmentType`: `string`; `experience`: `string`; `financialAssistance`: `boolean`; `floor`: `number`; `garden`: `boolean`; `holidayCare`: `boolean`; `houseNumber`: `string`; `localityType`: `string`; `maritalStatus`: `string`; `numberKids`: `number`; `previousAdoption`: `boolean`; `residence`: `string`; `space`: `number`; `streetName`: `string`; `tenure`: `string`; `zip`: `string`; \}\> = `CaretakerSchema`

Defined in: home4strays-backend/src/models/zod-schemas/caretaker.zod.ts:143

Schema defining the structure of a request payload for caretaker operations.
This schema enforces data validation for request bodies when creating
or updating caretaker records. It ensures all required fields are present
and follow the expected data types and format specifications.
