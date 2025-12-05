"use client";

import Link from "next/link";
import { useState } from "react";

const RESTORATION_TYPE_OPTIONS = [
  "None",
  "Full coverage crown",
  "Implant crown",
  "Inlay",
  "Onlay",
  "Overlay",
  "Veneer",
  "Endocrown",
  "Post & core only",
  "Pontic (bridge tooth)",
  "Abutment crown (bridge)",
];

const MATERIAL_OPTIONS = [
  // Metal & metal-ceramic
  "High-noble metal (gold-based)",
  "Noble metal alloy (Pd-based)",
  "Base metal alloy (Ni-Cr / Co-Cr)",
  "Porcelain-fused-to-metal (PFM)",
  // All-ceramic
  "Feldspathic porcelain",
  "Leucite-reinforced glass-ceramic",
  "Lithium disilicate",
  "Zirconia – monolithic",
  "Zirconia – layered (porcelain on zirconia)",
  "Alumina-based ceramic",
  // Polymers / composites
  "Indirect composite / nano-ceramic CAD-CAM",
  "PMMA provisional",
  // Other
  "Stainless steel crown",
  "Provisional shell crown",
  "Other / custom material",
];

const PREPARATION_STATUS_OPTIONS = [
  "Not prepared",
  "Preparation planned",
  "Prepared – impression pending",
  "Prepared – impression taken",
];

const RESTORATION_STAGE_OPTIONS = [
  "Planned",
  "Wax-up / digital design",
  "In lab fabrication",
  "Try-in",
  "Cemented / delivered",
  "Under review / remake",
];

const POST_TYPE_OPTIONS = [
  "None",
  "Cast metal post & core",
  "Prefabricated metal post",
  "Fiber-reinforced post",
  "Ceramic / zirconia post",
];

const SHADE_SYSTEM_OPTIONS = [
  "VITA Classical A1–D4",
  "VITA 3D-Master",
  "Ivoclar Chromascop",
  "Other / custom system",
];

const SHADE_CODE_OPTIONS = [
  "A1",
  "A2",
  "A3",
  "A3.5",
  "A4",
  "B1",
  "B2",
  "B3",
  "B4",
  "C1",
  "C2",
  "C3",
  "C4",
  "D2",
  "D3",
  "D4",
];

const REMOVABLE_OPTIONS = [
  "No removable prosthesis",
  "Interim partial denture",
  "Conventional complete denture",
  "Implant-retained overdenture",
  "Other removable prosthesis",
];

const FRAMEWORK_MATERIAL_OPTIONS = [
  "Not applicable",
  "Cobalt-chromium",
  "Titanium",
  "PEEK / high-performance polymer",
  "Other framework material",
];

const OCCLUSAL_SCHEME_OPTIONS = [
  "Not specified",
  "Canine guidance",
  "Group function",
  "Balanced occlusion",
  "Monoplane",
];

const IMPLANT_PROSTHESIS_TYPE_OPTIONS = [
  "None",
  "Single implant crown",
  "Implant-supported short bridge",
  "Full-arch fixed hybrid",
  "Full-arch screw-retained bridge",
  "Overdenture on implants",
];

const RESTORATION_AREA_OPTIONS = [
  "Single crown",
  "Multiple single crowns",
  "Short bridge (≤3 units)",
  "Long bridge (≥4 units)",
  "Full arch",
  "Both arches",
];

const UPPER_TEETH = [18, 17, 16, 15, 14, 13, 12, 11];
const LOWER_TEETH = [48, 47, 46, 45, 44, 43, 42, 41];

type Arch = "upper" | "lower";

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-xs font-semibold tracking-[0.2em] text-sky-300/80 uppercase">
      {children}
    </h2>
  );
}

function Card({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-3xl border border-slate-800/70 bg-slate-900/60 px-5 py-4 shadow-[0_18px_60px_rgba(15,23,42,0.85)] backdrop-blur-xl">
      <div className="mb-3 space-y-1">
        <h3 className="text-sm font-semibold text-slate-100">{title}</h3>
        {subtitle && (
          <p className="text-[11px] leading-snug text-slate-400">{subtitle}</p>
        )}
      </div>
      {children}
    </section>
  );
}

