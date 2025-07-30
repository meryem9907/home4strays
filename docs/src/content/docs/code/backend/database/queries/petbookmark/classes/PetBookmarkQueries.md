---
editUrl: false
next: false
prev: false
title: "PetBookmarkQueries"
---

Defined in: home4strays-backend/src/database/queries/petbookmark.ts:10

Manages database queries related to pet bookmarks.
Provides static methods to interact with the pet_bookmark table.

## Constructors

### Constructor

> **new PetBookmarkQueries**(): `PetBookmarkQueries`

#### Returns

`PetBookmarkQueries`

## Methods

### select()

> `static` **select**(`db`): `Promise`\<[`default`](/docs/code/backend/models/db-models/petbookmark/classes/default/)[]\>

Defined in: home4strays-backend/src/database/queries/petbookmark.ts:20

Retrieves all pet bookmarks from the database.
Executes a SELECT query on the pet_bookmark table,
converts the result keys to camel case for compatibility with the PetBookmark class,
and maps the data to instances of the PetBookmark class.

#### Parameters

##### db

[`DatabaseManager`](/docs/code/backend/database/db/classes/databasemanager/)

DatabaseManager instance used to execute the query.

#### Returns

`Promise`\<[`default`](/docs/code/backend/models/db-models/petbookmark/classes/default/)[]\>

A promise that resolves to an array of PetBookmark objects.
