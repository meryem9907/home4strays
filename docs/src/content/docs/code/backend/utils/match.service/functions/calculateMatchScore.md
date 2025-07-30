---
editUrl: false
next: false
prev: false
title: "calculateMatchScore"
---

> **calculateMatchScore**(`pet`, `caretaker`): `Promise`\<`number`\>

Defined in: home4strays-backend/src/utils/match.service.ts:23

This function will calculate the match score between caretaker and animal as a background process.
It evaluates various criteria including location, experience, space, and other requirements.

## Parameters

### pet

[`Pet`](/docs/code/backend/models/db-models/pet/classes/pet/)

### caretaker

[`Caretaker`](/docs/code/backend/models/db-models/caretaker/classes/caretaker/)

## Returns

`Promise`\<`number`\>
