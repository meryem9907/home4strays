---
editUrl: false
next: false
prev: false
title: "EnumQueries"
---

Defined in: home4strays-backend/src/database/queries/enum.ts:30

A utility class providing methods to retrieve and translate enum values
for various data models, with support for multilingual translation.

## Constructors

### Constructor

> **new EnumQueries**(): `EnumQueries`

#### Returns

`EnumQueries`

## Methods

### getBehaviourEnum()

> `static` **getBehaviourEnum**(`db`, `lang`): [`Behaviour`](/docs/code/backend/models/enums/enumerations/behaviour/)[]

Defined in: home4strays-backend/src/database/queries/enum.ts:192

Retrieves and translates the Behaviour enum values based on the provided language.

#### Parameters

##### db

[`DatabaseManager`](/docs/code/backend/database/db/classes/databasemanager/)

The database manager instance (passed for potential future integration).

##### lang

`string`

The language code for translation (e.g., 'en', 'es').

#### Returns

[`Behaviour`](/docs/code/backend/models/enums/enumerations/behaviour/)[]

An array of translated Behaviour enum values.

***

### getEmploymentTypeEnum()

> `static` **getEmploymentTypeEnum**(`db`, `lang`): [`Employment`](/docs/code/backend/models/enums/enumerations/employment/)[]

Defined in: home4strays-backend/src/database/queries/enum.ts:140

Retrieves and translates the Employment enum values based on the provided language.

#### Parameters

##### db

[`DatabaseManager`](/docs/code/backend/database/db/classes/databasemanager/)

The database manager instance (passed for potential future integration).

##### lang

`string`

The language code for translation (e.g., 'en', 'es').

#### Returns

[`Employment`](/docs/code/backend/models/enums/enumerations/employment/)[]

An array of translated Employment enum values.

***

### getExperienceEnum()

> `static` **getExperienceEnum**(`db`, `lang`): [`Experience`](/docs/code/backend/models/enums/enumerations/experience/)[]

Defined in: home4strays-backend/src/database/queries/enum.ts:37

Retrieves and translates the Experience enum values based on the provided language.

#### Parameters

##### db

[`DatabaseManager`](/docs/code/backend/database/db/classes/databasemanager/)

The database manager instance (passed for potential future integration).

##### lang

`string`

The language code for translation (e.g., 'en', 'es').

#### Returns

[`Experience`](/docs/code/backend/models/enums/enumerations/experience/)[]

An array of translated Experience enum values.

***

### getGenderEnum()

> `static` **getGenderEnum**(`db`, `lang`): [`Gender`](/docs/code/backend/models/enums/enumerations/gender/)[]

Defined in: home4strays-backend/src/database/queries/enum.ts:177

Retrieves and translates the Gender enum values based on the provided language.

#### Parameters

##### db

[`DatabaseManager`](/docs/code/backend/database/db/classes/databasemanager/)

The database manager instance (passed for potential future integration).

##### lang

`string`

The language code for translation (e.g., 'en', 'es').

#### Returns

[`Gender`](/docs/code/backend/models/enums/enumerations/gender/)[]

An array of translated Gender enum values.

***

### getLocalityTypeEnum()

> `static` **getLocalityTypeEnum**(`db`, `lang`): [`LocalityType`](/docs/code/backend/models/enums/enumerations/localitytype/)[]

Defined in: home4strays-backend/src/database/queries/enum.ts:96

Retrieves and translates the LocalityType enum values based on the provided language.

#### Parameters

##### db

[`DatabaseManager`](/docs/code/backend/database/db/classes/databasemanager/)

The database manager instance (passed for potential future integration).

##### lang

`string`

The language code for translation (e.g., 'en', 'es').

#### Returns

[`LocalityType`](/docs/code/backend/models/enums/enumerations/localitytype/)[]

An array of translated LocalityType enum values.

***

### getMaritalStatusEnum()

> `static` **getMaritalStatusEnum**(`db`, `lang`): [`MaritalStatus`](/docs/code/backend/models/enums/enumerations/maritalstatus/)[]

Defined in: home4strays-backend/src/database/queries/enum.ts:74

Retrieves and translates the MaritalStatus enum values based on the provided language.

#### Parameters

##### db

[`DatabaseManager`](/docs/code/backend/database/db/classes/databasemanager/)

The database manager instance (passed for potential future integration).

##### lang

`string`

The language code for translation (e.g., 'en', 'es').

#### Returns

[`MaritalStatus`](/docs/code/backend/models/enums/enumerations/maritalstatus/)[]

An array of translated MaritalStatus enum values.

***

### getResidenceTypeEnum()

> `static` **getResidenceTypeEnum**(`db`, `lang`): [`Residence`](/docs/code/backend/models/enums/enumerations/residence/)[]

Defined in: home4strays-backend/src/database/queries/enum.ts:118

Retrieves and translates the Residence enum values based on the provided language.

#### Parameters

##### db

[`DatabaseManager`](/docs/code/backend/database/db/classes/databasemanager/)

The database manager instance (passed for potential future integration).

##### lang

`string`

The language code for translation (e.g., 'en', 'es').

#### Returns

[`Residence`](/docs/code/backend/models/enums/enumerations/residence/)[]

An array of translated Residence enum values.

***

### getTenureEnum()

> `static` **getTenureEnum**(`db`, `lang`): [`Tenure`](/docs/code/backend/models/enums/enumerations/tenure/)[]

Defined in: home4strays-backend/src/database/queries/enum.ts:59

Retrieves and translates the Tenure enum values based on the provided language.

#### Parameters

##### db

[`DatabaseManager`](/docs/code/backend/database/db/classes/databasemanager/)

The database manager instance (passed for potential future integration).

##### lang

`string`

The language code for translation (e.g., 'en', 'es').

#### Returns

[`Tenure`](/docs/code/backend/models/enums/enumerations/tenure/)[]

An array of translated Tenure enum values.

***

### getWeekdayTypeEnum()

> `static` **getWeekdayTypeEnum**(`db`, `lang`): [`Weekday`](/docs/code/backend/models/enums/enumerations/weekday/)[]

Defined in: home4strays-backend/src/database/queries/enum.ts:162

Retrieves and translates the Weekday enum values based on the provided language.

#### Parameters

##### db

[`DatabaseManager`](/docs/code/backend/database/db/classes/databasemanager/)

The database manager instance (passed for potential future integration).

##### lang

`string`

The language code for translation (e.g., 'en', 'es').

#### Returns

[`Weekday`](/docs/code/backend/models/enums/enumerations/weekday/)[]

An array of translated Weekday enum values.
