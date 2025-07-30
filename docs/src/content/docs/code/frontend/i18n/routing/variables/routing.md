---
editUrl: false
next: false
prev: false
title: "routing"
---

> `const` **routing**: `object`

Defined in: i18n/routing.ts:4

## Type declaration

### alternateLinks?

> `optional` **alternateLinks**: `boolean`

Sets the `Link` response header to notify search engines about content in other languages (defaults to `true`). See https://developers.google.com/search/docs/specialty/international/localized-versions#http

#### See

https://next-intl.dev/docs/routing/middleware#alternate-links

### defaultLocale

> **defaultLocale**: `"de"` \| `"en"` \| `"tr"`

Used when no locale matches.

#### See

https://next-intl.dev/docs/routing

### domains?

> `optional` **domains**: `undefined`

Can be used to change the locale handling per domain.

#### See

https://next-intl.dev/docs/routing#domains

### localeCookie?

> `optional` **localeCookie**: `boolean` \| `CookieAttributes`

Can be used to disable the locale cookie or to customize it.

#### See

https://next-intl.dev/docs/routing/middleware#locale-cookie

### localeDetection?

> `optional` **localeDetection**: `boolean`

By setting this to `false`, the cookie as well as the `accept-language` header will no longer be used for locale detection.

#### See

https://next-intl.dev/docs/routing/middleware#locale-detection

### localePrefix?

> `optional` **localePrefix**: `LocalePrefix`\<readonly \[`"de"`, `"en"`, `"tr"`\], `"always"`\>

Configures whether and which prefix is shown for a given locale.

#### See

https://next-intl.dev/docs/routing#locale-prefix

### locales

> **locales**: readonly \[`"de"`, `"en"`, `"tr"`\]

All available locales.

#### See

https://next-intl.dev/docs/routing
