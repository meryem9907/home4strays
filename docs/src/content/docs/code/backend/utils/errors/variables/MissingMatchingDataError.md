---
editUrl: false
next: false
prev: false
title: "MissingMatchingDataError"
---

> `const` **MissingMatchingDataError**: `HttpError`\<`400`\>

Defined in: home4strays-backend/src/utils/errors.ts:128

Custom HTTP error for missing required match data fields.
Thrown when specific fields are missing during a match process.
Required fields: pet.zipRequirement, pet.experienceRequirement, pet.minimumSpaceRequirement,
pet.kidsAllowed, pet.streetName, caretaker.zip, caretaker.experience, caretaker.space,
caretaker.numberKids.
