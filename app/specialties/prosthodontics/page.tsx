"use client";

import React from "react";
import Link from "next/link";
import { SpecialtyTopActions } from "@/app/_components/SpecialtyTopActions";

function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`w-full rounded-xl border border-slate-700 bg-slate-950/70 px-3 py-2 text-xs text-slate-100 outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-500/60 ${
        props.className ?? ""
      }`}
    />
  );
}

function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={`w-full rounded-xl border border-slate-700 bg-slate-950/70 px-3 py-2 text-xs text-slate-100 outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-500/60 ${
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
      className={`w-full rounded-xl border border-slate-700 bg-slate-950/70 px-3 py-2 text-xs text-slate-100 outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-500/60 ${
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
    <section className="rounded-2xl border border-slate-800 bg-slate-950/80 px-4 py-4 md:px-5 md:py-5 shadow-[0_22px_80px_rgba(15,23,42,0.95)]">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <h2 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-200">
            {title}
          </h2>
          {subtitle && (
            <p className="mt-1 text-[11px] text-slate-500">{subtitle}</p>
          )}
        </div>
        {badge && (
          <span className="rounded-full border border-amber-500/40 bg-amber-500/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.2em] text-amber-200">
            {badge}
          </span>
        )}
      </div>
      {children}
    </section>
  );
}

