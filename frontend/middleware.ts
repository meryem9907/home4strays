import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { NextRequest, NextResponse } from "next/server";

// export createMiddleware(routing);

const nextIntlMiddleware = createMiddleware({
  locales: routing.locales,
  defaultLocale: "de",
});

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    !routing.locales.some((locale) => pathname.startsWith(`/${locale}`)) &&
    !pathname.startsWith("/_next")
  ) {
    return NextResponse.redirect(new URL(`/en${pathname}`, request.url));
  }

  return nextIntlMiddleware(request);
}

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
