"use client";

import React, { useState } from "react";
import Link from "next/link";

type SpecialtyId =
  | "general"
  | "preventive"
  | "implants"
  | "perio"
  | "radiology"
  | "pediatric"
  | "prostho"
  | "ortho";

const SPECIALTY_LABEL: Record<SpecialtyId, string> = {
  general: "General Dentistry",
  preventive: "Preventive Dentistry",
  implants: "Implants",
  perio: "Periodontic Dentistry",
  radiology: "Radiology",
  pediatric: "Pediatric Dentistry",
  prostho: "Prosthodontics",
  ortho: "Orthodontics",
};

const SPECIALTY_DESCRIPTION: Record<SpecialtyId, string> = {
  general: "Point of entry for all treatments.",
  preventive:
    "Fluoride, sealants, risk assessment and maintenance protocols.",
  implants:
    "Implant planning, surgery notes, prosthetic steps and long-term follow-up.",
  perio:
    "Periodontal chart, pockets, diagnosis, non-surgical and surgical treatment.",
  radiology:
    "Panoramic, CBCT and periapical images linked to each clinical module.",
  pediatric:
    "Growth, eruption, behavior notes and interceptive treatment in children.",
  prostho:
    "Prosthetic design, crowns, bridges, veneers, occlusion and adjustments.",
  ortho:
    "Complete orthodontic workflow: records, aligners, appliances and retention.",
};

type SpecialtyButtonProps = {
  id: SpecialtyId;
  label: string;
  href?: string;
  active: boolean;
  onSelect: (id: SpecialtyId) => void;
};

function SpecialtyButton({
  id,
  label,
  href,
  active,
  onSelect,
}: SpecialtyButtonProps) {
  const baseClasses =
    "w-full md:w-64 rounded-xl border px-6 py-3 text-sm md:text-[13px] font-medium transition-colors flex items-center justify-center";

  const activeClasses =
    "border-sky-500/80 bg-sky-500/20 text-sky-100 shadow-[0_0_32px_rgba(56,189,248,0.55)]";
  const inactiveClasses =
    "border-slate-700 bg-slate-900/80 text-slate-200 hover:border-sky-500/70 hover:bg-slate-900";

  const content = (
    <button
      type="button"
      onClick={() => onSelect(id)}
      className={`${baseClasses} ${active ? activeClasses : inactiveClasses}`}
    >
      {label}
    </button>
  );

  // Si tenemos href, lo envolvemos en Link para navegar
  if (href) {
    return (
      <Link href={href} onClick={() => onSelect(id)} className="block">
        {content}
      </Link>
    );
  }

  return content;
}

export default function SpecialtiesPage() {
  const [selected, setSelected] = useState<SpecialtyId>("general");

  return (
    <main className="min-h-screen bg-slate-950 text-slate-50 px-6 md:px-10 py-8">
      {/* HEADER: título + botón Dashboard */}
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-10">
        <div>
          <p className="text-[11px] uppercase tracking-[0.24em] text-sky-400 mb-1">
            Specialties Universe
          </p>
          <h1 className="text-2xl md:text-3xl font-semibold text-slate-50">
            Specialties Universe
          </h1>
          <p className="mt-2 text-xs md:text-sm text-slate-400 max-w-2xl">
            Touch (or click) a specialty to enter its deep layer. Each node will
            be a full module with forms, protocols and a specialty-specific
            dental chart.
          </p>
        </div>

        {/* Botón para ir al Dashboard */}
        <div className="flex justify-end">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900/80 px-4 py-1.5 text-xs text-slate-200 hover:border-sky-500/70 hover:bg-slate-900 hover:text-sky-100 transition"
          >
            <span>🏠</span>
            <span>Back to Dashboard</span>
          </Link>
        </div>
      </header>

      {/* CARD PRINCIPAL */}
      <section className="mx-auto max-w-5xl rounded-[32px] border border-slate-800 bg-gradient-to-b from-slate-900/80 to-slate-950 px-6 md:px-10 py-8 shadow-[0_0_60px_rgba(15,23,42,0.9)]">
        {/* Universo de especialidades */}
        <div className="flex flex-col items-center gap-10">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-6 md:gap-10 items-center">
            {/* COLUMNA IZQUIERDA */}
            <div className="flex flex-col gap-3 items-center md:items-end">
              <SpecialtyButton
                id="preventive"
                label={SPECIALTY_LABEL.preventive}
                active={selected === "preventive"}
                onSelect={setSelected}
              />
              <SpecialtyButton
                id="implants"
                label={SPECIALTY_LABEL.implants}
                active={selected === "implants"}
                onSelect={setSelected}
              />
              <SpecialtyButton
                id="perio"
                label={SPECIALTY_LABEL.perio}
                active={selected === "perio"}
                onSelect={setSelected}
              />
            </div>

            {/* NÚCLEO CENTRAL */}
            <div className="relative flex flex-col items-center gap-4">
              <div className="relative">
                <div className="absolute -inset-8 rounded-[32px] bg-sky-500/15 blur-3xl" />
                <div className="relative rounded-[28px] border border-sky-500/80 bg-slate-900/80 px-10 py-8 text-center shadow-[0_0_50px_rgba(56,189,248,0.7)]">
                  <p className="text-[11px] uppercase tracking-[0.25em] text-sky-300 mb-1">
                    Core node
                  </p>
                  <p className="text-xl font-semibold text-slate-50 mb-1">
                    {SPECIALTY_LABEL.general}
                  </p>
                  <p className="text-[11px] text-slate-400">
                    {SPECIALTY_DESCRIPTION.general}
                  </p>
                </div>
              </div>

              {/* Botón de General Dentistry (capa profunda futura) */}
              <SpecialtyButton
                id="general"
                label={SPECIALTY_LABEL.general}
                active={selected === "general"}
                onSelect={setSelected}
                // más adelante podríamos apuntar a /specialties/general
              />

              {/* Botón de Orthodontics que YA lleva al módulo de ortodoncia */}
              <SpecialtyButton
                id="ortho"
                label={SPECIALTY_LABEL.ortho}
                active={selected === "ortho"}
                onSelect={setSelected}
                href="/specialties/orthodontics"
              />
            </div>

            {/* COLUMNA DERECHA */}
            <div className="flex flex-col gap-3 items-center md:items-start">
              <SpecialtyButton
                id="radiology"
                label={SPECIALTY_LABEL.radiology}
                active={selected === "radiology"}
                onSelect={setSelected}
              />
              <SpecialtyButton
                id="pediatric"
                label={SPECIALTY_LABEL.pediatric}
                active={selected === "pediatric"}
                onSelect={setSelected}
              />
              <SpecialtyButton
                id="prostho"
                label={SPECIALTY_LABEL.prostho}
                active={selected === "prostho"}
                onSelect={setSelected}
              />
            </div>
          </div>

          {/* TEXTO EXPLICATIVO ABAJO */}
          <div className="w-full pt-4 border-t border-slate-800/70 text-xs text-slate-300">
            <p>
              <span className="text-slate-500">Selected specialty: </span>
              <span className="font-semibold text-sky-300">
                {SPECIALTY_LABEL[selected]}
              </span>
            </p>
            <p className="text-[11px] text-slate-400 mt-1">
              {SPECIALTY_DESCRIPTION[selected]}
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
