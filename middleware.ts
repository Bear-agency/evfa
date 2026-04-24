import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

// Keep in sync with lib/auth/constants.ts.
const SESSION_COOKIE_NAME = "evfa_session";

function isAdminArea(pathname: string) {
  if (pathname === "/admin-login") return false;
  return pathname === "/admin" || pathname.startsWith("/admin/");
}

function isUserPrivateArea(pathname: string) {
  if (pathname === "/login") return false;
  return (
    pathname === "/dashboard" ||
    pathname.startsWith("/dashboard/") ||
    pathname === "/account" ||
    pathname.startsWith("/account/")
  );
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasSession = Boolean(request.cookies.get(SESSION_COOKIE_NAME)?.value);

  if (isAdminArea(pathname)) {
    if (!hasSession) {
      const url = new URL("/admin-login", request.url);
      url.searchParams.set("next", pathname);
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  if (isUserPrivateArea(pathname)) {
    if (!hasSession) {
      const url = new URL("/login", request.url);
      url.searchParams.set("next", pathname);
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/dashboard/:path*", "/account/:path*"],
};
