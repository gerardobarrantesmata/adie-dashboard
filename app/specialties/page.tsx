"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

type SpecialtyId =
  | "general"
  | "preventive"
  | "implants"
  | "perio"
  | "radiology"
  | "pediatric"
  | "prostho"
  | "omfs"
  | "ortho";

const SPECIALTIES: Record<
  SpecialtyId,
  { label: string; description: string; href?: string }
> = {
  general: {
    label: "General Dentistry",
    description: "Point of entry for all treatments.",
    href: "/specialties/general",
  },
  preventive: {
    label: "Preventive Dentistry",
    description: "Check-ups, prophylaxis, sealants and basic preventive care.",
  },
  implants: {
    label: "Implants",
    description: "Implant planning, surgery and prosthetic restorations.",
  },
  perio: {
    label: "Periodontic Dentistry",
    description:
      "Periodontal chart, pockets, diagnosis and non-surgical / surgical treatment.",
    href: "/specialties/periodontics",
  },
  radiology: {
    label: "Radiology",
    description: "CBCT, panoramic and intraoral imaging modules.",
  },
  pediatric: {
    label: "Pediatric Dentistry",
    description: "Pediatric records, growth tracking and behavior notes.",
  },
  prostho: {
    label: "Prosthodontics",
    description: "Crowns, bridges, dentures and complex rehabilitations.",
  },
  omfs: {
    label: "Oral & Maxillofacial Surgery",
    description:
      "Surgical planning, maxillofacial procedures, digital reports and consents.",
    // Cuando tengamos el módulo de OMFS, agregamos aquí: href: "/specialties/omfs"
  },
  ortho: {
    label: "Orthodontics",
    description: "Ortho assessments, records, brackets and aligner workflow.",
    href: "/specialties/orthodontics",
  },
};

type SpecialtyButtonProps = {
  id: SpecialtyId;
  selected: SpecialtyId;
  onSelect: (id: SpecialtyId) => void;
};

function SpecialtyButton({ id, selected, onSelect }: SpecialtyButtonProps) {
  const spec = SPECIALTIES[id];
  const isActive = selected === id;

  const content = (
    <div
      className={[
        "w-full rounded-xl border px-6 py-3 text-left text-sm transition-all",
        "bg-slate-900/60 border-slate-800 hover:border-slate-500/70 hover:bg-slate-900",
        isActive
          ? "border-sky-500/80 bg-sky-500/10 shadow-[0_0_35px_rgba(56,189,248,0.4)]"
          : "",
      ].join(" ")}
    >
      <p className="font-semibold text-slate-100">{spec.label}</p>
      <p className="mt-1 text-[11px] text-slate-400">{spec.description}</p>
    </div>
  );

  if (spec.href) {
    return (
      <Link
        href={spec.href}
        onMouseEnter={() => onSelect(id)}
        onFocus={() => onSelect(id)}
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={() => onSelect(id)}
      onMouseEnter={() => onSelect(id)}
      className="w-full"
    >
      {content}
    </button>
  );
}

export default function SpecialtiesPage() {
  const router = useRouter();
  const [selected, setSelected] = useState<SpecialtyId>("general");
  const selectedSpec = SPECIALTIES[selected];

  const handleCoreClick = () => {
    router.push("/specialties/general");
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-50 px-8 py-10">
      <section className="mx-auto max-w-6xl">
        {/* Header */}
        <p className="text-[11px] tracking-[0.25em] uppercase text-sky-400 mb-1">
          Specialties · Layer 2
        </p>
        <h1 className="text-2xl md:text-3xl font-semibold text-slate-50">
          Specialties Universe
        </h1>
        <p className="mt-2 text-sm text-slate-400 max-w-2xl">
          Touch (or click) a specialty to enter its deep layer. Each node will
          be a full module with forms, protocols and a specialty-specific dental
          chart.
        </p>

        {/* Card container */}
        <div className="mt-10 rounded-3xl border border-slate-900 bg-slate-950/70 p-8 md:p-10 shadow-[0_40px_120px_rgba(15,23,42,0.9)]">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            {/* Left column */}
            <div className="space-y-4">
              <SpecialtyButton
                id="preventive"
                selected={selected}
                onSelect={setSelected}
              />
              <SpecialtyButton
                id="implants"
                selected={selected}
                onSelect={setSelected}
              />
              <SpecialtyButton
                id="perio"
                selected={selected}
                onSelect={setSelected}
              />
            </div>

            {/* Core node + bottom row */}
            <div className="flex flex-col items-center gap-6">
              {/* CORE NODE: General Dentistry (usa router.push) */}
              <button
                type="button"
                onClick={handleCoreClick}
                onMouseEnter={() => setSelected("general")}
                onFocus={() => setSelected("general")}
                className="relative w-full max-w-xs rounded-3xl border border-sky-500/60 bg-gradient-to-b from-sky-500/10 via-slate-900/80 to-slate-950/90 px-6 py-8 text-center shadow-[0_0_45px_rgba(56,189,248,0.8)] transition-transform hover:-translate-y-0.5 focus:outline-none"
              >
                <div className="absolute -inset-1 rounded-3xl bg-sky-500/20 blur-3xl" />
                <div className="relative">
                  <p className="text-[11px] tracking-[0.28em] text-sky-300/80 uppercase mb-2">
                    Core Node
                  </p>
                  <p className="text-xl font-semibold bg-gradient-to-r from-sky-200 via-cyan-200 to-emerald-200 bg-clip-text text-transparent">
                    General Dentistry
                  </p>
                  <p className="mt-2 text-[11px] text-slate-300">
                    Point of entry for all treatments.
                  </p>
                </div>
              </button>

              {/* Bottom row */}
              <div className="flex flex-col md:flex-row gap-4 w-full justify-center">
                <div className="w-full md:w-auto">
                  <SpecialtyButton
                    id="omfs"
                    selected={selected}
                    onSelect={setSelected}
                  />
                </div>
                <div className="w-full md:w-auto">
                  <SpecialtyButton
                    id="ortho"
                    selected={selected}
                    onSelect={setSelected}
                  />
                </div>
              </div>
            </div>

            {/* Right column */}
            <div className="space-y-4">
              <SpecialtyButton
                id="radiology"
                selected={selected}
                onSelect={setSelected}
              />
              <SpecialtyButton
                id="pediatric"
                selected={selected}
                onSelect={setSelected}
              />
              <SpecialtyButton
                id="prostho"
                selected={selected}
                onSelect={setSelected}
              />
            </div>
          </div>

          {/* Selected description footer */}
          <div className="mt-8 border-t border-slate-900 pt-4 text-[11px] md:text-xs text-slate-400">
            <span className="mr-1">Selected specialty:</span>
            <span className="font-semibold text-sky-300">
              {selectedSpec.label}
            </span>
            <span className="mx-1">·</span>
            <span>{selectedSpec.description}</span>
          </div>
        </div>
      </section>
    </main>
  );
}
