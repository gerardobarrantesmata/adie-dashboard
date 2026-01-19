import { NextResponse } from "next/server";

const COOKIE_NAME = process.env.AUTH_COOKIE_NAME ?? "adie_auth";

export async function POST() {
  const res = NextResponse.json({ ok: true });

  // Borra cookie (compatible con DO / Node runtime)
  res.cookies.set(COOKIE_NAME, "", {
    path: "/",
    maxAge: 0,
  });

  return res;
}
