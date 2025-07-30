---
editUrl: false
next: false
prev: false
title: "MessageQueries"
---

Defined in: home4strays-backend/src/database/queries/message.ts:9

Class containing database query operations for Message entities
Provides static methods to interact with the Message table in the database

## Constructors

### Constructor

> **new MessageQueries**(): `MessageQueries`

#### Returns

`MessageQueries`

## Methods

### select()

> `static` **select**(`db`): `Promise`\<[`default`](/docs/code/backend/models/db-models/message/classes/default/)[]\>

Defined in: home4strays-backend/src/database/queries/message.ts:28

Retrieves all messages from the database
Executes a SELECT query on the Message table and returns the results

#### Parameters

##### db

[`DatabaseManager`](/docs/code/backend/database/db/classes/databasemanager/)

DatabaseManager instance used to execute the query

#### Returns

`Promise`\<[`default`](/docs/code/backend/models/db-models/message/classes/default/)[]\>

Promise resolving to an array of Message objects

#### Description

This method fetches all records from the Message table, including:
- id: Unique identifier for the message
- sender: Identifier of the message sender
- recipient: Identifier of the message recipient
- content: The message content text
- timestamp: Datetime when the message was created

The results are automatically converted from database rows to Message class instances
using class-transformer's plainToInstance method
