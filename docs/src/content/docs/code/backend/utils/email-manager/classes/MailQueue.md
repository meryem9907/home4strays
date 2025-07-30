---
editUrl: false
next: false
prev: false
title: "MailQueue"
---

Defined in: home4strays-backend/src/utils/email-manager.ts:192

Singleton class managing the email queue.
This provides a centralized location for pending email messages.

## Constructors

### Constructor

> **new MailQueue**(): `MailQueue`

#### Returns

`MailQueue`

## Properties

### queue

> `static` **queue**: `Queue`\<`Mail`\>

Defined in: home4strays-backend/src/utils/email-manager.ts:197

Static singleton instance of the email queue.
This ensures a single shared queue across the application.
