"use client";

import { useState } from "react";
import Link from "next/link";

function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`w-full rounded-lg border border-slate-700 bg-slate-900/60 px-3 py-2 text-xs text-slate-100 outline-none ring-sky-500/60 focus:border-sky-400 focus:ring-1 ${
        props.className ?? ""
      }`}
    />
  );
}

function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={`w-full rounded-lg border border-slate-700 bg-slate-900/60 px-3 py-2 text-xs text-slate-100 outline-none ring-sky-500/60 focus:border-sky-400 focus:ring-1 ${
        props.className ?? ""
      }`}
    >
      {props.children}
    </select>
  );
}

function TextArea({
  rows = 3,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      rows={rows}
      className={`w-full resize-none rounded-lg border border-slate-700 bg-slate-900/60 px-3 py-2 text-xs text-slate-100 outline-none ring-sky-500/60 focus:border-sky-400 focus:ring-1 ${
        props.className ?? ""
      }`}
    />
  );
}

function Card(props: {
  title: string;
  subtitle?: string;
  badge?: string;
  children: React.ReactNode;
}) {
  const { title, subtitle, badge, children } = props;
  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-950/70 px-4 py-4 md:px-5 md:py-5 shadow-[0_20px_70px_rgba(15,23,42,0.9)]">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-300">
            {title}
          </h2>
          {subtitle && (
            <p className="mt-1 text-[11px] text-slate-500">{subtitle}</p>
          )}
        </div>
        {badge && (
          <span className="rounded-full border border-sky-500/40 bg-sky-500/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.18em] text-sky-200">
            {badge}
          </span>
        )}
      </div>
      {children}
    </section>
  );
}

/* ---- Implant safety sliders ---- */

type ImplantSite = {
  id: string;
  tooth: string;
  arch: string;
  region: string;
  availableBoneMm: number;
  implantLengthMm: number;
};

const INITIAL_SITES: ImplantSite[] = [
  {
    id: "site1",
    tooth: "11",
    arch: "Maxilla",
    region: "Anterior",
    availableBoneMm: 14,
    implantLengthMm: 11.5,
  },
  {
    id: "site2",
    tooth: "21",
    arch: "Maxilla",
    region: "Anterior",
    availableBoneMm: 13,
    implantLengthMm: 10,
  },
  {
    id: "site3",
    tooth: "36",
    arch: "Mandible",
    region: "Posterior",
    availableBoneMm: 11,
    implantLengthMm: 9,
  },
  {
    id: "site4",
    tooth: "46",
    arch: "Mandible",
    region: "Posterior",
    availableBoneMm: 9,
    implantLengthMm: 8,
  },
];

function getSafetyLevel(site: ImplantSite) {
  const margin = site.availableBoneMm - site.implantLengthMm;

  if (margin < 1) {
    return {
      label: "Critical — not enough bone",
      className:
        "bg-rose-500/15 text-rose-200 border-rose-500/60 shadow-[0_0_24px_rgba(248,113,113,0.55)]",
      bar: "bg-rose-500",
    };
  }
  if (margin < 3) {
    return {
      label: "Limited — borderline safety zone",
      className:
        "bg-amber-500/15 text-amber-100 border-amber-500/60 shadow-[0_0_24px_rgba(245,158,11,0.55)]",
      bar: "bg-amber-400",
    };
  }
  return {
    label: "Safe — adequate bone for length",
    className:
      "bg-emerald-500/15 text-emerald-100 border-emerald-500/60 shadow-[0_0_24px_rgba(16,185,129,0.55)]",
    bar: "bg-emerald-400",
  };
}

