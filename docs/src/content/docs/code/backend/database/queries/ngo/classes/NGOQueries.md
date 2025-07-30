---
editUrl: false
next: false
prev: false
title: "NGOQueries"
---

Defined in: home4strays-backend/src/database/queries/ngo.ts:13

Provides database query operations for NGO-related data.
This class encapsulates all CRUD operations for NGOs and their associated data.

## Constructors

### Constructor

> **new NGOQueries**(): `NGOQueries`

#### Returns

`NGOQueries`

## Methods

### deleteByEmail()

> `static` **deleteByEmail**(`db`, `email`): `Promise`\<`QueryResult`\<`any`\>\>

Defined in: home4strays-backend/src/database/queries/ngo.ts:379

Deletes an NGO by its email address.
This method removes an NGO record from the database based on the email field.

#### Parameters

##### db

[`DatabaseManager`](/docs/code/backend/database/db/classes/databasemanager/)

The database manager instance used to execute the query.

##### email

`string`

Email of the NGO to be deleted.

#### Returns

`Promise`\<`QueryResult`\<`any`\>\>

A promise that resolves to void after the deletion.

***

### deleteById()

> `static` **deleteById**(`db`, `id`): `Promise`\<`void`\>

Defined in: home4strays-backend/src/database/queries/ngo.ts:410

Deletes an NGO by its ID.
This method removes an NGO record from the database based on the ID field.

#### Parameters

##### db

[`DatabaseManager`](/docs/code/backend/database/db/classes/databasemanager/)

The database manager instance used to execute the query.

##### id

`string`

ID of the NGO to be deleted.

#### Returns

`Promise`\<`void`\>

A promise that resolves to void after the deletion.

***

### deleteByName()

> `static` **deleteByName**(`db`, `name`): `Promise`\<`void`\>

Defined in: home4strays-backend/src/database/queries/ngo.ts:421

Deletes an NGO by its name.
This method removes an NGO record from the database based on the name field.

#### Parameters

##### db

[`DatabaseManager`](/docs/code/backend/database/db/classes/databasemanager/)

The database manager instance used to execute the query.

##### name

`string`

Name of the NGO to be deleted.

#### Returns

`Promise`\<`void`\>

A promise that resolves to void after the deletion.

***

### deleteByNameAndCountry()

> `static` **deleteByNameAndCountry**(`db`, `name`, `country`): `Promise`\<`void`\>

Defined in: home4strays-backend/src/database/queries/ngo.ts:392

Deletes an NGO by its name and country.
This method removes an NGO record from the database based on the name and country fields.

#### Parameters

##### db

[`DatabaseManager`](/docs/code/backend/database/db/classes/databasemanager/)

The database manager instance used to execute the query.

##### name

`string`

Name of the NGO to be deleted.

##### country

`string`

Country of the NGO to be deleted.

#### Returns

`Promise`\<`void`\>

A promise that resolves to void after the deletion.

***

### deleteNgoLogoPic()

> `static` **deleteNgoLogoPic**(`db`, `ngoId`): `Promise`\<`void`\>

Defined in: home4strays-backend/src/database/queries/ngo.ts:456

Deletes the logo picture path and link for an NGO by its ID.
This method removes the logo information from an NGO record based on its ID.

#### Parameters

##### db

[`DatabaseManager`](/docs/code/backend/database/db/classes/databasemanager/)

The database manager instance used to execute the query.

##### ngoId

`string`

ID of the NGO.

#### Returns

`Promise`\<`void`\>

A promise that resolves to void after the deletion.

***

### insert()

> `static` **insert**(`db`, `ngo`): `Promise`\<`boolean`\>

Defined in: home4strays-backend/src/database/queries/ngo.ts:292

Inserts a new NGO into the database.
This method inserts a new NGO record into the database and returns a boolean indicating success.

#### Parameters

##### db

[`DatabaseManager`](/docs/code/backend/database/db/classes/databasemanager/)

The database manager instance used to execute the query.

##### ngo

[`NGO`](/docs/code/backend/models/db-models/ngo/classes/ngo/)

NGO object containing the data to be inserted.

#### Returns

`Promise`\<`boolean`\>

A promise that resolves to true if the insertion was successful.

#### Throws

DBInsertError if the insertion fails (e.g., duplicate ID).

***

### select()

> `static` **select**(`db`): `Promise`\<`undefined` \| [`NGO`](/docs/code/backend/models/db-models/ngo/classes/ngo/)[]\>

Defined in: home4strays-backend/src/database/queries/ngo.ts:22

Retrieves all NGOs from the database.
This method fetches all NGO records and converts them to the NGO model class.

#### Parameters

##### db

[`DatabaseManager`](/docs/code/backend/database/db/classes/databasemanager/)

The database manager instance used to execute the query.

#### Returns

`Promise`\<`undefined` \| [`NGO`](/docs/code/backend/models/db-models/ngo/classes/ngo/)[]\>

