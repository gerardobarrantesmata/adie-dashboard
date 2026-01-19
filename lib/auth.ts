// lib/auth.ts
import { cookies, headers } from "next/headers";
import crypto from "crypto";

export const SESSION_COOKIE_NAME = "adie_session";

// --- token helpers (HMAC) ---
function getAuthSecret() {
  const secret =
    process.env.ADIE_AUTH_SECRET ||
    process.env.AUTH_SECRET ||
    process.env.NEXTAUTH_SECRET ||
    "";

  if (!secret) {
    // No tiramos error para no tumbar dev, pero sin secret no hay sesión segura.
    // En prod debe existir.
    return "dev-insecure-secret-change-me";
  }
  return secret;
}

function b64urlEncode(input: Buffer | string) {
  const buf = Buffer.isBuffer(input) ? input : Buffer.from(input, "utf8");
  return buf
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

function b64urlDecodeToString(input: string) {
  const pad = input.length % 4 === 0 ? "" : "=".repeat(4 - (input.length % 4));
  const b64 = input.replace(/-/g, "+").replace(/_/g, "/") + pad;
  return Buffer.from(b64, "base64").toString("utf8");
}

function sign(data: string) {
  return b64urlEncode(crypto.createHmac("sha256", getAuthSecret()).update(data).digest());
}

export function signSessionToken(
  payload: Record<string, any>,
  expiresInSeconds = 60 * 60 * 24 * 7 // 7 días
) {
  const exp = Math.floor(Date.now() / 1000) + expiresInSeconds;
  const body = b64urlEncode(JSON.stringify({ ...payload, exp }));
  const sig = sign(body);
  return `${body}.${sig}`;
}

export function verifySessionToken(token: string): Record<string, any> | null {
  const [body, sig] = token.split(".");
  if (!body || !sig) return null;

  const expected = sign(body);
  // timing safe compare
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return null;
  if (!crypto.timingSafeEqual(a, b)) return null;

  try {
    const json = JSON.parse(b64urlDecodeToString(body));
    const exp = Number(json?.exp ?? 0);
    if (!exp || exp < Math.floor(Date.now() / 1000)) return null;
    return json;
  } catch {
    return null;
  }
}

// --- public API used by routes ---
export async function getAuthedUserId(): Promise<string | null> {
  // Next 15: cookies() es async
  const c = await cookies();
  const token = c.get(SESSION_COOKIE_NAME)?.value;
  if (!token) return null;

  const payload = verifySessionToken(token);
  const userId = payload?.userId;
  return typeof userId === "string" && userId.length > 0 ? userId : null;
}

export async function getBearerToken(): Promise<string | null> {
  // Next 15: headers() es async
  const h = await headers();
  const auth = h.get("authorization") || "";
  const m = auth.match(/^Bearer\s+(.+)$/i);
  return m?.[1] ?? null;
}
