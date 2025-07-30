---
editUrl: false
next: false
prev: false
title: "CaretakerQueries"
---

Defined in: home4strays-backend/src/database/queries/caretaker.ts:35

Class containing database query operations for managing caretaker data.
This class provides methods to interact with the caretaker table in the database,
including selecting, inserting, updating, and deleting caretaker records.
All operations are performed using the provided DatabaseManager instance.

## Constructors

### Constructor

> **new CaretakerQueries**(): `CaretakerQueries`

#### Returns

`CaretakerQueries`

## Methods

### deleteById()

> `static` **deleteById**(`db`, `userId`): `Promise`\<`void`\>

Defined in: home4strays-backend/src/database/queries/caretaker.ts:604

Deletes a caretaker from the database by their user ID.

This method removes the caretaker record associated with the provided user ID
from the database. It uses a parameterized SQL query to ensure security against
SQL injection and guarantees transactional integrity.

#### Parameters

##### db

[`DatabaseManager`](/docs/code/backend/database/db/classes/databasemanager/)

The database manager instance used to execute the query.

##### userId

`string`

The unique identifier of the user associated with the caretaker
                 record to be deleted.

#### Returns

`Promise`\<`void`\>

A Promise that resolves when the deletion operation is complete.

***

### deleteCaretakerById()

> `static` **deleteCaretakerById**(`db`, `userId`): `Promise`\<`void`\>

Defined in: home4strays-backend/src/database/queries/caretaker.ts:579

Deletes a caretaker from the database by their user ID.

This method removes the caretaker record associated with the provided user ID
from the database. It uses a parameterized SQL query to ensure security against
SQL injection and guarantees transactional integrity.

#### Parameters

##### db

[`DatabaseManager`](/docs/code/backend/database/db/classes/databasemanager/)

The database manager instance used to execute the query.

##### userId

`string`

The unique identifier of the user associated with the caretaker
                 record to be deleted.

#### Returns

`Promise`\<`void`\>

A Promise that resolves when the deletion operation is complete.

***

### insert()

> `static` **insert**(`db`, `caretaker`, `lang`): `Promise`\<`void`\>

Defined in: home4strays-backend/src/database/queries/caretaker.ts:407

Inserts a new caretaker into the database.

#### Parameters

##### db

[`DatabaseManager`](/docs/code/backend/database/db/classes/databasemanager/)

DatabaseManager instance used to execute the query.

##### caretaker

[`Caretaker`](/docs/code/backend/models/db-models/caretaker/classes/caretaker/)

The Caretaker object to be inserted.

##### lang

`string` = `"en"`

Language code for translation of enum values (default is 'en').

#### Returns

`Promise`\<`void`\>

A promise that resolves when the insertion is complete.

#### Throws

No exceptions are explicitly thrown, but may throw errors from the database operation.

***

### select()

> `static` **select**(`db`, `lang`): `Promise`\<[`Caretaker`](/docs/code/backend/models/db-models/caretaker/classes/caretaker/)[]\>

Defined in: home4strays-backend/src/database/queries/caretaker.ts:43

Selects all caretakers from the database.

#### Parameters

##### db

[`DatabaseManager`](/docs/code/backend/database/db/classes/databasemanager/)

DatabaseManager instance used to execute the query.

##### lang

`string` = `"en"`

Language code for translation of enum values (default is 'en').

#### Returns

`Promise`\<[`Caretaker`](/docs/code/backend/models/db-models/caretaker/classes/caretaker/)[]\>

A promise that resolves to an array of Caretaker objects.

#### Throws

No exceptions are explicitly thrown, but may return empty arrays if no records found.

***

### selectAllInfosByCaretakerList()

> `static` **selectAllInfosByCaretakerList**(`db`, `caretakers`, `lang`): `Promise`\<[`FullCaretaker`](/docs/code/backend/models/db-models/caretaker/classes/fullcaretaker/)[]\>

Defined in: home4strays-backend/src/database/queries/caretaker.ts:300

Selects all full caretaker information from a list of caretaker IDs.

#### Parameters

##### db

[`DatabaseManager`](/docs/code/backend/database/db/classes/databasemanager/)

DatabaseManager instance used to execute the query.

##### caretakers

[`Caretaker`](/docs/code/backend/models/db-models/caretaker/classes/caretaker/)[]

Array of Caretaker objects to retrieve full information for.

##### lang

`string` = `"en"`

Language code for translation of enum values (default is 'en').

#### Returns

`Promise`\<[`FullCaretaker`](/docs/code/backend/models/db-models/caretaker/classes/fullcaretaker/)[]\>

A promise that resolves to an array of FullCaretaker objects.

#### Throws

No exceptions are explicitly thrown, but may return empty arrays if no records found.

***

