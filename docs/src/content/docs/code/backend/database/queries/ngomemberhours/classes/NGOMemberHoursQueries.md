---
editUrl: false
next: false
prev: false
title: "NGOMemberHoursQueries"
---

Defined in: home4strays-backend/src/database/queries/ngomemberhours.ts:19

Class containing query operations for managing NGO member hours data
Provides methods for selecting, inserting, updating, and deleting NGO member hours records

## Constructors

### Constructor

> **new NGOMemberHoursQueries**(): `NGOMemberHoursQueries`

#### Returns

`NGOMemberHoursQueries`

## Methods

### deleteAllNGOMemberHours()

> `static` **deleteAllNGOMemberHours**(`db`, `ngoMemberId`): `Promise`\<`void`\>

Defined in: home4strays-backend/src/database/queries/ngomemberhours.ts:220

Deletes all NGO member hours records for a specific member

#### Parameters

##### db

[`DatabaseManager`](/docs/code/backend/database/db/classes/databasemanager/)

DatabaseManager instance for executing queries

##### ngoMemberId

`string`

Identifier for the NGO member

#### Returns

`Promise`\<`void`\>

Promise resolving to void

This method removes all records from the ngo_member_hours table that
are associated with the provided NGO member ID. It effectively clears
all hours for the specified member.

***

### deleteNGOMemberHours()

> `static` **deleteNGOMemberHours**(`db`, `ngoMemberId`, `weekday`, `startTime`): `Promise`\<`void`\>

Defined in: home4strays-backend/src/database/queries/ngomemberhours.ts:195

Deletes a specific NGO member hour record by identifier

#### Parameters

##### db

[`DatabaseManager`](/docs/code/backend/database/db/classes/databasemanager/)

DatabaseManager instance for executing queries

##### ngoMemberId

`string`

Identifier for the NGO member

##### weekday

`string`

Weekday of the hour to delete

##### startTime

`string`

Start time of the hour to delete

#### Returns

`Promise`\<`void`\>

Promise resolving to void

This method deletes a single record from the ngo_member_hours table
based on the provided NGO member ID, weekday, and start time. It ensures
that the exact match is removed from the database.

***

### insertNGOMemberHours()

> `static` **insertNGOMemberHours**(`db`, `ngoMemberId`, `ngoMemberHoursData`, `lang`): `Promise`\<`void`\>

Defined in: home4strays-backend/src/database/queries/ngomemberhours.ts:73

Inserts new NGO member hours records into the database

#### Parameters

##### db

[`DatabaseManager`](/docs/code/backend/database/db/classes/databasemanager/)

DatabaseManager instance for executing queries

##### ngoMemberId

`string`

Identifier for the NGO member

##### ngoMemberHoursData

[`default`](/docs/code/backend/models/db-models/ngomemberhours/classes/default/)[]

Array of NGOMemberHours objects to insert

##### lang

`string` = `"en"`

Language code for translation (default is 'en')

#### Returns

`Promise`\<`void`\>

Promise resolving to void

This method processes each hour entry in the provided data array. If the
language is not English, it translates the weekday value using the
ReverseWeekdayTranslations map. It validates that all required fields
(startTime, endTime, weekday) are present and that start time is before
end time. If any validation fails, it throws a ValidationError.

***

### select()

> `static` **select**(`db`, `lang`): `Promise`\<[`default`](/docs/code/backend/models/db-models/ngomemberhours/classes/default/)[]\>

Defined in: home4strays-backend/src/database/queries/ngomemberhours.ts:31

Selects all NGO member hours records from the database

#### Parameters

##### db

[`DatabaseManager`](/docs/code/backend/database/db/classes/databasemanager/)

DatabaseManager instance for executing queries

##### lang

`string`

Language code for translation (default is 'en')

#### Returns

`Promise`\<[`default`](/docs/code/backend/models/db-models/ngomemberhours/classes/default/)[]\>

Promise resolving to an array of NGOMemberHours objects

This method retrieves all records from the ngo_member_hours table,
converts the result keys to camelCase, and translates weekday values
based on the specified language. If the language is not English, it
applies the appropriate translation using the WeekdayTranslations map.

***

### updateNGOMemberHours()

> `static` **updateNGOMemberHours**(`db`, `ngoMemberId`, `ngoMemberHoursData`, `lang`): `Promise`\<`void`\>

Defined in: home4strays-backend/src/database/queries/ngomemberhours.ts:132

Updates NGO member hours records by deleting existing entries first

#### Parameters

##### db

[`DatabaseManager`](/docs/code/backend/database/db/classes/databasemanager/)

DatabaseManager instance for executing queries

##### ngoMemberId

`string`

Identifier for the NGO member

##### ngoMemberHoursData

[`default`](/docs/code/backend/models/db-models/ngomemberhours/classes/default/)[]

Array of NGOMemberHours objects to update

##### lang

`string` = `"en"`

Language code for translation (default is 'en')

#### Returns

`Promise`\<`void`\>

Promise resolving to void

This method performs an upsert operation. For each hour entry in the
provided data array, it first deletes any existing record that matches
the same weekday and startTime combination for the given NGO member.
If the language is not English, it translates the weekday value using
the ReverseWeekdayTranslations map. It validates that all required fields
(startTime, endTime, weekday) are present and that start time is before
end time. If any validation fails, it throws a ValidationError.
