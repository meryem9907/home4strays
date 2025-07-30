---
editUrl: false
next: false
prev: false
title: "SpeciesTranslationQueries"
---

Defined in: home4strays-backend/src/database/queries/speciestranslation.ts:10

Class containing query methods for interacting with the species translation database table.
Provides methods to retrieve translated species data with proper type conversion and formatting.

## Constructors

### Constructor

> **new SpeciesTranslationQueries**(): `SpeciesTranslationQueries`

#### Returns

`SpeciesTranslationQueries`

## Methods

### select()

> `static` **select**(`db`): `Promise`\<[`default`](/docs/code/backend/models/db-models/speciestranslation/classes/default/)[]\>

Defined in: home4strays-backend/src/database/queries/speciestranslation.ts:23

Retrieves all translated species records from the database.

#### Parameters

##### db

[`DatabaseManager`](/docs/code/backend/database/db/classes/databasemanager/)

DatabaseManager instance used to execute the query

#### Returns

`Promise`\<[`default`](/docs/code/backend/models/db-models/speciestranslation/classes/default/)[]\>

Promise resolving to an array of SpeciesTranslation instances

This method:
1. Executes a SQL query to fetch all records from species_translation table
2. Converts the result keys to camel case format
3. Uses class-transformer to instantiate SpeciesTranslation objects
4. Returns the array of deserialized objects

***

### selectAllTranslatedSpecies()

> `static` **selectAllTranslatedSpecies**(`db`, `lang`): `Promise`\<[`default`](/docs/code/backend/models/db-models/speciestranslation/classes/default/)[]\>

Defined in: home4strays-backend/src/database/queries/speciestranslation.ts:48

Retrieves all distinct translated species names for a specific language.

#### Parameters

##### db

[`DatabaseManager`](/docs/code/backend/database/db/classes/databasemanager/)

DatabaseManager instance used to execute the query

##### lang

`string` = `"en"`

Language code filter (default: "en")

#### Returns

`Promise`\<[`default`](/docs/code/backend/models/db-models/speciestranslation/classes/default/)[]\>

Promise resolving to an array of SpeciesTranslation instances

This method:
1. Executes a SQL query joining species_translation with Breed table
2. Filters results by the specified language code
3. Converts the result keys to camel case format
4. Uses class-transformer to instantiate SpeciesTranslation objects
5. Returns the array of deserialized objects

***

### selectTranslatedSpecies()

> `static` **selectTranslatedSpecies**(`db`, `species`, `lang`): `Promise`\<[`default`](/docs/code/backend/models/db-models/speciestranslation/classes/default/)\>

Defined in: home4strays-backend/src/database/queries/speciestranslation.ts:80

Retrieves a specific translated species name for a given language.

#### Parameters

##### db

[`DatabaseManager`](/docs/code/backend/database/db/classes/databasemanager/)

DatabaseManager instance used to execute the query

##### species

`string`

Species identifier to filter by

##### lang

`string` = `"en"`

Language code filter (default: "en")

#### Returns

`Promise`\<[`default`](/docs/code/backend/models/db-models/speciestranslation/classes/default/)\>

Promise resolving to a SpeciesTranslation instance

This method:
1. Executes a SQL query joining species_translation with Breed table
2. Filters results by both species identifier and language code
3. Converts the result keys to camel case format
4. Uses class-transformer to instantiate a SpeciesTranslation object
5. Returns the deserialized object (assuming single result)
