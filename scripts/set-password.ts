// scripts/set-password.ts
import dotenv from "dotenv";
import bcrypt from "bcryptjs";

// Cargar variables de entorno (primero .env.local, luego .env por si acaso)
dotenv.config({ path: ".env.local" });
dotenv.config({ path: ".env" });

async function main() {
  const email = process.argv[2];
  const password = process.argv[3];
  const clinicCode = process.argv[4]; // opcional

  if (!email || !password) {
    console.log(
      'Uso:\n  npx tsx scripts/set-password.ts "email" "PasswordTemporal#2025"\n' +
        'Si el email existe en varias clínicas:\n  npx tsx scripts/set-password.ts "email" "PasswordTemporal#2025" "CLINIC-CODE"'
    );
    process.exit(1);
  }

  // Import dinámico para que dotenv ya haya cargado antes de instanciar Prisma
  const { prisma } = await import("../lib/prisma");

  // 1) Si te pasan clinicCode, resolvemos clínica y buscamos ese user en esa clínica
  if (clinicCode) {
    const clinic = await prisma.clinic.findUnique({ where: { code: clinicCode } });

    if (!clinic) {
      console.error("No existe una clínica con code:", clinicCode);
      process.exit(1);
    }

    const user = await prisma.user.findFirst({
      where: { email: email.toLowerCase(), clinicId: clinic.id },
      select: { id: true, clinicId: true, email: true },
    });

    if (!user) {
      console.error(`No existe usuario con email ${email} en la clínica ${clinicCode}`);
      process.exit(1);
    }

    const passwordHash = await bcrypt.hash(password, 12);

    await prisma.user.update({
      where: { id: user.id }, // ✅ único
      data: {
        passwordHash,
        failedLoginCount: 0,
        lockedUntil: null,
        lastLoginAt: null,
      },
    });

    console.log(`OK ✅ Password seteado para ${email} (clinicCode=${clinicCode})`);
    return;
  }

  // 2) Si NO te pasan clinicCode, buscamos por email (puede haber 1 o varios)
  const matches = await prisma.user.findMany({
    where: { email: email.toLowerCase() },
    select: {
      id: true,
      email: true,
      clinic: { select: { code: true, name: true } },
    },
  });

  if (matches.length === 0) {
    console.error("No existe un usuario con ese email:", email);
    process.exit(1);
  }

  if (matches.length > 1) {
    console.error(
      `Ese email existe en ${matches.length} clínicas. Para seguridad, indicá clinicCode:\n` +
        matches
          .map((u) => `- ${u.clinic?.code ?? "(sin-code)"} | ${u.clinic?.name ?? "(sin-nombre)"}`)
          .join("\n")
    );
    console.error(`\nEjemplo:\n  npx tsx scripts/set-password.ts "${email}" "${password}" "CLINIC-CODE"`);
    process.exit(1);
  }

  const user = matches[0];
  const passwordHash = await bcrypt.hash(password, 12);

  await prisma.user.update({
    where: { id: user.id }, // ✅ único
    data: {
      passwordHash,
      failedLoginCount: 0,
      lockedUntil: null,
      lastLoginAt: null,
    },
  });

  console.log(`OK ✅ Password seteado para ${email} (clinicCode=${user.clinic?.code ?? "N/A"})`);
}

main().catch((e) => {
  console.error("[SET_PASSWORD_ERROR]", e);
  process.exit(1);
});
