---
editUrl: false
next: false
prev: false
title: "detectLanguage"
---

> **detectLanguage**(`req`, `res`, `next`): `void`

Defined in: home4strays-backend/src/middlewares/detect-lang.middleware.ts:12

Middleware to detect and set the user's preferred language based on the Accept-Language header.
This middleware extracts the primary language code from the request headers and sets it in res.locals.
If the detected language is not supported, it defaults to English ('en').

## Parameters

### req

`Request`

Express request object containing headers

### res

`Response`

Express response object used to store language information in res.locals

### next

`NextFunction`

Express next function to pass control to the next middleware

## Returns

`void`
