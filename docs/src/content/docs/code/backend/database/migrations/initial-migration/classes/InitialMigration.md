---
editUrl: false
next: false
prev: false
title: "InitialMigration"
---

Defined in: home4strays-backend/src/database/migrations/initial-migration.ts:13

Migration interface defining the contract for database migration operations
Implementations must provide both forward and reverse migration capabilities
to ensure database schema can be evolved and rolled back safely

## Implements

- [`default`](/docs/code/backend/database/migrations/migrations/interfaces/default/)

## Constructors

### Constructor

> **new InitialMigration**(): `InitialMigration`

#### Returns

`InitialMigration`

## Methods

### createBreed()

> **createBreed**(`db`, `migrations`): `void`

Defined in: home4strays-backend/src/database/migrations/initial-migration.ts:212

#### Parameters

##### db

[`DatabaseManager`](/docs/code/backend/database/db/classes/databasemanager/)

##### migrations

`string`[]

#### Returns

`void`

***

### createCaretaker()

> **createCaretaker**(`db`, `migrations`): `void`

Defined in: home4strays-backend/src/database/migrations/initial-migration.ts:124

#### Parameters

##### db

[`DatabaseManager`](/docs/code/backend/database/db/classes/databasemanager/)

##### migrations

`string`[]

#### Returns

`void`

***

### createCTHours()

> **createCTHours**(`db`, `migrations`): `void`

Defined in: home4strays-backend/src/database/migrations/initial-migration.ts:182

#### Parameters

##### db

[`DatabaseManager`](/docs/code/backend/database/db/classes/databasemanager/)

##### migrations

`string`[]

#### Returns

`void`

***

### createEnums()

> **createEnums**(`db`): `Promise`\<`void`\>

Defined in: home4strays-backend/src/database/migrations/initial-migration.ts:14

#### Parameters

##### db

[`DatabaseManager`](/docs/code/backend/database/db/classes/databasemanager/)

#### Returns

`Promise`\<`void`\>

***

### createInterestedPets()

> **createInterestedPets**(`db`, `migrations`): `void`

Defined in: home4strays-backend/src/database/migrations/initial-migration.ts:290

#### Parameters

##### db

[`DatabaseManager`](/docs/code/backend/database/db/classes/databasemanager/)

##### migrations

`string`[]

#### Returns

`void`

***

### createMessage()

> **createMessage**(`db`, `migrations`): `void`

Defined in: home4strays-backend/src/database/migrations/initial-migration.ts:113

#### Parameters

##### db

[`DatabaseManager`](/docs/code/backend/database/db/classes/databasemanager/)

##### migrations

`string`[]

#### Returns

`void`

***

### createNGO()

> **createNGO**(`db`, `migrations`): `void`

Defined in: home4strays-backend/src/database/migrations/initial-migration.ts:152

#### Parameters

##### db

[`DatabaseManager`](/docs/code/backend/database/db/classes/databasemanager/)

##### migrations

`string`[]

#### Returns

`void`

***

### createNGOHours()

> **createNGOHours**(`db`, `migrations`): `void`

Defined in: home4strays-backend/src/database/migrations/initial-migration.ts:192

#### Parameters

##### db

[`DatabaseManager`](/docs/code/backend/database/db/classes/databasemanager/)

##### migrations

`string`[]

#### Returns

`void`

***

### createNGOMember()

> **createNGOMember**(`db`, `migrations`): `void`

Defined in: home4strays-backend/src/database/migrations/initial-migration.ts:172

#### Parameters

##### db

[`DatabaseManager`](/docs/code/backend/database/db/classes/databasemanager/)

##### migrations

`string`[]

#### Returns

`void`

***

### createNGOMemberHours()

> **createNGOMemberHours**(`db`, `migrations`): `void`

Defined in: home4strays-backend/src/database/migrations/initial-migration.ts:202

#### Parameters

##### db

