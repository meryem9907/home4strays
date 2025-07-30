---
editUrl: false
next: false
prev: false
title: "PetDiseaseQueries"
---

Defined in: home4strays-backend/src/database/queries/petdisease.ts:11

Provides query operations for managing pet disease data in the database
This class encapsulates database operations related to pet disease records
All methods are static and can be called without instantiating the class

## Constructors

### Constructor

> **new PetDiseaseQueries**(): `PetDiseaseQueries`

#### Returns

`PetDiseaseQueries`

## Methods

### select()

> `static` **select**(`db`): `Promise`\<[`default`](/docs/code/backend/models/db-models/petdisease/classes/default/)[]\>

Defined in: home4strays-backend/src/database/queries/petdisease.ts:20

Selects all pet disease records from the database
Executes a SQL query to retrieve all pet disease entries
Converts database results to camelCase keys and instantiates PetDisease objects

#### Parameters

##### db

[`DatabaseManager`](/docs/code/backend/database/db/classes/databasemanager/)

DatabaseManager instance for executing database operations

#### Returns

`Promise`\<[`default`](/docs/code/backend/models/db-models/petdisease/classes/default/)[]\>

Promise resolving to an array of PetDisease instances
