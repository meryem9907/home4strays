---
editUrl: false
next: false
prev: false
title: "verifyNGO"
---

> **verifyNGO**(`req`, `res`, `next`): `Promise`\<`void`\>

Defined in: home4strays-backend/src/middlewares/verifiy-ngo.middleware.ts:24

Middleware to verify if the authenticated user is associated with a verified NGO.
This middleware checks the user's NGO association and ensures the NGO is verified.
If the NGO is not verified, it throws a ForbiddenAccessError.
If the user is not associated with any NGO, it throws an NGONotFoundError.
If the user ID is missing, it throws an IdNotFoundError.

## Parameters

### req

`Request`

Express request object containing user authentication context

### res

`Response`

Express response object

### next

`NextFunction`

Express next function to pass control to the next middleware

## Returns

`Promise`\<`void`\>

## Throws

If the associated NGO is not verified

## Throws

If no NGO is found for the user

## Throws

If the user ID is missing from the authentication context
