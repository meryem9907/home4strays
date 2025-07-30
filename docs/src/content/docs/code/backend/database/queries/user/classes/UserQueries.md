---
editUrl: false
next: false
prev: false
title: "UserQueries"
---

Defined in: home4strays-backend/src/database/queries/user.ts:20

Class containing database query operations for user-related data

## Constructors

### Constructor

> **new UserQueries**(): `UserQueries`

#### Returns

`UserQueries`

## Methods

### deleteByEmail()

> `static` **deleteByEmail**(`db`, `email`): `Promise`\<`void`\>

Defined in: home4strays-backend/src/database/queries/user.ts:477

Deletes a user by email

#### Parameters

##### db

[`DatabaseManager`](/docs/code/backend/database/db/classes/databasemanager/)

Database connection manager

##### email

`string`

Email address of the user to delete

#### Returns

`Promise`\<`void`\>

Promise resolving to void

***

### deleteById()

> `static` **deleteById**(`db`, `id`): `Promise`\<`void`\>

Defined in: home4strays-backend/src/database/queries/user.ts:490

Deletes a user by ID

#### Parameters

##### db

[`DatabaseManager`](/docs/code/backend/database/db/classes/databasemanager/)

Database connection manager

##### id

`string`

ID of the user to delete

#### Returns

`Promise`\<`void`\>

Promise resolving to void

***

### deleteUserProfilePic()

> `static` **deleteUserProfilePic**(`db`, `userId`): `Promise`\<`void`\>

Defined in: home4strays-backend/src/database/queries/user.ts:513

Deletes a user's profile picture by setting both the external link and local path to NULL in the database.
This operation permanently removes the association of the profile picture with the user.

#### Parameters

##### db

[`DatabaseManager`](/docs/code/backend/database/db/classes/databasemanager/)

The database manager instance used to execute the SQL query.

##### userId

`string`

The unique identifier of the user whose profile picture will be deleted.

#### Returns

`Promise`\<`void`\>

A Promise that resolves when the operation is complete.

#### Remarks

- This function directly modifies the database and should be used with caution.
- The SQL query ensures both `profile_picture_link` and `profile_picture_path` are set to NULL,
  effectively removing the reference to the profile picture.
- The function assumes the `user` table contains the columns `profile_picture_link` and `profile_picture_path`.
- The `userId` parameter is expected to be a valid string representing a user ID in the database.

#### Example

```ts
// Example usage:
await UserFunctions.deleteUserProfilePic(db, 'user123');
```

***

### insert()

> `static` **insert**(`db`, `user`): `Promise`\<`void`\>

Defined in: home4strays-backend/src/database/queries/user.ts:401

Inserts a new user into the database

#### Parameters

##### db

[`DatabaseManager`](/docs/code/backend/database/db/classes/databasemanager/)

Database connection manager

##### user

[`User`](/docs/code/backend/models/db-models/user/classes/user/)

User object containing all required fields

#### Returns

`Promise`\<`void`\>

Promise resolving to void

***

### select()

> `static` **select**(`db`): `Promise`\<[`User`](/docs/code/backend/models/db-models/user/classes/user/)[]\>

Defined in: home4strays-backend/src/database/queries/user.ts:40

Retrieves all user records from the database.
Executes a SQL query to fetch all user data, converts the result to camelCase,
and maps the data to User entity instances.

#### Parameters

##### db

[`DatabaseManager`](/docs/code/backend/database/db/classes/databasemanager/)

The database manager instance used to execute the query.

#### Returns

`Promise`\<[`User`](/docs/code/backend/models/db-models/user/classes/user/)[]\>

A promise that resolves to an array of User instances.

#### Note

This method assumes the database connection is properly configured.

#### Note

The query result is converted to camelCase to match TypeScript property naming conventions.

#### Note

The plainToInstance utility is used to map the result to User entity instances.

Example SQL query executed:
SELECT id, first_name, last_name, email, password,
       profile_picture_link, profile_picture_path,
       phone_number, is_admin, is_ngo_user
FROM "user";

***

### selectAllAdminsSecurely()

> `static` **selectAllAdminsSecurely**(`db`): `Promise`\<[`User`](/docs/code/backend/models/db-models/user/classes/user/)[]\>

Defined in: home4strays-backend/src/database/queries/user.ts:204

Selects all admin users without exposing confidential data