export default function ImplantsRecordPage() {
  const [sites, setSites] = useState<ImplantSite[]>(INITIAL_SITES);

  const updateSite = (
    id: string,
    field: keyof ImplantSite,
    value: number | string
  ) => {
    setSites((prev) =>
      prev.map((s) =>
        s.id === id
          ? {
              ...s,
              [field]:
                typeof s[field] === "number" ? Number(value) : String(value),
            }
          : s
      )
    );
  };

  const adjustMm = (
    id: string,
    field: "availableBoneMm" | "implantLengthMm",
    delta: number
  ) => {
    setSites((prev) =>
      prev.map((s) => {
        if (s.id !== id) return s;
        const min = field === "availableBoneMm" ? 4 : 6;
        const max = field === "availableBoneMm" ? 25 : 18;
        const next = Math.min(max, Math.max(min, s[field] + delta));
        return { ...s, [field]: next };
      })
    );
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-50">
      <div className="mx-auto max-w-6xl px-4 pb-24 pt-8">
        {/* Header */}
        <header className="mb-8 flex items-center justify-between gap-4">
          <div>
            <p className="text-[11px] uppercase tracking-[0.28em] text-sky-400">
              Specialties · Layer 3
            </p>
            <h1 className="mt-1 text-2xl md:text-3xl font-semibold tracking-tight text-slate-50">
              Implants · 3D Planning & Surgical Record
            </h1>
            <p className="mt-2 max-w-2xl text-xs md:text-sm text-slate-400">
              Measure bone, select implant system, define guided vs freehand
              surgery, torque, immediate loading and distances — ready to sync
              with radiology and prosthodontics.
            </p>
          </div>

          <Link
            href="/specialties"
            className="rounded-full border border-slate-700 bg-slate-900/70 px-4 py-1.5 text-xs md:text-sm text-slate-200 hover:border-sky-500 hover:text-sky-100 transition-colors"
          >
            ← Back to Specialties Universe
          </Link>
        </header>

        {/* Context */}
        <Card
          title="Implant Case Context"
          subtitle="Link with EMR, CBCT and prosthodontic plan."
          badge="Planning"
        >
          <div className="grid gap-4 md:grid-cols-4">
            <div>
              <label className="mb-1 block text-[11px] font-medium text-slate-300">
                Patient (link EMR)
              </label>
              <button className="w-full rounded-full border border-sky-500/70 bg-sky-500/10 px-3 py-2 text-[11px] font-semibold text-sky-100 hover:bg-sky-500/20 transition">
                Select patient from EMR
              </button>
            </div>
            <div>
              <label className="mb-1 block text-[11px] font-medium text-slate-300">
                Implant case ID
              </label>
              <Input placeholder="ADIE-IMPL-0001" />
            </div>
            <div>
              <label className="mb-1 block text-[11px] font-medium text-slate-300">
                Arch
              </label>
              <Select defaultValue="">
                <option value="">Select…</option>
                <option>Maxilla</option>
                <option>Mandible</option>
                <option>Both arches</option>
              </Select>
            </div>
            <div>
              <label className="mb-1 block text-[11px] font-medium text-slate-300">
                Prosthodontic plan
              </label>
              <Select defaultValue="">
                <option value="">Select…</option>
                <option>Single crown</option>
                <option>Short-span bridge</option>
                <option>Full-arch fixed (All-on-X)</option>
                <option>Overdenture</option>
                <option>Zygomatic-based rehabilitation</option>
              </Select>
            </div>
          </div>

          <div className="mt-4 grid gap-4 md:grid-cols-4">
            <div>
              <label className="mb-1 block text-[11px] font-medium text-slate-300">
                CBCT
              </label>
              <Select defaultValue="">
                <option value="">Select…</option>
                <option>CBCT reviewed</option>
                <option>CBCT requested</option>
                <option>No CBCT (not indicated)</option>
              </Select>
            </div>
            <div>
              <label className="mb-1 block text-[11px] font-medium text-slate-300">
                Surgical guide
              </label>
              <Select defaultValue="">
                <option value="">Select…</option>
                <option>No guide (freehand)</option>
                <option>Printed static guide</option>
                <option>Guided pilot only</option>
                <option>Dynamic navigation</option>
              </Select>
            </div>
            <div>
              <label className="mb-1 block text-[11px] font-medium text-slate-300">
                Immediate loading
              </label>
              <Select defaultValue="">
                <option value="">Select…</option>
                <option>No immediate load</option>
                <option>Immediate provisional crown</option>
                <option>Immediate full-arch provisional</option>
                <option>Delayed loading plan</option>
              </Select>
            </div>
            <div>
              <label className="mb-1 block text-[11px] font-medium text-slate-300">
                Zygomatic implants
              </label>
              <Select defaultValue="">
                <option value="">Select…</option>
                <option>Not used</option>
                <option>Unilateral zygomatic</option>
                <option>Bilateral zygomatic</option>
                <option>Quad zygoma</option>
              </Select>
            </div>
          </div>
        </Card>

        {/* Main grid */}
        <div className="mt-6 grid gap-5 lg:grid-cols-[1.5fr,1.5fr]">
          {/* Left column: system + sliders */}
          <div className="space-y-5">
            <Card
              title="Implant System & Components"
              subtitle="System, connection, diameter, length and platform grouping."
              badge="System"
            >
              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <label className="mb-1 block text-[11px] font-medium text-slate-300">
                    Implant system
                  </label>
                  <Select defaultValue="">
                    <option value="">Select…</option>
                    <option>Nobel Biocare (NobelActive, NobelReplace, etc.)</option>
                    <option>Straumann (BL, BLX, TL, etc.)</option>
                    <option>Astra Tech / Dentsply Sirona</option>
                    <option>Zimmer Biomet</option>
                    <option>BioHorizons</option>
                    <option>Neodent</option>
                    <option>MIS / Alpha-Bio</option>
                    <option>Megagen / Other</option>
                  </Select>
                </div>
                <div>
                  <label className="mb-1 block text-[11px] font-medium text-slate-300">
                    Connection type
                  </label>
                  <Select defaultValue="">
                    <option value="">Select…</option>
                    <option>Conical / Morse taper</option>
                    <option>Internal hex</option>
                    <option>Internal tri-channel</option>
                    <option>External hex</option>
                  </Select>
                </div>
                <div>
                  <label className="mb-1 block text-[11px] font-medium text-slate-300">
                    Platform group (A / B / C)
                  </label>
                  <Select defaultValue="">
                    <option value="">Select…</option>
                    <option>Platform A (narrow)</option>
                    <option>Platform B (standard)</option>
                    <option>Platform C (wide)</option>
                  </Select>
                </div>
              </div>

              <div className="mt-4 grid gap-4 md:grid-cols-4">
                <div>
                  <label className="mb-1 block text-[11px] font-medium text-slate-300">
                    Diameter (mm)
                  </label>
                  <Select defaultValue="">
                    <option value="">Select…</option>
                    <option>3.0</option>
                    <option>3.3</option>
                    <option>3.5</option>
                    <option>3.75</option>
                    <option>4.0</option>
                    <option>4.3</option>
                    <option>4.8</option>
                    <option>5.0</option>
                    <option>5.5+</option>
                  </Select>
                </div>
                <div>
                  <label className="mb-1 block text-[11px] font-medium text-slate-300">
                    Length (mm)
                  </label>
                  <Select defaultValue="">
                    <option value="">Select…</option>
                    <option>6</option>
                    <option>8</option>
                    <option>9</option>
                    <option>10</option>
                    <option>11.5</option>
                    <option>13</option>
                    <option>15</option>
                    <option>18</option>
                  </Select>
                </div>
                <div>
                  <label className="mb-1 block text-[11px] font-medium text-slate-300">
                    Torque at placement (Ncm)
                  </label>
                  <Input placeholder="e.g. 35 Ncm" />
                </div>
                <div>
                  <label className="mb-1 block text-[11px] font-medium text-slate-300">
                    Primary stability
                  </label>
                  <Select defaultValue="">
                    <option value="">Select…</option>
                    <option>Excellent</option>
                    <option>Good</option>
                    <option>Moderate</option>
                    <option>Poor</option>
                  </Select>
                </div>
              </div>
            </Card>

            <Card
              title="Bone vs Implant Safety Grid"
              subtitle="Per-implant sliders: available bone height vs planned implant length with color-coded safety."
              badge="Bone & length"
            >
              <p className="mb-3 text-[11px] text-slate-400">
                Each row simulates the kind of chart you had for periodontics,
                now focused on vertical bone and implant length. The color band
                indicates if the current combination is critical, limited or
                safe — ideal for matching CBCT measurements.
              </p>

              <div className="space-y-3">
                {sites.map((site) => {
                  const safety = getSafetyLevel(site);
                  const margin = site.availableBoneMm - site.implantLengthMm;

                  return (
                    <div
                      key={site.id}
                      className="rounded-2xl border border-slate-800 bg-slate-950/80 px-3 py-3 md:px-4 md:py-3.5"
                    >
                      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2 text-[11px]">
                          <span className="rounded-full bg-sky-500/20 px-2 py-0.5 font-semibold text-sky-200">
                            Site {site.tooth || "—"}
                          </span>
                          <span className="text-slate-400">
                            {site.arch} · {site.region}
                          </span>
                        </div>
                        <span
                          className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] ${safety.className}`}
                        >
                          {safety.label}
                          <span className="ml-2 text-[9px] opacity-80">
                            Margin: {margin.toFixed(1)} mm
                          </span>
                        </span>
                      </div>

                      <div className="grid gap-3 md:grid-cols-[1.2fr,1.2fr]">
                        {/* Left side: tooth & mm controls */}
                        <div className="space-y-2">
                          <div className="grid grid-cols-3 gap-2">
                            <div>
                              <label className="mb-1 block text-[10px] font-medium text-slate-300">
                                Tooth / site
                              </label>
                              <Input
                                value={site.tooth}
                                onChange={(e) =>
                                  updateSite(site.id, "tooth", e.target.value)
                                }
                                placeholder="FDI / universal"
                              />
                            </div>
                            <div>
                              <label className="mb-1 block text-[10px] font-medium text-slate-300">
                                Arch
                              </label>
                              <Select
                                value={site.arch}
                                onChange={(e) =>
                                  updateSite(site.id, "arch", e.target.value)
                                }
                              >
                                <option>Maxilla</option>
                                <option>Mandible</option>
                              </Select>
                            </div>
                            <div>
                              <label className="mb-1 block text-[10px] font-medium text-slate-300">
                                Region
                              </label>
                              <Select
                                value={site.region}
                                onChange={(e) =>
                                  updateSite(site.id, "region", e.target.value)
                                }
                              >
                                <option>Anterior</option>
                                <option>Premolar</option>
                                <option>Posterior</option>
                              </Select>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="mb-1 block text-[10px] font-medium text-emerald-300">
                                Available bone height (mm)
                              </label>
                              <div className="flex items-center gap-1">
                                <button
                                  type="button"
                                  onClick={() =>
                                    adjustMm(
                                      site.id,
                                      "availableBoneMm",
                                      -1
                                    )
                                  }
                                  className="h-7 w-7 rounded-full border border-slate-700 bg-slate-900 text-[13px] text-slate-200 hover:border-sky-500 hover:text-sky-200"
                                >
                                  –
                                </button>
                                <div className="flex-1 rounded-lg border border-slate-700 bg-slate-900/70 px-2 py-1 text-center text-[11px] text-slate-100">
                                  {site.availableBoneMm.toFixed(1)} mm
                                </div>
                                <button
                                  type="button"
                                  onClick={() =>
                                    adjustMm(site.id, "availableBoneMm", 1)
                                  }
                                  className="h-7 w-7 rounded-full border border-slate-700 bg-slate-900 text-[13px] text-slate-200 hover:border-sky-500 hover:text-sky-200"
                                >
                                  +
                                </button>
                              </div>
                            </div>
                            <div>
                              <label className="mb-1 block text-[10px] font-medium text-sky-300">
                                Planned implant length (mm)
                              </label>
                              <div className="flex items-center gap-1">
                                <button
                                  type="button"
                                  onClick={() =>
                                    adjustMm(site.id, "implantLengthMm", -1)
                                  }
                                  className="h-7 w-7 rounded-full border border-slate-700 bg-slate-900 text-[13px] text-slate-200 hover:border-sky-500 hover:text-sky-200"
                                >
                                  –
                                </button>
                                <div className="flex-1 rounded-lg border border-slate-700 bg-slate-900/70 px-2 py-1 text-center text-[11px] text-slate-100">
                                  {site.implantLengthMm.toFixed(1)} mm
                                </div>
                                <button
                                  type="button"
                                  onClick={() =>
                                    adjustMm(site.id, "implantLengthMm", 1)
                                  }
                                  className="h-7 w-7 rounded-full border border-slate-700 bg-slate-900 text-[13px] text-slate-200 hover:border-sky-500 hover:text-sky-200"
                                >
                                  +
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Right side: visual bar + distances */}
                        <div className="space-y-2">
                          <div>
                            <p className="mb-1 text-[10px] font-medium text-slate-300">
                              Safety visualization
                            </p>
                            <div className="h-3 w-full rounded-full bg-slate-800 overflow-hidden">
                              <div
                                className={`h-full ${safety.bar}`}
                                style={{
                                  width: `${
                                    Math.min(
                                      100,
                                      (site.implantLengthMm /
                                        Math.max(
                                          site.availableBoneMm,
                                          site.implantLengthMm
                                        )) *
                                        100
                                    ) || 0
                                  }%`,
                                }}
                              />
                            </div>
                            <p className="mt-1 text-[10px] text-slate-500">
                              Idea futura: conectar esto a la vista SVG del
                              implante sobre el hueso (CBCT).
                            </p>
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="mb-1 block text-[10px] font-medium text-slate-300">
                                Distance to adjacent teeth (mm)
                              </label>
                              <Input placeholder="e.g. 1.5 mm / 2.0 mm" />
                            </div>
                            <div>
                              <label className="mb-1 block text-[10px] font-medium text-slate-300">
                                Distance to next implant (mm)
                              </label>
                              <Input placeholder="e.g. 3.0 mm" />
                            </div>
                          </div>

                          <div>
                            <label className="mb-1 block text-[10px] font-medium text-slate-300">
                              Critical structures
                            </label>
                            <TextArea
                              rows={2}
                              placeholder="Sinus floor, nasal floor, mandibular canal, mental foramen, incisive canal, etc."
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>

          {/* Right column: surgical details + notes */}
          <div className="space-y-5">
            <Card
              title="Surgical Details"
              subtitle="Flap design, approach, drilling protocol and irrigation."
              badge="Surgery"
            >
              <div className="grid gap-3 md:grid-cols-3">
                <div>
                  <label className="mb-1 block text-[11px] font-medium text-slate-300">
                    Flap design
                  </label>
                  <Select defaultValue="">
                    <option value="">Select…</option>
                    <option>Flapless</option>
                    <option>Crestal incision</option>
                    <option>Crestal with releasing incisions</option>
                    <option>Extended flap (augmentation)</option>
                  </Select>
                </div>
                <div>
                  <label className="mb-1 block text-[11px] font-medium text-slate-300">
                    Drilling protocol
                  </label>
                  <Select defaultValue="">
                    <option value="">Select…</option>
                    <option>Standard sequence</option>
                    <option>Undersized (for high stability)</option>
                    <option>Soft bone protocol</option>
                    <option>Hard bone protocol</option>
                    <option>Custom / modified protocol</option>
                  </Select>
                </div>
                <div>
                  <label className="mb-1 block text-[11px] font-medium text-slate-300">
                    Irrigation
                  </label>
                  <Select defaultValue="">
                    <option value="">Select…</option>
                    <option>External irrigation</option>
                    <option>Internal irrigation</option>
                    <option>Combined</option>
                  </Select>
                </div>
              </div>

              <div className="mt-3">
                <label className="mb-1 block text-[11px] font-medium text-slate-300">
                  Surgical notes
                </label>
                <TextArea placeholder="Details of approach, sinus management, ridge expansion, complications, changes to the plan…" />
              </div>
            </Card>

            <Card
              title="Soft Tissue, Healing & Prosthetic Connection"
              subtitle="Emergence profile, healing abutments and connection to prosthodontics."
              badge="Connection"
            >
              <div className="grid gap-3 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-[11px] font-medium text-slate-300">
                    Soft tissue management
                  </label>
                  <Select defaultValue="">
                    <option value="">Select…</option>
                    <option>No soft tissue augmentation</option>
                    <option>Connective tissue graft</option>
                    <option>Free gingival graft</option>
                    <option>Pedicle flap</option>
                    <option>Other soft tissue procedure</option>
                  </Select>
                </div>
                <div>
                  <label className="mb-1 block text-[11px] font-medium text-slate-300">
                    Healing components
                  </label>
                  <Select defaultValue="">
                    <option value="">Select…</option>
                    <option>Healing abutments</option>
                    <option>Cover screws (submerged)</option>
                    <option>Immediate provisional abutments</option>
                  </Select>
                </div>
              </div>

              <div className="mt-3 grid gap-3 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-[11px] font-medium text-slate-300">
                    Prosthetic timeline
                  </label>
                  <Select defaultValue="">
                    <option value="">Select…</option>
                    <option>Immediate provisionalization</option>
                    <option>Early loading (6–8 weeks)</option>
                    <option>Conventional loading (3–6 months)</option>
                    <option>Custom timeline</option>
                  </Select>
                </div>
                <div>
                  <label className="mb-1 block text-[11px] font-medium text-slate-300">
                    Link to Prosthodontics module
                  </label>
                  <Input placeholder="Planned case ID / notes to lab…" />
                </div>
              </div>

              <div className="mt-3">
                <label className="mb-1 block text-[11px] font-medium text-slate-300">
                  Global summary / comments
                </label>
                <TextArea placeholder="Final impression of case, special risks, long-term follow-up recommendations, coordination with perio / prostho / OMFS…" />
              </div>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}
