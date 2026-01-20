// app/api/auth/select-workspace/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { COOKIE_NAME, parseSession } from "@/lib/auth";

type Body = {
  clinicId?: string;
  locationId?: string;
};

async function readSession() {
  // En tu setup cookies() es async ✅
  const cookieStore = await cookies();
  const raw = cookieStore.get(COOKIE_NAME)?.value;
  return parseSession(raw);
}

export async function POST(req: Request) {
  try {
    const session = await readSession();
    if (!session.userId) {
      return NextResponse.json({ ok: false, error: "UNAUTHORIZED" }, { status: 401 });
    }

    const body = (await req.json().catch(() => ({}))) as Body;
    const clinicId = String(body?.clinicId ?? "").trim();
    const locationId = String(body?.locationId ?? "").trim();

    if (!clinicId || !locationId) {
      return NextResponse.json({ ok: false, error: "MISSING_FIELDS" }, { status: 400 });
    }

    // 1) Validar que el user pertenece a la clínica (ACTIVE)
    const member = await prisma.clinicMember.findFirst({
      where: { userId: session.userId, clinicId, status: "ACTIVE" },
      select: { id: true },
    });

    if (!member) {
      return NextResponse.json({ ok: false, error: "FORBIDDEN" }, { status: 403 });
    }

    // 2) Validar que la sede pertenece a esa clínica y está activa
    const loc = await prisma.location.findFirst({
      where: { id: locationId, clinicId, isActive: true },
      select: { id: true },
    });

    if (!loc) {
      return NextResponse.json({ ok: false, error: "INVALID_LOCATION" }, { status: 400 });
    }

    // 3) Si existen LocationMember rows para ese user+clinic, entonces restringe
    const locationMembers = await prisma.locationMember.findMany({
      where: { userId: session.userId, clinicId },
      select: { locationId: true },
    });

    if (locationMembers.length > 0) {
      const allowed = new Set(locationMembers.map((x) => x.locationId));
      if (!allowed.has(locationId)) {
        return NextResponse.json({ ok: false, error: "LOCATION_FORBIDDEN" }, { status: 403 });
      }
    }

    // 4) Set cookie con el workspace seleccionado
    const res = NextResponse.json({ ok: true, next: "/dashboard" });

    res.cookies.set(
      COOKIE_NAME,
      JSON.stringify({
        userId: session.userId,
        clinicId,
        locationId,
      }),
      {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      }
    );

    return res;
  } catch (e: any) {
    const detail = typeof e?.message === "string" ? e.message : "SERVER_ERROR";
    return NextResponse.json({ ok: false, error: "SERVER_ERROR", detail }, { status: 500 });
  }
}
