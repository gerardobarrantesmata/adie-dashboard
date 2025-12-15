"use client";

import React from "react";
import Link from "next/link";

function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`w-full rounded-lg border border-slate-700 bg-slate-900/60 px-3 py-2 text-xs text-slate-100 outline-none ring-emerald-500/60 focus:border-emerald-400 focus:ring-1 ${
        props.className ?? ""
      }`}
    />
  );
}

function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={`w-full rounded-lg border border-slate-700 bg-slate-900/60 px-3 py-2 text-xs text-slate-100 outline-none ring-emerald-500/60 focus:border-emerald-400 focus:ring-1 ${
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
      className={`w-full resize-none rounded-lg border border-slate-700 bg-slate-900/60 px-3 py-2 text-xs text-slate-100 outline-none ring-emerald-500/60 focus:border-emerald-400 focus:ring-1 ${
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
          <span className="rounded-full border border-emerald-500/40 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.18em] text-emerald-200">
            {badge}
          </span>
        )}
      </div>
      {children}
    </section>
  );
}

export default function PerioLayerPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-50">
      <div className="mx-auto max-w-6xl px-4 pb-24 pt-8">
        {/* HEADER */}
        <header className="mb-8 flex items-center justify-between gap-4">
          <div>
            <p className="text-[11px] uppercase tracking-[0.28em] text-emerald-400">
              Specialties · Layer 3
            </p>
            <h1 className="mt-1 text-2xl md:text-3xl font-semibold tracking-tight text-slate-50">
              Periodontics · Bone, Pockets & Maintenance Workspace
            </h1>
            <p className="mt-2 max-w-2xl text-xs md:text-sm text-slate-400">
              Prototype of the periocenter for ADIE: risk evaluation, staging,
              sextant bone summary and maintenance programs. Future step: connect
              this to the periodontal SVG odontogram and implant safety grid.
            </p>
          </div>

          <Link
            href="/specialties"
            className="rounded-full border border-slate-700 bg-slate-900/70 px-4 py-1.5 text-xs md:text-sm text-slate-200 hover:border-emerald-400 hover:text-emerald-100 transition-colors"
          >
            ← Back to Specialties Universe
          </Link>
        </header>

        <div className="grid gap-5 lg:grid-cols-[1.5fr,1.5fr]">
          {/* LEFT COLUMN */}
          <div className="space-y-5">
            <Card
              title="Perio Case Context"
              subtitle="Baseline diagnosis, systemic links and prosthetic implications."
              badge="Context"
            >
              <div className="grid gap-4 md:grid-cols-4">
                <div className="md:col-span-2">
                  <label className="mb-1 block text-[11px] font-medium text-slate-300">
                    Patient (link EMR)
                  </label>
                  <button className="w-full rounded-full border border-emerald-500/70 bg-emerald-500/10 px-3 py-2 text-[11px] font-semibold text-emerald-100 hover:bg-emerald-500/20 transition">
                    Select patient from EMR
                  </button>
                </div>
                <div>
                  <label className="mb-1 block text-[11px] font-medium text-slate-300">
                    Perio case ID
                  </label>
                  <Input placeholder="ADIE-PERIO-0001" />
                </div>
                <div>
                  <label className="mb-1 block text-[11px] font-medium text-slate-300">
                    Smoking / habits
                  </label>
                  <Select defaultValue="">
                    <option value="">Select…</option>
                    <option>Non-smoker</option>
                    <option>Former smoker</option>
                    <option>Smoker (&lt;10 cig/day)</option>
                    <option>Smoker (&gt;10 cig/day)</option>
                  </Select>
                </div>
              </div>

              <div className="mt-4 grid gap-4 md:grid-cols-4">
                <div>
                  <label className="mb-1 block text-[11px] font-medium text-slate-300">
                    Systemic conditions
                  </label>
                  <Select defaultValue="">
                    <option value="">Select…</option>
                    <option>No relevant systemic disease</option>
                    <option>Diabetes (controlled)</option>
                    <option>Diabetes (uncontrolled)</option>
                    <option>Cardiovascular disease</option>
                    <option>Immunocompromised</option>
                  </Select>
                </div>
                <div>
                  <label className="mb-1 block text-[11px] font-medium text-slate-300">
                    Periodontal staging
                  </label>
                  <Select defaultValue="">
                    <option value="">Select…</option>
                    <option>Stage I</option>
                    <option>Stage II</option>
                    <option>Stage III</option>
                    <option>Stage IV</option>
                  </Select>
                </div>
                <div>
                  <label className="mb-1 block text-[11px] font-medium text-slate-300">
                    Grade (progression)
                  </label>
                  <Select defaultValue="">
                    <option value="">Select…</option>
                    <option>Grade A (slow)</option>
                    <option>Grade B (moderate)</option>
                    <option>Grade C (rapid)</option>
                  </Select>
                </div>
                <div>
                  <label className="mb-1 block text-[11px] font-medium text-slate-300">
                    Link to prosthodontic / implant plan
                  </label>
                  <Input placeholder="Bridge / implant cases impacted by perio…" />
                </div>
              </div>
            </Card>

            <Card
              title="Sextant Bone & Pocket Summary"
              subtitle="Fast summary mirrors what the SVG odontogram will display visually."
              badge="Bone & pockets"
            >
              <p className="mb-3 text-[11px] text-slate-400">
                Enter an overview of deepest pockets and bone loss per sextant.
                Detailed values will live in the periodontal chart; here you keep a
                quick, BI-ready summary.
              </p>

              <div className="grid gap-2 text-[11px]">
                {[
                  "Upper right (17–14)",
                  "Upper anterior (13–23)",
                  "Upper left (24–27)",
                  "Lower left (37–34)",
                  "Lower anterior (33–43)",
                  "Lower right (44–47)",
                ].map((label, idx) => (
                  <div
                    key={label}
                    className="grid grid-cols-[minmax(0,1.6fr),minmax(0,1fr),minmax(0,1fr),minmax(0,1.4fr)] gap-2 rounded-xl border border-slate-800 bg-slate-950/80 px-3 py-2"
                  >
                    <div className="flex items-center text-slate-200">
                      <span className="mr-2 rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] text-emerald-200">
                        Sextant {idx + 1}
                      </span>
                      {label}
                    </div>
                    <Input placeholder="Max pocket (mm)" />
                    <Input placeholder="Bone loss %" />
                    <Select defaultValue="">
                      <option value="">Bleeding / plaque</option>
                      <option>Low</option>
                      <option>Moderate</option>
                      <option>High</option>
                    </Select>
                  </div>
                ))}
              </div>

              <p className="mt-2 text-[10px] text-slate-500">
                Future step: each sextant row will be clickable and open the full
                periodontal chart SVG anchored to the same data.
              </p>
            </Card>
          </div>

          {/* RIGHT COLUMN */}
          <div className="space-y-5">
            <Card
              title="Perio Treatment & Maintenance Program"
              subtitle="Non-surgical, surgical and recall structure."
              badge="Therapy"
            >
              <div className="grid gap-3 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-[11px] font-medium text-slate-300">
                    Initial therapy
                  </label>
                  <Select defaultValue="">
                    <option value="">Select…</option>
                    <option>Prophylaxis only</option>
                    <option>Scaling & root planing (SRP)</option>
                    <option>SRP + local antimicrobials</option>
                    <option>SRP + systemic antibiotics</option>
                  </Select>
                </div>
                <div>
                  <label className="mb-1 block text-[11px] font-medium text-slate-300">
                    Surgical plan
                  </label>
                  <Select defaultValue="">
                    <option value="">Select…</option>
                    <option>No surgery planned</option>
                    <option>Flap surgery (access)</option>
                    <option>Regenerative procedures</option>
                    <option>Resective / crown lengthening</option>
                    <option>Mucogingival / root coverage</option>
                  </Select>
                </div>
              </div>

              <div className="mt-3 grid gap-3 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-[11px] font-medium text-slate-300">
                    Maintenance interval
                  </label>
                  <Select defaultValue="">
                    <option value="">Select…</option>
                    <option>Every 3 months</option>
                    <option>Every 4 months</option>
                    <option>Every 6 months</option>
                    <option>Custom</option>
                  </Select>
                </div>
                <div>
                  <label className="mb-1 block text-[11px] font-medium text-slate-300">
                    Maintenance risk level
                  </label>
                  <Select defaultValue="">
                    <option value="">Select…</option>
                    <option>Low risk</option>
                    <option>Moderate risk</option>
                    <option>High risk (needs tight recall)</option>
                  </Select>
                </div>
              </div>

              <div className="mt-3">
                <label className="mb-1 block text-[11px] font-medium text-slate-300">
                  Perio notes / systemic coordination
                </label>
                <TextArea
                  rows={4}
                  placeholder="Notes for coordination with diabetes physician, cardiology, implant planning, patient education…"
                />
              </div>
            </Card>

            <Card
              title="Future BI & SVG Integration"
              subtitle="Explain to the user what this layer will do once fully connected."
              badge="Roadmap"
            >
              <ul className="space-y-1 text-[11px] text-slate-400">
                <li>• SVG periodontal chart with real-time pocket visualization</li>
                <li>• Bone level overlays synchronized with implant planning</li>
                <li>• Risk dashboards: smoking, diabetes, maintenance compliance</li>
                <li>• Automatic perio alerts inside General Dentistry & Implants</li>
              </ul>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}