[`DatabaseManager`](/docs/code/backend/database/db/classes/databasemanager/)

##### migrations

`string`[]

#### Returns

`void`

***

### createPet()

> **createPet**(`db`, `migrations`): `void`

Defined in: home4strays-backend/src/database/migrations/initial-migration.ts:228

#### Parameters

##### db

[`DatabaseManager`](/docs/code/backend/database/db/classes/databasemanager/)

##### migrations

`string`[]

#### Returns

`void`

***

### createPetBookmark()

> **createPetBookmark**(`db`, `migrations`): `void`

Defined in: home4strays-backend/src/database/migrations/initial-migration.ts:366

#### Parameters

##### db

[`DatabaseManager`](/docs/code/backend/database/db/classes/databasemanager/)

##### migrations

`string`[]

#### Returns

`void`

***

### createPetDisease()

> **createPetDisease**(`db`, `migrations`): `void`

Defined in: home4strays-backend/src/database/migrations/initial-migration.ts:256

#### Parameters

##### db

[`DatabaseManager`](/docs/code/backend/database/db/classes/databasemanager/)

##### migrations

`string`[]

#### Returns

`void`

***

### createPetFears()

> **createPetFears**(`db`, `migrations`): `void`

Defined in: home4strays-backend/src/database/migrations/initial-migration.ts:265

#### Parameters

##### db

[`DatabaseManager`](/docs/code/backend/database/db/classes/databasemanager/)

##### migrations

`string`[]

#### Returns

`void`

***

### createPetPicture()

> **createPetPicture**(`db`, `migrations`): `void`

Defined in: home4strays-backend/src/database/migrations/initial-migration.ts:282

#### Parameters

##### db

[`DatabaseManager`](/docs/code/backend/database/db/classes/databasemanager/)

##### migrations

`string`[]

#### Returns

`void`

***

### createPetVaccinaction()

> **createPetVaccinaction**(`db`, `migrations`): `void`

Defined in: home4strays-backend/src/database/migrations/initial-migration.ts:274

#### Parameters

##### db

[`DatabaseManager`](/docs/code/backend/database/db/classes/databasemanager/)

##### migrations

`string`[]

#### Returns

`void`

***

### createSpeciesTranslation()

> **createSpeciesTranslation**(`db`, `migrations`): `void`

Defined in: home4strays-backend/src/database/migrations/initial-migration.ts:220

#### Parameters

##### db

[`DatabaseManager`](/docs/code/backend/database/db/classes/databasemanager/)

##### migrations

`string`[]

#### Returns

`void`

***

### createUser()

> **createUser**(`db`, `migrations`): `void`

Defined in: home4strays-backend/src/database/migrations/initial-migration.ts:97

#### Parameters

##### db

[`DatabaseManager`](/docs/code/backend/database/db/classes/databasemanager/)

##### migrations

`string`[]

#### Returns

`void`

***

### insertBreeds()

> **insertBreeds**(`db`, `migrations`, `values`): `void`

Defined in: home4strays-backend/src/database/migrations/initial-migration.ts:299

#### Parameters

##### db

[`DatabaseManager`](/docs/code/backend/database/db/classes/databasemanager/)

##### migrations

`string`[]

##### values

`any`[]

#### Returns

`void`

***

### insertSpeciesTranslation()

> **insertSpeciesTranslation**(`db`, `migrations`, `values`): `void`

Defined in: home4strays-backend/src/database/migrations/initial-migration.ts:330

#### Parameters

##### db

[`DatabaseManager`](/docs/code/backend/database/db/classes/databasemanager/)

##### migrations

`string`[]

##### values

`any`[]

#### Returns

`void`

***

### migrate()

> **migrate**(`db`): `Promise`\<`void`\>

Defined in: home4strays-backend/src/database/migrations/initial-migration.ts:373

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

Defined in: home4strays-backend/src/database/migrations/initial-migration.ts:431

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
