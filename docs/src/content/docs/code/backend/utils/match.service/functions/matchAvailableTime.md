---
editUrl: false
next: false
prev: false
title: "matchAvailableTime"
---

> **matchAvailableTime**(`score`, `availableTime`): `number`

Defined in: home4strays-backend/src/utils/match.service.ts:307

Raises score if caretaker has enough available time.

## Parameters

### score

`number`

Current match score.

### availableTime

Total available minutes calculated from CTHours.

`undefined` | `number`

## Returns

`number`

Updated match score based on available time.
