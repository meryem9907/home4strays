---
editUrl: false
next: false
prev: false
title: "formatTime"
---

> **formatTime**(`time`): `string`

Defined in: home4strays-backend/src/utils/formatter.ts:13

Formats a time string in "HH:MM:SS" format with leading zeros for each component.
This function ensures consistent time string formatting by padding each time unit
to two digits. It is designed to work with time strings split into hour, minute,
and second components.

## Parameters

### time

`string`

A string representing time in "HH:MM:SS" format

## Returns

`string`

A string formatted as "HH:MM:SS" with leading zeros for each component
