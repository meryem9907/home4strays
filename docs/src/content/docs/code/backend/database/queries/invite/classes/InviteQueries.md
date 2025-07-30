---
editUrl: false
next: false
prev: false
title: "InviteQueries"
---

Defined in: home4strays-backend/src/database/queries/invite.ts:10

A class containing database query operations for managing invites.
This class provides static methods to interact with the invite table in the database.

## Constructors

### Constructor

> **new InviteQueries**(): `InviteQueries`

#### Returns

`InviteQueries`

## Methods

### createInvite()

> `static` **createInvite**(`db`, `userId`, `ngoId`, `invite`, `email`): `Promise`\<`void`\>

Defined in: home4strays-backend/src/database/queries/invite.ts:20

Creates a new invite record in the database.
This method inserts a new invite into the invite table. If an invite with the same ngo_id and email already exists, it updates the invite token.

#### Parameters

##### db

[`DatabaseManager`](/docs/code/backend/database/db/classes/databasemanager/)

The database manager instance used to execute the query.

##### userId

`string`

The unique identifier of the user creating the invite.

##### ngoId

`string`

The unique identifier of the NGO associated with the invite.

##### invite

`string`

The unique invite token generated for the user.

##### email

`string`

The email address of the user associated with the invite.

#### Returns

`Promise`\<`void`\>

***

### deleteInvite()

> `static` **deleteInvite**(`db`, `ngoId?`, `email?`): `Promise`\<`void`\>

Defined in: home4strays-backend/src/database/queries/invite.ts:59

Deletes an invite record from the database.
This method removes an invite record based on the provided NGO ID and email address.

#### Parameters

##### db

[`DatabaseManager`](/docs/code/backend/database/db/classes/databasemanager/)

The database manager instance used to execute the query.

##### ngoId?

`string`

The unique identifier of the NGO associated with the invite.

##### email?

`string`

The email address of the user associated with the invite.

#### Returns

`Promise`\<`void`\>

***

### getInvite()

> `static` **getInvite**(`db`, `invite`): `Promise`\<[`InviteNGO`](/docs/code/backend/models/invite/classes/invitengo/)[]\>

Defined in: home4strays-backend/src/database/queries/invite.ts:77

Retrieves an invite record by its unique token.
This method fetches an invite record from the database using the invite token, converts the keys to camelCase, and returns it as an InviteNGO instance.

#### Parameters

##### db

[`DatabaseManager`](/docs/code/backend/database/db/classes/databasemanager/)

The database manager instance used to execute the query.

##### invite

`string`

The unique invite token used to identify the record.

#### Returns

`Promise`\<[`InviteNGO`](/docs/code/backend/models/invite/classes/invitengo/)[]\>

An InviteNGO instance representing the retrieved invite.

***

### getInvites()

> `static` **getInvites**(`db`, `ngoId`): `Promise`\<[`InviteNGO`](/docs/code/backend/models/invite/classes/invitengo/)[]\>

Defined in: home4strays-backend/src/database/queries/invite.ts:40

Retrieves all invites associated with a specific NGO.
This method fetches invite records from the database for the given NGO ID, converts the keys to camelCase, and returns them as InviteNGO instances.

#### Parameters

##### db

[`DatabaseManager`](/docs/code/backend/database/db/classes/databasemanager/)

The database manager instance used to execute the query.

##### ngoId

`string`

The unique identifier of the NGO for which to retrieve invites.

#### Returns

`Promise`\<[`InviteNGO`](/docs/code/backend/models/invite/classes/invitengo/)[]\>

An array of InviteNGO instances representing the retrieved invites.
