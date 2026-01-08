"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";

type ProviderRow = {
  id: string; // User.id
  email: string;
  fullName: string | null;
  isActive: boolean;
  role: "DOCTOR";
  provider: null | {
    id: string; // ProviderProfile.id
    licenseNumber: string | null;
    primarySpecialty: string | null;
    specialties: { specialty: string }[];
  };
};

const SPECIALTY_OPTIONS: { value: string; label: string }[] = [
  { value: "GENERAL", label: "General" },
  { value: "ENDODONTICS", label: "Endodontics" },
  { value: "PERIODONTICS", label: "Periodontics" },
  { value: "PROSTHODONTICS", label: "Prosthodontics" },
  { value: "ORTHODONTICS", label: "Orthodontics" },
  { value: "IMPLANTS", label: "Implants" },
  { value: "ORAL_SURGERY", label: "Oral surgery" },
  { value: "PEDIATRIC", label: "Pediatric" },
  { value: "RADIOLOGY", label: "Radiology" },
  // NOTA: ocultamos ORTHODONTONTICS (typo) para que nadie lo use.
];

function cx(...s: Array<string | false | null | undefined>) {
  return s.filter(Boolean).join(" ");
}

export default function TeamSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [providers, setProviders] = useState<ProviderRow[]>([]);
  const [query, setQuery] = useState("");
  const [showInactive, setShowInactive] = useState(false);

  // Modal create/edit
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<ProviderRow | null>(null);

  // form state
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [licenseNumber, setLicenseNumber] = useState("");
  const [primarySpecialty, setPrimarySpecialty] = useState<string>("");
  const [specialties, setSpecialties] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch("/api/settings/providers", { cache: "no-store" });
      const data = await res.json();
      setProviders(Array.isArray(data?.providers) ? data.providers : []);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return providers
      .filter((p) => (showInactive ? true : p.isActive))
      .filter((p) => {
        if (!q) return true;
        return (
          (p.fullName || "").toLowerCase().includes(q) ||
          (p.email || "").toLowerCase().includes(q)
        );
      });
  }, [providers, query, showInactive]);

  function openCreate() {
    setEditing(null);
    setFullName("");
    setEmail("");
    setLicenseNumber("");
    setPrimarySpecialty("");
    setSpecialties([]);
    setModalOpen(true);
  }

  function openEdit(p: ProviderRow) {
    setEditing(p);
    setFullName(p.fullName || "");
    setEmail(p.email || "");
    setLicenseNumber(p.provider?.licenseNumber || "");
    setPrimarySpecialty(p.provider?.primarySpecialty || "");
    setSpecialties((p.provider?.specialties || []).map((x) => x.specialty));
    setModalOpen(true);
  }

  async function saveProvider(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    try {
      if (!editing) {
        // CREATE
        const res = await fetch("/api/settings/providers", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            fullName,
            licenseNumber: licenseNumber || null,
            primarySpecialty: primarySpecialty || null,
            specialties,
          }),
        });

        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          alert(err?.error || "Could not create provider");
          return;
        }
      } else {
        // UPDATE
        const res = await fetch(`/api/settings/providers/${editing.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fullName,
            // email no se edita aquí (por seguridad). Si lo quieres, lo habilitamos luego con flujo controlado.
            licenseNumber: licenseNumber || null,
            primarySpecialty: primarySpecialty || null,
            specialties,
          }),
        });

        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          alert(err?.error || "Could not update provider");
          return;
        }
      }

      setModalOpen(false);
      await load();
    } finally {
      setSaving(false);
    }
  }

  async function toggleActive(p: ProviderRow) {
    const next = !p.isActive;
    const ok = confirm(next ? "Activate this provider?" : "Deactivate this provider?\n\n(Recommended: deactivate, never delete.)");
    if (!ok) return;

    const res = await fetch(`/api/settings/providers/${p.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: next }),
    });

    if (!res.ok) {
      alert("Could not update provider status");
      return;
    }

    await load();
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 flex">
      {/* Left nav */}
      <aside className="hidden md:flex w-56 flex-col border-r border-slate-800 bg-slate-950/90">
        <div className="h-16 flex items-center px-5 border-b border-slate-800/60">
          <div className="h-9 w-9 rounded-xl bg-sky-500 flex items-center justify-center text-xs font-bold text-slate-950">
            AD
          </div>
          <div className="ml-3">
            <p className="text-[10px] uppercase tracking-[0.18em] text-slate-400">ADIE</p>
            <p className="text-sm font-semibold">Settings</p>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 text-xs">
          <p className="px-3 text-[10px] font-semibold tracking-[0.18em] text-slate-500 uppercase mb-2">Navigation</p>
          <NavLink href="/dashboard" label="Dashboard" />
          <NavLink href="/patients" label="Patients" />
          <NavLink href="/calendar" label="Calendar" />
          <div className="pt-3">
            <p className="px-3 text-[10px] font-semibold tracking-[0.18em] text-slate-500 uppercase mb-2">Settings</p>
            <NavLink href="/settings/team" label="Team & Providers" active />
          </div>
        </nav>

        <div className="border-t border-slate-800/60 px-4 py-3 text-[11px] text-slate-400">
          <p className="font-semibold text-sm">Gerardo Barrantes</p>
          <p>Owner/Admin</p>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col">
        <header className="h-16 border-b border-slate-800 bg-slate-950/70 backdrop-blur flex items-center justify-between px-4 md:px-6">
          <div>
            <p className="text-[10px] uppercase tracking-[0.18em] text-slate-500">Settings</p>
            <h1 className="text-base md:text-lg font-semibold">Team & Providers</h1>
          </div>
          <button
            onClick={openCreate}
            className="inline-flex items-center rounded-full border border-sky-500/70 bg-sky-500/10 px-3 py-1 text-[11px] font-semibold text-sky-300 hover:bg-sky-500/20"
          >
            + Add provider
          </button>
        </header>

        <main className="flex-1 px-4 md:px-6 py-4">
          <section className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
            <div className="flex flex-col md:flex-row md:items-center gap-3 md:justify-between">
              <div className="flex items-center gap-2">
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search provider by name or email…"
                  className="w-72 max-w-full rounded-xl border border-slate-700 bg-slate-950/80 px-3 py-2 text-[11px] outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-500/60"
                />
                <label className="inline-flex items-center gap-2 text-[11px] text-slate-300 select-none">
                  <input
                    type="checkbox"
                    checked={showInactive}
                    onChange={(e) => setShowInactive(e.target.checked)}
                  />
                  Show inactive
                </label>
              </div>

              <div className="text-[11px] text-slate-400">
                {loading ? "Loading…" : `${filtered.length} provider(s)`}
              </div>
            </div>

            <div className="mt-4 overflow-auto">
              <table className="w-full text-[11px]">
                <thead className="text-slate-400">
                  <tr className="border-b border-slate-800">
                    <th className="text-left py-2 pr-3">Provider</th>
                    <th className="text-left py-2 pr-3">Email</th>
                    <th className="text-left py-2 pr-3">Primary</th>
                    <th className="text-left py-2 pr-3">Specialties</th>
                    <th className="text-left py-2 pr-3">License</th>
                    <th className="text-left py-2 pr-3">Status</th>
                    <th className="text-right py-2">Actions</th>
                  </tr>
                </thead>

                <tbody className="text-slate-100">
                  {!loading && filtered.length === 0 && (
                    <tr>
                      <td colSpan={7} className="py-6 text-center text-slate-500">
                        No providers found.
                      </td>
                    </tr>
                  )}

                  {filtered.map((p) => (
                    <tr key={p.id} className="border-b border-slate-900/70">
                      <td className="py-2 pr-3">
                        <div className="font-semibold">{p.fullName || "—"}</div>
                        <div className="text-[10px] text-slate-500">UserID: {p.id.slice(0, 8)}…</div>
                      </td>
                      <td className="py-2 pr-3 text-slate-300">{p.email}</td>
                      <td className="py-2 pr-3 text-slate-300">{p.provider?.primarySpecialty || "—"}</td>
                      <td className="py-2 pr-3 text-slate-300">
                        {(p.provider?.specialties || []).map((x) => x.specialty).join(", ") || "—"}
                      </td>
                      <td className="py-2 pr-3 text-slate-300">{p.provider?.licenseNumber || "—"}</td>
                      <td className="py-2 pr-3">
                        <span
                          className={cx(
                            "inline-flex rounded-full border px-2 py-0.5 text-[10px] uppercase",
                            p.isActive ? "border-emerald-500/40 text-emerald-300" : "border-slate-700 text-slate-400"
                          )}
                        >
                          {p.isActive ? "active" : "inactive"}
                        </span>
                      </td>
                      <td className="py-2 text-right">
                        <div className="inline-flex gap-2">
                          <button
                            onClick={() => openEdit(p)}
                            className="rounded-lg border border-slate-800 bg-slate-900/60 px-2 py-1 text-slate-200 hover:border-sky-400"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => toggleActive(p)}
                            className="rounded-lg border border-slate-800 bg-slate-900/60 px-2 py-1 text-slate-200 hover:border-sky-400"
                          >
                            {p.isActive ? "Deactivate" : "Activate"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <p className="mt-3 text-[10px] text-slate-500">
                Best practice: never delete providers. Deactivate to keep appointments/encounters intact.
              </p>
            </div>
          </section>
        </main>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-3"
          role="dialog"
          aria-modal="true"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setModalOpen(false);
          }}
        >
          <div className="w-full max-w-xl rounded-2xl border border-slate-800 bg-slate-950 shadow-[0_30px_120px_rgba(0,0,0,0.65)]">
            <div className="flex items-start justify-between gap-3 border-b border-slate-800 px-4 py-3">
              <div>
                <p className="text-xs font-semibold text-slate-100">{editing ? "Edit provider" : "Add provider"}</p>
                <p className="text-[11px] text-slate-400">Creates/updates User + ProviderProfile + Specialties.</p>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="rounded-lg border border-slate-800 bg-slate-900/70 px-2 py-1 text-[11px] text-slate-200 hover:border-sky-400"
              >
                ✕
              </button>
            </div>

            <form onSubmit={saveProvider} className="px-4 py-4 space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] text-slate-300 mb-1">Full name</label>
                  <input
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950/80 px-3 py-2 text-[11px] outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-500/60"
                    placeholder="Dr. John Smith"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-slate-300 mb-1">Email</label>
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={cx(
                      "w-full rounded-xl border bg-slate-950/80 px-3 py-2 text-[11px] outline-none focus:ring-1",
                      editing
                        ? "border-slate-800 text-slate-500 cursor-not-allowed"
                        : "border-slate-700 focus:border-sky-400 focus:ring-sky-500/60"
                    )}
                    placeholder="doctor@clinic.com"
                    required
                    disabled={!!editing}
                    title={editing ? "Email edits are disabled in v1 (safer). We can add later with controlled flow." : ""}
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-slate-300 mb-1">License number</label>
                  <input
                    value={licenseNumber}
                    onChange={(e) => setLicenseNumber(e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950/80 px-3 py-2 text-[11px] outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-500/60"
                    placeholder="Optional"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-slate-300 mb-1">Primary specialty</label>
                  <select
                    value={primarySpecialty}
                    onChange={(e) => setPrimarySpecialty(e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950/80 px-3 py-2 text-[11px] outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-500/60"
                  >
                    <option value="">—</option>
                    {SPECIALTY_OPTIONS.map((s) => (
                      <option key={s.value} value={s.value}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] text-slate-300 mb-1">Specialties (multiple)</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 rounded-2xl border border-slate-800 bg-slate-950/60 p-3">
                  {SPECIALTY_OPTIONS.map((s) => {
                    const active = specialties.includes(s.value);
                    return (
                      <button
                        key={s.value}
                        type="button"
                        onClick={() => {
                          setSpecialties((prev) =>
                            prev.includes(s.value) ? prev.filter((x) => x !== s.value) : [...prev, s.value]
                          );
                        }}
                        className={cx(
                          "rounded-xl border px-2 py-2 text-left text-[11px] transition",
                          active
                            ? "border-sky-500 bg-sky-500/10 text-sky-200"
                            : "border-slate-800 bg-slate-900/40 text-slate-300 hover:border-sky-400/60"
                        )}
                      >
                        {s.label}
                      </button>
                    );
                  })}
                </div>
                <p className="mt-2 text-[10px] text-slate-500">
                  UI-safe: we hide enum typo ORTHODONTONTICS to avoid dirty data.
                </p>
              </div>

              <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-800">
                <div className="text-[10px] text-slate-500">
                  Next step (after this): invite flow / password setup for new users.
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="rounded-xl border border-slate-800 bg-slate-900/70 px-3 py-2 text-[11px] text-slate-200 hover:border-sky-400"
                    disabled={saving}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-xl border border-sky-500/70 bg-sky-500/10 px-3 py-2 text-[11px] font-semibold text-sky-300 hover:bg-sky-500/20"
                    disabled={saving}
                  >
                    {saving ? "Saving…" : editing ? "Save changes" : "Create provider"}
                  </button>
                </div>
              </div>
            </form>

            <div className="px-4 pb-4">
              <Link href="/calendar" className="text-[10px] text-slate-400 hover:text-sky-300">
                ← Back to calendar
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

type NavLinkProps = { href: string; label: string; active?: boolean };
function NavLink({ href, label, active }: NavLinkProps) {
  return (
    <Link
      href={href}
      className={cx(
        "flex items-center rounded-xl px-3 py-2 text-xs transition-colors",
        active
          ? "bg-sky-500/20 text-sky-200 font-semibold border border-sky-500/50 shadow-[0_0_16px_rgba(56,189,248,0.6)]"
          : "text-slate-300 hover:bg-slate-800/80 hover:text-sky-200"
      )}
    >
      <span className="w-1.5 h-1.5 rounded-full mr-2 bg-sky-400 opacity-80" />
      {label}
    </Link>
  );
}
