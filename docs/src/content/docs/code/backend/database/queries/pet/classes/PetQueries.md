---
editUrl: false
next: false
prev: false
title: "PetQueries"
---

Defined in: home4strays-backend/src/database/queries/pet.ts:23

Class containing static methods for querying Pet data from the database.

## Constructors

### Constructor

> **new PetQueries**(): `PetQueries`

#### Returns

`PetQueries`

## Methods

### deleteById()

> `static` **deleteById**(`db`, `id`): `Promise`\<`void`\>

Defined in: home4strays-backend/src/database/queries/pet.ts:378

Deletes a pet from the database by ID.

#### Parameters

##### db

[`DatabaseManager`](/docs/code/backend/database/db/classes/databasemanager/)

DatabaseManager instance for executing queries.

##### id

`string`

ID of the pet to delete.

#### Returns

`Promise`\<`void`\>

***

### deleteByName()

> `static` **deleteByName**(`db`, `name`): `Promise`\<`void`\>

Defined in: home4strays-backend/src/database/queries/pet.ts:388

Deletes a pet from the database by name.

#### Parameters

##### db

[`DatabaseManager`](/docs/code/backend/database/db/classes/databasemanager/)

DatabaseManager instance for executing queries.

##### name

`string`

Name of the pet to delete.

#### Returns

`Promise`\<`void`\>

Promise resolving to void.

***

### deletePetById()

> `static` **deletePetById**(`db`, `id`): `Promise`\<`void`\>

Defined in: home4strays-backend/src/database/queries/pet.ts:315

Deletes a pet from the database by ID.

#### Parameters

##### db

[`DatabaseManager`](/docs/code/backend/database/db/classes/databasemanager/)

DatabaseManager instance for executing queries.

##### id

`string`

ID of the pet to delete.

#### Returns

`Promise`\<`void`\>

***

### deletePetProfilePic()

> `static` **deletePetProfilePic**(`db`, `petId`): `Promise`\<`void`\>

Defined in: home4strays-backend/src/database/queries/pet.ts:422

Deletes a pet's profile picture information from the database.

#### Parameters

##### db

[`DatabaseManager`](/docs/code/backend/database/db/classes/databasemanager/)

DatabaseManager instance for executing queries.

##### petId

`string`

ID of the pet to update.

#### Returns

`Promise`\<`void`\>

Promise resolving to void.

***

### insert()

> `static` **insert**(`db`, `pet`, `lang`): `Promise`\<`void`\>

Defined in: home4strays-backend/src/database/queries/pet.ts:115

Inserts a new pet into the database.

#### Parameters

##### db

[`DatabaseManager`](/docs/code/backend/database/db/classes/databasemanager/)

DatabaseManager instance for executing queries.

##### pet

[`Pet`](/docs/code/backend/models/db-models/pet/classes/pet/)

Pet object containing the data to insert.

##### lang

`string` = `"en"`

Language code for translation, defaults to 'en'.

#### Returns

`Promise`\<`void`\>

***

### insertPetProfilePic()

> `static` **insertPetProfilePic**(`db`, `profilePicPath`, `profilePicLink`): `Promise`\<`void`\>

Defined in: home4strays-backend/src/database/queries/pet.ts:184

Inserts the profile picture information of a specific pet into the database.

#### Parameters

##### db

[`DatabaseManager`](/docs/code/backend/database/db/classes/databasemanager/)

DatabaseManager instance for executing queries.

##### profilePicPath

`string`

Path to the pet's profile picture.

##### profilePicLink

`string`

Link to the pet's profile picture.

#### Returns

`Promise`\<`void`\>

***

### select()

> `static` **select**(`db`, `lang`): `Promise`\<[`Pet`](/docs/code/backend/models/db-models/pet/classes/pet/)[]\>

Defined in: home4strays-backend/src/database/queries/pet.ts:30

Selects all pets from the database and returns them as an array of Pet objects.

#### Parameters

##### db

[`DatabaseManager`](/docs/code/backend/database/db/classes/databasemanager/)

DatabaseManager instance for executing queries.

