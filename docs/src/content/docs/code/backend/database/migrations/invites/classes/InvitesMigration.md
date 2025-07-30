---
editUrl: false
next: false
prev: false
title: "InvitesMigration"
---

Defined in: home4strays-backend/src/database/migrations/invites.ts:13

Represents a database migration for managing invite-related tables.
This class handles the creation, migration, and rollback operations for the invite table.

## Implements

- [`default`](/docs/code/backend/database/migrations/migrations/interfaces/default/)

## Constructors

### Constructor

> **new InvitesMigration**(): `InvitesMigration`

#### Returns

`InvitesMigration`

## Methods

### createInviteTable()

> **createInviteTable**(`db`, `migrations`): `void`

Defined in: home4strays-backend/src/database/migrations/invites.ts:22

Creates the invite table with specified schema.
This method constructs the SQL statement for creating the invite table
with columns for user_id, ngo_id, invite, and email, including foreign key constraints.

#### Parameters

##### db

[`DatabaseManager`](/docs/code/backend/database/db/classes/databasemanager/)

The database manager instance used to execute the migration.

##### migrations

`string`[]

An array to collect the SQL statements for the migration.

#### Returns

`void`

***

### migrate()

> **migrate**(`db`): `Promise`\<`void`\>

Defined in: home4strays-backend/src/database/migrations/invites.ts:38

Executes the migration for the invite table.
This method handles the transactional migration process, including
creating the invite table and handling any errors that occur during migration.

#### Parameters

##### db

[`DatabaseManager`](/docs/code/backend/database/db/classes/databasemanager/)

The database manager instance used to execute the migration.

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`default`](/docs/code/backend/database/migrations/migrations/interfaces/default/).[`migrate`](/docs/code/backend/database/migrations/migrations/interfaces/default/#migrate)

***

### rollback()

> **rollback**(`db`): `Promise`\<`void`\>

Defined in: home4strays-backend/src/database/migrations/invites.ts:79

Rolls back the migration by dropping the invite table.
This method is used to revert the database schema to its previous state
by removing the invite table if it exists.

#### Parameters

##### db

[`DatabaseManager`](/docs/code/backend/database/db/classes/databasemanager/)

The database manager instance used to execute the rollback.

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`default`](/docs/code/backend/database/migrations/migrations/interfaces/default/).[`rollback`](/docs/code/backend/database/migrations/migrations/interfaces/default/#rollback)
