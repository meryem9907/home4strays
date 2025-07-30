---
editUrl: false
next: false
prev: false
title: "verifyNGO"
---

> **verifyNGO**(`req`, `res`, `next`): `Promise`\<`void`\>

Defined in: home4strays-backend/src/middlewares/verify-ngo.middleware.ts:15

Middleware to verify if the authenticated user is associated with a verified NGO.
This middleware checks the user's NGO membership status and ensures the NGO is verified.
If the user is not found, the NGO is not found, or the NGO is not verified, an appropriate error is thrown.

## Parameters

### req

`Request`

### res

`Response`

### next

`NextFunction`

## Returns

`Promise`\<`void`\>
