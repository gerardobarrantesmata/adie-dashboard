"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";

type UserRole = "OWNER" | "ADMIN" | "DOCTOR" | "STAFF";

type SpecialtyType =
  | "GENERAL"
  | "ENDODONTICS"
  | "PERIODONTICS"
  | "PROSTHODONTICS"
  | "ORTHODONTICS"
  | "IMPLANTS"
  | "ORAL_SURGERY"
  | "PEDIATRIC"
  | "RADIOLOGY";

const SPECIALTIES: { key: SpecialtyType; label: string }[] = [
  { key: "GENERAL", label: "General" },
  { key: "ENDODONTICS", label: "Endodontics" },
  { key: "PERIODONTICS", label: "Periodontics" },
  { key: "PROSTHODONTICS", label: "Prosthodontics" },
  { key: "ORTHODONTICS", label: "Orthodontics" },
  { key: "IMPLANTS", label: "Implants" },
  { key: "ORAL_SURGERY", label: "Oral Surgery" },
  { key: "PEDIATRIC", label: "Pediatric" },
  { key: "RADIOLOGY", label: "Radiology" },
];

type ProviderRow = {
  id: string;
  fullName: string | null;
  email: string;
  role: UserRole;
  isActive: boolean;
  provider: null | {
    id: string;
    primarySpecialty: SpecialtyType | null;
    specialties: { specialty: SpecialtyType }[];
  };
};

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-slate-700 bg-slate-900/70 px-2 py-0.5 text-[10px] text-slate-200">
      {children}
    </span>
  );
}

const API_BASE = "/api/settings/providers";

async function readJsonSafe(res: Response) {
  const contentType = res.headers.get("content-type") || "";
  const text = await res.text();

  if (contentType.includes("application/json")) {
    try {
      return JSON.parse(text);
    } catch {
      return { error: "Invalid JSON returned by server." };
    }
  }

  // If the server returned HTML (like a 404 page), avoid crashing on res.json()
  const preview = text?.slice(0, 160)?.replace(/\s+/g, " ") ?? "";
  return {
    error: `Non-JSON response (${res.status}). ${preview ? "Preview: " + preview : ""}`.trim(),
  };
}

