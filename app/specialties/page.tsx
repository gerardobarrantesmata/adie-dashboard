"use client";

import React, { useState } from "react";
import Link from "next/link";

type SpecialtyId =
  | "general"
  | "ortho"
  | "perio"
  | "prostho"
  | "pediatric"
  | "preventive"
  | "implants"
  | "radiology"
  | "oralSurgery";

const SPECIALTY_LABEL: Record<SpecialtyId, string> = {
  general: "General Dentistry",
  ortho: "Orthodontics",
  perio: "Periodontic Dentistry",
  prostho: "Prosthodontics",
  pediatric: "Pediatric Dentistry",
  preventive: "Preventive Dentistry",
  implants: "Implants",
  radiology: "Radiology",
  oralSurgery: "Oral & Maxillofacial Surgery",
};

const SPECIALTY_DESCRIPTION: Record<SpecialtyId, string> = {
  general: "Point of entry for all treatments.",
  ortho: "Full orthodontic workflows, records and aligners.",
  perio: "Periodontal chart, pockets, diagnosis and treatment.",
  prostho: "Fixed, removable and implant-supported prosthetics.",
  pediatric:
    "Growth, eruption, caries risk and behavior management for children.",
  preventive: "Prophylaxis, sealants, fluoride and recall programs.",
  implants:
    "3D implant planning, torque, guided surgery and prosthetic connection.",
  radiology: "Radiology, CBCT, ceph and AI-assisted image review.",
  oralSurgery: "Hospital-level oral & maxillofacial surgery workflows.",
};

const SPECIALTY_ROUTE: Partial<Record<SpecialtyId, string>> = {
  general: "/specialties/general",
  ortho: "/specialties/orthodontics",
  perio: "/specialties/periodontics",
  prostho: "/specialties/prosthodontics",
  pediatric: "/specialties/pediatric",
  oralSurgery: "/specialties/oral-surgery",
  implants: "/specialties/implants",
  radiology: "/specialties/radiology",
};

type SpecialtyButtonProps = {
  id: SpecialtyId;
  label: string;
  active: boolean;
  href?: string;
  onSelect: (id: SpecialtyId) => void;
};

function SpecialtyButton({
  id,
  label,
  active,
  href,
  onSelect,
}: SpecialtyButtonProps) {
  const baseClasses =
    "w-full rounded-xl border px-6 py-3 text-sm md:text-[15px] flex items-center justify-center transition-all";
  const activeClasses =
    "border-sky-400/80 bg-sky-500/10 shadow-[0_0_30px_rgba(56,189,248,0.45)] text-sky-100";
  const inactiveClasses =
    "border-slate-700/80 bg-slate-900/60 text-slate-200 hover:border-sky-500/50 hover:text-sky-100";

  const content = (
    <button
      type="button"
      onClick={() => onSelect(id)}
      className={`${baseClasses} ${active ? activeClasses : inactiveClasses}`}
    >
      <span className="font-medium tracking-[0.03em]">{label}</span>
    </button>
  );

  if (href) {
    return (
      <Link href={href} scroll={false} className="w-full">
        {content}
      </Link>
    );
  }

  return content;
}

