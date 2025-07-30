---
editUrl: false
next: false
prev: false
title: "InterestedPetQueries"
---

Defined in: home4strays-backend/src/database/queries/interestedpet.ts:11

Manages database operations for caretaker-pet interest relationships
Provides methods to select, insert, update, and revoke interest entries

## Constructors

### Constructor

> **new InterestedPetQueries**(): `InterestedPetQueries`

#### Returns

`InterestedPetQueries`

## Methods

### insert()

> `static` **insert**(`db`, `ip`): `Promise`\<`void`\>

Defined in: home4strays-backend/src/database/queries/interestedpet.ts:41

Inserts a new pet of interest relationship into the database

#### Parameters

##### db

[`DatabaseManager`](/docs/code/backend/database/db/classes/databasemanager/)

Database connection manager

##### ip

[`default`](/docs/code/backend/models/db-models/interestedpet/classes/default/)

InterestedPet object containing the relationship data

#### Returns

`Promise`\<`void`\>

Promise resolving to void

This method executes an SQL INSERT statement to add a new record to the interested_pet table.
It uses parameterized queries to prevent SQL injection and ensures data integrity.

***

### revokeMatch()

> `static` **revokeMatch**(`db`, `caretakerId`, `petId`): `Promise`\<`void`\>

Defined in: home4strays-backend/src/database/queries/interestedpet.ts:58

Revokes a caretaker-pet interest relationship by setting interested flag to false

#### Parameters

##### db

[`DatabaseManager`](/docs/code/backend/database/db/classes/databasemanager/)

Database connection manager

##### caretakerId

`string`

User ID of the caretaker

##### petId

`string`

Pet ID of the pet

#### Returns

`Promise`\<`void`\>

Promise resolving to void

This method updates the interested_pet record to mark the relationship as revoked.
It sets the interested flag to false and resets the score to 0 for the specified user-pet pair.

***

### select()

> `static` **select**(`db`): `Promise`\<[`default`](/docs/code/backend/models/db-models/interestedpet/classes/default/)[]\>

Defined in: home4strays-backend/src/database/queries/interestedpet.ts:21

Retrieves all caretaker-pet interest entries from the database

#### Parameters

##### db

[`DatabaseManager`](/docs/code/backend/database/db/classes/databasemanager/)

Database connection manager

#### Returns

`Promise`\<[`default`](/docs/code/backend/models/db-models/interestedpet/classes/default/)[]\>

Promise resolving to an array of InterestedPet objects

This method executes a SQL query to fetch all records from the interested_pet table,
converts the result keys to camel case for consistency with TypeScript models,
and maps the database rows to InterestedPet instances using class-transformer

***

### setScore()

> `static` **setScore**(`db`, `ip`): `Promise`\<`void`\>

Defined in: home4strays-backend/src/database/queries/interestedpet.ts:78

Updates the score for an existing caretaker-pet interest relationship

#### Parameters

##### db

[`DatabaseManager`](/docs/code/backend/database/db/classes/databasemanager/)

Database connection manager

##### ip

[`default`](/docs/code/backend/models/db-models/interestedpet/classes/default/)

InterestedPet object containing the updated score

#### Returns

`Promise`\<`void`\>

Promise resolving to void

This method executes an SQL UPDATE statement to modify the score value in the interested_pet table.
It ensures the update is applied to the correct user-pet pair by using parameterized queries.