export default function ProvidersSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [providers, setProviders] = useState<ProviderRow[]>([]);

  // create modal
  const [createOpen, setCreateOpen] = useState(false);
  const [cFullName, setCFullName] = useState("");
  const [cEmail, setCEmail] = useState("");
  const [cRole, setCRole] = useState<UserRole>("DOCTOR");
  const [cPrimary, setCPrimary] = useState<SpecialtyType | "">("");
  const [cSpecs, setCSpecs] = useState<Record<string, boolean>>({});

  // edit modal
  const [editOpen, setEditOpen] = useState(false);
  const [editUserId, setEditUserId] = useState<string | null>(null);
  const editTarget = useMemo(
    () => providers.find((p) => p.id === editUserId) ?? null,
    [providers, editUserId]
  );

  const [ePrimary, setEPrimary] = useState<SpecialtyType | "">("");
  const [eSpecs, setESpecs] = useState<Record<string, boolean>>({});

  async function load() {
    setLoading(true);
    setErr(null);

    try {
      const res = await fetch(API_BASE, { cache: "no-store" });
      const json = await readJsonSafe(res);

      if (!res.ok) throw new Error(json?.error ?? `Failed (${res.status})`);
      setProviders(json.providers ?? []);
    } catch (e: any) {
      setErr(e?.message ?? "Failed");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  function openEdit(p: ProviderRow) {
    setEditUserId(p.id);

    const primary = p.provider?.primarySpecialty ?? "";
    setEPrimary(primary as any);

    const map: Record<string, boolean> = {};
    for (const s of SPECIALTIES) map[s.key] = false;
    for (const s of p.provider?.specialties ?? []) map[s.specialty] = true;
    setESpecs(map);

    setEditOpen(true);
  }

  async function createProvider(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);

    try {
      const specialties = Object.entries(cSpecs)
        .filter(([, v]) => v)
        .map(([k]) => k);

      const res = await fetch(API_BASE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: cFullName,
          email: cEmail,
          role: cRole,
          primarySpecialty: cPrimary || null,
          specialties,
        }),
      });

      const json = await readJsonSafe(res);
      if (!res.ok) throw new Error(json?.error ?? `Create failed (${res.status})`);

      setCreateOpen(false);
      setCFullName("");
      setCEmail("");
      setCRole("DOCTOR");
      setCPrimary("");
      setCSpecs({});
      await load();
    } catch (e: any) {
      setErr(e?.message ?? "Create failed");
    }
  }

  async function saveSpecialties() {
    if (!editTarget) return;
    setErr(null);

    try {
      const specialties = Object.entries(eSpecs)
        .filter(([, v]) => v)
        .map(([k]) => k);

      const res = await fetch(`${API_BASE}/${editTarget.id}/specialties`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          primarySpecialty: ePrimary || null,
          specialties,
        }),
      });

      const json = await readJsonSafe(res);
      if (!res.ok) throw new Error(json?.error ?? `Save failed (${res.status})`);

      setEditOpen(false);
      setEditUserId(null);
      await load();
    } catch (e: any) {
      setErr(e?.message ?? "Save failed");
    }
  }

  async function toggleActive(p: ProviderRow) {
    setErr(null);

    try {
      const res = await fetch(`${API_BASE}/${p.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !p.isActive }),
      });

      const json = await readJsonSafe(res);
      if (!res.ok) throw new Error(json?.error ?? `Update failed (${res.status})`);

      await load();
    } catch (e: any) {
      setErr(e?.message ?? "Update failed");
    }
  }

  return (
    <div className="max-w-5xl space-y-4">
      <section className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold text-slate-100">Providers</p>
            <p className="text-[11px] text-slate-400 mt-1">
              Add and manage doctors/staff for your clinic. These providers will feed Calendar and
              Specialties.
            </p>
          </div>

          <button
            onClick={() => {
              const map: Record<string, boolean> = {};
              for (const s of SPECIALTIES) map[s.key] = false;
              setCSpecs(map);
              setCreateOpen(true);
            }}
            className="inline-flex items-center rounded-full border border-sky-500/70 bg-sky-500/10 px-3 py-1 text-[11px] font-semibold text-sky-300 hover:bg-sky-500/20"
          >
            + Add provider
          </button>
        </div>

        {err && (
          <div className="mt-3 rounded-xl border border-rose-900/50 bg-rose-950/40 px-3 py-2 text-[11px] text-rose-200">
            {err}
          </div>
        )}
      </section>

      <section className="rounded-2xl border border-slate-800 bg-slate-950/80 p-3">
        {loading ? (
          <p className="text-[11px] text-slate-500">Loading…</p>
        ) : providers.length === 0 ? (
          <p className="text-[11px] text-slate-500">No providers yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[11px]">
              <thead className="text-[10px] uppercase tracking-[0.18em] text-slate-500">
                <tr>
                  <th className="py-2 px-2">Name</th>
                  <th className="py-2 px-2">Email</th>
                  <th className="py-2 px-2">Role</th>
                  <th className="py-2 px-2">Specialties</th>
                  <th className="py-2 px-2">Status</th>
                  <th className="py-2 px-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="text-slate-200">
                {providers.map((p) => {
                  const specs = (p.provider?.specialties ?? []).map((s) => s.specialty);
                  return (
                    <tr key={p.id} className="border-t border-slate-800/70">
                      <td className="py-2 px-2">
                        <div className="font-semibold text-slate-100">{p.fullName ?? "—"}</div>
                      </td>
                      <td className="py-2 px-2 text-slate-300">{p.email}</td>
                      <td className="py-2 px-2">
                        <Pill>{p.role}</Pill>
                      </td>
                      <td className="py-2 px-2">
                        <div className="flex flex-wrap gap-1">
                          {p.provider?.primarySpecialty && (
                            <Pill>Primary: {p.provider.primarySpecialty}</Pill>
                          )}
                          {specs.length === 0 ? (
                            <span className="text-slate-500">—</span>
                          ) : (
                            specs.map((s) => <Pill key={s}>{s}</Pill>)
                          )}
                        </div>
                      </td>
                      <td className="py-2 px-2">
                        <Pill>{p.isActive ? "ACTIVE" : "INACTIVE"}</Pill>
                      </td>
                      <td className="py-2 px-2">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => openEdit(p)}
                            className="rounded-lg border border-slate-700 bg-slate-900/70 px-2 py-1 hover:border-sky-400"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => toggleActive(p)}
                            className="rounded-lg border border-slate-700 bg-slate-900/70 px-2 py-1 hover:border-sky-400"
                          >
                            {p.isActive ? "Disable" : "Enable"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            <p className="mt-3 text-[10px] text-slate-500">
              Tip: Calendar should consume providers from DB (this list), not hardcoded arrays.
            </p>

            <p className="mt-1 text-[10px] text-slate-600">
              Login note: new providers are created without a password here; we’ll add “Reset password /
              Invite link” next.
            </p>
          </div>
        )}
      </section>

      {/* Create modal */}
      {createOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-3"
          role="dialog"
          aria-modal="true"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setCreateOpen(false);
          }}
        >
          <div className="w-full max-w-xl rounded-2xl border border-slate-800 bg-slate-950 shadow-[0_30px_120px_rgba(0,0,0,0.65)]">
            <div className="flex items-start justify-between gap-3 border-b border-slate-800 px-4 py-3">
              <div>
                <p className="text-xs font-semibold text-slate-100">Add Provider</p>
                <p className="text-[11px] text-slate-400">Create a new provider scoped to this clinic.</p>
              </div>
              <button
                onClick={() => setCreateOpen(false)}
                className="rounded-lg border border-slate-800 bg-slate-900/70 px-2 py-1 text-[11px] text-slate-200 hover:border-sky-400"
              >
                ✕
              </button>
            </div>

            <form onSubmit={createProvider} className="px-4 py-4 space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] text-slate-300 mb-1">Full name</label>
                  <input
                    value={cFullName}
                    onChange={(e) => setCFullName(e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950/80 px-3 py-2 text-[11px] outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-500/60"
                    placeholder="Dr. John Doe"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-slate-300 mb-1">Email</label>
                  <input
                    value={cEmail}
                    onChange={(e) => setCEmail(e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950/80 px-3 py-2 text-[11px] outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-500/60"
                    placeholder="doctor@clinic.com"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-slate-300 mb-1">Role</label>
                  <select
                    value={cRole}
                    onChange={(e) => setCRole(e.target.value as UserRole)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950/80 px-3 py-2 text-[11px] outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-500/60"
                  >
                    <option value="DOCTOR">DOCTOR</option>
                    <option value="STAFF">STAFF</option>
                    <option value="ADMIN">ADMIN</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] text-slate-300 mb-1">Primary specialty</label>
                  <select
                    value={cPrimary}
                    onChange={(e) => setCPrimary(e.target.value as any)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950/80 px-3 py-2 text-[11px] outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-500/60"
                  >
                    <option value="">—</option>
                    {SPECIALTIES.map((s) => (
                      <option key={s.key} value={s.key}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-3">
                <p className="text-[11px] font-semibold tracking-[0.18em] uppercase text-slate-500 mb-2">
                  Specialties (multi-select)
                </p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {SPECIALTIES.map((s) => (
                    <label
                      key={s.key}
                      className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/60 px-3 py-2 text-[11px] text-slate-200"
                    >
                      <input
                        type="checkbox"
                        checked={Boolean(cSpecs[s.key])}
                        onChange={(e) => setCSpecs((prev) => ({ ...prev, [s.key]: e.target.checked }))}
                      />
                      {s.label}
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-800">
                <div className="text-[10px] text-slate-500">
                  This writes to Postgres with clinicId guardrails (safe multi-tenant).
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setCreateOpen(false)}
                    className="rounded-xl border border-slate-800 bg-slate-900/70 px-3 py-2 text-[11px] text-slate-200 hover:border-sky-400"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-xl border border-sky-500/70 bg-sky-500/10 px-3 py-2 text-[11px] font-semibold text-sky-300 hover:bg-sky-500/20"
                  >
                    Create provider
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit modal */}
      {editOpen && editTarget && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-3"
          role="dialog"
          aria-modal="true"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setEditOpen(false);
          }}
        >
          <div className="w-full max-w-xl rounded-2xl border border-slate-800 bg-slate-950 shadow-[0_30px_120px_rgba(0,0,0,0.65)]">
            <div className="flex items-start justify-between gap-3 border-b border-slate-800 px-4 py-3">
              <div>
                <p className="text-xs font-semibold text-slate-100">Edit Specialties</p>
                <p className="text-[11px] text-slate-400">
                  {editTarget.fullName ?? "—"} · {editTarget.email}
                </p>
              </div>
              <button
                onClick={() => setEditOpen(false)}
                className="rounded-lg border border-slate-800 bg-slate-900/70 px-2 py-1 text-[11px] text-slate-200 hover:border-sky-400"
              >
                ✕
              </button>
            </div>

            <div className="px-4 py-4 space-y-3">
              <div>
                <label className="block text-[11px] text-slate-300 mb-1">Primary specialty</label>
                <select
                  value={ePrimary}
                  onChange={(e) => setEPrimary(e.target.value as any)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950/80 px-3 py-2 text-[11px] outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-500/60"
                >
                  <option value="">—</option>
                  {SPECIALTIES.map((s) => (
                    <option key={s.key} value={s.key}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-3">
                <p className="text-[11px] font-semibold tracking-[0.18em] uppercase text-slate-500 mb-2">
                  Specialties (multi-select)
                </p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {SPECIALTIES.map((s) => (
                    <label
                      key={s.key}
                      className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/60 px-3 py-2 text-[11px] text-slate-200"
                    >
                      <input
                        type="checkbox"
                        checked={Boolean(eSpecs[s.key])}
                        onChange={(e) => setESpecs((prev) => ({ ...prev, [s.key]: e.target.checked }))}
                      />
                      {s.label}
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-800">
                <div className="text-[10px] text-slate-500">
                  Next: add “Invite/Reset password” so clinic admins never touch scripts.
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setEditOpen(false)}
                    className="rounded-xl border border-slate-800 bg-slate-900/70 px-3 py-2 text-[11px] text-slate-200 hover:border-sky-400"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={saveSpecialties}
                    className="rounded-xl border border-sky-500/70 bg-sky-500/10 px-3 py-2 text-[11px] font-semibold text-sky-300 hover:bg-sky-500/20"
                  >
                    Save
                  </button>
                </div>
              </div>

              <Link href="/calendar" className="block text-center text-[11px] text-slate-400 hover:text-sky-300">
                Go to Calendar (providers should appear there once we connect Calendar → DB)
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
