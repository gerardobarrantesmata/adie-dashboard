import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { signSessionToken } from "@/lib/auth";

const COOKIE_NAME = process.env.AUTH_COOKIE_NAME || "adie_session";
const IS_PROD = process.env.NODE_ENV === "production";

const MAX_FAILS = 5;
const LOCK_MINUTES = 15;
const SESSION_HOURS = 12;

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));

    const clinicCodeRaw = String(body?.clinicCode ?? "").trim();
    const email = String(body?.email ?? "").trim().toLowerCase();
    const password = String(body?.password ?? "");

    if (!clinicCodeRaw || !email || !password) {
      return NextResponse.json({ error: "Faltan datos." }, { status: 400 });
    }

    // Clinic code case-insensitive (evita fallos por mayúsculas/minúsculas)
    const clinic = await prisma.clinic.findFirst({
      where: { code: { equals: clinicCodeRaw, mode: "insensitive" } },
      select: { id: true, code: true },
    });

    if (!clinic) {
      return NextResponse.json({ error: "Clinic Code inválido." }, { status: 401 });
    }

    // unique compuesto (clinicId + email)
    const user = await prisma.user.findUnique({
      where: {
        clinicId_email: { clinicId: clinic.id, email },
      },
      select: {
        id: true,
        clinicId: true,
        email: true,
        role: true,
        isActive: true,
        passwordHash: true,
        failedLoginCount: true,
        lockedUntil: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "Email o password incorrecto." }, { status: 401 });
    }

    if (!user.isActive) {
      return NextResponse.json(
        { error: "Usuario inactivo. Contacta al administrador." },
        { status: 403 }
      );
    }

    if (user.lockedUntil && user.lockedUntil > new Date()) {
      return NextResponse.json(
        { error: "Cuenta bloqueada temporalmente. Intenta más tarde." },
        { status: 429 }
      );
    }

    if (!user.passwordHash) {
      return NextResponse.json(
        { error: "Este usuario no tiene password configurado aún." },
        { status: 403 }
      );
    }

    const ok = await bcrypt.compare(password, user.passwordHash);

    if (!ok) {
      const nextFails = (user.failedLoginCount ?? 0) + 1;
      const lock =
        nextFails >= MAX_FAILS
          ? new Date(Date.now() + LOCK_MINUTES * 60 * 1000)
          : null;

      await prisma.user.update({
        where: { id: user.id },
        data: { failedLoginCount: nextFails, lockedUntil: lock },
      });

      return NextResponse.json({ error: "Email o password incorrecto." }, { status: 401 });
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { failedLoginCount: 0, lockedUntil: null, lastLoginAt: new Date() },
    });

    const token = await signSessionToken({
      userId: user.id,
      clinicId: user.clinicId,
      role: user.role,
      email: user.email,
    });

    const res = NextResponse.json({ ok: true });

    // ✅ Cookie válida para TODA la app (incluye /api/settings/*)
    res.cookies.set({
      name: COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: IS_PROD,
      sameSite: "lax",
      path: "/", // <- clave
      maxAge: 60 * 60 * SESSION_HOURS,
    });

    return res;
  } catch (e) {
    console.error("[LOGIN_ERROR]", e);
    return NextResponse.json({ error: "Error interno en login." }, { status: 500 });
  }
}