### selectAllInfosById()

> `static` **selectAllInfosById**(`db`, `caretakerId`, `lang`): `Promise`\<`undefined` \| [`FullCaretaker`](/docs/code/backend/models/db-models/caretaker/classes/fullcaretaker/)\>

Defined in: home4strays-backend/src/database/queries/caretaker.ts:254

Selects all information about a caretaker including their profile, user details, and CTHours.

#### Parameters

##### db

[`DatabaseManager`](/docs/code/backend/database/db/classes/databasemanager/)

DatabaseManager instance used to execute the query.

##### caretakerId

`string`

The ID of the caretaker.

##### lang

`string` = `"en"`

Language code for translation of enum values (default is 'en').

#### Returns

`Promise`\<`undefined` \| [`FullCaretaker`](/docs/code/backend/models/db-models/caretaker/classes/fullcaretaker/)\>

A promise that resolves to a FullCaretaker object or undefined if not found.

#### Throws

No exceptions are explicitly thrown, but may return undefined if no record found.

***

### selectById()

> `static` **selectById**(`db`, `userId`, `lang`): `Promise`\<`undefined` \| [`Caretaker`](/docs/code/backend/models/db-models/caretaker/classes/caretaker/)\>

Defined in: home4strays-backend/src/database/queries/caretaker.ts:110

Selects a caretaker by their user ID.

#### Parameters

##### db

[`DatabaseManager`](/docs/code/backend/database/db/classes/databasemanager/)

DatabaseManager instance used to execute the query.

##### userId

`string`

The user ID associated with the caretaker.

##### lang

`string` = `"en"`

Language code for translation of enum values (default is 'en').

#### Returns

`Promise`\<`undefined` \| [`Caretaker`](/docs/code/backend/models/db-models/caretaker/classes/caretaker/)\>

A promise that resolves to a Caretaker object or undefined if not found.

#### Throws

No exceptions are explicitly thrown, but may return undefined if no record found.

***

### selectCaretakerWithHoursById()

> `static` **selectCaretakerWithHoursById**(`db`, `userId`, `lang`): `Promise`\<`null` \| [`Caretaker`](/docs/code/backend/models/db-models/caretaker/classes/caretaker/) & `object`\>

Defined in: home4strays-backend/src/database/queries/caretaker.ts:322

Selects a caretaker along with their CTHours information.

#### Parameters

##### db

[`DatabaseManager`](/docs/code/backend/database/db/classes/databasemanager/)

DatabaseManager instance used to execute the query.

##### userId

`string`

The user ID associated with the caretaker.

##### lang

`string`

Language code for translation of enum values (default is 'en').

#### Returns

`Promise`\<`null` \| [`Caretaker`](/docs/code/backend/models/db-models/caretaker/classes/caretaker/) & `object`\>

A promise that resolves to an object containing Caretaker data and CTHours, or null if not found.

#### Throws

No exceptions are explicitly thrown, but may return null if no record found.

***

### selectMatchedCaretakersByPet()

> `static` **selectMatchedCaretakersByPet**(`db`, `petId`, `lang`): `Promise`\<[`Caretaker`](/docs/code/backend/models/db-models/caretaker/classes/caretaker/)[]\>

Defined in: home4strays-backend/src/database/queries/caretaker.ts:180

Selects caretakers who have expressed interest in a specific pet.

#### Parameters

##### db

[`DatabaseManager`](/docs/code/backend/database/db/classes/databasemanager/)

DatabaseManager instance used to execute the query.

##### petId

`string`

The ID of the pet to find interested caretakers for.

##### lang

`string` = `"en"`

Language code for translation of enum values (default is 'en').

#### Returns

`Promise`\<[`Caretaker`](/docs/code/backend/models/db-models/caretaker/classes/caretaker/)[]\>

A promise that resolves to an array of Caretaker objects.

#### Throws

No exceptions are explicitly thrown, but may return empty arrays if no records found.

***

### updateCaretakerById()

> `static` **updateCaretakerById**(`db`, `userId`, `caretaker`, `lang`): `Promise`\<`void`\>

Defined in: home4strays-backend/src/database/queries/caretaker.ts:493

Updates an existing caretaker's information in the database.

#### Parameters

##### db

[`DatabaseManager`](/docs/code/backend/database/db/classes/databasemanager/)

DatabaseManager instance used to execute the query.

##### userId

`string`

##### caretaker

[`Caretaker`](/docs/code/backend/models/db-models/caretaker/classes/caretaker/)

The Caretaker object containing updated data.

##### lang

`string` = `"en"`

Language code for translation of enum values (default is 'en').

#### Returns

`Promise`\<`void`\>

A promise that resolves when the update is complete.

#### Throws

No exceptions are explicitly thrown, but may throw errors from the database operation.
