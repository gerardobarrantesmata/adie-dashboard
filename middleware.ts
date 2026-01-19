import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const COOKIE_NAME = process.env.AUTH_COOKIE_NAME || "adie_session";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 1) Rutas públicas (no requieren auth)
  const isPublic =
    pathname === "/login" ||
    pathname.startsWith("/api/auth/login") ||
    pathname.startsWith("/api/auth/logout") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname.startsWith("/public");

  if (isPublic) return NextResponse.next();

  // 2) Si NO hay cookie → mandar a /login
  const token = req.cookies.get(COOKIE_NAME)?.value;

  if (!token) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // protege todo menos assets y rutas típicas públicas
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