export default function SpecialtiesPage() {
  const [selected, setSelected] = useState<SpecialtyId>("general");

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-6xl px-4 pb-24 pt-10">
        {/* Header */}
        <header className="mb-10 flex items-center justify-between gap-4">
          <div>
            <p className="text-[11px] uppercase tracking-[0.28em] text-teal-400">
              Specialties · Layer 2
            </p>
            <h1 className="mt-1 text-2xl md:text-3xl font-semibold tracking-tight text-slate-50">
              Specialties Universe
            </h1>
            <p className="mt-2 max-w-xl text-xs md:text-sm text-slate-400">
              Touch (or click) a specialty to enter its deep layer. Each node
              will be a full module with forms, protocols and a specialty-
              specific dental chart.
            </p>
          </div>

          <Link
            href="/"
            className="rounded-full border border-slate-700 bg-slate-900/70 px-4 py-1.5 text-xs md:text-sm text-slate-200 hover:border-sky-500 hover:text-sky-100 transition-colors"
          >
            ← Back to Dashboard
          </Link>
        </header>

        {/* Universe card */}
        <section className="mx-auto max-w-4xl rounded-3xl border border-slate-800 bg-gradient-to-b from-slate-950/90 to-slate-950/60 px-6 py-8 md:px-10 md:py-10 shadow-[0_40px_120px_rgba(15,23,42,0.9)]">
          <div className="grid gap-8 md:grid-cols-[1.2fr_auto_1.2fr] items-center">
            {/* Left column */}
            <div className="space-y-4">
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
                href={SPECIALTY_ROUTE.implants}
                onSelect={setSelected}
              />
              <SpecialtyButton
                id="perio"
                label={SPECIALTY_LABEL.perio}
                active={selected === "perio"}
                href={SPECIALTY_ROUTE.perio}
                onSelect={setSelected}
              />
            </div>

            {/* Core node */}
            <div className="flex flex-col items-center justify-center">
              <div className="relative flex items-center justify-center">
                <div className="absolute -inset-10 rounded-full bg-sky-500/25 blur-3xl" />
                <div className="relative rounded-3xl border border-sky-400/70 bg-sky-500/10 px-8 py-8 md:px-10 md:py-10 shadow-[0_0_55px_rgba(56,189,248,0.75)]">
                  <p className="text-[11px] uppercase tracking-[0.3em] text-sky-200/80 text-center mb-1">
                    Core Node
                  </p>
                  <h2 className="text-xl md:text-2xl font-semibold text-slate-50 text-center">
                    {SPECIALTY_LABEL.general}
                  </h2>
                  <p className="mt-2 text-[11px] text-sky-100/80 text-center max-w-xs">
                    {SPECIALTY_DESCRIPTION.general}
                  </p>

                  <div className="mt-5">
                    <SpecialtyButton
                      id="general"
                      label={SPECIALTY_LABEL.general}
                      active={selected === "general"}
                      href={SPECIALTY_ROUTE.general}
                      onSelect={setSelected}
                    />
                  </div>
                </div>
              </div>

              {/* Bottom row under core */}
              <div className="mt-6 flex w-full flex-col gap-4 md:flex-row">
                <SpecialtyButton
                  id="oralSurgery"
                  label={SPECIALTY_LABEL.oralSurgery}
                  active={selected === "oralSurgery"}
                  href={SPECIALTY_ROUTE.oralSurgery}
                  onSelect={setSelected}
                />
                <SpecialtyButton
                  id="ortho"
                  label={SPECIALTY_LABEL.ortho}
                  active={selected === "ortho"}
                  href={SPECIALTY_ROUTE.ortho}
                  onSelect={setSelected}
                />
              </div>
            </div>

            {/* Right column */}
            <div className="space-y-4">
              <SpecialtyButton
                id="radiology"
                label={SPECIALTY_LABEL.radiology}
                active={selected === "radiology"}
                href={SPECIALTY_ROUTE.radiology}
                onSelect={setSelected}
              />
              <SpecialtyButton
                id="pediatric"
                label={SPECIALTY_LABEL.pediatric}
                active={selected === "pediatric"}
                href={SPECIALTY_ROUTE.pediatric}
                onSelect={setSelected}
              />
              <SpecialtyButton
                id="prostho"
                label={SPECIALTY_LABEL.prostho}
                active={selected === "prostho"}
                href={SPECIALTY_ROUTE.prostho}
                onSelect={setSelected}
              />
            </div>
          </div>

          {/* Selected description */}
          <div className="mt-8 border-t border-slate-800 pt-4 text-xs md:text-sm text-slate-400">
            <span className="text-slate-500">Selected specialty: </span>
            <span className="font-semibold text-sky-200">
              {SPECIALTY_LABEL[selected]}
            </span>
            <span className="text-slate-500"> · </span>
            <span>{SPECIALTY_DESCRIPTION[selected]}</span>
          </div>
        </section>
      </div>
    </main>
  );
}
