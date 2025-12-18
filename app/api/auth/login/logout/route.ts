import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const COOKIE_NAME = process.env.AUTH_COOKIE_NAME || "adie_session";

export async function POST() {
  cookies().set(COOKIE_NAME, "", { path: "/", maxAge: 0 });
  return NextResponse.json({ ok: true });
}
