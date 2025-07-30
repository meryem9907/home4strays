---
editUrl: false
next: false
prev: false
title: "NGOMemberQueries"
---

Defined in: home4strays-backend/src/database/queries/ngomember.ts:16

Class containing all database query operations related to NGO members.
This class provides methods to interact with the ngo_member table,
including select, insert, update, and delete operations.

## Constructors

### Constructor

> **new NGOMemberQueries**(): `NGOMemberQueries`

#### Returns

`NGOMemberQueries`

## Methods

### deleteNGOMemberByEmail()

> `static` **deleteNGOMemberByEmail**(`db`, `email`): `Promise`\<`void`\>

Defined in: home4strays-backend/src/database/queries/ngomember.ts:120

Deletes an NGO member by their email address.

#### Parameters

##### db

[`DatabaseManager`](/docs/code/backend/database/db/classes/databasemanager/)

DatabaseManager instance used to execute the query.

##### email

`string`

Email address of the NGO member to delete.

#### Returns

`Promise`\<`void`\>

A Promise that resolves to void.

***

### deleteNGOMemberById()

> `static` **deleteNGOMemberById**(`db`, `userId`, `ngoId`): `Promise`\<`void`\>

Defined in: home4strays-backend/src/database/queries/ngomember.ts:134

Deletes an NGO member by their user ID and NGO ID.

#### Parameters

##### db

[`DatabaseManager`](/docs/code/backend/database/db/classes/databasemanager/)

DatabaseManager instance used to execute the query.

##### userId

`string`

User ID of the NGO member to delete.

##### ngoId

`string`

NGO ID of the NGO member to delete.

#### Returns

`Promise`\<`void`\>

A Promise that resolves to void.

***

### deleteNGOMemberByUserId()

> `static` **deleteNGOMemberByUserId**(`db`, `userId`): `Promise`\<`void`\>

Defined in: home4strays-backend/src/database/queries/ngomember.ts:146

Delete ngo member by id of ngo user

#### Parameters

##### db

[`DatabaseManager`](/docs/code/backend/database/db/classes/databasemanager/)

##### userId

`string`

#### Returns

`Promise`\<`void`\>

***

### existsByUserId()

> `static` **existsByUserId**(`db`, `userId`): `Promise`\<`boolean`\>

Defined in: home4strays-backend/src/database/queries/ngomember.ts:198

Checks if a user exists as an NGO member in the database.

#### Parameters

##### db

[`DatabaseManager`](/docs/code/backend/database/db/classes/databasemanager/)

DatabaseManager instance used to execute the query.

##### userId

`string`

User ID to check for existence.

#### Returns

`Promise`\<`boolean`\>

A Promise that resolves to a boolean indicating if the user exists.

***

### getNGOMember()

> `static` **getNGOMember**(`db`, `userId`): `Promise`\<[`NGOMember`](/docs/code/backend/models/db-models/ngomember/classes/ngomember/)[]\>

Defined in: home4strays-backend/src/database/queries/ngomember.ts:155

#### Parameters

##### db

[`DatabaseManager`](/docs/code/backend/database/db/classes/databasemanager/)

##### userId

`string`

#### Returns

`Promise`\<[`NGOMember`](/docs/code/backend/models/db-models/ngomember/classes/ngomember/)[]\>

***

### getUserAndNGOMember()

> `static` **getUserAndNGOMember**(`db`, `email`): `Promise`\<[`NGOMemberAndUser`](/docs/code/backend/models/db-models/ngomember/classes/ngomemberanduser/)[]\>

Defined in: home4strays-backend/src/database/queries/ngomember.ts:175

Retrieves a list of users and their associated NGO member details by email.
This method performs a JOIN between the "user" and ngo_member tables.

#### Parameters

##### db

[`DatabaseManager`](/docs/code/backend/database/db/classes/databasemanager/)

DatabaseManager instance used to execute the query.

##### email

`string`

Email address of the user to filter results by.

#### Returns

`Promise`\<[`NGOMemberAndUser`](/docs/code/backend/models/db-models/ngomember/classes/ngomemberanduser/)[]\>

A Promise that resolves to an array of NGOMemberAndUser objects.

***

### insert()

> `static` **insert**(`db`, `ngoMember`): `Promise`\<`void`\>

Defined in: home4strays-backend/src/database/queries/ngomember.ts:92

Inserts a new NGO member into the database.

#### Parameters

##### db

[`DatabaseManager`](/docs/code/backend/database/db/classes/databasemanager/)

DatabaseManager instance used to execute the query.

##### ngoMember

[`NGOMember`](/docs/code/backend/models/db-models/ngomember/classes/ngomember/)

NGOMember object containing the data to insert.

#### Returns

`Promise`\<`void`\>

A Promise that resolves to void.

***

### select()

> `static` **select**(`db`): `Promise`\<[`NGOMember`](/docs/code/backend/models/db-models/ngomember/classes/ngomember/)[]\>

Defined in: home4strays-backend/src/database/queries/ngomember.ts:22

Retrieves all NGO members from the database.

#### Parameters

##### db

[`DatabaseManager`](/docs/code/backend/database/db/classes/databasemanager/)

DatabaseManager instance used to execute the query.

#### Returns

`Promise`\<[`NGOMember`](/docs/code/backend/models/db-models/ngomember/classes/ngomember/)[]\>

A Promise that resolves to an array of NGOMember objects.

***

### selectNGOMemberByEmail()

> `static` **selectNGOMemberByEmail**(`db`, `email`): `Promise`\<`null` \| [`NGOMember`](/docs/code/backend/models/db-models/ngomember/classes/ngomember/)\>

Defined in: home4strays-backend/src/database/queries/ngomember.ts:40

Retrieves an NGO member by their email address.

#### Parameters

##### db

[`DatabaseManager`](/docs/code/backend/database/db/classes/databasemanager/)

DatabaseManager instance used to execute the query.

##### email

`string`

Email address of the NGO member to retrieve.

#### Returns

`Promise`\<`null` \| [`NGOMember`](/docs/code/backend/models/db-models/ngomember/classes/ngomember/)\>

A Promise that resolves to an NGOMember object or null if not found.

#### Throws

NGOMemberNotFoundError if no member is found with the given email.

***

### selectNGOMemberById()

> `static` **selectNGOMemberById**(`db`, `userId`): `Promise`\<`undefined` \| [`NGOMember`](/docs/code/backend/models/db-models/ngomember/classes/ngomember/)\>

Defined in: home4strays-backend/src/database/queries/ngomember.ts:66

Retrieves an NGO member by their user ID.

#### Parameters

##### db

[`DatabaseManager`](/docs/code/backend/database/db/classes/databasemanager/)

DatabaseManager instance used to execute the query.

##### userId

`string`

User ID of the NGO member to retrieve.

#### Returns

`Promise`\<`undefined` \| [`NGOMember`](/docs/code/backend/models/db-models/ngomember/classes/ngomember/)\>

A Promise that resolves to an NGOMember object.

#### Throws

NGOMemberNotFoundError if no member is found with the given user ID.

***

### updateNGOAssociationMemberById()

> `static` **updateNGOAssociationMemberById**(`db`, `userId`, `ngoMember`): `Promise`\<`void`\>

Defined in: home4strays-backend/src/database/queries/ngomember.ts:103

Updates the NGOId of an NGOmember based on userId

#### Parameters

##### db

[`DatabaseManager`](/docs/code/backend/database/db/classes/databasemanager/)

##### userId

`string`

##### ngoMember

[`NGOMember`](/docs/code/backend/models/db-models/ngomember/classes/ngomember/)

#### Returns

`Promise`\<`void`\>