##### lang

`string` = `"en"`

Language code for translation, defaults to 'en'.

#### Returns

`Promise`\<[`Pet`](/docs/code/backend/models/db-models/pet/classes/pet/)[]\>

Promise resolving to an array of Pet objects.

***

### selectByIdSecurely()

> `static` **selectByIdSecurely**(`db`, `petId`, `lang`): `Promise`\<[`Pet`](/docs/code/backend/models/db-models/pet/classes/pet/)\>

Defined in: home4strays-backend/src/database/queries/pet.ts:331

Selects all data from a pet except ProfilePicturePath by ID.

#### Parameters

##### db

[`DatabaseManager`](/docs/code/backend/database/db/classes/databasemanager/)

DatabaseManager instance for executing queries.

##### petId

`string`

ID of the pet to retrieve data for.

##### lang

`string` = `"en"`

Language code for translation, defaults to 'en'.

#### Returns

`Promise`\<[`Pet`](/docs/code/backend/models/db-models/pet/classes/pet/)\>

Promise resolving to a Pet object.

***

### selectMatchedPetsByCaretaker()

> `static` **selectMatchedPetsByCaretaker**(`db`, `caretakerId`, `lang`): `Promise`\<[`Pet`](/docs/code/backend/models/db-models/pet/classes/pet/)[]\>

Defined in: home4strays-backend/src/database/queries/pet.ts:205

Selects matched pets from a caretaker's perspective.

#### Parameters

##### db

[`DatabaseManager`](/docs/code/backend/database/db/classes/databasemanager/)

DatabaseManager instance for executing queries.

##### caretakerId

`string`

ID of the caretaker to find matched pets for.

##### lang

`string` = `"en"`

Language code for translation, defaults to 'en'.

#### Returns

`Promise`\<[`Pet`](/docs/code/backend/models/db-models/pet/classes/pet/)[]\>

Promise resolving to an array of Pet objects.

***

### selectProfilePicture()

> `static` **selectProfilePicture**(`db`, `petId`): `Promise`\<[`Pet`](/docs/code/backend/models/db-models/pet/classes/pet/)\>

Defined in: home4strays-backend/src/database/queries/pet.ts:85

Selects the profile picture information of a specific pet by ID.

#### Parameters

##### db

[`DatabaseManager`](/docs/code/backend/database/db/classes/databasemanager/)

DatabaseManager instance for executing queries.

##### petId

`string`

ID of the pet to retrieve profile picture data for.

#### Returns

`Promise`\<[`Pet`](/docs/code/backend/models/db-models/pet/classes/pet/)\>

Promise resolving to a Pet object containing profile picture data.

***

### selectSecurely()

> `static` **selectSecurely**(`db`, `lang`): `Promise`\<[`Pet`](/docs/code/backend/models/db-models/pet/classes/pet/)[]\>

Defined in: home4strays-backend/src/database/queries/pet.ts:261

Selects all data except ProfilePicturePath for pets.

#### Parameters

##### db

[`DatabaseManager`](/docs/code/backend/database/db/classes/databasemanager/)

DatabaseManager instance for executing queries.

##### lang

`string` = `"en"`

Language code for translation, defaults to 'en'.

#### Returns

`Promise`\<[`Pet`](/docs/code/backend/models/db-models/pet/classes/pet/)[]\>

Promise resolving to an array of Pet objects.

***

### updatePetProfilePic()

> `static` **updatePetProfilePic**(`db`, `petId`, `profilePicturePath`, `profilePictureLink`): `Promise`\<`void`\>

Defined in: home4strays-backend/src/database/queries/pet.ts:400

Updates a pet's profile picture information in the database.

#### Parameters

##### db

[`DatabaseManager`](/docs/code/backend/database/db/classes/databasemanager/)

DatabaseManager instance for executing queries.

##### petId

`string`

ID of the pet to update.

##### profilePicturePath

`string`

New path for the pet's profile picture.

##### profilePictureLink

`string`

New link for the pet's profile picture.

#### Returns

`Promise`\<`void`\>

Promise resolving to void.