A promise that resolves to an array of NGO objects or undefined if no records are found.

***

### selectAllNGOsWithHours()

> `static` **selectAllNGOsWithHours**(`db`, `lang`): `Promise`\<`undefined` \| [`FullNGO`](/docs/code/backend/models/db-models/ngo/classes/fullngo/)[]\>

Defined in: home4strays-backend/src/database/queries/ngo.ts:48

Retrieves all NGOs along with their associated hours data.
This method first fetches all NGO records, then retrieves hours data for each NGO using the NGOHoursQueries.

#### Parameters

##### db

[`DatabaseManager`](/docs/code/backend/database/db/classes/databasemanager/)

The database manager instance used to execute the query.

##### lang

`string`

Language code for localization of hours data.

#### Returns

`Promise`\<`undefined` \| [`FullNGO`](/docs/code/backend/models/db-models/ngo/classes/fullngo/)[]\>

A promise that resolves to an array of FullNGO objects (NGO with hours data) or undefined if no records are found.

***

### selectAllNGOsWithHoursByList()

> `static` **selectAllNGOsWithHoursByList**(`db`, `ngos`, `lang`): `Promise`\<`undefined` \| [`FullNGO`](/docs/code/backend/models/db-models/ngo/classes/fullngo/)[]\>

Defined in: home4strays-backend/src/database/queries/ngo.ts:90

Retrieves all NGOs with hours data by a provided list of NGO objects.
This method takes an array of NGO objects and attaches their hours data using the NGOHoursQueries.

#### Parameters

##### db

[`DatabaseManager`](/docs/code/backend/database/db/classes/databasemanager/)

The database manager instance used to execute the query.

##### ngos

[`NGO`](/docs/code/backend/models/db-models/ngo/classes/ngo/)[]

Array of NGO objects to process.

##### lang

`string`

Language code for localization of hours data.

#### Returns

`Promise`\<`undefined` \| [`FullNGO`](/docs/code/backend/models/db-models/ngo/classes/fullngo/)[]\>

A promise that resolves to an array of FullNGO objects (NGO with hours data) or undefined if no records are found.

***

### selectById()

> `static` **selectById**(`db`, `ngoId`): `Promise`\<`undefined` \| [`NGO`](/docs/code/backend/models/db-models/ngo/classes/ngo/)\>

Defined in: home4strays-backend/src/database/queries/ngo.ts:256

Retrieves one NGO by its ID.
This method fetches an NGO record by its ID and returns it as an NGO object.

#### Parameters

##### db

[`DatabaseManager`](/docs/code/backend/database/db/classes/databasemanager/)

The database manager instance used to execute the query.

##### ngoId

`string`

ID of the NGO.

#### Returns

`Promise`\<`undefined` \| [`NGO`](/docs/code/backend/models/db-models/ngo/classes/ngo/)\>

A promise that resolves to an NGO object or undefined if no record is found.

***

### selectByNameAndCountry()

> `static` **selectByNameAndCountry**(`db`, `name`, `country`): `Promise`\<`undefined` \| [`NGO`](/docs/code/backend/models/db-models/ngo/classes/ngo/)\>

Defined in: home4strays-backend/src/database/queries/ngo.ts:477

Retrieves an NGO by its name and country.
This method fetches an NGO record based on the provided name and country.

#### Parameters

##### db

[`DatabaseManager`](/docs/code/backend/database/db/classes/databasemanager/)

The database manager instance used to execute the query.

##### name

`string`

Name of the NGO.

##### country

`string`

Country of the NGO.

#### Returns

`Promise`\<`undefined` \| [`NGO`](/docs/code/backend/models/db-models/ngo/classes/ngo/)\>

A promise that resolves to an NGO object or undefined if no record is found.

***

### selectLogo()

> `static` **selectLogo**(`db`, `id`): `Promise`\<[`NGO`](/docs/code/backend/models/db-models/ngo/classes/ngo/)\>

Defined in: home4strays-backend/src/database/queries/ngo.ts:150

Retrieves the logo information of an NGO by its ID.
This method fetches the logo picture path and link from the database for the specified NGO ID.

#### Parameters

##### db

[`DatabaseManager`](/docs/code/backend/database/db/classes/databasemanager/)

The database manager instance used to execute the query.

##### id

`string`

ID of the NGO.

#### Returns

`Promise`\<[`NGO`](/docs/code/backend/models/db-models/ngo/classes/ngo/)\>

A promise that resolves to an NGO object containing its logo information.

***

### selectNGOByUserId()

> `static` **selectNGOByUserId**(`db`, `userLinkedToNGO`): `Promise`\<[`NGO`](/docs/code/backend/models/db-models/ngo/classes/ngo/)\>

Defined in: home4strays-backend/src/database/queries/ngo.ts:221

Retrieves an NGO by a user's ID linked to the NGO.
This method finds an NGO associated with a specific user ID through the ngo_member table.

#### Parameters

##### db

