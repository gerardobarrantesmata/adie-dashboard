"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function prettyError(code: string) {
  switch (code) {
    case "MISSING_FIELDS":
      return "Faltan datos. Revisa Email y Password.";
    case "INVALID_CREDENTIALS":
      return "Credenciales inválidas.";
    case "LOCKED":
      return "Cuenta bloqueada temporalmente. Intenta más tarde.";
    case "CLINIC_NOT_FOUND":
      return "Clinic Code no existe. Verifica el código.";
    case "NOT_A_MEMBER":
      return "Tu usuario no tiene acceso a esa clínica.";
    case "NO_ACTIVE_LOCATION":
      return "Esa clínica no tiene una sede activa configurada.";
    case "SERVER_ERROR":
      return "Error del servidor. Revisa la consola/terminal.";
    default:
      return code || "Login falló.";
  }
}

export default function LoginPage() {
  const router = useRouter();
  const sp = useSearchParams();
  const nextFromUrl = sp.get("next");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // ✅ opcional: si se llena -> el API intenta entrar directo a esa clínica
  const [clinicCode, setClinicCode] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          password,
          clinicCode: clinicCode.trim(), // ✅ opcional
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(prettyError(String(data?.error || "")));
        setLoading(false);
        return;
      }

      const next = String(data?.next || "").trim();
      const target = next || nextFromUrl || "/select-workspace";
      router.push(target);
      router.refresh();
    } catch {
      setError("Error de red. Revisa tu conexión.");
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6">
      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-[0_18px_60px_rgba(15,23,42,0.75)]">
        <h1 className="text-lg font-semibold tracking-wide">ADIE — Login</h1>
        <p className="mt-1 text-xs text-slate-400">
          Ingresa con <b>Email + Password</b>. Si escribes <b>Clinic Code</b>, entras directo a esa clínica.
        </p>

        <form className="mt-5 space-y-3" onSubmit={onSubmit}>
          <div>
            <label className="text-xs text-slate-300">Email</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950/70 px-3 py-2 text-sm outline-none focus:border-amber-400"
              placeholder="ej: doctor@clinica.com"
              autoComplete="email"
              required
            />
          </div>

          <div>
            <label className="text-xs text-slate-300">Password</label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950/70 px-3 py-2 text-sm outline-none focus:border-amber-400"
              type="password"
              autoComplete="current-password"
              required
            />
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label className="text-xs text-slate-300">Clinic Code (opcional)</label>
              <span className="text-[10px] text-slate-500">ej: gbm-services-llc</span>
            </div>
            <input
              value={clinicCode}
              onChange={(e) => setClinicCode(e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950/70 px-3 py-2 text-sm outline-none focus:border-amber-400"
              placeholder="ej: ortho-club-01"
              autoComplete="off"
              inputMode="text"
            />
            <p className="mt-1 text-[11px] text-slate-500">
              Si lo dejas vacío, podrás escoger la clínica después en <b>Select Workspace</b>.
            </p>
          </div>

          {error && (
            <div className="rounded-xl border border-red-900/50 bg-red-950/40 p-3 text-xs text-red-200">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-amber-500 px-4 py-2 text-sm font-semibold text-slate-950 disabled:opacity-60"
          >
            {loading ? "Ingresando..." : "Login"}
          </button>
        </form>
      </div>
    </main>
  );
}
