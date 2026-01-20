import type { NextRequest } from "next/server";
import { cookies } from "next/headers";

export const COOKIE_NAME = process.env.AUTH_COOKIE_NAME || "adie_session";

export type Session = {
  userId?: string;
  clinicId?: string;
  locationId?: string;
};

export function parseSession(raw: string | undefined): Session {
  if (!raw) return {};
  try {
    const s = JSON.parse(raw);
    if (!s || typeof s !== "object") return {};
    return {
      userId: typeof (s as any).userId === "string" ? (s as any).userId : undefined,
      clinicId: typeof (s as any).clinicId === "string" ? (s as any).clinicId : undefined,
      locationId: typeof (s as any).locationId === "string" ? (s as any).locationId : undefined,
    };
  } catch {
    return {};
  }
}

// ✅ Route Handlers / Server Components
export async function readSessionServer(): Promise<Session> {
  const cookieStore = await cookies();
  const raw = cookieStore.get(COOKIE_NAME)?.value;
  return parseSession(raw);
}

// ✅ Middleware
export function readSessionFromRequest(req: NextRequest): Session {
  const raw = req.cookies.get(COOKIE_NAME)?.value;
  return parseSession(raw);
}
