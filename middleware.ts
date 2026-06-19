import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const role = request.cookies.get("role")?.value;
  const { pathname } = request.nextUrl;

  const isLoggedIn = !!role && role !== "guest";

  // guest trying to access dashboard → home
  if (pathname.startsWith("/dashboard") && !isLoggedIn) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // admin trying to access dashboard → admin panel
  if (pathname.startsWith("/dashboard") && role === "admin") {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  // non-admin trying to access admin → home
  if (pathname.startsWith("/admin") && role !== "admin") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*"],
};