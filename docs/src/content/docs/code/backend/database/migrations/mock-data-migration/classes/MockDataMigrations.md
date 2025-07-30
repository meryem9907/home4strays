---
editUrl: false
next: false
prev: false
title: "MockDataMigrations"
---

Defined in: home4strays-backend/src/database/migrations/mock-data-migration.ts:6

## Constructors

### Constructor

> **new MockDataMigrations**(): `MockDataMigrations`

#### Returns

`MockDataMigrations`

## Methods

### createMockData()

> **createMockData**(`db`, `migrations`): `void`

Defined in: home4strays-backend/src/database/migrations/mock-data-migration.ts:7

#### Parameters

##### db

[`DatabaseManager`](/docs/code/backend/database/db/classes/databasemanager/)

##### migrations

`String`[]

#### Returns

`void`

***

### insertPublicURLs()

> **insertPublicURLs**(`db`): `Promise`\<`void`\>

Defined in: home4strays-backend/src/database/migrations/mock-data-migration.ts:343

#### Parameters

##### db

[`DatabaseManager`](/docs/code/backend/database/db/classes/databasemanager/)

#### Returns

`Promise`\<`void`\>

***

### migrate()

> **migrate**(`db`): `Promise`\<`void`\>

Defined in: home4strays-backend/src/database/migrations/mock-data-migration.ts:425

#### Parameters

##### db

[`DatabaseManager`](/docs/code/backend/database/db/classes/databasemanager/)

#### Returns

`Promise`\<`void`\>

***

### rollback()

> **rollback**(`db`): `Promise`\<`void`\>

Defined in: home4strays-backend/src/database/migrations/mock-data-migration.ts:463

#### Parameters

##### db

[`DatabaseManager`](/docs/code/backend/database/db/classes/databasemanager/)

#### Returns

`Promise`\<`void`\>
