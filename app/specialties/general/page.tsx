"use client";

import React from "react";
import Link from "next/link";

type CardProps = {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
};

function Card({ title, subtitle, children }: CardProps) {
  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900/60 px-5 py-4 shadow-[0_18px_60px_rgba(15,23,42,0.75)]">
      <header className="mb-3">
        <h3 className="text-[13px] font-semibold tracking-[0.16em] text-sky-300/90 uppercase">
          {title}
        </h3>
        {subtitle && (
          <p className="mt-1 text-[11px] text-slate-400">{subtitle}</p>
        )}
      </header>
      <div className="space-y-3">{children}</div>
    </section>
  );
}

export default function GeneralDentistryRecordPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8 lg:px-0">
        {/* Top bar */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[11px] tracking-[0.28em] text-emerald-400/80 uppercase">
              Specialties · Layer 3
            </p>
            <h1 className="mt-2 text-2xl md:text-3xl font-semibold tracking-tight text-slate-50">
              General Dentistry Clinical Record
            </h1>
            <p className="mt-2 max-w-xl text-[12px] text-slate-400">
              Complete chart to document chief complaint, history, clinical
              examination, tooth status, and treatment plan for general
              dentistry cases.
            </p>
          </div>

          <Link
            href="/specialties"
            className="inline-flex items-center rounded-full border border-slate-700 bg-slate-900 px-4 py-2 text-[12px] font-medium text-slate-200 hover:border-sky-500 hover:text-sky-200 hover:bg-slate-900/70 transition-colors"
          >
            ← Back to Specialties Universe
          </Link>
        </div>

        {/* Patient context */}
        <Card
          title="Patient context"
          subtitle="Later this bar will connect with the active EMR patient."
        >
          <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-300">
            <button className="rounded-full bg-sky-500/90 px-4 py-1.5 text-[11px] font-semibold text-slate-950 shadow-[0_0_25px_rgba(56,189,248,0.55)] hover:bg-sky-400">
              Select patient from EMR
            </button>
            <span className="text-slate-500">ID:</span>
            <span className="rounded-full bg-slate-900/80 px-3 py-1 text-[11px]">
              ADIE-GEN-0001
            </span>
            <span className="text-slate-500">Age:</span>
            <span className="rounded-full bg-slate-900/80 px-3 py-1 text-[11px]">
              —
            </span>
            <span className="text-slate-500">Status:</span>
            <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-[11px] font-semibold text-emerald-300 border border-emerald-500/40">
              Active treatment
            </span>
          </div>
        </Card>

        {/* Main grid */}
        <div className="grid gap-5 lg:grid-cols-[minmax(0,2fr)_minmax(0,1.4fr)]">
          {/* LEFT COLUMN */}
          <div className="space-y-5">
            {/* Chief complaint & history */}
            <Card
              title="Chief complaint & history"
              subtitle="Reason for consultation and relevant dental / medical background."
            >
              <div>
                <label className="mb-1 block text-[11px] font-semibold text-slate-300">
                  Chief complaint
                </label>
                <textarea
                  className="h-20 w-full rounded-xl border border-slate-700/70 bg-slate-950/70 px-3 py-2 text-[12px] text-slate-100 placeholder:text-slate-500 focus:border-sky-500 focus:outline-none"
                  placeholder="Example: Pain on chewing upper right molar, sensitivity to cold in lower front teeth…"
                />
              </div>

              <div>
                <label className="mb-1 block text-[11px] font-semibold text-slate-300">
                  Dental / medical history
                </label>
                <textarea
                  className="h-24 w-full rounded-xl border border-slate-700/70 bg-slate-950/70 px-3 py-2 text-[12px] text-slate-100 placeholder:text-slate-500 focus:border-sky-500 focus:outline-none"
                  placeholder="Previous restorations, root canals, extractions, systemic diseases, medications, allergies…"
                />
              </div>
            </Card>

            {/* Clinical examination summary */}
            <Card
              title="Clinical examination summary"
              subtitle="Global clinical findings before going to specialty modules."
            >
              <div className="grid gap-3 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-[11px] font-semibold text-slate-300">
                    Caries risk
                  </label>
                  <select className="w-full rounded-xl border border-slate-700/70 bg-slate-950/80 px-3 py-2 text-[12px] text-slate-100 focus:border-sky-500 focus:outline-none">
                    <option value="">Select level…</option>
                    <option>Low</option>
                    <option>Moderate</option>
                    <option>High</option>
                    <option>Extreme</option>
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-[11px] font-semibold text-slate-300">
                    Periodontal status (summary)
                  </label>
                  <select className="w-full rounded-xl border border-slate-700/70 bg-slate-950/80 px-3 py-2 text-[12px] text-slate-100 focus:border-sky-500 focus:outline-none">
                    <option value="">Select option…</option>
                    <option>Healthy / gingivitis</option>
                    <option>Initial periodontitis</option>
                    <option>Moderate / severe periodontitis</option>
                    <option>Under perio maintenance</option>
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-[11px] font-semibold text-slate-300">
                    Occlusion &amp; TMJ
                  </label>
                  <textarea
                    className="h-16 w-full rounded-xl border border-slate-700/70 bg-slate-950/70 px-3 py-2 text-[12px] text-slate-100 placeholder:text-slate-500 focus:border-sky-500 focus:outline-none"
                    placeholder="Overbite/overjet, malocclusion, TMJ symptoms, parafunctions…"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-[11px] font-semibold text-slate-300">
                    Radiographic findings
                  </label>
                  <textarea
                    className="h-16 w-full rounded-xl border border-slate-700/70 bg-slate-950/70 px-3 py-2 text-[12px] text-slate-100 placeholder:text-slate-500 focus:border-sky-500 focus:outline-none"
                    placeholder="Periapicals, bitewings, panoramic findings, bone levels, periapical lesions…"
                  />
                </div>
              </div>
            </Card>

            {/* Treatment plan & priorities */}
            <Card
              title="Treatment plan & priorities"
              subtitle="Organize phases according to complexity and urgency."
            >
              <div className="space-y-3">
                <div>
                  <label className="mb-1 block text-[11px] font-semibold text-slate-300">
                    Priority 1 – Emergency / pain control
                  </label>
                  <textarea
                    className="h-16 w-full rounded-xl border border-slate-700/70 bg-slate-950/70 px-3 py-2 text-[12px] text-slate-100 placeholder:text-slate-500 focus:border-sky-500 focus:outline-none"
                    placeholder="Examples: acute caries close to pulp, fractures, abscess drainage, infections…"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-[11px] font-semibold text-slate-300">
                    Priority 2 – Disease control
                  </label>
                  <textarea
                    className="h-16 w-full rounded-xl border border-slate-700/70 bg-slate-950/70 px-3 py-2 text-[12px] text-slate-100 placeholder:text-slate-500 focus:border-sky-500 focus:outline-none"
                    placeholder="Caries removal, restorations, endodontic therapy, periodontal phase, extractions…"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-[11px] font-semibold text-slate-300">
                    Priority 3 – Rehabilitation / aesthetics
                  </label>
                  <textarea
                    className="h-16 w-full rounded-xl border border-slate-700/70 bg-slate-950/70 px-3 py-2 text-[12px] text-slate-100 placeholder:text-slate-500 focus:border-sky-500 focus:outline-none"
                    placeholder="Crowns, bridges, veneers, implants, whitening, aesthetic corrections…"
                  />
                </div>
              </div>
            </Card>

            {/* Clinical notes (full width on left column end for mobile; still ok) */}
            <Card
              title="Clinical notes"
              subtitle="Short narrative tying diagnosis and planned treatment. This will be part of the legal clinical record."
            >
              <textarea
                className="h-28 w-full rounded-xl border border-slate-700/70 bg-slate-950/70 px-3 py-2 text-[12px] text-slate-100 placeholder:text-slate-500 focus:border-sky-500 focus:outline-none"
                placeholder="Summary of findings, treatment decisions, informed consent notes…"
              />
            </Card>
          </div>

          {/* RIGHT COLUMN */}
          <div className="space-y-5">
            {/* Medical alerts & modifiers */}
            <Card
              title="Medical alerts & modifiers"
              subtitle="Conditions that may change how we plan or deliver treatment."
            >
              <div>
                <label className="mb-1 block text-[11px] font-semibold text-slate-300">
                  Medical alerts
                </label>
                <textarea
                  className="h-20 w-full rounded-xl border border-rose-500/50 bg-rose-950/60 px-3 py-2 text-[12px] text-rose-50 placeholder:text-rose-200/70 focus:border-rose-400 focus:outline-none"
                  placeholder="Anticoagulants, uncontrolled diabetes, hypertension, endocarditis risk, pregnancy, allergies…"
                />
              </div>

              <div>
                <label className="mb-1 block text-[11px] font-semibold text-slate-300">
                  Behavioral &amp; lifestyle risk factors
                </label>
                <textarea
                  className="h-16 w-full rounded-xl border border-slate-700/70 bg-slate-950/70 px-3 py-2 text-[12px] text-slate-100 placeholder:text-slate-500 focus:border-sky-500 focus:outline-none"
                  placeholder="Oral hygiene, diet, sugar intake, smoking, alcohol, bruxism, high caries risk habits…"
                />
              </div>
            </Card>

            {/* Recall & maintenance */}
            <Card
              title="Recall & maintenance"
              subtitle="Follow-up strategy once active treatment is completed."
            >
              <div>
                <label className="mb-1 block text-[11px] font-semibold text-slate-300">
                  Recall interval
                </label>
                <select className="w-full rounded-xl border border-slate-700/70 bg-slate-950/80 px-3 py-2 text-[12px] text-slate-100 focus:border-sky-500 focus:outline-none">
                  <option value="">Select option…</option>
                  <option>Every 3 months</option>
                  <option>Every 6 months</option>
                  <option>Once a year</option>
                  <option>Custom / according to risk</option>
                </select>
              </div>

              <div>
                <label className="mb-1 block text-[11px] font-semibold text-slate-300">
                  Maintenance notes
                </label>
                <textarea
                  className="h-20 w-full rounded-xl border border-slate-700/70 bg-slate-950/70 px-3 py-2 text-[12px] text-slate-100 placeholder:text-slate-500 focus:border-sky-500 focus:outline-none"
                  placeholder="Prophylaxis, fluoride, sealants, sealant repair, maintenance for restorations, implants, perio…"
                />
              </div>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}
