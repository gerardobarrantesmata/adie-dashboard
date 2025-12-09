"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

type SpecialtyTopActionsProps = {
  specialtyLabel: string; // e.g. "Endodontics", "Periodontics"
};

export function SpecialtyTopActions({ specialtyLabel }: SpecialtyTopActionsProps) {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Leemos el patientId que viene en la URL: ?patientId=ADIE-PT-0001
  const patientId = searchParams.get("patientId") ?? "ADIE-PT-0001";

  const [isSaving, setIsSaving] = useState(false);

  const handleSaveAndExit = () => {
    if (isSaving) return;
    setIsSaving(true);

    // FUTURO: aquí se llamará al API para guardar de verdad.
    // Por ahora simulamos un guardado rápido y luego vamos al dashboard.
    setTimeout(() => {
      setIsSaving(false);
      router.push("/dashboard");
    }, 800);
  };

  return (
    <div className="mb-4 flex flex-wrap items-center justify-between gap-2 text-[11px]">
      <div className="text-[11px] text-slate-500">
        <span className="uppercase tracking-[0.18em]">Active patient · </span>
        <span className="font-mono text-sky-300">{patientId}</span>
        <span className="text-slate-400"> · {specialtyLabel}</span>
      </div>

      <div className="flex flex-wrap gap-2">
        <Link
          href={`/patients/${encodeURIComponent(patientId)}`}
          className="rounded-full border border-slate-700 bg-slate-900/70 px-3 py-1.5 text-slate-200 hover:border-sky-400 hover:text-sky-100"
        >
          ← Back to Master EMR
        </Link>

        <button
          onClick={handleSaveAndExit}
          disabled={isSaving}
          className="rounded-full border border-emerald-500 bg-emerald-500/10 px-3 py-1.5 text-emerald-100 hover:bg-emerald-500/20 disabled:opacity-60"
        >
          {isSaving ? "Saving…" : "Save & go to Dashboard"}
        </button>
      </div>
    </div>
  );
}
