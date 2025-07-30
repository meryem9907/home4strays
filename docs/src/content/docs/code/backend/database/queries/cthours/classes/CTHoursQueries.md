---
editUrl: false
next: false
prev: false
title: "CTHoursQueries"
---

Defined in: home4strays-backend/src/database/queries/cthours.ts:19

Class containing methods to query, manipulate, and manage caretaker hours data
This class provides database operations for retrieving, creating, updating, and deleting caretaker hours records

## Constructors

### Constructor

> **new CTHoursQueries**(): `CTHoursQueries`

#### Returns

`CTHoursQueries`

## Methods

### deleteCTHours()

> `static` **deleteCTHours**(`db`, `caretakerId`, `weekday`, `startTime`): `Promise`\<`void`\>

Defined in: home4strays-backend/src/database/queries/cthours.ts:283

Deletes a specific caretaker hour record by caretaker ID, weekday, and start time

#### Parameters

##### db

[`DatabaseManager`](/docs/code/backend/database/db/classes/databasemanager/)

DatabaseManager instance for executing queries

##### caretakerId

`string`

ID of the caretaker associated with the hours

##### weekday

`string`

Weekday of the hour to delete

##### startTime

`string`

Start time of the hour to delete

#### Returns

`Promise`\<`void`\>

Promise resolving to void

#### Throws

Error if database query fails

***

### deleteCTHoursById()

> `static` **deleteCTHoursById**(`db`, `caretakerId`): `Promise`\<`void`\>

Defined in: home4strays-backend/src/database/queries/cthours.ts:305

Deletes all caretaker hours records associated with a specific caretaker ID

#### Parameters

##### db

[`DatabaseManager`](/docs/code/backend/database/db/classes/databasemanager/)

DatabaseManager instance for executing queries

##### caretakerId

`string`

ID of the caretaker whose hours to delete

#### Returns

`Promise`\<`void`\>

Promise resolving to void

#### Throws

Error if database query fails

***

### insertCTHours()

> `static` **insertCTHours**(`db`, `caretakerId`, `ctHoursData`, `lang`): `Promise`\<`void`\>

Defined in: home4strays-backend/src/database/queries/cthours.ts:153

Inserts new caretaker hours records into the database

#### Parameters

##### db

[`DatabaseManager`](/docs/code/backend/database/db/classes/databasemanager/)

DatabaseManager instance for executing queries

##### caretakerId

`string`

ID of the caretaker associated with the hours

##### ctHoursData

[`default`](/docs/code/backend/models/db-models/cthours/classes/default/)[]

Array of CTHours objects to insert

##### lang

`string` = `"en"`

Language code for translation (default is 'en')

#### Returns

`Promise`\<`void`\>

Promise resolving to void

#### Throws

ValidationError if any required fields are missing or start time >= end time

***

### selectById()

> `static` **selectById**(`db`, `caretakerId`, `lang`): `Promise`\<[`default`](/docs/code/backend/models/db-models/cthours/classes/default/)[]\>

Defined in: home4strays-backend/src/database/queries/cthours.ts:63

Selects caretaker hours records by caretaker ID

#### Parameters

##### db

[`DatabaseManager`](/docs/code/backend/database/db/classes/databasemanager/)

DatabaseManager instance for executing queries

##### caretakerId

`string`

ID of the caretaker to filter records

##### lang

`string` = `"en"`

Language code for translation (default is 'en')

#### Returns

`Promise`\<[`default`](/docs/code/backend/models/db-models/cthours/classes/default/)[]\>

Promise resolving to an array of CTHours objects

#### Throws

Error if database query fails

***

### selectCTHour()

> `static` **selectCTHour**(`db`, `caretakerId`, `weekday`, `startTime`, `lang`): `Promise`\<`undefined` \| [`default`](/docs/code/backend/models/db-models/cthours/classes/default/)\>

Defined in: home4strays-backend/src/database/queries/cthours.ts:107

Selects a specific caretaker hour record by caretaker ID, weekday, and start time

#### Parameters

##### db

[`DatabaseManager`](/docs/code/backend/database/db/classes/databasemanager/)

DatabaseManager instance for executing queries

##### caretakerId

`string`

ID of the caretaker to filter records

##### weekday

`string`

Weekday to filter records

##### startTime

`string`

Start time to filter records

##### lang

`string` = `"en"`

Language code for translation (default is 'en')

#### Returns

`Promise`\<`undefined` \| [`default`](/docs/code/backend/models/db-models/cthours/classes/default/)\>

Promise resolving to a CTHours object or undefined if not found

#### Throws

Error if database query fails

***

### selectCTHours()

> `static` **selectCTHours**(`db`, `lang`): `Promise`\<[`default`](/docs/code/backend/models/db-models/cthours/classes/default/)[]\>

Defined in: home4strays-backend/src/database/queries/cthours.ts:27

Selects all caretaker hours records from the database

#### Parameters

##### db

[`DatabaseManager`](/docs/code/backend/database/db/classes/databasemanager/)

DatabaseManager instance for executing queries

##### lang

`string` = `"en"`

Language code for translation (default is 'en')

#### Returns

`Promise`\<[`default`](/docs/code/backend/models/db-models/cthours/classes/default/)[]\>

Promise resolving to an array of CTHours objects

#### Throws

Error if database query fails

***

### updateCTHours()

> `static` **updateCTHours**(`db`, `caretakerId`, `ctHoursData`, `lang`): `Promise`\<`void`\>

Defined in: home4strays-backend/src/database/queries/cthours.ts:218

Updates caretaker hours records or inserts new ones if they don't exist

#### Parameters

##### db

[`DatabaseManager`](/docs/code/backend/database/db/classes/databasemanager/)

DatabaseManager instance for executing queries

##### caretakerId

`string`

ID of the caretaker associated with the hours

##### ctHoursData

[`default`](/docs/code/backend/models/db-models/cthours/classes/default/)[]

Array of CTHours objects to process

##### lang

`string`

Language code for translation (default is 'en')

#### Returns

`Promise`\<`void`\>

Promise resolving to void

#### Throws

ValidationError if any required fields are missing or start time >= end time
