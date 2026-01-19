// app/api/settings/providers/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthedUserId } from "@/lib/auth";

function asJson(body: any, status = 200) {
  return NextResponse.json(body, { status });
}

async function requireClinicContext() {
  const userId = await getAuthedUserId();
  if (!userId) return { ok: false as const, status: 401, error: "Unauthorized" };

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, clinicId: true, role: true },
  });

  if (!user) return { ok: false as const, status: 401, error: "Unauthorized" };

  // Guardrail: only OWNER/ADMIN can manage providers
  if (user.role !== "OWNER" && user.role !== "ADMIN") {
    return { ok: false as const, status: 403, error: "Forbidden" };
  }

  return { ok: true as const, userId: user.id, clinicId: user.clinicId };
}

export async function GET() {
  const ctx = await requireClinicContext();
  if (!ctx.ok) return asJson({ error: ctx.error }, ctx.status);

  const users = await prisma.user.findMany({
    where: { clinicId: ctx.clinicId },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      fullName: true,
      email: true,
      role: true,
      isActive: true,
      provider: {
        select: {
          id: true,
          primarySpecialty: true,
          specialties: { select: { specialty: true } },
        },
      },
    },
  });

  return asJson({ providers: users });
}

export async function POST(req: Request) {
  const ctx = await requireClinicContext();
  if (!ctx.ok) return asJson({ error: ctx.error }, ctx.status);

  const body = await req.json().catch(() => null);
  if (!body) return asJson({ error: "Invalid JSON" }, 400);

  const fullName = String(body.fullName ?? "").trim();
  const email = String(body.email ?? "").trim().toLowerCase();
  const role = String(body.role ?? "DOCTOR");
  const primarySpecialty = body.primarySpecialty ?? null;
  const specialties = Array.isArray(body.specialties) ? body.specialties : [];

  if (!fullName || !email) return asJson({ error: "fullName and email are required" }, 400);
  if (!["OWNER", "ADMIN", "DOCTOR", "STAFF"].includes(role)) return asJson({ error: "Invalid role" }, 400);

  const existing = await prisma.user.findUnique({
    where: { clinicId_email: { clinicId: ctx.clinicId, email } },
    select: { id: true },
  });
  if (existing) return asJson({ error: "A user with this email already exists in this clinic" }, 409);

  const created = await prisma.user.create({
    data: {
      clinicId: ctx.clinicId,
      role: role as any,
      email,
      fullName,
      isActive: true,
      provider: {
        create: {
          primarySpecialty: primarySpecialty ?? null,
          specialties: {
            create: specialties
              .filter((s: any) => typeof s === "string" && s.length > 0)
              .map((s: string) => ({ specialty: s as any })),
          },
        },
      },
    },
    select: {
      id: true,
      fullName: true,
      email: true,
      role: true,
      isActive: true,
      provider: {
        select: {
          id: true,
          primarySpecialty: true,
          specialties: { select: { specialty: true } },
        },
      },
    },
  });

  return asJson({ provider: created }, 201);
}
