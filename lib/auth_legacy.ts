import { SignJWT, jwtVerify } from "jose";

type SessionPayload = {
  userId: string;
  clinicId: string;
  role: string;
  email: string;
};

const secret = process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET || "dev-secret-change-me";
const key = new TextEncoder().encode(secret);

export async function signSessionToken(payload: SessionPayload) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("12h")
    .sign(key);
}

export async function verifySessionToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, key);
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}
