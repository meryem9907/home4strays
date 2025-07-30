---
editUrl: false
next: false
prev: false
title: "default"
---

Defined in: home4strays-backend/src/database/migrations/migrations-manager.ts:13

Manages database migrations for application setup and data consistency.
This class orchestrates the execution of migration scripts in a defined order,
supporting both full migration workflows and test-specific migration scenarios.
It ensures database schema evolution while maintaining compatibility with
different environments and use cases.

## Constructors

### Constructor

> **new default**(): `MigrationsManager`

#### Returns

`MigrationsManager`

## Methods

### migrateAll()

> `static` **migrateAll**(`db`): `Promise`\<`void`\>

Defined in: home4strays-backend/src/database/migrations/migrations-manager.ts:49

Executes all registered migrations in sequence to update the database schema.
This method is typically used during application initialization to ensure
the database is in a consistent and up-to-date state.

#### Parameters

##### db

[`DatabaseManager`](/docs/code/backend/database/db/classes/databasemanager/)

DatabaseManager instance that provides database connection

#### Returns

`Promise`\<`void`\>

Promise that resolves when all migrations have completed successfully

***

### migrateForTest()

> `static` **migrateForTest**(`db`): `Promise`\<`void`\>

Defined in: home4strays-backend/src/database/migrations/migrations-manager.ts:76

Executes migrations specific to test environments, excluding mock data setup.
This method ensures test databases are initialized with core functionality
without including mock data that could interfere with test scenarios.

#### Parameters

##### db

[`DatabaseManager`](/docs/code/backend/database/db/classes/databasemanager/)

DatabaseManager instance that provides database connection

#### Returns

`Promise`\<`void`\>

Promise that resolves when all test migrations have completed successfully

***

### rollbackAll()

> `static` **rollbackAll**(`db`): `Promise`\<`void`\>

Defined in: home4strays-backend/src/database/migrations/migrations-manager.ts:62

Reverts all migrations in reverse order to rollback database schema changes.
This method is useful for testing or when manual schema adjustments are needed.

#### Parameters

##### db

[`DatabaseManager`](/docs/code/backend/database/db/classes/databasemanager/)

DatabaseManager instance that provides database connection

#### Returns

`Promise`\<`void`\>

Promise that resolves when all rollbacks have completed successfully

***

### rollbackForTest()

> `static` **rollbackForTest**(`db`): `Promise`\<`void`\>

Defined in: home4strays-backend/src/database/migrations/migrations-manager.ts:90

Reverts migrations specific to test environments, excluding mock data.
This method is used to clean up test databases after test execution,
ensuring they return to their original state without mock data remnants.

#### Parameters

##### db

[`DatabaseManager`](/docs/code/backend/database/db/classes/databasemanager/)

DatabaseManager instance that provides database connection

#### Returns

`Promise`\<`void`\>

Promise that resolves when all test rollbacks have completed successfully
