---
editUrl: false
next: false
prev: false
title: "FullTextSearchIndizesMigration"
---

Defined in: home4strays-backend/src/database/migrations/create-fulltext-search-indizes-migration.ts:6

Migration interface defining the contract for database migration operations
Implementations must provide both forward and reverse migration capabilities
to ensure database schema can be evolved and rolled back safely

## Implements

- [`default`](/docs/code/backend/database/migrations/migrations/interfaces/default/)

## Constructors

### Constructor

> **new FullTextSearchIndizesMigration**(): `FullTextSearchIndizesMigration`

#### Returns

`FullTextSearchIndizesMigration`

## Methods

### createPetIndizes()

> **createPetIndizes**(`db`, `migrations`): `void`

Defined in: home4strays-backend/src/database/migrations/create-fulltext-search-indizes-migration.ts:7

#### Parameters

##### db

[`DatabaseManager`](/docs/code/backend/database/db/classes/databasemanager/)

##### migrations

`string`[]

#### Returns

`void`

***

### migrate()

> **migrate**(`db`): `Promise`\<`void`\>

Defined in: home4strays-backend/src/database/migrations/create-fulltext-search-indizes-migration.ts:171

Applies the migration to the database
This method should implement the logic to modify the database schema
according to the migration's requirements

#### Parameters

##### db

[`DatabaseManager`](/docs/code/backend/database/db/classes/databasemanager/)

DatabaseManager instance providing access to database operations

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`default`](/docs/code/backend/database/migrations/migrations/interfaces/default/).[`migrate`](/docs/code/backend/database/migrations/migrations/interfaces/default/#migrate)

***

### rollback()

> **rollback**(`db`): `Promise`\<`void`\>

Defined in: home4strays-backend/src/database/migrations/create-fulltext-search-indizes-migration.ts:211

Reverts the migration changes to the database
This method should implement the logic to undo the changes made by the
migrate method, restoring the database to its previous state

#### Parameters

##### db

[`DatabaseManager`](/docs/code/backend/database/db/classes/databasemanager/)

DatabaseManager instance providing access to database operations

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`default`](/docs/code/backend/database/migrations/migrations/interfaces/default/).[`rollback`](/docs/code/backend/database/migrations/migrations/interfaces/default/#rollback)
