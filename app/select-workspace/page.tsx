"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type Workspace = {
  clinic: { id: string; name: string; code?: string | null };
  role: string;
  locations: { id: string; name: string; city?: string | null; country?: string | null }[];
};

export default function SelectWorkspacePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [err, setErr] = useState<string | null>(null);

  const flattened = useMemo(() => {
    const items: { clinicId: string; clinicName: string; locationId: string | null; label: string }[] = [];
    for (const w of workspaces) {
      if (w.locations.length === 0) {
        items.push({
          clinicId: w.clinic.id,
          clinicName: w.clinic.name,
          locationId: null,
          label: `${w.clinic.name} (no locations yet)`,
        });
      } else {
        for (const loc of w.locations) {
          const place = [loc.city, loc.country].filter(Boolean).join(", ");
          items.push({
            clinicId: w.clinic.id,
            clinicName: w.clinic.name,
            locationId: loc.id,
            label: `${w.clinic.name} — ${loc.name}${place ? ` · ${place}` : ""}`,
          });
        }
      }
    }
    return items;
  }, [workspaces]);

  // Auto-skip: si solo hay 1 opción, la selecciona y entra.
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setErr(null);
        const res = await fetch("/api/auth/workspaces", { cache: "no-store" });
        const data = await res.json();
        if (!data.ok) throw new Error(data.error || "Failed to load workspaces");

        setWorkspaces(data.workspaces || []);

        // Espera a que workspaces se setee y luego evaluamos con data directo:
        const tempWorkspaces: Workspace[] = data.workspaces || [];
        const tempFlat: any[] = [];
        for (const w of tempWorkspaces) {
          if (!w.locations?.length) tempFlat.push({ clinicId: w.clinic.id, locationId: null });
          else for (const loc of w.locations) tempFlat.push({ clinicId: w.clinic.id, locationId: loc.id });
        }

        if (tempFlat.length === 1) {
          // Selección automática
          const only = tempFlat[0];
          await fetch("/api/auth/select-workspace", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ clinicId: only.clinicId, locationId: only.locationId }),
          });
          router.replace("/dashboard");
          return;
        }

        setLoading(false);
      } catch (e: any) {
        setErr(e?.message || "Error");
        setLoading(false);
      }
    })();
  }, [router]);

  async function pick(clinicId: string, locationId: string | null) {
    setErr(null);
    const res = await fetch("/api/auth/select-workspace", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ clinicId, locationId }),
    });
    const data = await res.json();
    if (!data.ok) {
      setErr(data.error || "Failed selecting workspace");
      return;
    }
    router.replace("/dashboard");
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 flex items-center justify-center p-6">
      <div className="w-full max-w-xl rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
        <div className="mb-4">
          <h1 className="text-lg font-semibold">Select workspace</h1>
          <p className="text-xs text-slate-400">
            Choose the clinic/location you want to work on now.
          </p>
        </div>

        {loading ? (
          <p className="text-sm text-slate-300">Loading...</p>
        ) : err ? (
          <div className="text-sm text-red-300">
            {err}
            <div className="mt-3">
              <button
                onClick={() => location.reload()}
                className="rounded-xl border border-slate-700 px-3 py-2 text-xs hover:border-sky-400"
              >
                Retry
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            {flattened.map((it, idx) => (
              <button
                key={`${it.clinicId}-${it.locationId ?? "none"}-${idx}`}
                onClick={() => pick(it.clinicId, it.locationId)}
                className="w-full text-left rounded-xl border border-slate-800 bg-slate-950/40 px-4 py-3 hover:border-sky-500/70 hover:bg-slate-950/70 transition"
              >
                <div className="text-sm text-slate-100">{it.label}</div>
                <div className="text-[11px] text-slate-400">Click to enter</div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
