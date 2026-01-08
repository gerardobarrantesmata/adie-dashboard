// app/api/settings/providers/[userId]/route.ts
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

export async function PATCH(req: Request, { params }: { params: { userId: string } }) {
  const ctx = await requireClinicContext();
  if (!ctx.ok) return asJson({ error: ctx.error }, ctx.status);

  const targetUserId = params.userId;
  const body = await req.json().catch(() => null);
  if (!body) return asJson({ error: "Invalid JSON" }, 400);

  const fullName = body.fullName != null ? String(body.fullName).trim() : undefined;
  const isActive = body.isActive != null ? Boolean(body.isActive) : undefined;
  const role = body.role != null ? String(body.role) : undefined;

  const target = await prisma.user.findUnique({
    where: { id: targetUserId },
    select: { id: true, clinicId: true },
  });
  if (!target || target.clinicId !== ctx.clinicId) return asJson({ error: "Not found" }, 404);

  if (role && !["OWNER", "ADMIN", "DOCTOR", "STAFF"].includes(role)) {
    return asJson({ error: "Invalid role" }, 400);
  }

  const updated = await prisma.user.update({
    where: { id: targetUserId },
    data: {
      ...(fullName !== undefined ? { fullName } : {}),
      ...(isActive !== undefined ? { isActive } : {}),
      ...(role !== undefined ? { role: role as any } : {}),
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

  return asJson({ provider: updated });
}
