---
editUrl: false
next: false
prev: false
title: "DatabaseManager"
---

Defined in: home4strays-backend/src/database/db.ts:10

Manages PostgreSQL database connections and operations with support for migrations, transactions, and query execution.
This class implements a singleton pattern to ensure a single instance of the database connection pool.

## Methods

### endPool()

> **endPool**(): `Promise`\<`void`\>

Defined in: home4strays-backend/src/database/db.ts:202

Gracefully ends the database connection pool

#### Returns

`Promise`\<`void`\>

Promise that resolves when pool is closed

***

### executeQuery()

> **executeQuery**(`sqlCommand`, `values?`): `Promise`\<`QueryResult`\<`any`\>\>

Defined in: home4strays-backend/src/database/db.ts:80

Executes a single SQL query with parameter binding

#### Parameters

##### sqlCommand

`string`

SQL query string

##### values?

`any`[] = `[]`

Array of parameter values

#### Returns

`Promise`\<`QueryResult`\<`any`\>\>

Promise resolving to query result

#### Throws

If query execution fails

***

### executeQueryWithTimeout()

> **executeQueryWithTimeout**(`sqlCommand`, `values?`, `timeoutMs?`): `Promise`\<`unknown`\>

Defined in: home4strays-backend/src/database/db.ts:147

Executes a query with a timeout constraint

#### Parameters

##### sqlCommand

`string`

SQL query string

##### values?

`any`[] = `[]`

Array of parameter values

##### timeoutMs?

`number` = `5000`

Maximum time in milliseconds to wait for query execution

#### Returns

`Promise`\<`unknown`\>

Promise resolving to query result

#### Throws

If query execution exceeds timeout or fails

***

### executeTransaction()

> **executeTransaction**(`sqlCommands`, `values?`): `Promise`\<`QueryResult`\<`any`\>[]\>

Defined in: home4strays-backend/src/database/db.ts:105

Executes a transaction with multiple SQL commands

#### Parameters

##### sqlCommands

`string`[]

Array of SQL commands to execute

##### values?

`any`[][] = `[]`

Array of parameter arrays for each command

#### Returns

`Promise`\<`QueryResult`\<`any`\>[]\>

Promise resolving to array of query results

#### Throws

If any command in the transaction fails

***

### getPoolStatus()

> **getPoolStatus**(): `object`

Defined in: home4strays-backend/src/database/db.ts:227

Gets current status of the database connection pool

#### Returns

`object`

Object containing pool statistics

##### idleCount

> **idleCount**: `number`

##### totalCount

> **totalCount**: `number`

##### waitingCount

> **waitingCount**: `number`

***

### migrate()

> **migrate**(): `Promise`\<`void`\>

Defined in: home4strays-backend/src/database/db.ts:167

Runs all database migrations

#### Returns

`Promise`\<`void`\>

Promise that resolves when migrations complete

***

### migrateForTest()

> **migrateForTest**(): `Promise`\<`void`\>

Defined in: home4strays-backend/src/database/db.ts:185

Runs test-specific database migrations

#### Returns

`Promise`\<`void`\>

Promise that resolves when test migrations complete

***

### rollback()

> **rollback**(): `Promise`\<`void`\>

Defined in: home4strays-backend/src/database/db.ts:176

Rolls back all database migrations

#### Returns

`Promise`\<`void`\>

Promise that resolves when rollbacks complete

***

### rollbackForTest()

> **rollbackForTest**(): `Promise`\<`void`\>

Defined in: home4strays-backend/src/database/db.ts:194

Rolls back test-specific database migrations

#### Returns

`Promise`\<`void`\>

Promise that resolves when test rollbacks complete

***

### getInstance()

> `static` **getInstance**(): `DatabaseManager`

Defined in: home4strays-backend/src/database/db.ts:66

Gets the singleton instance of DatabaseManager

#### Returns

`DatabaseManager`

The singleton instance
