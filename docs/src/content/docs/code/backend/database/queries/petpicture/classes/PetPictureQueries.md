---
editUrl: false
next: false
prev: false
title: "PetPictureQueries"
---

Defined in: home4strays-backend/src/database/queries/petpicture.ts:10

Manages database operations for pet pictures
Provides methods to interact with the pet_picture table

## Constructors

### Constructor

> **new PetPictureQueries**(): `PetPictureQueries`

#### Returns

`PetPictureQueries`

## Methods

### deleteByPicturePath()

> `static` **deleteByPicturePath**(`db`, `picturePath`): `Promise`\<`void`\>

Defined in: home4strays-backend/src/database/queries/petpicture.ts:103

Deletes a pet picture by its picture path

#### Parameters

##### db

[`DatabaseManager`](/docs/code/backend/database/db/classes/databasemanager/)

Database connection manager

##### picturePath

`string`

Unique identifier for the picture path

#### Returns

`Promise`\<`void`\>

#### Throws

Error if database operation fails

***

### insert()

> `static` **insert**(`db`, `petPicture`): `Promise`\<`void`\>

Defined in: home4strays-backend/src/database/queries/petpicture.ts:17

Inserts a new pet picture into the database

#### Parameters

##### db

[`DatabaseManager`](/docs/code/backend/database/db/classes/databasemanager/)

Database connection manager

##### petPicture

[`default`](/docs/code/backend/models/db-models/petpicture/classes/default/)

PetPicture object containing picture data

#### Returns

`Promise`\<`void`\>

#### Throws

Error if database operation fails

***

### selectByPetId()

> `static` **selectByPetId**(`db`, `petId`): `Promise`\<[`default`](/docs/code/backend/models/db-models/petpicture/classes/default/)[]\>

Defined in: home4strays-backend/src/database/queries/petpicture.ts:35

Retrieves all pet pictures associated with a specific pet ID

#### Parameters

##### db

[`DatabaseManager`](/docs/code/backend/database/db/classes/databasemanager/)

Database connection manager

##### petId

`string`

Identifier for the pet

#### Returns

`Promise`\<[`default`](/docs/code/backend/models/db-models/petpicture/classes/default/)[]\>

Array of PetPicture objects

#### Throws

Error if database operation fails

***

### selectByPictureLink()

> `static` **selectByPictureLink**(`db`, `petId`, `pictureLink`): `Promise`\<[`default`](/docs/code/backend/models/db-models/petpicture/classes/default/)\>

Defined in: home4strays-backend/src/database/queries/petpicture.ts:59

Retrieves a pet picture by its picture link and pet ID

#### Parameters

##### db

[`DatabaseManager`](/docs/code/backend/database/db/classes/databasemanager/)

Database connection manager

##### petId

`string`

Identifier for the pet

##### pictureLink

`string`

Unique identifier for the picture

#### Returns

`Promise`\<[`default`](/docs/code/backend/models/db-models/petpicture/classes/default/)\>

PetPicture object if found, null otherwise

#### Throws

Error if database operation fails

***

### update()

> `static` **update**(`db`, `petPicture`): `Promise`\<`void`\>

Defined in: home4strays-backend/src/database/queries/petpicture.ts:84

Updates an existing pet picture in the database

#### Parameters

##### db

[`DatabaseManager`](/docs/code/backend/database/db/classes/databasemanager/)

Database connection manager

##### petPicture

`Partial`\<[`default`](/docs/code/backend/models/db-models/petpicture/classes/default/)\> & `object`

Partial PetPicture object containing updated data

#### Returns

`Promise`\<`void`\>

#### Throws

Error if database operation fails

#### Note

Uses COALESCE to preserve existing values when fields are not provided
