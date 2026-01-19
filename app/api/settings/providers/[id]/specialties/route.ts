// app/api/settings/providers/[userId]/specialties/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
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
  if (user.role !== "OWNER" && user.role !== "ADMIN") return { ok: false as const, status: 403, error: "Forbidden" };

  return { ok: true as const, userId: user.id, clinicId: user.clinicId };
}

export async function PUT(req: Request, { params }: { params: { userId: string } }) {
  const ctx = await requireClinicContext();
  if (!ctx.ok) return asJson({ error: ctx.error }, ctx.status);

  const body = await req.json().catch(() => null);
  if (!body) return asJson({ error: "Invalid JSON" }, 400);

  const primarySpecialty = body.primarySpecialty ?? null;
  const specialties = Array.isArray(body.specialties) ? body.specialties : [];

  const targetUser = await prisma.user.findUnique({
    where: { id: params.userId },
    select: { id: true, clinicId: true, provider: { select: { id: true } } },
  });

  if (!targetUser || targetUser.clinicId !== ctx.clinicId) return asJson({ error: "Not found" }, 404);

  // Ensure ProviderProfile exists
  const providerProfileId =
    targetUser.provider?.id ??
    (
      await prisma.providerProfile.create({
        data: { userId: targetUser.id, primarySpecialty: primarySpecialty ?? null },
        select: { id: true },
      })
    ).id;

  // Replace specialties (simple + safe)
  await prisma.providerSpecialty.deleteMany({ where: { providerId: providerProfileId } });

  if (specialties.length > 0) {
    await prisma.providerSpecialty.createMany({
      data: specialties
        .filter((s: any) => typeof s === "string" && s.length > 0)
        .map((s: string) => ({ providerId: providerProfileId, specialty: s as any })),
      skipDuplicates: true,
    });
  }

  const updated = await prisma.providerProfile.update({
    where: { id: providerProfileId },
    data: { primarySpecialty: primarySpecialty ?? null },
    select: { id: true, primarySpecialty: true, specialties: { select: { specialty: true } } },
  });

  return asJson({ providerProfile: updated });
}
