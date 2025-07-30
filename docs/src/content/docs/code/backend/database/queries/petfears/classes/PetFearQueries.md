---
editUrl: false
next: false
prev: false
title: "PetFearQueries"
---

Defined in: home4strays-backend/src/database/queries/petfears.ts:11

Class containing database query operations for managing pet fears data
This class provides static methods to interact with the pet_fears table
in the database, handling data transformation and type mapping

## Constructors

### Constructor

> **new PetFearQueries**(): `PetFearQueries`

#### Returns

`PetFearQueries`

## Methods

### select()

> `static` **select**(`db`): `Promise`\<[`default`](/docs/code/backend/models/db-models/petfears/classes/default/)[]\>

Defined in: home4strays-backend/src/database/queries/petfears.ts:27

Retrieves all pet fears records from the database

#### Parameters

##### db

[`DatabaseManager`](/docs/code/backend/database/db/classes/databasemanager/)

Database connection manager instance

#### Returns

`Promise`\<[`default`](/docs/code/backend/models/db-models/petfears/classes/default/)[]\>

Promise resolving to an array of PetFears objects

#### Description

This method executes a SELECT query on the pet_fears table to retrieve
all records. The results undergo two transformation steps:
1. Key case conversion from snake_case to camelCase using convertKeysToCamelCase
2. Type mapping to PetFears class instances using class-transformer

The query returns pet_id, fear, and info fields which are mapped to
the PetFears class properties
