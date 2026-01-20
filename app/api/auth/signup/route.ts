// app/api/auth/signup/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hash } from "bcryptjs";

const COOKIE_NAME = process.env.AUTH_COOKIE_NAME || "adie_session";

function slugifyClinicCode(input: string) {
  return input
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "") // letras, numeros y guiones
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const clinicName = String(body?.clinicName ?? "").trim();
    const clinicCodeRaw = String(body?.clinicCode ?? "");
    const country = String(body?.country ?? "").trim();
    const city = String(body?.city ?? "").trim();

    const ownerFullName = String(body?.ownerFullName ?? "").trim();
    const ownerEmail = String(body?.ownerEmail ?? "").trim().toLowerCase();
    const password = String(body?.password ?? "");

    const clinicCode = slugifyClinicCode(clinicCodeRaw);

    // 1) Validaciones
    if (!clinicName || !clinicCode || !country || !city || !ownerFullName || !ownerEmail || !password) {
      return NextResponse.json({ ok: false, error: "MISSING_FIELDS" }, { status: 400 });
    }

    if (clinicCode.length < 3 || clinicCode.length > 40) {
      return NextResponse.json({ ok: false, error: "INVALID_CLINIC_CODE_LENGTH" }, { status: 400 });
    }

    if (!/^[a-z0-9-]+$/.test(clinicCode)) {
      return NextResponse.json({ ok: false, error: "INVALID_CLINIC_CODE_FORMAT" }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json({ ok: false, error: "WEAK_PASSWORD" }, { status: 400 });
    }

    const passwordHash = await hash(password, 12);

    // 2) Transaccion: crea Clinic + Location + User + Memberships
    const result = await prisma.$transaction(async (tx) => {
      const clinic = await tx.clinic.create({
        data: {
          name: clinicName,
          code: clinicCode,
          country,
          city,
        },
        select: { id: true, name: true, code: true },
      });

      const location = await tx.location.create({
        data: {
          clinicId: clinic.id,
          name: "Main",
          country,
          city,
          isActive: true,
        },
        select: { id: true, clinicId: true, name: true },
      });

      const user = await tx.user.create({
        data: {
          email: ownerEmail,
          fullName: ownerFullName,
          isActive: true,
          passwordHash,
        },
        select: { id: true, email: true },
      });

      await tx.clinicMember.create({
        data: {
          clinicId: clinic.id,
          userId: user.id,
          role: "OWNER",
          status: "ACTIVE",
        },
        select: { id: true },
      });

      await tx.locationMember.create({
        data: {
          clinicId: clinic.id,
          userId: user.id,
          locationId: location.id,
        },
        select: { id: true },
      });

      // ✅ Regla pro: si el usuario termina con 1 sola clínica y 1 sola sede -> dashboard
      // (si en el futuro el mismo email tuviera más clínicas, esto mandaría a select-workspace)
      const clinicCount = await tx.clinicMember.count({
        where: { userId: user.id, status: "ACTIVE" },
      });

      const activeLocationsCount = await tx.location.count({
        where: { clinicId: clinic.id, isActive: true },
      });

      const autoEnter = clinicCount === 1 && activeLocationsCount === 1;

      return { clinic, location, user, autoEnter };
    });

    // 3) Cookie + redirect target
    const session =
      result.autoEnter
        ? { userId: result.user.id, clinicId: result.clinic.id, locationId: result.location.id }
        : { userId: result.user.id };

    const next = result.autoEnter ? "/dashboard" : "/select-workspace";

    const res = NextResponse.json({ ok: true, clinic: result.clinic, next });

    res.cookies.set(COOKIE_NAME, JSON.stringify(session), {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return res;
  } catch (e: any) {
    // Prisma unique constraint
    if (e?.code === "P2002") {
      const target = Array.isArray(e?.meta?.target) ? e.meta.target.join(",") : String(e?.meta?.target ?? "");
      if (target.includes("code")) return NextResponse.json({ ok: false, error: "CLINIC_CODE_TAKEN" }, { status: 409 });
      if (target.includes("email")) return NextResponse.json({ ok: false, error: "EMAIL_TAKEN" }, { status: 409 });
      return NextResponse.json({ ok: false, error: "DUPLICATE" }, { status: 409 });
    }

    const detail = typeof e?.message === "string" ? e.message : "SERVER_ERROR";
    return NextResponse.json({ ok: false, error: "SERVER_ERROR", detail }, { status: 500 });
  }
}
