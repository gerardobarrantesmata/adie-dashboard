import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

const COOKIE_NAME = process.env.AUTH_COOKIE_NAME || "adie_session";

type SessionShape = { userId?: string; clinicId?: string; locationId?: string };

async function readSession(): Promise<SessionShape> {
  const cookieStore = await cookies(); // ✅ IMPORTANT: cookies() is async in your setup
  const raw = cookieStore.get(COOKIE_NAME)?.value;
  if (!raw) return {};
  try {
    return JSON.parse(raw) as SessionShape;
  } catch {
    return {};
  }
}

export async function GET() {
  const session = await readSession();

  if (!session.userId) {
    return NextResponse.json({ ok: false, error: "UNAUTHORIZED" }, { status: 401 });
  }

  // 1) Clinic memberships
  const memberships = await prisma.clinicMember.findMany({
    where: { userId: session.userId, status: "ACTIVE" },
    select: {
      clinicId: true,
      role: true,
      clinic: { select: { id: true, name: true, code: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  const clinicIds = [...new Set(memberships.map((m) => m.clinicId))];

  if (clinicIds.length === 0) {
    return NextResponse.json({ ok: true, workspaces: [] });
  }

  // 2) Active locations for those clinics
  const locations = await prisma.location.findMany({
    where: { clinicId: { in: clinicIds }, isActive: true },
    select: { id: true, clinicId: true, name: true, city: true, country: true },
    orderBy: [{ clinicId: "asc" }, { createdAt: "asc" }],
  });

  // 3) LocationMember restrictions (optional)
  const locationMembers = await prisma.locationMember.findMany({
    where: { userId: session.userId, clinicId: { in: clinicIds } },
    select: { locationId: true },
  });

  const allowedLocationIds = new Set(locationMembers.map((lm) => lm.locationId));

  // If there are no LocationMember rows yet, allow all clinic locations (your intended behavior).
  const filteredLocations =
    locationMembers.length === 0
      ? locations
      : locations.filter((loc) => allowedLocationIds.has(loc.id));

  const payload = memberships.map((m) => ({
    clinic: m.clinic,
    role: m.role,
    locations: filteredLocations
      .filter((loc) => loc.clinicId === m.clinicId)
      .map((loc) => ({
        id: loc.id,
        name: loc.name,
        city: loc.city,
        country: loc.country,
      })),
  }));

  return NextResponse.json({ ok: true, workspaces: payload });
}
