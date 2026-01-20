// app/api/auth/login/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { compare } from "bcryptjs";

const COOKIE_NAME = process.env.AUTH_COOKIE_NAME || "adie_session";

type SessionShape = { userId?: string; clinicId?: string; locationId?: string };

function normalizeClinicCode(input: string) {
  return String(input || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const email = String(body?.email || "").trim().toLowerCase();
    const password = String(body?.password || "");
    const clinicCode = normalizeClinicCode(body?.clinicCode || ""); // opcional

    if (!email || !password) {
      return NextResponse.json({ ok: false, error: "MISSING_FIELDS" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, email: true, passwordHash: true, isActive: true, lockedUntil: true },
    });

    if (!user || !user.isActive || !user.passwordHash) {
      return NextResponse.json({ ok: false, error: "INVALID_CREDENTIALS" }, { status: 401 });
    }

    if (user.lockedUntil && user.lockedUntil > new Date()) {
      return NextResponse.json({ ok: false, error: "LOCKED" }, { status: 423 });
    }

    const valid = await compare(password, user.passwordHash);
    if (!valid) {
      return NextResponse.json({ ok: false, error: "INVALID_CREDENTIALS" }, { status: 401 });
    }

    // ✅ Caso 1: No clinicCode -> ir a selector de workspaces
    if (!clinicCode) {
      const res = NextResponse.json({ ok: true, next: "/select-workspace" });
      const session: SessionShape = { userId: user.id };
      res.cookies.set(COOKIE_NAME, JSON.stringify(session), {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      });
      return res;
    }

    // ✅ Caso 2: clinicCode -> entrar directo a esa clínica (si es miembro)
    const clinic = await prisma.clinic.findUnique({
      where: { code: clinicCode },
      select: { id: true, code: true, name: true },
    });

    if (!clinic) {
      return NextResponse.json({ ok: false, error: "CLINIC_NOT_FOUND" }, { status: 404 });
    }

    const member = await prisma.clinicMember.findUnique({
      where: { clinicId_userId: { clinicId: clinic.id, userId: user.id } },
      select: { status: true, role: true },
    });

    if (!member || member.status !== "ACTIVE") {
      return NextResponse.json({ ok: false, error: "NOT_A_MEMBER" }, { status: 403 });
    }

    // Elegir Location (si hay LocationMember, respetarlo; si no, usar la primera activa)
    const locationMembers = await prisma.locationMember.findMany({
      where: { userId: user.id, clinicId: clinic.id },
      select: { locationId: true },
    });

    let locationId: string | null = null;

    if (locationMembers.length > 0) {
      // Tomamos la primera location permitida que esté activa
      const allowedIds = locationMembers.map((x) => x.locationId);
      const loc = await prisma.location.findFirst({
        where: { clinicId: clinic.id, isActive: true, id: { in: allowedIds } },
        select: { id: true },
        orderBy: { createdAt: "asc" },
      });
      locationId = loc?.id ?? null;
    } else {
      // No hay restricciones por location -> primera activa
      const loc = await prisma.location.findFirst({
        where: { clinicId: clinic.id, isActive: true },
        select: { id: true },
        orderBy: { createdAt: "asc" },
      });
      locationId = loc?.id ?? null;
    }

    if (!locationId) {
      return NextResponse.json({ ok: false, error: "NO_ACTIVE_LOCATION" }, { status: 409 });
    }

    const res = NextResponse.json({ ok: true, next: "/dashboard" });
    const session: SessionShape = { userId: user.id, clinicId: clinic.id, locationId };
    res.cookies.set(COOKIE_NAME, JSON.stringify(session), {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });
    return res;
  } catch (e) {
    return NextResponse.json({ ok: false, error: "SERVER_ERROR" }, { status: 500 });
  }
}
