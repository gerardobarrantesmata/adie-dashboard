import { NextResponse, type NextRequest } from "next/server";
import { readSessionFromRequest } from "@/lib/auth";

const PUBLIC_PATHS = ["/login", "/signup", "/select-workspace"];

function isPublicPath(pathname: string) {
  if (PUBLIC_PATHS.includes(pathname) || PUBLIC_PATHS.some((p) => pathname.startsWith(p + "/"))) return true;

  // ✅ IMPORTANTÍSIMO: nunca bloquear API routes
  if (pathname.startsWith("/api/")) return true;

  if (pathname.startsWith("/_next/")) return true;
  if (pathname.startsWith("/favicon")) return true;
  return false;
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (isPublicPath(pathname)) return NextResponse.next();

  const session = readSessionFromRequest(req);

  // 1) si no hay user -> login
  if (!session.userId) {
    const login = new URL("/login", req.url);
    login.searchParams.set("next", pathname);
    return NextResponse.redirect(login);
  }

  // 2) si hay user pero falta clinic/location -> select-workspace
  const missingWorkspace = !session.clinicId || !session.locationId;
  if (missingWorkspace) {
    return NextResponse.redirect(new URL("/select-workspace", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
