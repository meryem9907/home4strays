---
editUrl: false
next: false
prev: false
title: "SearchQueries"
---

Defined in: home4strays-backend/src/database/queries/search.ts:23

A utility class for performing full-text searches across different entities.
This class handles translation of search queries to English for cross-language searches,
and provides translated results based on the requested language.

## Constructors

### Constructor

> **new SearchQueries**(): `SearchQueries`

#### Returns

`SearchQueries`

## Methods

### searchCaretaker()

> `static` **searchCaretaker**(`db`, `query`, `location`, `lang`): `Promise`\<`undefined` \| [`FullCaretaker`](/docs/code/backend/models/db-models/caretaker/classes/fullcaretaker/)[]\>

Defined in: home4strays-backend/src/database/queries/search.ts:168

Searches for caretakers matching the query and location criteria.
Translates the query to English if the requested language is not English.
Returns caretakers with additional information and translated fields based on the requested language.

#### Parameters

##### db

[`DatabaseManager`](/docs/code/backend/database/db/classes/databasemanager/)

Database manager instance for executing queries

##### query

`string`

The search query string

##### location

Optional location filter for search results

`undefined` | `string`

##### lang

`string` = `"en"`

Language code for translation and result formatting (default: 'en')

#### Returns

`Promise`\<`undefined` \| [`FullCaretaker`](/docs/code/backend/models/db-models/caretaker/classes/fullcaretaker/)[]\>

Array of FullCaretaker objects with translated fields, or undefined if no results

***

### searchNGO()

> `static` **searchNGO**(`db`, `query`, `location`, `lang`): `Promise`\<`undefined` \| [`FullNGO`](/docs/code/backend/models/db-models/ngo/classes/fullngo/)[]\>

Defined in: home4strays-backend/src/database/queries/search.ts:121

Searches for NGOs matching the query and location criteria.
Translates the query to English if the requested language is not English.
Returns NGOs with additional information and translated fields based on the requested language.

#### Parameters

##### db

[`DatabaseManager`](/docs/code/backend/database/db/classes/databasemanager/)

Database manager instance for executing queries

##### query

`string`

The search query string

##### location

Optional location filter for search results

`undefined` | `string`

##### lang

`string` = `"en"`

Language code for translation and result formatting (default: 'en')

#### Returns

`Promise`\<`undefined` \| [`FullNGO`](/docs/code/backend/models/db-models/ngo/classes/fullngo/)[]\>

Array of FullNGO objects with translated fields, or undefined if no results

***

### searchPet()

> `static` **searchPet**(`db`, `query`, `location`, `lang`): `Promise`\<`undefined` \| [`Pet`](/docs/code/backend/models/db-models/pet/classes/pet/)[]\>

Defined in: home4strays-backend/src/database/queries/search.ts:35

Searches for pets matching the query and location criteria.
Translates the query to English if the requested language is not English.
Returns pets with breed information and translated fields based on the requested language.

#### Parameters

##### db

[`DatabaseManager`](/docs/code/backend/database/db/classes/databasemanager/)

Database manager instance for executing queries

##### query

`string`

The search query string

##### location

Optional location filter for search results

`undefined` | `string`

##### lang

`string` = `"en"`

Language code for translation and result formatting (default: 'en')

#### Returns

`Promise`\<`undefined` \| [`Pet`](/docs/code/backend/models/db-models/pet/classes/pet/)[]\>

Array of PetWithBreed objects with translated fields, or undefined if no results
