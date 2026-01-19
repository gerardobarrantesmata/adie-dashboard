// app/api/auth/login/logout/route.ts
import { NextResponse } from "next/server";

const COOKIE_NAME = "adie_auth";

export async function POST() {
  const res = NextResponse.json({ ok: true });

  // Borra la cookie
  res.cookies.set(COOKIE_NAME, "", {
    path: "/",
    maxAge: 0,
  });

  return res;
}