function ToothRow({
  toothNumber,
  arch,
}: {
  toothNumber: number;
  arch: Arch;
}) {
  return (
    <div className="grid grid-cols-6 gap-2 rounded-2xl border border-slate-800/80 bg-slate-900/60 px-3 py-2 text-[11px] text-slate-200">
      <div className="flex items-center font-semibold text-sky-200">
        {arch === "upper" ? "⬆" : "⬇"}&nbsp;Tooth {toothNumber}
      </div>

      <select className="rounded-xl border border-slate-700/70 bg-slate-900 px-2 py-1 text-[11px] focus:border-sky-400 focus:outline-none">
        {RESTORATION_TYPE_OPTIONS.map((opt) => (
          <option key={opt}>{opt}</option>
        ))}
      </select>

      <select className="rounded-xl border border-slate-700/70 bg-slate-900 px-2 py-1 text-[11px] focus:border-sky-400 focus:outline-none">
        {MATERIAL_OPTIONS.map((opt) => (
          <option key={opt}>{opt}</option>
        ))}
      </select>

      <select className="rounded-xl border border-slate-700/70 bg-slate-900 px-2 py-1 text-[11px] focus:border-sky-400 focus:outline-none">
        {PREPARATION_STATUS_OPTIONS.map((opt) => (
          <option key={opt}>{opt}</option>
        ))}
      </select>

      <select className="rounded-xl border border-slate-700/70 bg-slate-900 px-2 py-1 text-[11px] focus:border-sky-400 focus:outline-none">
        {RESTORATION_STAGE_OPTIONS.map((opt) => (
          <option key={opt}>{opt}</option>
        ))}
      </select>

      <select className="rounded-xl border border-slate-700/70 bg-slate-900 px-2 py-1 text-[11px] focus:border-sky-400 focus:outline-none">
        {POST_TYPE_OPTIONS.map((opt) => (
          <option key={opt}>{opt}</option>
        ))}
      </select>
    </div>
  );
}

