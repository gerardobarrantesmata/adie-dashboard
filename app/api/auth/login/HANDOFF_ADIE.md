# ADIE — Handoff (Estado de trabajo)

## Objetivo actual
Dejar login funcionando estable (Clinic Code + Email + Password), Prisma Studio operando, y preparar base para multi-clinic.

## Qué ya funciona (confirmado hoy)
- Next dev corre local.
- Prisma Studio abre en http://localhost:5555
- Se creó/actualizó Clinic con code: Ortho-Club
- Script set-password funciona y actualiza passwordHash para usuario.
- Login en http://localhost:3000/login ya permite ingresar (confirmado).

## Datos actuales en BD (DEV)
- Clinic.code = "Ortho-Club"
- Usuario: <email>  (role OWNER) ligado al clinicId de Ortho-Club

## Archivos importantes tocados / existentes
- scripts/set-password.ts  (resetea passwordHash por email, opcional clinicCode)
- app/api/auth/login/route.ts  (set cookie session)
- app/api/auth/logout/route.ts

## Problemas/pendientes para próxima sesión
1) “Autofill” en login muestra datos reales (Ortho-Club / danielbar...) -> cambiar a placeholders o limpiar autofill/localStorage.
2) Limpiar errores rojos de terminal:
   - lock .next/dev.lock por múltiples next dev corriendo
   - puerto 3000 ocupado -> usar kill PID, borrar .next y reiniciar
3) Revisar si hay errores en UI tipo TURBOPACK "__set is not a function" (si reaparece).
4) Estandarizar Clinic Code demo (ej: "adie") y email demo (ej: "adie@gmail.com") sin nombres reales.

## Comandos útiles (Windows PowerShell)
- Borrar build:
  Remove-Item -Recurse -Force .next
- Ver puertos:
  netstat -ano | findstr :3000
  netstat -ano | findstr :3001
- Matar PID:
  taskkill /PID <PID> /F
- Correr dev:
  npm run dev
- Prisma Studio:
  npx prisma studio