#### Parameters

##### db

[`DatabaseManager`](/docs/code/backend/database/db/classes/databasemanager/)

Database connection manager

#### Returns

`Promise`\<[`User`](/docs/code/backend/models/db-models/user/classes/user/)[]\>

Promise resolving to array of User objects

***

### selectByEmailSecurely()

> `static` **selectByEmailSecurely**(`db`, `email`): `Promise`\<[`User`](/docs/code/backend/models/db-models/user/classes/user/)[]\>

Defined in: home4strays-backend/src/database/queries/user.ts:89

Selects users by email without exposing confidential data (password, profile pictures)

#### Parameters

##### db

[`DatabaseManager`](/docs/code/backend/database/db/classes/databasemanager/)

Database connection manager

##### email

`string`

Email address to search for

#### Returns

`Promise`\<[`User`](/docs/code/backend/models/db-models/user/classes/user/)[]\>

Promise resolving to array of User objects

***

### selectByEmailUnsecure()

> `static` **selectByEmailUnsecure**(`db`, `email`): `Promise`\<`undefined` \| [`User`](/docs/code/backend/models/db-models/user/classes/user/)\>

Defined in: home4strays-backend/src/database/queries/user.ts:180

Selects a user by email including confidential data (password, profile pictures)

#### Parameters

##### db

[`DatabaseManager`](/docs/code/backend/database/db/classes/databasemanager/)

Database connection manager

##### email

`string`

Email address to search for

#### Returns

`Promise`\<`undefined` \| [`User`](/docs/code/backend/models/db-models/user/classes/user/)\>

Promise resolving to User object or undefined if not found

***

### selectByIdSecurely()

> `static` **selectByIdSecurely**(`db`, `id`): `Promise`\<`undefined` \| [`User`](/docs/code/backend/models/db-models/user/classes/user/)\>

Defined in: home4strays-backend/src/database/queries/user.ts:129

Selects a user by ID without exposing confidential data (password, profile pictures)

#### Parameters

##### db

[`DatabaseManager`](/docs/code/backend/database/db/classes/databasemanager/)

Database connection manager

##### id

`string`

ID of the user to retrieve

#### Returns

`Promise`\<`undefined` \| [`User`](/docs/code/backend/models/db-models/user/classes/user/)\>

Promise resolving to User object or undefined if not found

***

### selectByIdUnsecure()

> `static` **selectByIdUnsecure**(`db`, `id`): `Promise`\<`undefined` \| [`User`](/docs/code/backend/models/db-models/user/classes/user/)\>

Defined in: home4strays-backend/src/database/queries/user.ts:154

Selects a user by ID including confidential data (password, profile pictures)

#### Parameters

##### db

[`DatabaseManager`](/docs/code/backend/database/db/classes/databasemanager/)

Database connection manager

##### id

`string`

ID of the user to retrieve

#### Returns

`Promise`\<`undefined` \| [`User`](/docs/code/backend/models/db-models/user/classes/user/)\>

Promise resolving to User object or undefined if not found

***

### selectNGOMembersWithHoursByNGO()

> `static` **selectNGOMembersWithHoursByNGO**(`db`, `ngoId`, `lang`): `Promise`\<[`NGOMemberWithMemberHours`](/docs/code/backend/models/db-models/ngomember/classes/ngomemberwithmemberhours/)[]\>

Defined in: home4strays-backend/src/database/queries/user.ts:253

Selects NGO members with their hours for a specific NGO

#### Parameters

##### db

[`DatabaseManager`](/docs/code/backend/database/db/classes/databasemanager/)

Database connection manager

##### ngoId

`string`

ID of the NGO

##### lang

`string` = `"en"`

Language code for translation (default: 'en')

#### Returns

`Promise`\<[`NGOMemberWithMemberHours`](/docs/code/backend/models/db-models/ngomember/classes/ngomemberwithmemberhours/)[]\>

Promise resolving to array of NGOMemberWithMemberHours objects

***

### selectNGOMemberWithHoursByNGOAndUserId()

> `static` **selectNGOMemberWithHoursByNGOAndUserId**(`db`, `userId`, `lang`): `Promise`\<`undefined` \| `Record`\<`string`, [`NGOMemberAndUser`](/docs/code/backend/models/db-models/ngomember/classes/ngomemberanduser/) \| [`default`](/docs/code/backend/models/db-models/ngomemberhours/classes/default/)[]\>\>

