---
editUrl: false
next: false
prev: false
title: "authenticateToken"
---

> **authenticateToken**(`req`, `res`, `next`): `void`

Defined in: home4strays-backend/src/middlewares/verifiy-token.middleware.ts:17

Middleware for JWT-based token authentication
Validates the presence and integrity of a JSON Web Token
in the Authorization header of incoming requests

## Parameters

### req

`Request`

Express request object

### res

`Response`

Express response object

### next

`NextFunction`

Express next middleware function

## Returns

`void`

## Throws

If no token is provided in the Authorization header

## Throws

If the token is invalid or cannot be verified
