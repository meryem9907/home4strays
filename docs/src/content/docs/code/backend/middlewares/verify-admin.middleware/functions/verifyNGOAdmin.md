---
editUrl: false
next: false
prev: false
title: "verifyNGOAdmin"
---

> **verifyNGOAdmin**(`req`, `res`, `next`): `Promise`\<`void`\>

Defined in: home4strays-backend/src/middlewares/verify-admin.middleware.ts:22

Middleware to verify if a user is an admin of an NGO.
This middleware performs the following actions:
1. Retrieves the NGO member record associated with the authenticated user
2. Validates the user's membership status
3. Grants access to admin-only routes if the user is verified as an admin

## Parameters

### req

`Request`

Express request object containing user authentication data

### res

`Response`

Express response object

### next

`NextFunction`

Express next function for middleware chaining

## Returns

`Promise`\<`void`\>

Calls next() if verification is successful

## Throws

When the user is not found in the NGO members table

## Throws

When the user is not verified as an admin for their NGO
