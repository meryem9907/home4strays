---
editUrl: false
next: false
prev: false
title: "PetVaccinationQueries"
---

Defined in: home4strays-backend/src/database/queries/petvaccination.ts:10

Manages database queries for pet vaccination records
Provides methods to retrieve vaccination data from the database

## Constructors

### Constructor

> **new PetVaccinationQueries**(): `PetVaccinationQueries`

#### Returns

`PetVaccinationQueries`

## Methods

### select()

> `static` **select**(`db`): `Promise`\<[`default`](/docs/code/backend/models/db-models/petvaccination/classes/default/)[]\>

Defined in: home4strays-backend/src/database/queries/petvaccination.ts:21

Retrieves all pet vaccination records from the database

#### Parameters

##### db

[`DatabaseManager`](/docs/code/backend/database/db/classes/databasemanager/)

Database connection manager

#### Returns

`Promise`\<[`default`](/docs/code/backend/models/db-models/petvaccination/classes/default/)[]\>

Promise resolving to an array of PetVaccination objects

This method executes a SELECT query on the pet_vaccination table,
converts the result keys to camelCase format, and maps the data
to PetVaccination class instances using class-transformer

***

### selectById()

> `static` **selectById**(`db`, `id`): `Promise`\<[`default`](/docs/code/backend/models/db-models/petvaccination/classes/default/)[]\>

Defined in: home4strays-backend/src/database/queries/petvaccination.ts:44

Retrieves vaccination records for a specific pet by ID

#### Parameters

##### db

[`DatabaseManager`](/docs/code/backend/database/db/classes/databasemanager/)

Database connection manager

##### id

`string`

Pet ID to filter vaccinations by

#### Returns

`Promise`\<[`default`](/docs/code/backend/models/db-models/petvaccination/classes/default/)[]\>

Promise resolving to an array of PetVaccination objects

This method executes a SELECT query with a WHERE clause filtering
by pet_id, converts the result keys to camelCase format, and maps
the data to PetVaccination class instances using class-transformer
The query uses parameterized SQL to prevent SQL injection