export default function ProsthodonticsRecordPage() {
  const [fixedImplantMode, setFixedImplantMode] = useState<"fixed" | "implant">(
    "fixed",
  );

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-950 to-slate-950 text-slate-50">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-6 pb-12 pt-8">
        {/* Header */}
        <header className="flex items-center justify-between gap-4">
          <div className="space-y-1">
            <SectionLabel>SPECIALTIES · LAYER 3</SectionLabel>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-50">
              Prosthodontics Clinical Record
            </h1>
            <p className="max-w-2xl text-xs text-slate-400">
              Fixed, removable and implant-supported prosthetic work in one
              organized module. Almost everything is selectable so specialists
              can focus on decisions, not typing.
            </p>
          </div>

          <Link
            href="/specialties"
            className="inline-flex items-center rounded-full border border-slate-700 bg-slate-900/70 px-4 py-2 text-[11px] font-medium text-slate-200 shadow-[0_0_0_1px_rgba(15,23,42,0.8)] transition hover:border-sky-500 hover:text-sky-200"
          >
            ← Back to Specialties Universe
          </Link>
        </header>

        {/* Top area: patient context */}
        <Card
          title="Patient & case context"
          subtitle="Link with EMR, define global prosthodontic plan and complexity."
        >
          <div className="grid gap-4 md:grid-cols-4 lg:grid-cols-6">
            <div className="md:col-span-2">
              <p className="text-[11px] text-slate-400 mb-1">Patient</p>
              <button className="w-full rounded-full border border-sky-600/60 bg-slate-900 px-3 py-1.5 text-[11px] font-semibold text-sky-100 shadow-[0_0_18px_rgba(56,189,248,0.5)] hover:border-sky-400">
                Select patient from EMR
              </button>
            </div>

            <div>
              <p className="mb-1 text-[11px] text-slate-400">Case ID</p>
              <div className="rounded-full border border-slate-700 bg-slate-950 px-3 py-1.5 text-[11px] text-slate-200">
                ADIE-PROSTH-0001
              </div>
            </div>

            <div>
              <p className="mb-1 text-[11px] text-slate-400">Case type</p>
              <select className="w-full rounded-full border border-slate-700 bg-slate-950 px-3 py-1.5 text-[11px] text-slate-200">
                <option>Single tooth rehabilitation</option>
                <option>Multiple crowns / short bridge</option>
                <option>Full arch fixed</option>
                <option>Full mouth rehabilitation</option>
              </select>
            </div>

            <div>
              <p className="mb-1 text-[11px] text-slate-400">Complexity</p>
              <select className="w-full rounded-full border border-slate-700 bg-slate-950 px-3 py-1.5 text-[11px] text-slate-200">
                <option>Standard</option>
                <option>Advanced (occlusion / esthetics)</option>
                <option>Complex (implant / full mouth)</option>
              </select>
            </div>
          </div>
        </Card>

        {/* Middle: grid of fixed + removable / implant */}
        <div className="grid gap-5 lg:grid-cols-[minmax(0,2fr),minmax(0,1fr)]">
          {/* Tooth-level prosthetic map */}
          <Card
            title="Tooth-level prosthetic map"
            subtitle="For each tooth, choose restoration type, material, preparation and stage. Click options instead of typing — almost everything is selectable."
          >
            <div className="mb-3 flex items-center justify-between gap-3 text-[11px]">
              <div className="inline-flex items-center gap-2 rounded-full border border-slate-700/70 bg-slate-900/80 px-2 py-1">
                <span className="text-slate-400">Mode:</span>
                <button
                  type="button"
                  onClick={() => setFixedImplantMode("fixed")}
                  className={`rounded-full px-2 py-0.5 text-[11px] ${
                    fixedImplantMode === "fixed"
                      ? "bg-sky-500 text-slate-900"
                      : "text-slate-300 hover:text-sky-200"
                  }`}
                >
                  Fixed
                </button>
                <button
                  type="button"
                  onClick={() => setFixedImplantMode("implant")}
                  className={`rounded-full px-2 py-0.5 text-[11px] ${
                    fixedImplantMode === "implant"
                      ? "bg-sky-500 text-slate-900"
                      : "text-slate-300 hover:text-sky-200"
                  }`}
                >
                  Implant-supported
                </button>
              </div>
              <p className="text-[11px] text-slate-500">
                Arches follow FDI numbering · Columns: Restoration · Material ·
                Prep · Stage · Post type
              </p>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              {/* Upper arch */}
              <div className="space-y-2">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-300">
                  Upper arch
                </p>
                <div className="space-y-1.5">
                  {UPPER_TEETH.map((t) => (
                    <ToothRow key={`u-${t}`} toothNumber={t} arch="upper" />
                  ))}
                </div>
              </div>

              {/* Lower arch */}
              <div className="space-y-2">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-300">
                  Lower arch
                </p>
                <div className="space-y-1.5">
                  {LOWER_TEETH.map((t) => (
                    <ToothRow key={`l-${t}`} toothNumber={t} arch="lower" />
                  ))}
                </div>
              </div>
            </div>
          </Card>

          {/* Removable & implant summary */}
          <div className="space-y-4">
            <Card
              title="Removable & full-arch prostheses"
              subtitle="Quick selectors for complete and partial dentures, overdentures and full-arch implant prosthetics."
            >
              <div className="space-y-3 text-[11px]">
                <div>
                  <p className="mb-1 text-slate-400">Upper arch</p>
                  <select className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-1.5 text-[11px] text-slate-100">
                    {REMOVABLE_OPTIONS.map((opt) => (
                      <option key={opt}>{opt}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <p className="mb-1 text-slate-400">Lower arch</p>
                  <select className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-1.5 text-[11px] text-slate-100">
                    {REMOVABLE_OPTIONS.map((opt) => (
                      <option key={opt}>{opt}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <p className="mb-1 text-slate-400">Framework material</p>
                  <select className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-1.5 text-[11px] text-slate-100">
                    {FRAMEWORK_MATERIAL_OPTIONS.map((opt) => (
                      <option key={opt}>{opt}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <p className="mb-1 text-slate-400">Occlusal scheme</p>
                  <select className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-1.5 text-[11px] text-slate-100">
                    {OCCLUSAL_SCHEME_OPTIONS.map((opt) => (
                      <option key={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
              </div>
            </Card>

            <Card
              title="Implant prosthetics (summary)"
              subtitle="This will later connect with the implant surgery module and CBCT."
            >
              <div className="space-y-3 text-[11px]">
                <div>
                  <p className="mb-1 text-slate-400">
                    Number of implants in prosthodontic plan
                  </p>
                  <input
                    type="number"
                    min={0}
                    className="w-24 rounded-xl border border-slate-700 bg-slate-950 px-3 py-1.5 text-[11px] text-slate-100"
                    placeholder="0"
                  />
                </div>

                <div>
                  <p className="mb-1 text-slate-400">
                    Type of implant-supported prosthesis
                  </p>
                  <select className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-1.5 text-[11px] text-slate-100">
                    {IMPLANT_PROSTHESIS_TYPE_OPTIONS.map((opt) => (
                      <option key={opt}>{opt}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <p className="mb-1 text-slate-400">
                    Connection & screw protocol
                  </p>
                  <select className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-1.5 text-[11px] text-slate-100">
                    <option>Not specified</option>
                    <option>Stock abutment – cement-retained</option>
                    <option>Custom abutment – cement-retained</option>
                    <option>Screw-retained directly on implant</option>
                    <option>Screw-retained on multi-unit abutment</option>
                  </select>
                </div>

                <div>
                  <p className="mb-1 text-slate-400">Notes for implant prosthetics</p>
                  <textarea
                    rows={3}
                    className="w-full resize-none rounded-2xl border border-slate-700 bg-slate-950 px-3 py-2 text-[11px] text-slate-100"
                    placeholder="Brand and system, platform size, emergence profile goals, soft tissue considerations…"
                  />
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Bottom: lab prescription & notes */}
        <div className="grid gap-5 lg:grid-cols-[minmax(0,2fr),minmax(0,1fr)]">
          <Card
            title="Lab prescription"
            subtitle="All the key elements in a high-level lab Rx: area, material, shade and finishing details."
          >
            <div className="grid gap-4 md:grid-cols-2 text-[11px]">
              <div className="space-y-3">
                <div>
                  <p className="mb-1 text-slate-400">Restoration area</p>
                  <select className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-1.5 text-[11px] text-slate-100">
                    {RESTORATION_AREA_OPTIONS.map((opt) => (
                      <option key={opt}>{opt}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <p className="mb-1 text-slate-400">Primary material</p>
                  <select className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-1.5 text-[11px] text-slate-100">
                    {MATERIAL_OPTIONS.map((opt) => (
                      <option key={opt}>{opt}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <p className="mb-1 text-slate-400">Shade system</p>
                  <select className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-1.5 text-[11px] text-slate-100">
                    {SHADE_SYSTEM_OPTIONS.map((opt) => (
                      <option key={opt}>{opt}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="mb-1 text-slate-400">Shade code</p>
                    <select className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-1.5 text-[11px] text-slate-100">
                      {SHADE_CODE_OPTIONS.map((opt) => (
                        <option key={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <p className="mb-1 text-slate-400">Stump shade</p>
                    <input
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-1.5 text-[11px] text-slate-100"
                      placeholder="e.g. ND2 / A3 dentin"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <p className="mb-1 text-slate-400">Occlusal scheme / guidance</p>
                  <select className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-1.5 text-[11px] text-slate-100">
                    {OCCLUSAL_SCHEME_OPTIONS.map((opt) => (
                      <option key={opt}>{opt}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="mb-1 text-slate-400">Surface texture</p>
                    <select className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-1.5 text-[11px] text-slate-100">
                      <option>Natural / age-matched</option>
                      <option>Smooth / youthful</option>
                      <option>Pronounced texture</option>
                    </select>
                  </div>
                  <div>
                    <p className="mb-1 text-slate-400">Glaze / polish</p>
                    <select className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-1.5 text-[11px] text-slate-100">
                      <option>Full glaze</option>
                      <option>Glaze + localized polish</option>
                      <option>High polish only</option>
                    </select>
                  </div>
                </div>

                <div>
                  <p className="mb-1 text-slate-400">Special instructions for the lab</p>
                  <textarea
                    rows={5}
                    className="w-full resize-none rounded-2xl border border-slate-700 bg-slate-950 px-3 py-2 text-[11px] text-slate-100"
                    placeholder="Margin design (chamfer/shoulder), pontic design, contact tightness, emergence profile, soft tissue support, try-in preferences…"
                  />
                </div>
              </div>
            </div>
          </Card>

          <Card
            title="Clinical notes"
            subtitle="Short narrative tying clinical findings, diagnosis and planned prosthetic treatment. This will be part of the legal clinical record."
          >
            <textarea
              rows={12}
              className="w-full resize-none rounded-2xl border border-slate-700 bg-slate-950 px-3 py-2 text-[11px] text-slate-100"
              placeholder="Example: Full-mouth rehab with lithium disilicate in esthetic zone and monolithic zirconia in posterior segments. Existing PFM crowns on 26–27 to be maintained. Implant-supported fixed hybrid planned on 36–46 region…"
            />
          </Card>
        </div>
      </div>
    </main>
  );
}
