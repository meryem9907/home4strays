---
editUrl: false
next: false
prev: false
title: "Request"
---

Defined in: home4strays-backend/node\_modules/@types/express-serve-static-core/index.d.ts:10

## Properties

### file?

> `optional` **file**: [`File`](/docs/code/backend/types/express/namespaces/express/namespaces/multer/interfaces/file/)

Defined in: home4strays-backend/node\_modules/@types/multer/index.d.ts:41

`Multer.File` object populated by `single()` middleware.

***

### files?

> `optional` **files**: \{[`fieldname`: `string`]: [`File`](/docs/code/backend/types/express/namespaces/express/namespaces/multer/interfaces/file/)[]; \} \| [`File`](/docs/code/backend/types/express/namespaces/express/namespaces/multer/interfaces/file/)[]

Defined in: home4strays-backend/node\_modules/@types/multer/index.d.ts:46

Array or dictionary of `Multer.File` object populated by `array()`,
`fields()`, and `any()` middleware.

***

### ngo?

> `optional` **ngo**: `object`

Defined in: home4strays-backend/src/@types/express/index.d.ts:7

#### verified

> **verified**: `boolean`

***

### user?

> `optional` **user**: `object`

Defined in: home4strays-backend/src/@types/express/index.d.ts:6

#### email

> **email**: `string`

#### id

> **id**: `string`

#### isAdmin

> **isAdmin**: `boolean`

#### ngoId?

> `optional` **ngoId**: `string`
