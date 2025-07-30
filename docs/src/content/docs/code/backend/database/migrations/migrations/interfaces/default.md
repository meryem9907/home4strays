---
editUrl: false
next: false
prev: false
title: "default"
---

Defined in: home4strays-backend/src/database/migrations/migrations.ts:13

Migration interface defining the contract for database migration operations
Implementations must provide both forward and reverse migration capabilities
to ensure database schema can be evolved and rolled back safely

## Methods

### migrate()

> **migrate**(`db`): `void`

Defined in: home4strays-backend/src/database/migrations/migrations.ts:20

Applies the migration to the database
This method should implement the logic to modify the database schema
according to the migration's requirements

#### Parameters

##### db

[`DatabaseManager`](/docs/code/backend/database/db/classes/databasemanager/)

DatabaseManager instance providing access to database operations

#### Returns

`void`

***

### rollback()

> **rollback**(`db`): `void`

Defined in: home4strays-backend/src/database/migrations/migrations.ts:28

Reverts the migration changes to the database
This method should implement the logic to undo the changes made by the
migrate method, restoring the database to its previous state

#### Parameters

##### db

[`DatabaseManager`](/docs/code/backend/database/db/classes/databasemanager/)

DatabaseManager instance providing access to database operations

#### Returns

`void`
