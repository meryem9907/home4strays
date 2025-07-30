---
editUrl: false
next: false
prev: false
title: "getSecret"
---

> **getSecret**(`key`, `default_value`): `string`

Defined in: home4strays-backend/src/utils/secret-manager.ts:31

Retrieves a value from the environment variables.

This function provides a typed and safe way to access environment variables.
If the specified key is not found, it returns the provided default value.

## Parameters

### key

`string`

The name of the environment variable to retrieve.

### default\_value

`string` = `""`

Optional default value to return if the key is not found.

## Returns

`string`

The value of the environment variable or the default value if not found.

## Example

```ts
const PORT = getSecret("PORT", "3000");
```

## Remarks

- The function is designed to be used with Starlight documentation.
- It ensures type safety by returning a string value.
- Always prefer using this function over direct `process.env` access for better maintainability.
