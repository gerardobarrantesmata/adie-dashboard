// app/specialties/page.tsx
"use client";

import Link from "next/link";

type Workspace = {
  name: string;
  description: string;
  layerLabel: string;
  href: string;
};

const clinicalWorkspaces: Workspace[] = [
  {
    name: "General Dentistry",
    description: "Chief complaint, history, clinical exam & treatment plan.",
    layerLabel: "Layer 3 · Clinical record",
    href: "/specialties/general",
  },
  {
    name: "Periodontics",
    description: "Bone, pockets & maintenance linked to dental chart.",
    layerLabel: "Layer 3 · Bone & maintenance",
    href: "/specialties/periodontics",
  },
  {
    name: "Endodontics",
    description: "Apex tracking, working length & obturation quality.",
    layerLabel: "Layer 3 · Root canal workspace",
    href: "/specialties/endodontics",
  },
  {
    name: "Orthodontics",
    description: "Braces & aligners timeline with growth & TMJ links.",
    layerLabel: "Layer 3 · Braces & aligners",
    href: "/specialties/orthodontics",
  },
  {
    name: "Pediatric Dentistry",
    description: "Growth, eruption & prevention connected to vaccines.",
    layerLabel: "Layer 3 · Growth & prevention",
    href: "/specialties/pediatric",
  },
  {
    name: "Prosthodontics",
    description: "Crowns, bridges, full-arch and occlusal design.",
    layerLabel: "Layer 3 · Restorative planning",
    href: "/specialties/prosthodontics",
  },
  {
    name: "Implants",
    description: "3D planning, bone safety grid & surgery record.",
    layerLabel: "Layer 3 · 3D planning",
    href: "/specialties/implants",
  },
  {
    name: "Radiology",
    description: "Imaging uploads linked to AI bone & caries analysis.",
    layerLabel: "Layer 3 · Imaging & AI",
    href: "/specialties/radiology",
  },
  {
    name: "Oral & Maxillofacial Surgery",
    description: "Extractions, trauma, orthognathic & hospital cases.",
    layerLabel: "Layer 3 · Surgical hub",
    href: "/specialties/oral-surgery",
  },
];

function LivePill() {
  return (
    <span className="rounded-full border border-emerald-500/40 bg-emerald-500/10 px-2 py-[2px] text-[10px] font-semibold uppercase tracking-[0.18em] text-emerald-300">
      Live
    </span>
  );
}

export default function SpecialtiesUniversePage() {
  return (
    <div className="space-y-6">
      {/* TOP BAR */}
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-[11px] uppercase tracking-[0.28em] text-sky-400">
            Specialties · Layers 2 &amp; 3
          </p>
          <h1 className="mt-1 text-2xl md:text-3xl font-semibold tracking-tight text-slate-50">
            Specialties Universe
          </h1>
          <p className="mt-2 max-w-2xl text-xs md:text-sm text-slate-400">
            Navigate every clinical specialty in ADIE. Each tile opens a
            dedicated workspace that later will sync with the global dental
            chart, radiology, BI and operations.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 justify-start sm:justify-end">
          <Link
            href="/dashboard"
            className="rounded-full border border-slate-700 bg-slate-900/70 px-4 py-1.5 text-xs text-slate-200 hover:border-sky-500 hover:text-sky-100 transition-colors"
          >
            ← Back to Dashboard
          </Link>
        </div>
      </header>

      {/* LAYERS SUMMARY */}
      <section className="grid gap-3 md:grid-cols-3 text-[11px]">
        <div className="rounded-2xl border border-slate-800 bg-slate-950/80 px-4 py-3">
          <p className="font-semibold text-slate-200 mb-1">Layer 1 · EMR</p>
          <p className="text-slate-400">
            Patient registry, risk flags and clinical history coming from
            Patients.
          </p>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-950/80 px-4 py-3">
          <p className="font-semibold text-slate-200 mb-1">Layer 2 · Universe</p>
          <p className="text-slate-400">
            This screen: navigate specialties and understand how they link
            with implants, perio, BI and operations.
          </p>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-950/80 px-4 py-3">
          <p className="font-semibold text-slate-200 mb-1">
            Layer 3 · Workspaces
          </p>
          <p className="text-slate-400">
            Deep clinical modules for each specialty. Data will flow to Daily
            BI and financial analytics.
          </p>
        </div>
      </section>

      {/* CLINICAL WORKSPACES GRID */}
      <section className="rounded-3xl border border-slate-800 bg-slate-950/80 px-4 py-4 md:px-5 md:py-5">
        <div className="mb-3 flex items-center justify-between gap-2">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-300">
              Clinical workspaces
            </p>
            <p className="text-[11px] text-slate-500 mt-1">
              Click any tile to open the layer 3 workspace for that specialty.
            </p>
          </div>

          {/* SOLO LIVE */}
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-[2px] text-emerald-200 border border-emerald-500/40 text-[10px]">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            Live
          </span>
        </div>

        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {clinicalWorkspaces.map((ws) => (
            <article
              key={ws.name}
              className="group rounded-2xl border border-slate-800 bg-slate-950/80 px-4 py-3.5 hover:border-sky-500/50 hover:bg-slate-900/80 transition-colors"
            >
              <div className="mb-2 flex items-start justify-between gap-2">
                <div>
                  <h2 className="text-sm font-semibold text-slate-50">
                    {ws.name}
                  </h2>
                  <p className="mt-1 text-[11px] text-slate-400">
                    {ws.description}
                  </p>
                </div>
                <LivePill />
              </div>

              <div className="mt-2 flex items-center justify-between text-[11px]">
                <span className="text-slate-500">{ws.layerLabel}</span>
                <Link
                  href={ws.href}
                  className="inline-flex items-center gap-1 rounded-full border border-slate-700 px-3 py-1 text-[11px] text-sky-200 group-hover:border-sky-500 group-hover:text-sky-100"
                >
                  Open workspace
                  <span className="text-[10px]">↗</span>
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* INTEGRATION ROADMAP */}
      <section className="rounded-3xl border border-slate-800 bg-slate-950/80 px-4 py-4 md:px-5 md:py-4 text-[11px] text-slate-300">
        <p className="font-semibold mb-1.5">Integration roadmap</p>
        <ul className="space-y-1 text-slate-400">
          <li>• Short term: connect modules to ADIE database and BI dashboards.</li>
          <li>• Mid term: unify all specialty timelines into Global Dental Chart.</li>
          <li>• Long term: inter-consultation and referrals between clinics.</li>
        </ul>
      </section>
    </div>
  );
}
