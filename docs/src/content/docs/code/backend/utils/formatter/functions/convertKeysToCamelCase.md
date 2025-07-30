---
editUrl: false
next: false
prev: false
title: "convertKeysToCamelCase"
---

> **convertKeysToCamelCase**(`obj`): `any`

Defined in: home4strays-backend/src/utils/formatter.ts:26

Recursively converts object keys to camelCase format while preserving nested structures.
This function handles arrays and objects, converting keys to camelCase while maintaining
the original data structure. Dates are preserved as-is, and nested objects/arrays are processed recursively.

## Parameters

### obj

`any`

The input object or array to process. Can be any type including nested objects/arrays.

## Returns

`any`

A new object with keys converted to camelCase, preserving original data types.