Defined in: home4strays-backend/src/database/queries/user.ts:333

Selects a specific NGO member with their hours

#### Parameters

##### db

[`DatabaseManager`](/docs/code/backend/database/db/classes/databasemanager/)

Database connection manager

##### userId

`string`

ID of the user

##### lang

`string` = `"en"`

Language code for translation (default: 'en')

#### Returns

`Promise`\<`undefined` \| `Record`\<`string`, [`NGOMemberAndUser`](/docs/code/backend/models/db-models/ngomember/classes/ngomemberanduser/) \| [`default`](/docs/code/backend/models/db-models/ngomemberhours/classes/default/)[]\>\>

Promise resolving to object containing user and hours data or undefined

***

### selectProfilePicture()

> `static` **selectProfilePicture**(`db`, `userId`): `Promise`\<[`User`](/docs/code/backend/models/db-models/user/classes/user/)\>

Defined in: home4strays-backend/src/database/queries/user.ts:63

Selects a user's profile picture information

#### Parameters

##### db

[`DatabaseManager`](/docs/code/backend/database/db/classes/databasemanager/)

Database connection manager

##### userId

`string`

ID of the user to retrieve

#### Returns

`Promise`\<[`User`](/docs/code/backend/models/db-models/user/classes/user/)\>

Promise resolving to User object containing profile picture data

***

### selectUserIdByEmail()

> `static` **selectUserIdByEmail**(`db`, `email`): `Promise`\<[`User`](/docs/code/backend/models/db-models/user/classes/user/)[]\>

Defined in: home4strays-backend/src/database/queries/user.ts:111

Selects user ID and email from the database based on email

#### Parameters

##### db

[`DatabaseManager`](/docs/code/backend/database/db/classes/databasemanager/)

Database connection manager

##### email

`string`

Email address to search for

#### Returns

`Promise`\<[`User`](/docs/code/backend/models/db-models/user/classes/user/)[]\>

Promise resolving to array of User objects containing id and email

***

### selectUsersByNGO()

> `static` **selectUsersByNGO**(`db`, `name`, `country`): `Promise`\<[`User`](/docs/code/backend/models/db-models/user/classes/user/)[]\>

Defined in: home4strays-backend/src/database/queries/user.ts:224

Selects users associated with a specific NGO by name and country

#### Parameters

##### db

[`DatabaseManager`](/docs/code/backend/database/db/classes/databasemanager/)

Database connection manager

##### name

`string`

Name of the NGO

##### country

`string`

Country of the NGO

#### Returns

`Promise`\<[`User`](/docs/code/backend/models/db-models/user/classes/user/)[]\>

Promise resolving to array of User objects containing email and ID

***

### update()

> `static` **update**(`db`, `user`): `Promise`\<`void`\>

Defined in: home4strays-backend/src/database/queries/user.ts:456

Update user details
Updates the first name, last name, and phone number of a specified user in the database.
This method ensures that the user's basic information is safely updated
using parameterized queries to prevent SQL injection vulnerabilities.

#### Parameters

##### db

[`DatabaseManager`](/docs/code/backend/database/db/classes/databasemanager/)

The database manager instance used to execute the query.

##### user

[`User`](/docs/code/backend/models/db-models/user/classes/user/)

The User object containing the updated information.

#### Returns

`Promise`\<`void`\>

A Promise that resolves when the update operation is complete.

***

### updateUserProfilePic()

> `static` **updateUserProfilePic**(`db`, `userId`, `profilePicturePath`, `profilePictureLink`): `Promise`\<`void`\>

Defined in: home4strays-backend/src/database/queries/user.ts:432

Update user profilePic
Updates the profile picture path and link for a specified user in the database.
This method ensures that the user's profile picture information is safely updated
using parameterized queries to prevent SQL injection vulnerabilities.

#### Parameters

##### db

[`DatabaseManager`](/docs/code/backend/database/db/classes/databasemanager/)

The database manager instance used to execute the query.

##### userId

`string`

The unique identifier of the user whose profile picture is being updated.

##### profilePicturePath

`string`

The local path to the user's profile picture.

##### profilePictureLink

`string`

The URL link to the user's profile picture.

#### Returns

`Promise`\<`void`\>

A Promise that resolves when the update operation is complete.
