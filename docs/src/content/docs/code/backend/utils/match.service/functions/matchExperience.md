---
editUrl: false
next: false
prev: false
title: "matchExperience"
---

> **matchExperience**(`score`, `petexperienceRequirement`, `caretakerExperience`): `number`

Defined in: home4strays-backend/src/utils/match.service.ts:202

Matches experience requirement between pet and caretaker.
Compares normalized experience levels to determine match.

## Parameters

### score

`number`

Current match score.

### petexperienceRequirement

`string`

Pet's experience requirement.

### caretakerExperience

`string`

Caretaker's experience level.

## Returns

`number`

Updated match score based on experience match.
