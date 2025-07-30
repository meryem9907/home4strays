---
editUrl: false
next: false
prev: false
title: "NGOHoursQueries"
---

Defined in: home4strays-backend/src/database/queries/ngohours.ts:15

Class containing database query operations for NGO hours data
Handles CRUD operations and multilingual translation for NGO hours records

## Constructors

### Constructor

> **new NGOHoursQueries**(): `NGOHoursQueries`

#### Returns

`NGOHoursQueries`

## Methods

### deleteById()

> `static` **deleteById**(`db`, `ngoId`): `Promise`\<`void`\>

Defined in: home4strays-backend/src/database/queries/ngohours.ts:197

Deletes all NGO hours records associated with a specific NGO ID

#### Parameters

##### db

[`DatabaseManager`](/docs/code/backend/database/db/classes/databasemanager/)

DatabaseManager instance for executing queries

##### ngoId

`string`

Identifier for the NGO

#### Returns

`Promise`\<`void`\>

Promise resolving to void

***

### insert()

> `static` **insert**(`db`, `ngoId`, `hours`, `lang`): `Promise`\<`void`\>

Defined in: home4strays-backend/src/database/queries/ngohours.ts:104

Inserts new NGO hours records into the database

#### Parameters

##### db

[`DatabaseManager`](/docs/code/backend/database/db/classes/databasemanager/)

DatabaseManager instance for executing queries

##### ngoId

`string`

Identifier for the NGO

##### hours

[`default`](/docs/code/backend/models/db-models/ngohours/classes/default/)[]

Array of NGOHours objects to insert

##### lang

`string`

Language code for translation (default: 'en')

#### Returns

`Promise`\<`void`\>

Promise resolving to void

***

### select()

> `static` **select**(`db`, `lang`): `Promise`\<[`default`](/docs/code/backend/models/db-models/ngohours/classes/default/)[]\>

Defined in: home4strays-backend/src/database/queries/ngohours.ts:22

Retrieves all NGO hours records from the database

#### Parameters

##### db

[`DatabaseManager`](/docs/code/backend/database/db/classes/databasemanager/)

DatabaseManager instance for executing queries

##### lang

`string` = `"en"`

Language code for translation (default: 'en')

#### Returns

`Promise`\<[`default`](/docs/code/backend/models/db-models/ngohours/classes/default/)[]\>

Promise resolving to array of NGOHours objects

***

### selectById()

> `static` **selectById**(`db`, `ngoId`, `lang`): `Promise`\<[`default`](/docs/code/backend/models/db-models/ngohours/classes/default/)[]\>

Defined in: home4strays-backend/src/database/queries/ngohours.ts:61

Retrieves NGO hours records by NGO ID

#### Parameters

##### db

[`DatabaseManager`](/docs/code/backend/database/db/classes/databasemanager/)

DatabaseManager instance for executing queries

##### ngoId

`string`

Identifier for the NGO

##### lang

`string` = `"en"`

Language code for translation (default: 'en')

#### Returns

`Promise`\<[`default`](/docs/code/backend/models/db-models/ngohours/classes/default/)[]\>

Promise resolving to array of NGOHours objects

***

### update()

> `static` **update**(`db`, `ngoId`, `hours`, `lang`): `Promise`\<`void`\>

Defined in: home4strays-backend/src/database/queries/ngohours.ts:138

Updates existing NGO hours records or inserts new ones if they don't exist

#### Parameters

##### db

[`DatabaseManager`](/docs/code/backend/database/db/classes/databasemanager/)

DatabaseManager instance for executing queries

##### ngoId

`string`

Identifier for the NGO

##### hours

[`default`](/docs/code/backend/models/db-models/ngohours/classes/default/)[]

Array of NGOHours objects to update or insert

##### lang

`string`

Language code for translation (default: 'en')

#### Returns

`Promise`\<`void`\>

Promise resolving to void
