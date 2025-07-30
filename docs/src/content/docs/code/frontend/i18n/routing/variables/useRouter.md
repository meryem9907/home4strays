---
editUrl: false
next: false
prev: false
title: "useRouter"
---

> **useRouter**: () => `object`

Defined in: i18n/routing.ts:14

## Returns

### prefetch()

> **prefetch**: (`href`, `options?`) => `void`

#### Parameters

##### href

`string` | \{ `pathname`: `string`; `query?`: `QueryParams`; \}

##### options?

`Partial`\<`PrefetchOptions`\> & `object`

#### Returns

`void`

#### See

https://next-intl.dev/docs/routing/navigation#userouter

### push()

> **push**: (`href`, `options?`) => `void`

#### Parameters

##### href

`string` | \{ `pathname`: `string`; `query?`: `QueryParams`; \}

##### options?

`Partial`\<`NavigateOptions`\> & `object`

#### Returns

`void`

#### See

https://next-intl.dev/docs/routing/navigation#userouter

### replace()

> **replace**: (`href`, `options?`) => `void`

#### Parameters

##### href

`string` | \{ `pathname`: `string`; `query?`: `QueryParams`; \}

##### options?

`Partial`\<`NavigateOptions`\> & `object`

#### Returns

`void`

#### See

https://next-intl.dev/docs/routing/navigation#userouter

### back()

> **back**(): `void`

#### Returns

`void`

### forward()

> **forward**(): `void`

#### Returns

`void`

### refresh()

> **refresh**(): `void`

#### Returns

`void`
