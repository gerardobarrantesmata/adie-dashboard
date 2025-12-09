"use client";

import React from "react";
import Link from "next/link";

type Props = {
  patientId: string;
};

export default function PatientMiniHeader({ patientId }: Props) {
  // En esta fase dejamos los datos MOCK. Más adelante los leeremos de la BD.
  const displayName = "John / Jane Doe";
  const mrn = "123456-01";

  return (
    <section className="mb-5 rounded-2xl border border-slate-800 bg-slate-950/80 px-4 py-3 shadow-[0_18px_60px_rgba(15,23,42,0.8)]">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        {/* LADO IZQUIERDO: MINI PERFIL */}
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full border border-slate-700 bg-slate-900 text-[10px] text-slate-400">
            Photo
          </div>
          <div className="text-xs">
            <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500">
              Patient context · ADIE
            </p>
            <p className="text-sm font-semibold text-slate-100">
              {displayName}
            </p>
            <p className="text-[11px] text-slate-400">
              ADIE ID:{" "}
              <span className="font-mono text-sky-300">{patientId}</span>{" "}
              · MRN: <span className="font-mono text-slate-200">{mrn}</span>
            </p>
          </div>
        </div>

        {/* LADO DERECHO: NAVEGACIÓN GLOBAL */}
        <div className="flex flex-wrap items-center justify-end gap-2 text-[11px]">
          <Link
            href={`/patients/${patientId}`}
            className="rounded-full border border-slate-700 bg-slate-900/70 px-3 py-1.5 text-slate-200 hover:border-sky-400 hover:text-sky-100"
          >
            ← Master EMR
          </Link>
          <Link
            href="/patients"
            className="rounded-full border border-slate-700 bg-slate-900/70 px-3 py-1.5 text-slate-200 hover:border-emerald-400 hover:text-emerald-100"
          >
            Patients
          </Link>
          <Link
            href="/dashboard"
            className="rounded-full border border-slate-700 bg-slate-900/70 px-3 py-1.5 text-slate-200 hover:border-indigo-400 hover:text-indigo-100"
          >
            Dashboard
          </Link>
        </div>
      </div>
    </section>
  );
}
