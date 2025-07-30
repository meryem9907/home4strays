---
editUrl: false
next: false
prev: false
title: "SingleCaretakerResponseSchema"
---

> `const` **SingleCaretakerResponseSchema**: `ZodObject`\<\{ `adoptionWillingness`: `ZodBoolean`; `birthdate`: `ZodDate`; `cityName`: `ZodString`; `country`: `ZodString`; `employmentType`: `ZodString`; `experience`: `ZodString`; `financialAssistance`: `ZodBoolean`; `floor`: `ZodNumber`; `garden`: `ZodBoolean`; `holidayCare`: `ZodBoolean`; `houseNumber`: `ZodString`; `localityType`: `ZodString`; `maritalStatus`: `ZodString`; `numberKids`: `ZodNumber`; `previousAdoption`: `ZodBoolean`; `residence`: `ZodString`; `space`: `ZodNumber`; `streetName`: `ZodString`; `tenure`: `ZodString`; `zip`: `ZodString`; \}, `"strip"`, `ZodTypeAny`, \{ `adoptionWillingness`: `boolean`; `birthdate`: `Date`; `cityName`: `string`; `country`: `string`; `employmentType`: `string`; `experience`: `string`; `financialAssistance`: `boolean`; `floor`: `number`; `garden`: `boolean`; `holidayCare`: `boolean`; `houseNumber`: `string`; `localityType`: `string`; `maritalStatus`: `string`; `numberKids`: `number`; `previousAdoption`: `boolean`; `residence`: `string`; `space`: `number`; `streetName`: `string`; `tenure`: `string`; `zip`: `string`; \}, \{ `adoptionWillingness`: `boolean`; `birthdate`: `Date`; `cityName`: `string`; `country`: `string`; `employmentType`: `string`; `experience`: `string`; `financialAssistance`: `boolean`; `floor`: `number`; `garden`: `boolean`; `holidayCare`: `boolean`; `houseNumber`: `string`; `localityType`: `string`; `maritalStatus`: `string`; `numberKids`: `number`; `previousAdoption`: `boolean`; `residence`: `string`; `space`: `number`; `streetName`: `string`; `tenure`: `string`; `zip`: `string`; \}\> = `CaretakerSchema`

Defined in: home4strays-backend/src/models/zod-schemas/caretaker.zod.ts:136

Schema representing the structure of a single caretaker response.
This schema is used to validate the format of the response body
when retrieving information about a single caretaker resource.
It ensures consistency in data representation across API endpoints.
