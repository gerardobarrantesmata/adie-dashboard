# ADIE — HANDOFF (Estado de trabajo)

## 1) Estado actual (lo que ya funciona)
- ✅ Login page funciona en local: `http://localhost:3000/login`
- ✅ Pudimos ingresar con:
  - Clinic Code: **Ortho-Club**
  - Email: **danielbar@gmail.com**
  - Password: (ya seteado desde script)
- ✅ Auth por cookie ya está implementado (middleware + routes).
- ✅ Se hizo `git commit` y `git push` y el repo quedó en **working tree clean**.

## 2) Estructura real de rutas (importante para no confundir)
En este proyecto (Next.js App Router), los endpoints están así:
- `app/api/auth/login/route.ts`
- `app/api/auth/logout/route.ts`

🔎 Nota: **es `route.ts` (singular)** por convención de Next.js.  
En el Explorer puede verse como “routes.ts” en algunas vistas/agrupaciones, pero el archivo correcto para endpoints es `route.ts`.

## 3) Autocomplete en Login (pendiente)
- Problema: en el formulario aparece “Ortho-Club” y “danielbar…” prellenado.
- Causa probable: el navegador/Chrome está autocompletando o hay `localStorage`/estado guardado.
- Pendiente: cambiar placeholders a valores demo (ej: `adie`, `adie@gmail.com`) y desactivar autofill si se quiere.

## 4) Problemas rojos / errores que vimos (pendientes de depurar)
### A) Next dev / puerto ocupado / lock
- Se vio error tipo:
  - “Port 3000 is in use…”
  - “Unable to acquire lock at .next/dev/lock… another next dev running?”
- Fix (PowerShell):
  - Ver procesos por puerto:
    - `netstat -ano | findstr :3000`
    - `netstat -ano | findstr :3001`
  - Matar PID:
    - `taskkill /PID <PID> /F`
  - Limpiar build:
    - `Remove-Item -Recurse -Force .next`

### B) Prisma Studio error (apareció “Prisma Client Error / Unable to run script”)
- Se abrió Prisma Studio en `http://localhost:5555`
- Apareció modal “Prisma Client Error: Unable to run script”
- Pendiente: revisar conexión real a DB (env), Prisma client generado, y logs exactos del modal (Show details).

### C) Errores rojos en terminal relacionados a node_modules/Next sourcemaps (no bloquean)
- Se vio error tipo “Invalid source map… could not be parsed” apuntando a `node_modules/next/...`
- Pendiente: confirmar si es solo warning de sourcemaps (dev) y si vale ignorarlo o ajustar configuración.

## 5) .env.local / variables (estado y notas)
- Tenemos variables de DigitalOcean Postgres:
  - `POSTGRES_HOST`
  - `POSTGRES_PORT=25060`
  - `POSTGRES_DATABASE=adie_dev`
  - `POSTGRES_USER=doadmin`
  - `POSTGRES_PASSWORD=...`
  - `POSTGRES_SSLMODE=require`

- Importante:
  - Password de **DO Postgres** NO es el password del usuario “Ortho” en Prisma.
  - El password del usuario “Ortho” es app-level (tabla User), y el de DO Postgres es DB-level (conexión).

- Pendiente:
  - Confirmar que Prisma esté usando el nombre correcto de variable de conexión.
  - En Prisma normalmente es `DATABASE_URL` (no `DATABASE_URL_`).
  - Verificar si el proyecto espera `DATABASE_URL`, `DATABASE_URL_DIRECT`, `SHADOW_DATABASE_URL` o `DIRECT_URL` (según schema/config).

## 6) Archivos clave tocados/creados (para ubicar rápido)
- `scripts/set-password.ts` (setear passwordHash para un email)
- `app/api/auth/login/route.ts` (login: set cookie de sesión)
- `app/api/auth/logout/route.ts` (logout: limpiar cookie)
- `middleware.ts` (proteger rutas: si no hay cookie válida -> redirect /login)
- `lib/auth.ts` y/o `lib/auth_legacy.ts` (helpers token/session)
- `lib/prisma.ts` (Prisma client)
- `prisma/schema.prisma` + migrations
- `HANDOFF_ADIE.md` (este resumen)

## 7) Estado Git (ya guardado)
- ✅ Se ejecutó:
  - `git commit -m "Auth routes + prisma setup + handoff notes + ignore env"`
  - `git push`
- ✅ Resultado: repo limpio y sincronizado.

## 8) Próxima sesión (orden recomendado)
1) Estabilizar dev server (sin locks / sin puertos ocupados).
2) Arreglar Prisma Studio “Unable to run script”:
   - validar `DATABASE_URL` real que Prisma usa
   - correr `npx prisma generate`
   - revisar modal “Show details” y logs terminal
3) Limpiar autofill/placeholder en login (demo values).
4) Confirmar que auth redirect funcione estable (login -> dashboard, logout -> /login).

## 9) Comandos útiles (PowerShell)
- Limpiar build:
  - `Remove-Item -Recurse -Force .next`
- Ver puertos:
  - `netstat -ano | findstr :3000`
  - `netstat -ano | findstr :3001`
- Matar proceso:
  - `taskkill /PID <PID> /F`
- Correr dev:
  - `npm run dev`
- Prisma:
  - `npx prisma generate`
  - `npx prisma studio`