[`DatabaseManager`](/docs/code/backend/database/db/classes/databasemanager/)

The database manager instance used to execute the query.

##### userLinkedToNGO

`string`

User ID linked to the NGO.

#### Returns

`Promise`\<[`NGO`](/docs/code/backend/models/db-models/ngo/classes/ngo/)\>

A promise that resolves to an NGO object associated with the user ID.

#### Throws

NGONotFoundError if no NGO is found for the user ID.

***

### selectSecurely()

> `static` **selectSecurely**(`db`): `Promise`\<[`NGO`](/docs/code/backend/models/db-models/ngo/classes/ngo/)[]\>

Defined in: home4strays-backend/src/database/queries/ngo.ts:197

Retrieves all NGO data securely, excluding confidential fields like logo and verification documents.
This method fetches NGO data while omitting sensitive information such as logo paths and verification document paths.

#### Parameters

##### db

[`DatabaseManager`](/docs/code/backend/database/db/classes/databasemanager/)

The database manager instance used to execute the query.

#### Returns

`Promise`\<[`NGO`](/docs/code/backend/models/db-models/ngo/classes/ngo/)[]\>

A promise that resolves to an array of NGO objects with secure data.

***

### selectUnverifiedNGOs()

> `static` **selectUnverifiedNGOs**(`db`): `Promise`\<[`NGO`](/docs/code/backend/models/db-models/ngo/classes/ngo/)[]\>

Defined in: home4strays-backend/src/database/queries/ngo.ts:174

Retrieves all unverified NGOs from the database.
This method queries the database for NGOs that have not been verified.

#### Parameters

##### db

[`DatabaseManager`](/docs/code/backend/database/db/classes/databasemanager/)

The database manager instance used to execute the query.

#### Returns

`Promise`\<[`NGO`](/docs/code/backend/models/db-models/ngo/classes/ngo/)[]\>

A promise that resolves to an array of NGO objects representing unverified NGOs.

***

### selectVerificationStatusByNGO()

> `static` **selectVerificationStatusByNGO**(`db`, `name`, `country`): `Promise`\<[`NGO`](/docs/code/backend/models/db-models/ngo/classes/ngo/)\>

Defined in: home4strays-backend/src/database/queries/ngo.ts:120

Retrieves the verification status of an NGO by name and country.
This method queries the database for an NGO record matching the provided name and country, then returns its verification status.

#### Parameters

##### db

[`DatabaseManager`](/docs/code/backend/database/db/classes/databasemanager/)

The database manager instance used to execute the query.

##### name

`string`

Name of the NGO.

##### country

`string`

Country of the NGO.

#### Returns

`Promise`\<[`NGO`](/docs/code/backend/models/db-models/ngo/classes/ngo/)\>

A promise that resolves to an NGO object containing its verification status.

#### Throws

NGONotFoundError if no NGO is found with
the provided name and country.

***

### updateAsVerified()

> `static` **updateAsVerified**(`db`, `name`, `country`): `Promise`\<`void`\>

Defined in: home4strays-backend/src/database/queries/ngo.ts:332

Verifies an NGO by its name and country.
This method updates the 'verified' status of an NGO to true based on name and country.

#### Parameters

##### db

[`DatabaseManager`](/docs/code/backend/database/db/classes/databasemanager/)

The database manager instance used to execute the query.

##### name

`string`

Name of the NGO.

##### country

`string`

Country of the NGO.

#### Returns

`Promise`\<`void`\>

A promise that resolves to void after the update.

***

### updateNgoLogoPic()

> `static` **updateNgoLogoPic**(`db`, `ngoId`, `logoPicturePath`, `logoPictureLink`): `Promise`\<`void`\>

Defined in: home4strays-backend/src/database/queries/ngo.ts:434

Updates the logo picture path and link for an NGO by its ID.
This method updates the logo information of an NGO based on its ID.

#### Parameters

##### db

[`DatabaseManager`](/docs/code/backend/database/db/classes/databasemanager/)

The database manager instance used to execute the query.

##### ngoId

`string`

ID of the NGO.

##### logoPicturePath

`string`

New logo picture path.

##### logoPictureLink

`string`

New logo picture link.

#### Returns

`Promise`\<`void`\>

A promise that resolves to void after the update.

***

### updateOnId()

> `static` **updateOnId**(`db`, `ngoData`): `Promise`\<`void`\>

Defined in: home4strays-backend/src/database/queries/ngo.ts:350

Updates specific fields of an NGO by its ID.
This method updates the email, phone number, member count, website, and mission of an NGO based on its ID.

#### Parameters

##### db

[`DatabaseManager`](/docs/code/backend/database/db/classes/databasemanager/)

The database manager instance used to execute the query.

##### ngoData

[`NGO`](/docs/code/backend/models/db-models/ngo/classes/ngo/)

NGO object containing the updated data.

#### Returns

`Promise`\<`void`\>

A promise that resolves to void after the update.
