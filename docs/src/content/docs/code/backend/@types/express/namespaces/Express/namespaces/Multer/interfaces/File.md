---
editUrl: false
next: false
prev: false
title: "File"
---

Defined in: home4strays-backend/node\_modules/@types/multer/index.d.ts:8

Object containing file metadata and access information.

## Properties

### buffer

> **buffer**: `Buffer`

Defined in: home4strays-backend/node\_modules/@types/multer/index.d.ts:35

`MemoryStorage` only: A Buffer containing the entire file.

***

### destination

> **destination**: `string`

Defined in: home4strays-backend/node\_modules/@types/multer/index.d.ts:29

`DiskStorage` only: Directory to which this file has been uploaded.

***

### ~~encoding~~

> **encoding**: `string`

Defined in: home4strays-backend/node\_modules/@types/multer/index.d.ts:18

Value of the `Content-Transfer-Encoding` header for this file.

:::caution[Deprecated]
since July 2015
:::

#### See

RFC 7578, Section 4.7

***

### fieldname

> **fieldname**: `string`

Defined in: home4strays-backend/node\_modules/@types/multer/index.d.ts:10

Name of the form field associated with this file.

***

### filename

> **filename**: `string`

Defined in: home4strays-backend/node\_modules/@types/multer/index.d.ts:31

`DiskStorage` only: Name of this file within `destination`.

***

### mimetype

> **mimetype**: `string`

Defined in: home4strays-backend/node\_modules/@types/multer/index.d.ts:20

Value of the `Content-Type` header for this file.

***

### originalname

> **originalname**: `string`

Defined in: home4strays-backend/node\_modules/@types/multer/index.d.ts:12

Name of the file on the uploader's computer.

***

### path

> **path**: `string`

Defined in: home4strays-backend/node\_modules/@types/multer/index.d.ts:33

`DiskStorage` only: Full path to the uploaded file.

***

### size

> **size**: `number`

Defined in: home4strays-backend/node\_modules/@types/multer/index.d.ts:22

Size of the file in bytes.

***

### stream

> **stream**: `Readable`

Defined in: home4strays-backend/node\_modules/@types/multer/index.d.ts:27

A readable stream of this file. Only available to the `_handleFile`
callback for custom `StorageEngine`s.
