"use client";

import React from "react";
import Link from "next/link";

function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`w-full rounded-lg border border-slate-700 bg-slate-900/60 px-3 py-2 text-xs text-slate-100 outline-none ring-amber-500/60 focus:border-amber-400 focus:ring-1 ${
        props.className ?? ""
      }`}
    />
  );
}

function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={`w-full rounded-lg border border-slate-700 bg-slate-900/60 px-3 py-2 text-xs text-slate-100 outline-none ring-amber-500/60 focus:border-amber-400 focus:ring-1 ${
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
      className={`w-full resize-none rounded-lg border border-slate-700 bg-slate-900/60 px-3 py-2 text-xs text-slate-100 outline-none ring-amber-500/60 focus:border-amber-400 focus:ring-1 ${
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
          <span className="rounded-full border border-amber-500/40 bg-amber-500/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.18em] text-amber-200">
            {badge}
          </span>
        )}
      </div>
      {children}
    </section>
  );
}

export default function ProsthodonticsLayerPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-50">
      <div className="mx-auto max-w-6xl px-4 pb-24 pt-8">
        <header className="mb-8 flex items-center justify-between gap-4">
          <div>
            <p className="text-[11px] uppercase tracking-[0.28em] text-amber-400">
              Specialties · Layer 3
            </p>
            <h1 className="mt-1 text-2xl md:text-3xl font-semibold tracking-tight text-slate-50">
              Prosthodontics · Rehabilitation &amp; Lab Communication
            </h1>
            <p className="mt-2 max-w-2xl text-xs md:text-sm text-slate-400">
              Central hub for crowns, bridges, dentures and full-arch
              rehabilitations. Later this will read from Implants, Perio and the
              global Dental Chart to coordinate the restorative plan.
            </p>
          </div>

          <Link
            href="/specialties"
            className="rounded-full border border-slate-700 bg-slate-900/70 px-4 py-1.5 text-xs md:text-sm text-slate-200 hover:border-amber-400 hover:text-amber-100 transition-colors"
          >
            ← Back to Specialties Universe
          </Link>
        </header>

        <div className="grid gap-5 lg:grid-cols-[1.5fr,1.5fr]">
          {/* LEFT COLUMN */}
          <div className="space-y-5">
            <Card
              title="Rehabilitation Context"
              subtitle="Why we are restoring, and with which global strategy."
              badge="Context"
            >
              <div className="grid gap-3 md:grid-cols-4">
                <div className="md:col-span-2">
                  <label className="mb-1 block text-[11px] font-medium text-slate-300">
                    Patient (link EMR)
                  </label>
                  <button className="w-full rounded-full border border-amber-500/70 bg-amber-500/10 px-3 py-2 text-[11px] font-semibold text-amber-100 hover:bg-amber-500/20 transition">
                    Select patient from EMR
                  </button>
                </div>
                <div>
                  <label className="mb-1 block text-[11px] font-medium text-slate-300">
                    Prostho case ID
                  </label>
                  <Input placeholder="ADIE-PROSTHO-0001" />
                </div>
                <div>
                  <label className="mb-1 block text-[11px] font-medium text-slate-300">
                    Arch / extension
                  </label>
                  <Select defaultValue="">
                    <option value="">Select…</option>
                    <option>Single tooth</option>
                    <option>Short span</option>
                    <option>Full arch</option>
                    <option>Full mouth</option>
                  </Select>
                </div>
              </div>

              <div className="mt-3 grid gap-3 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-[11px] font-medium text-slate-300">
                    Main indication
                  </label>
                  <TextArea
                    rows={3}
                    placeholder="Caries, fractures, wear, aesthetics, post-endo tooth, implant rehabilitation, vertical dimension loss…"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-[11px] font-medium text-slate-300">
                    Occlusal concept / scheme
                  </label>
                  <TextArea
                    rows={3}
                    placeholder="Mutually protected, group function, lingualized occlusion, splint, vertical dimension changes…"
                  />
                </div>
              </div>
            </Card>

            <Card
              title="Planned Restorations Map"
              subtitle="Mini table per tooth / implant with material and status."
              badge="Restorations"
            >
              <div className="grid gap-2 text-[11px]">
                {["11", "21", "24", "25", "36", "46"].map((tooth) => (
                  <div
                    key={tooth}
                    className="grid grid-cols-[minmax(0,0.6fr),minmax(0,1.2fr),minmax(0,1.2fr),minmax(0,0.9fr)] gap-2 rounded-xl border border-slate-800 bg-slate-950/80 px-3 py-2"
                  >
                    <div className="flex items-center text-slate-200">
                      <span className="mr-2 rounded-full bg-amber-500/15 px-2 py-0.5 text-[10px] text-amber-200">
                        {tooth}
                      </span>
                      Tooth
                    </div>
                    <Select defaultValue="">
                      <option value="">Type (crown, onlay…)</option>
                      <option>Crown</option>
                      <option>Veneer</option>
                      <option>Onlay / inlay</option>
                      <option>Implant crown</option>
                      <option>Bridge abutment</option>
                    </Select>
                    <Select defaultValue="">
                      <option value="">Material</option>
                      <option>Zirconia monolithic</option>
                      <option>Zirconia layered</option>
                      <option>E.max / lithium disilicate</option>
                      <option>PFM</option>
                      <option>Other</option>
                    </Select>
                    <Select defaultValue="">
                      <option value="">Status</option>
                      <option>Planning</option>
                      <option>Impressions / scan done</option>
                      <option>In lab</option>
                      <option>Try-in</option>
                      <option>Cemented / delivered</option>
                    </Select>
                  </div>
                ))}
              </div>

              <p className="mt-2 text-[10px] text-slate-500">
                Future step: this table will be generated automatically from the
                Dental Chart + Implants data, so you don&apos;t repeat the same
                teeth many times.
              </p>
            </Card>
          </div>

          {/* RIGHT COLUMN */}
          <div className="space-y-5">
            <Card
              title="Lab Communication"
              subtitle="Exactly what the lab needs, saved in structured form."
              badge="Lab"
            >
              <div className="grid gap-3 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-[11px] font-medium text-slate-300">
                    Lab name / technician
                  </label>
                  <Input placeholder="Name or center" />
                </div>
                <div>
                  <label className="mb-1 block text-[11px] font-medium text-slate-300">
                    Shade & characterization
                  </label>
                  <Input placeholder="Example: A2, custom incisal halo, mamelons…" />
                </div>
              </div>

              <div className="mt-3">
                <label className="mb-1 block text-[11px] font-medium text-slate-300">
                  Design notes
                </label>
                <TextArea
                  rows={4}
                  placeholder="Midline, incisal edge display, buccal corridor, vertical dimension, smile line, photos taken, STL files sent…"
                />
              </div>

              <div className="mt-3">
                <label className="mb-1 block text-[11px] font-medium text-slate-300">
                  Try-in feedback / adjustments
                </label>
                <TextArea
                  rows={3}
                  placeholder="Contacts, occlusion, shade, phonetics, gingival adaptation, need for remake or minor adjustment…"
                />
              </div>
            </Card>

            <Card
              title="Maintenance & Longevity"
              subtitle="Bridge between prostho, perio and BI."
              badge="Maintenance"
            >
              <div className="grid gap-3 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-[11px] font-medium text-slate-300">
                    Maintenance plan
                  </label>
                  <Select defaultValue="">
                    <option value="">Select…</option>
                    <option>Standard recall</option>
                    <option>Implant-focused recall</option>
                    <option>High-risk (bruxism, perio)</option>
                  </Select>
                </div>
                <div>
                  <label className="mb-1 block text-[11px] font-medium text-slate-300">
                    Protective devices
                  </label>
                  <Select defaultValue="">
                    <option value="">Select…</option>
                    <option>Nightguard / splint</option>
                    <option>Sports mouthguard</option>
                    <option>Both</option>
                    <option>None</option>
                  </Select>
                </div>
              </div>

              <div className="mt-3">
                <label className="mb-1 block text-[11px] font-medium text-slate-300">
                  Long-term notes
                </label>
                <TextArea
                  rows={3}
                  placeholder="Bruxism risk, peri-implant maintenance, expected lifespan of restorations, comments for BI outcomes…"
                />
              </div>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}
