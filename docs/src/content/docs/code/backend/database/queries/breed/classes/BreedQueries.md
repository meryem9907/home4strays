---
editUrl: false
next: false
prev: false
title: "BreedQueries"
---

Defined in: home4strays-backend/src/database/queries/breed.ts:13

Class containing methods for querying breed-related data from the database.
This class provides static methods for selecting, inserting, and deleting breed records.
All queries are designed to work with the `breed` table and related translation data.

## Constructors

### Constructor

> **new BreedQueries**(): `BreedQueries`

#### Returns

`BreedQueries`

## Methods

### deleteByName()

> `static` **deleteByName**(`db`, `name`): `Promise`\<`void`\>

Defined in: home4strays-backend/src/database/queries/breed.ts:208

Deletes a breed by its name from the database.

#### Parameters

##### db

[`DatabaseManager`](/docs/code/backend/database/db/classes/databasemanager/)

DatabaseManager instance for executing queries.

##### name

`string`

Name of the breed to delete.

#### Returns

`Promise`\<`void`\>

Promise that resolves when the deletion is complete.

***

### insertBreed()

> `static` **insertBreed**(`db`, `species`, `name`, `information?`): `Promise`\<[`default`](/docs/code/backend/models/db-models/breed/classes/default/)\>

Defined in: home4strays-backend/src/database/queries/breed.ts:183

Inserts a new breed into the database.
Returns the inserted breed object with converted keys and mapped to the Breed class.

#### Parameters

##### db

[`DatabaseManager`](/docs/code/backend/database/db/classes/databasemanager/)

DatabaseManager instance for executing queries.

##### species

`string`

Species of the breed.

##### name

`string`

Name of the breed.

##### information?

`string`

Optional additional information about the breed.

#### Returns

`Promise`\<[`default`](/docs/code/backend/models/db-models/breed/classes/default/)\>

Promise resolving to the inserted Breed object.

***

### select()

> `static` **select**(`db`): `Promise`\<[`default`](/docs/code/backend/models/db-models/breed/classes/default/)[]\>

Defined in: home4strays-backend/src/database/queries/breed.ts:22

Retrieves all breeds from the database.
Converts query results to camelCase and maps them to the Breed class using class-transformer.

#### Parameters

##### db

[`DatabaseManager`](/docs/code/backend/database/db/classes/databasemanager/)

DatabaseManager instance for executing queries.

#### Returns

`Promise`\<[`default`](/docs/code/backend/models/db-models/breed/classes/default/)[]\>

Promise resolving to an array of Breed objects.

***

### selectBirdBreeds()

> `static` **selectBirdBreeds**(`db`): `Promise`\<[`default`](/docs/code/backend/models/db-models/breed/classes/default/)[]\>

Defined in: home4strays-backend/src/database/queries/breed.ts:75

Retrieves all bird breeds from the database.
Filters by species = 'Bird' and follows the same conversion and mapping process as select().

#### Parameters

##### db

[`DatabaseManager`](/docs/code/backend/database/db/classes/databasemanager/)

DatabaseManager instance for executing queries.

#### Returns

`Promise`\<[`default`](/docs/code/backend/models/db-models/breed/classes/default/)[]\>

Promise resolving to an array of Breed objects.

***

### selectBreedsBySpecies()

> `static` **selectBreedsBySpecies**(`db`, `species`, `language`): `Promise`\<[`default`](/docs/code/backend/models/db-models/breed/classes/default/)[]\>

Defined in: home4strays-backend/src/database/queries/breed.ts:143

Retrieves breed names filtered by species and language.
If the language is not English, it first translates the species name before querying.

#### Parameters

##### db

[`DatabaseManager`](/docs/code/backend/database/db/classes/databasemanager/)

DatabaseManager instance for executing queries.

##### species

`string`

Species name to filter breeds by.

##### language

`string` = `"en"`

Language code for translation (default is 'en').

#### Returns

`Promise`\<[`default`](/docs/code/backend/models/db-models/breed/classes/default/)[]\>

Promise resolving to an array of Breed objects.

***

### selectCatBreeds()

> `static` **selectCatBreeds**(`db`): `Promise`\<[`default`](/docs/code/backend/models/db-models/breed/classes/default/)[]\>

Defined in: home4strays-backend/src/database/queries/breed.ts:57

Retrieves all cat breeds from the database.
Filters by species = 'Cat' and follows the same conversion and mapping process as select().

#### Parameters

##### db

[`DatabaseManager`](/docs/code/backend/database/db/classes/databasemanager/)

DatabaseManager instance for executing queries.

#### Returns

`Promise`\<[`default`](/docs/code/backend/models/db-models/breed/classes/default/)[]\>

Promise resolving to an array of Breed objects.

***

### selectDogBreeds()

> `static` **selectDogBreeds**(`db`): `Promise`\<[`default`](/docs/code/backend/models/db-models/breed/classes/default/)[]\>

Defined in: home4strays-backend/src/database/queries/breed.ts:39

Retrieves all dog breeds from the database.
Filters by species = 'Dog' and follows the same conversion and mapping process as select().

#### Parameters

##### db

[`DatabaseManager`](/docs/code/backend/database/db/classes/databasemanager/)

DatabaseManager instance for executing queries.

#### Returns

`Promise`\<[`default`](/docs/code/backend/models/db-models/breed/classes/default/)[]\>

Promise resolving to an array of Breed objects.

***

### selectRodentBreeds()

> `static` **selectRodentBreeds**(`db`): `Promise`\<[`default`](/docs/code/backend/models/db-models/breed/classes/default/)[]\>

Defined in: home4strays-backend/src/database/queries/breed.ts:93

Retrieves all rodent breeds from the database.
Filters by species = 'Rodent' and follows the same conversion and mapping process as select().

#### Parameters

##### db

[`DatabaseManager`](/docs/code/backend/database/db/classes/databasemanager/)

DatabaseManager instance for executing queries.

#### Returns

`Promise`\<[`default`](/docs/code/backend/models/db-models/breed/classes/default/)[]\>

Promise resolving to an array of Breed objects.

***

### selectSpecies()

> `static` **selectSpecies**(`db`, `lang`): `Promise`\<[`default`](/docs/code/backend/models/db-models/speciestranslation/classes/default/)[] \| [`default`](/docs/code/backend/models/db-models/breed/classes/default/)[]\>

Defined in: home4strays-backend/src/database/queries/breed.ts:113

Retrieves species names based on language preference.
If language is not English, it fetches translated species names from the translation table.
Otherwise, it retrieves distinct species names from the breed table.

#### Parameters

##### db

[`DatabaseManager`](/docs/code/backend/database/db/classes/databasemanager/)

DatabaseManager instance for executing queries.

##### lang

`string` = `"en"`

Language code for translation (default is 'en').

#### Returns

`Promise`\<[`default`](/docs/code/backend/models/db-models/speciestranslation/classes/default/)[] \| [`default`](/docs/code/backend/models/db-models/breed/classes/default/)[]\>

Promise resolving to an array of SpeciesTranslation objects or Breed objects.