export default function ProsthodonticsLayerPage() {
  const demoTeeth = ["11", "12", "21", "24", "25", "36", "46"];

  return (
    <main className="min-h-screen bg-slate-950 text-slate-50">
      <div className="mx-auto max-w-6xl px-4 pb-24 pt-8">
        {/* HEADER TÍTULO + BOTONES */}
        <header className="mb-3 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-[0.28em] text-amber-400">
              Specialties · Prosthodontics
            </p>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-50 md:text-3xl">
              Prosthodontics · Digital Rehab & Lab Intelligence Hub
            </h1>
            <p className="mt-1 max-w-3xl text-xs text-slate-400 md:text-sm">
              Central cockpit for crowns, bridges, dentures, full-arch and
              implant-supported prostheses. Materials, shades, labs and AI
              guidance orchestrated in one workspace, fully connected to
              Implants, Perio and the global Dental Chart.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-end gap-2">
            <button className="rounded-full border border-slate-700 bg-slate-900/80 px-3 py-1.5 text-[11px] text-slate-200 hover:border-amber-400 hover:text-amber-100 transition-colors">
              View full EMR
            </button>
            <button className="rounded-full border border-slate-700 bg-slate-900/80 px-3 py-1.5 text-[11px] text-slate-200 hover:border-emerald-400 hover:text-emerald-100 transition-colors">
              Prostho timeline
            </button>
            <Link
              href="/specialties"
              className="rounded-full border border-slate-700 bg-slate-900/80 px-3 py-1.5 text-[11px] text-slate-300 hover:border-slate-400 hover:text-slate-50 transition-colors"
            >
              ← Back to Specialties Universe
            </Link>
          </div>
        </header>

        {/* BARRA ESTÁNDAR ADIE: BACK TO MPR + SAVE & DASHBOARD */}
        <SpecialtyTopActions specialtyLabel="Prosthodontics · Digital Rehab & Lab Intelligence" />

        {/* HEADER CLÍNICO COMPARTIDO */}
        <section className="mb-4 rounded-3xl border border-slate-800 bg-slate-950/80 px-5 py-3 shadow-[0_24px_80px_rgba(15,23,42,0.95)]">
          <div className="grid gap-4 md:grid-cols-[0.9fr,2fr,1.2fr] md:items-center">
            {/* FOTO PACIENTE */}
            <div className="space-y-2">
              <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-slate-400">
                Patient photo
              </p>
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-slate-700 bg-slate-900/80 text-[11px] text-slate-500">
                Photo
              </div>
              <button className="rounded-full border border-slate-700 bg-slate-900/80 px-3 py-1 text-[11px] text-slate-200 hover:border-amber-400 hover:text-amber-100 transition-colors">
                ⬆ Upload
              </button>
            </div>

            {/* DATOS + FLAGS */}
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-300">
                <span className="rounded-full bg-slate-900/80 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-400">
                  Active prosthodontic patient
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2 text-[13px] font-medium text-slate-50">
                <span>John / Jane Doe</span>
                <span className="text-slate-500">·</span>
                <span className="text-[11px] text-slate-300">
                  ID ADIE-PT-0001
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2 text-[10px] text-slate-400">
                <span>DOB: 1975-03-12</span>
                <span>· Age: 49y</span>
                <span>· Gender: Female</span>
                <span>· National ID / passport: 1-0000-0000</span>
              </div>

              <div className="flex flex-wrap items-center gap-2 text-[10px]">
                <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 font-semibold uppercase tracking-[0.18em] text-emerald-200">
                  VIP
                </span>
                <span className="rounded-full bg-amber-500/10 px-2 py-0.5 text-amber-200">
                  Financial hold · Review balance
                </span>
                <span className="rounded-full bg-slate-900 px-2 py-0.5 text-slate-300">
                  Full-arch rehab · Esthetic zone
                </span>
              </div>

              <div className="grid gap-2 text-[10px] text-slate-400 md:grid-cols-2">
                <div>
                  <p className="mb-0.5 font-medium text-slate-300">
                    Systemic & medical flags
                  </p>
                  <p className="leading-snug">
                    Controlled diabetes · no bisphosphonates · non-smoker ·
                    bruxism suspected (night-time clenching).
                  </p>
                </div>
                <div>
                  <p className="mb-0.5 font-medium text-slate-300">
                    Prostho & perio quick flags
                  </p>
                  <p className="leading-snug">
                    Generalized attrition · multiple missing posterior teeth ·
                    perio stable after therapy · several implants planned.
                  </p>
                </div>
              </div>
            </div>

            {/* RIESGO GLOBAL PROSTHO */}
            <div className="flex flex-col items-end gap-2.5">
              <div className="flex items-center gap-3">
                <div className="flex flex-col items-end text-right">
                  <span className="text-[10px] uppercase tracking-[0.24em] text-slate-400">
                    Global prostho risk
                  </span>
                  <div className="mt-1 flex items-center gap-2">
                    <div className="relative h-9 w-9">
                      <div className="absolute left-1/2 top-0 -translate-x-1/2 border-l-[9px] border-r-[9px] border-b-[16px] border-l-transparent border-r-transparent border-b-emerald-400/80" />
                      <div className="absolute left-1/2 top-[5px] -translate-x-1/2 border-l-[9px] border-r-[9px] border-b-[16px] border-l-transparent border-r-transparent border-b-amber-400/90" />
                      <div className="absolute left-1/2 top-[10px] -translate-x-1/2 border-l-[9px] border-r-[9px] border-b-[16px] border-l-transparent border-r-transparent border-b-rose-500/90" />
                    </div>
                    <div className="flex flex-col text-[10px] text-slate-300">
                      <span>Rehab complexity: 82/100</span>
                      <span className="text-amber-300">
                        Full-arch, implants + bruxism
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <button className="rounded-full border border-emerald-500/70 bg-emerald-500/10 px-3 py-1.5 text-[11px] font-semibold text-emerald-100 hover:bg-emerald-500/20 transition-colors">
                Cleared for prostho surgery · Medical alerts stable
              </button>

              <div className="flex flex-col items-end text-[10px] text-slate-400">
                <span>Implant sites: 14, 16, 24, 26, 36, 46 linked to Implants</span>
                <span>Perio & caries risk low · focus on occlusion & function</span>
              </div>
            </div>
          </div>
        </section>

        {/* LAYOUT PRINCIPAL */}
        <div className="grid gap-5 lg:grid-cols-[1.7fr,1.2fr]">
          {/* COLUMNA IZQUIERDA */}
          <div className="space-y-5">
            {/* CONTEXTO DE REHABILITACIÓN */}
            <Card
              title="Rehabilitation Strategy & Case Context"
              subtitle="Why we are restoring, extension of the case and link with Implants & Perio."
              badge="Context"
            >
              <div className="grid gap-3 text-[11px] md:grid-cols-4">
                <div className="md:col-span-2">
                  <label className="mb-1 block font-medium text-slate-300">
                    Patient (link EMR)
                  </label>
                  <button className="w-full rounded-full border border-slate-700 bg-slate-900/80 px-3 py-2 text-[11px] text-slate-200 hover:border-amber-400 hover:text-amber-100">
                    Select patient from EMR
                  </button>
                </div>
                <div>
                  <label className="mb-1 block font-medium text-slate-300">
                    Prostho case ID
                  </label>
                  <Input placeholder="ADIE-PROSTHO-0001" />
                </div>
                <div>
                  <label className="mb-1 block font-medium text-slate-300">
                    Extension
                  </label>
                  <Select defaultValue="">
                    <option value="">Select…</option>
                    <option>Single tooth</option>
                    <option>Short span (2–3 units)</option>
                    <option>Quadrant</option>
                    <option>Full arch</option>
                    <option>Full mouth</option>
                  </Select>
                </div>
              </div>

              <div className="mt-3 grid gap-3 text-[11px] md:grid-cols-3">
                <div>
                  <label className="mb-1 block font-medium text-slate-300">
                    Main rehab category
                  </label>
                  <Select defaultValue="">
                    <option value="">Select…</option>
                    <option>Fixed prosthodontics (crowns / bridges)</option>
                    <option>Implant-supported fixed</option>
                    <option>Removable partial denture</option>
                    <option>Complete dentures</option>
                    <option>Full-arch hybrid / overdenture</option>
                  </Select>
                </div>
                <div>
                  <label className="mb-1 block font-medium text-slate-300">
                    Vertical dimension plan
                  </label>
                  <Select defaultValue="">
                    <option value="">Select…</option>
                    <option>Maintain current VD</option>
                    <option>Increase VD (1–2 mm)</option>
                    <option>Increase VD (&gt;2 mm)</option>
                    <option>Test VD with provisional phase</option>
                  </Select>
                </div>
                <div>
                  <label className="mb-1 block font-medium text-slate-300">
                    Occlusal concept
                  </label>
                  <Select defaultValue="">
                    <option value="">Select…</option>
                    <option>Mutually protected occlusion</option>
                    <option>Group function</option>
                    <option>Lingualized occlusion</option>
                    <option>Balanced occlusion (complete dentures)</option>
                    <option>Other / custom concept</option>
                  </Select>
                </div>
              </div>

              <div className="mt-3 grid gap-3 text-[11px] md:grid-cols-2">
                <div>
                  <label className="mb-1 block font-medium text-slate-300">
                    Chief prostho goals
                  </label>
                  <TextArea
                    rows={3}
                    placeholder="Function, esthetics, phonetics, occlusal stability, posterior support, smile design..."
                  />
                </div>
                <div>
                  <label className="mb-1 block font-medium text-slate-300">
                    Links to Perio / Implants
                  </label>
                  <TextArea
                    rows={3}
                    placeholder="Perio stability, crown lengthening, implant timing, sinus lifts, soft tissue grafts..."
                  />
                </div>
              </div>
            </Card>

            {/* MAPA DE RESTAURACIONES FIJAS + IMPLANTES */}
            <Card
              title="Fixed & Implant Restorations Map"
              subtitle="Per-tooth / per-implant plan with material, shade and lab status."
              badge="Fixed & Implants"
            >
              <div className="mb-2 flex items-center justify-between text-[11px]">
                <p className="text-slate-400">
                  Each row mirrors a tooth or implant from the Dental Chart.
                  Later this will auto-populate from ADIE&apos;s global chart.
                </p>
                <span className="rounded-full border border-slate-700 bg-slate-900/80 px-3 py-0.5 text-[10px] text-slate-300">
                  Example set · anterior & posterior
                </span>
              </div>

              <div className="grid gap-2 text-[11px]">
                {demoTeeth.map((tooth) => (
                  <div
                    key={tooth}
                    className="grid grid-cols-[minmax(0,0.45fr),minmax(0,1.2fr),minmax(0,1.3fr),minmax(0,1.1fr),minmax(0,1fr)] gap-2 rounded-xl border border-slate-800 bg-slate-950/80 px-3 py-2"
                  >
                    <div className="flex flex-col justify-center text-slate-200">
                      <span className="mr-2 inline-flex items-center justify-center rounded-full bg-amber-500/15 px-2 py-0.5 text-[10px] font-semibold text-amber-200">
                        {tooth}
                      </span>
                      <span className="text-[10px] text-slate-500">
                        Tooth / implant
                      </span>
                    </div>

                    <Select defaultValue="">
                      <option value="">Type</option>
                      <option>Full crown</option>
                      <option>Veneer</option>
                      <option>Onlay / inlay</option>
                      <option>Implant crown</option>
                      <option>Bridge abutment</option>
                      <option>Pontic</option>
                    </Select>

                    <Select defaultValue="">
                      <option value="">Material</option>
                      <option>Monolithic zirconia</option>
                      <option>Layered zirconia</option>
                      <option>E.max / lithium disilicate</option>
                      <option>PFM (metal-ceramic)</option>
                      <option>Full gold</option>
                      <option>PMMA provisional</option>
                      <option>Hybrid zirconia + titanium base</option>
                    </Select>

                    <Select defaultValue="">
                      <option value="">Shade / system</option>
                      <option>Vita Classical · A1</option>
                      <option>Vita Classical · A2</option>
                      <option>Vita Classical · A3</option>
                      <option>Vita 3D-Master</option>
                      <option>Bleach shade (OM1 / OM2)</option>
                      <option>Custom multilayer shade</option>
                    </Select>

                    <Select defaultValue="">
                      <option value="">Status</option>
                      <option>Planning</option>
                      <option>Prep & scan done</option>
                      <option>In provisional phase</option>
                      <option>In lab</option>
                      <option>Try-in scheduled</option>
                      <option>Cemented / delivered</option>
                    </Select>
                  </div>
                ))}
              </div>

              <p className="mt-2 text-[10px] text-slate-500">
                Future step: clicking a row will open the 3D tooth/implant view,
                photos, STL and lab communication for that unit.
              </p>
            </Card>

            {/* PRÓTESIS REMOVIBLE / FULL ARCH */}
            <Card
              title="Removable & Full-Arch Rehabilitation"
              subtitle="Partial dentures, complete dentures and implant-supported hybrids."
              badge="Removable / Full-Arch"
            >
              <div className="grid gap-3 text-[11px] md:grid-cols-3">
                <div>
                  <label className="mb-1 block font-medium text-slate-300">
                    Upper arch plan
                  </label>
                  <Select defaultValue="">
                    <option value="">Select…</option>
                    <option>No removable prosthesis</option>
                    <option>Removable partial denture</option>
                    <option>Complete denture</option>
                    <option>Implant-supported overdenture</option>
                    <option>Fixed full-arch hybrid</option>
                  </Select>
                </div>
                <div>
                  <label className="mb-1 block font-medium text-slate-300">
                    Lower arch plan
                  </label>
                  <Select defaultValue="">
                    <option value="">Select…</option>
                    <option>No removable prosthesis</option>
                    <option>Removable partial denture</option>
                    <option>Complete denture</option>
                    <option>Implant-supported overdenture</option>
                    <option>Fixed full-arch hybrid</option>
                  </Select>
                </div>
                <div>
                  <label className="mb-1 block font-medium text-slate-300">
                    Immediate vs definitive
                  </label>
                  <Select defaultValue="">
                    <option value="">Select…</option>
                    <option>Immediate denture / provisional</option>
                    <option>Definitive prosthesis</option>
                    <option>Immediate followed by definitive</option>
                  </Select>
                </div>
              </div>

              <div className="mt-3 grid gap-3 text-[11px] md:grid-cols-2">
                <div>
                  <label className="mb-1 block font-medium text-slate-300">
                    Attachment system (implants)
                  </label>
                  <Select defaultValue="">
                    <option value="">Select…</option>
                    <option>Locator / stud attachments</option>
                    <option>Bar overdenture</option>
                    <option>Fixed hybrid on multi-unit abutments</option>
                    <option>Ball attachments</option>
                    <option>Other custom system</option>
                  </Select>
                </div>
                <div>
                  <label className="mb-1 block font-medium text-slate-300">
                    Denture teeth & base material
                  </label>
                  <Select defaultValue="">
                    <option value="">Select…</option>
                    <option>High wear-resistance acrylic teeth</option>
                    <option>Composite teeth</option>
                    <option>Monolithic milled PMMA</option>
                    <option>Hybrid zirconia teeth on metal / zirconia framework</option>
                  </Select>
                </div>
              </div>

              <div className="mt-3 grid gap-3 text-[11px] md:grid-cols-2">
                <div>
                  <label className="mb-1 block font-medium text-slate-300">
                    Esthetic & phonetic notes
                  </label>
                  <TextArea
                    rows={3}
                    placeholder="Midline, smile line, lip support, F/V/S sounds, buccal corridor, tooth display at rest..."
                  />
                </div>
                <div>
                  <label className="mb-1 block font-medium text-slate-300">
                    Functional impressions & jaw relations
                  </label>
                  <TextArea
                    rows={3}
                    placeholder="Border molding, functional impression materials, CR record technique, facebow, gothic arch tracing..."
                  />
                </div>
              </div>
            </Card>
          </div>

          {/* COLUMNA DERECHA */}
          <div className="space-y-5">
            {/* LAB & MATERIALES */}
            <Card
              title="Lab, Materials & Shade Intelligence"
              subtitle="Everything the lab needs, captured in structured format."
              badge="Lab & Materials"
            >
              <div className="grid gap-3 text-[11px] md:grid-cols-2">
                <div>
                  <label className="mb-1 block font-medium text-slate-300">
                    Preferred lab / technician
                  </label>
                  <Input placeholder="Lab name · technician" />
                </div>
                <div>
                  <label className="mb-1 block font-medium text-slate-300">
                    Workflow type
                  </label>
                  <Select defaultValue="">
                    <option value="">Select…</option>
                    <option>Fully digital (intraoral scan + STL)</option>
                    <option>Analog (impressions + stone models)</option>
                    <option>Hybrid (scan of models)</option>
                  </Select>
                </div>
              </div>

              <div className="mt-3 grid gap-3 text-[11px] md:grid-cols-3">
                <div>
                  <label className="mb-1 block font-medium text-slate-300">
                    Shade system
                  </label>
                  <Select defaultValue="">
                    <option value="">Select…</option>
                    <option>Vita Classical</option>
                    <option>Vita 3D-Master</option>
                    <option>Chromascop</option>
                    <option>Bleach guide</option>
                    <option>Custom system</option>
                  </Select>
                </div>
                <div>
                  <label className="mb-1 block font-medium text-slate-300">
                    Stump / core shade
                  </label>
                  <Select defaultValue="">
                    <option value="">Select…</option>
                    <option>Light (A1/B1)</option>
                    <option>Medium (A2/A3)</option>
                    <option>Dark / discolored</option>
                    <option>Metal core</option>
                    <option>Other</option>
                  </Select>
                </div>
                <div>
                  <label className="mb-1 block font-medium text-slate-300">
                    Characterization
                  </label>
                  <Select defaultValue="">
                    <option value="">Select…</option>
                    <option>Standard translucency</option>
                    <option>High translucency</option>
                    <option>Incisal halo + mamelons</option>
                    <option>White spots / hypocalcification</option>
                    <option>Custom characterization (see photos)</option>
                  </Select>
                </div>
              </div>

              <div className="mt-3">
                <label className="mb-1 block text-[11px] font-medium text-slate-300">
                  Lab prescription notes
                </label>
                <TextArea
                  rows={4}
                  placeholder="Photos taken (retracted, smile, occlusal), STL files sent, margin design, connector size, pontic design, emergence profile, special instructions..."
                />
              </div>

              <div className="mt-3">
                <label className="mb-1 block text-[11px] font-medium text-slate-300">
                  Try-in feedback / adjustments
                </label>
                <TextArea
                  rows={3}
                  placeholder="Contacts, occlusion, phonetics, shade match, soft tissue adaptation, need for remake or minor adjustment..."
                />
              </div>
            </Card>

            {/* OCLUSIÓN & RIESGO */}
            <Card
              title="Occlusion, Parafunction & Risk Matrix"
              subtitle="Where prostho, perio and endo meet long-term stability."
              badge="Risk"
            >
              <div className="grid gap-3 text-[11px] md:grid-cols-3">
                <div>
                  <label className="mb-1 block font-medium text-slate-300">
                    Bruxism / parafunction
                  </label>
                  <Select defaultValue="">
                    <option value="">Select…</option>
                    <option>No evidence of parafunction</option>
                    <option>Night-time clenching / bruxism</option>
                    <option>Daytime parafunction (nail biting, etc.)</option>
                    <option>Severe parafunction · high risk</option>
                  </Select>
                </div>
                <div>
                  <label className="mb-1 block font-medium text-slate-300">
                    Splint / guard plan
                  </label>
                  <Select defaultValue="">
                    <option value="">Select…</option>
                    <option>Hard stabilization splint</option>
                    <option>Soft guard</option>
                    <option>Mandibular advancement device</option>
                    <option>No splint planned</option>
                  </Select>
                </div>
                <div>
                  <label className="mb-1 block font-medium text-slate-300">
                    TMJ & muscle status
                  </label>
                  <Select defaultValue="">
                    <option value="">Select…</option>
                    <option>Asymptomatic TMJ, no clicks</option>
                    <option>Clicks / mild discomfort</option>
                    <option>Chronic pain / limited opening</option>
                    <option>Under specialist care</option>
                  </Select>
                </div>
              </div>

              <div className="mt-3 grid gap-3 text-[11px] md:grid-cols-2">
                <div>
                  <label className="mb-1 block font-medium text-slate-300">
                    Prostho risk summary
                  </label>
                  <TextArea
                    rows={3}
                    placeholder="Example: High esthetic demand · bruxism · implant-supported full arch · guarded prognosis for anterior veneers..."
                  />
                </div>
                <div>
                  <label className="mb-1 block font-medium text-slate-300">
                    Maintenance & recall plan
                  </label>
                  <Select defaultValue="">
                    <option value="">Select…</option>
                    <option>Standard recall every 6 months</option>
                    <option>High-risk recall every 3–4 months</option>
                    <option>Implant-focused recall with Perio</option>
                    <option>Custom protocol (see notes)</option>
                  </Select>
                  <TextArea
                    rows={2}
                    className="mt-2"
                    placeholder="Specific maintenance instructions for patient and hygiene team..."
                  />
                </div>
              </div>
            </Card>

            {/* AI DESIGN & OUTCOMES */}
            <Card
              title="ADIE AI · Design & Outcomes (Future Layer)"
              subtitle="How this prostho module will talk to AI and BI."
              badge="AI Roadmap"
            >
              <ul className="space-y-1 text-[11px] text-slate-400">
                <li>
                  • Generate AI-assisted treatment proposals combining Perio,
                  Implants, Ortho and Prostho risk.
                </li>
                <li>
                  • Predict expected lifespan of each restoration based on
                  material, occlusion, bruxism and maintenance compliance.
                </li>
                <li>
                  • Auto-build lab prescriptions from the fixed / removable maps
                  and attach photos, STL and CBCT data.
                </li>
                <li>
                  • Feed ADIE Outcomes BI: remake rates, material performance
                  and lab quality benchmarking.
                </li>
              </ul>

              <div className="mt-3 flex flex-wrap gap-2 text-[11px]">
                <button className="rounded-full border border-amber-500 bg-amber-500/10 px-3 py-1 text-amber-200 hover:bg-amber-500/20">
                  Simulate AI prostho summary
                </button>
                <button className="rounded-full border border-slate-700 bg-slate-900/80 px-3 py-1 text-slate-200 hover:border-emerald-400 hover:text-emerald-100">
                  Preview BI outcomes (mock)
                </button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}
