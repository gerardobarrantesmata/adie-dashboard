"use client";

import React from "react";
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

export default function PediaLayerPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-50">
      <div className="mx-auto max-w-6xl px-4 pb-24 pt-8">
        <header className="mb-8 flex items-center justify-between gap-4">
          <div>
            <p className="text-[11px] uppercase tracking-[0.28em] text-sky-400">
              Specialties · Layer 3
            </p>
            <h1 className="mt-1 text-2xl md:text-3xl font-semibold tracking-tight text-slate-50">
              Pediatric Dentistry · Growth & Prevention Record
            </h1>
            <p className="mt-2 max-w-2xl text-xs md:text-sm text-slate-400">
              Register pediatric risk, behavior, growth and preventive visits.
              Later this will sync with the pediatric dental chart, ortho layer
              and vaccines / systemic modules.
            </p>
          </div>

          <Link
            href="/specialties"
            className="rounded-full border border-slate-700 bg-slate-900/70 px-4 py-1.5 text-xs md:text-sm text-slate-200 hover:border-sky-500 hover:text-sky-100 transition-colors"
          >
            ← Back to Specialties Universe
          </Link>
        </header>

        <div className="grid gap-5 lg:grid-cols-[1.5fr,1.5fr]">
          {/* LEFT COLUMN */}
          <div className="space-y-5">
            <Card
              title="Pediatric Profile & Behavior"
              subtitle="Age, caregivers, behavior in the chair and caries risk."
              badge="Profile"
            >
              <div className="grid gap-4 md:grid-cols-4">
                <div className="md:col-span-2">
                  <label className="mb-1 block text-[11px] font-medium text-slate-300">
                    Patient (link EMR)
                  </label>
                  <button className="w-full rounded-full border border-sky-500/70 bg-sky-500/10 px-3 py-2 text-[11px] font-semibold text-sky-100 hover:bg-sky-500/20 transition">
                    Select patient from EMR
                  </button>
                </div>
                <div>
                  <label className="mb-1 block text-[11px] font-medium text-slate-300">
                    Pediatric case ID
                  </label>
                  <Input placeholder="ADIE-PEDIA-0001" />
                </div>
                <div>
                  <label className="mb-1 block text-[11px] font-medium text-slate-300">
                    Age group
                  </label>
                  <Select defaultValue="">
                    <option value="">Select…</option>
                    <option>0–3 years (toddlers)</option>
                    <option>4–6 years</option>
                    <option>7–12 years</option>
                    <option>13–17 years</option>
                  </Select>
                </div>
              </div>

              <div className="mt-4 grid gap-4 md:grid-cols-4">
                <div>
                  <label className="mb-1 block text-[11px] font-medium text-slate-300">
                    Behavior in chair
                  </label>
                  <Select defaultValue="">
                    <option value="">Select…</option>
                    <option>Cooperative</option>
                    <option>Potentially anxious</option>
                    <option>Non-cooperative</option>
                    <option>Needs pharmacologic support</option>
                  </Select>
                </div>
                <div>
                  <label className="mb-1 block text-[11px] font-medium text-slate-300">
                    Caries risk level
                  </label>
                  <Select defaultValue="">
                    <option value="">Select…</option>
                    <option>Low</option>
                    <option>Moderate</option>
                    <option>High</option>
                    <option>Extremely high (ECC)</option>
                  </Select>
                </div>
                <div>
                  <label className="mb-1 block text-[11px] font-medium text-slate-300">
                    Main caregiver
                  </label>
                  <Input placeholder="Mother, father, grandparents…" />
                </div>
                <div>
                  <label className="mb-1 block text-[11px] font-medium text-slate-300">
                    Home hygiene pattern
                  </label>
                  <Select defaultValue="">
                    <option value="">Select…</option>
                    <option>Brushing 2×/day + floss</option>
                    <option>Brushing 1×/day</option>
                    <option>Irregular brushing</option>
                    <option>No routine brushing</option>
                  </Select>
                </div>
              </div>
            </Card>

            <Card
              title="Growth & Eruption Snapshot"
              subtitle="Quick summary before having the full pediatric dental chart."
              badge="Growth"
            >
              <div className="grid gap-2 text-[11px]">
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="mb-1 block text-[11px] font-medium text-slate-300">
                      Dentition stage
                    </label>
                    <Select defaultValue="">
                      <option value="">Select…</option>
                      <option>Primary dentition</option>
                      <option>Mixed (early)</option>
                      <option>Mixed (late)</option>
                      <option>Permanent dentition</option>
                    </Select>
                  </div>
                  <div>
                    <label className="mb-1 block text-[11px] font-medium text-slate-300">
                      Growth pattern
                    </label>
                    <Select defaultValue="">
                      <option value="">Select…</option>
                      <option>Normal growth</option>
                      <option>Delayed</option>
                      <option>Advanced / early</option>
                    </Select>
                  </div>
                  <div>
                    <label className="mb-1 block text-[11px] font-medium text-slate-300">
                      Ortho referral
                    </label>
                    <Select defaultValue="">
                      <option value="">Select…</option>
                      <option>Not needed yet</option>
                      <option>Recommended soon</option>
                      <option>Already in ortho treatment</option>
                    </Select>
                  </div>
                </div>

                <div className="mt-3 grid grid-cols-2 gap-2">
                  <div>
                    <label className="mb-1 block text-[11px] font-medium text-slate-300">
                      Eruption / spacing notes
                    </label>
                    <TextArea
                      rows={3}
                      placeholder="Early loss of primary teeth, crowding, diastemas, crossbite, habits (thumb sucking, pacifier)…"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-[11px] font-medium text-slate-300">
                      Systemic / pediatrician notes
                    </label>
                    <TextArea
                      rows={3}
                      placeholder="Low weight or height, syndromes, cardiology clearance, special needs, medications…"
                    />
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* RIGHT COLUMN */}
          <div className="space-y-5">
            <Card
              title="Preventive Visits & Sealants"
              subtitle="Document the preventive strategy, not only the caries."
              badge="Prevention"
            >
              <div className="grid gap-3 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-[11px] font-medium text-slate-300">
                    Recall interval
                  </label>
                  <Select defaultValue="">
                    <option value="">Select…</option>
                    <option>3 months</option>
                    <option>6 months</option>
                    <option>12 months</option>
                    <option>Custom / high-risk protocol</option>
                  </Select>
                </div>
                <div>
                  <label className="mb-1 block text-[11px] font-medium text-slate-300">
                    Fluoride strategy
                  </label>
                  <Select defaultValue="">
                    <option value="">Select…</option>
                    <option>Varnish in clinic</option>
                    <option>Gel / foam</option>
                    <option>Prescription toothpaste</option>
                    <option>Combined strategy</option>
                  </Select>
                </div>
              </div>

              <div className="mt-3 grid gap-3 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-[11px] font-medium text-slate-300">
                    Sealants / preventive resin
                  </label>
                  <TextArea
                    rows={3}
                    placeholder="Which molars, surfaces, dates, materials, retention checks…"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-[11px] font-medium text-slate-300">
                    Diet & sugar exposure notes
                  </label>
                  <TextArea
                    rows={3}
                    placeholder="Frequency of sugary drinks/snacks, bottle at night, special recommendations for the family…"
                  />
                </div>
              </div>
            </Card>

            <Card
              title="Family Education & Behavior Management"
              subtitle="Key messages delivered to caregivers."
              badge="Education"
            >
              <div className="space-y-2 text-[11px] text-slate-300">
                <TextArea
                  rows={4}
                  placeholder="Document the key education messages: brushing routine, supervision, use of fluoride, trauma prevention, mouthguards, orthodontic timing…"
                />
                <p className="text-[10px] text-slate-500">
                  Future step: this text will feed a parent-friendly summary and
                  could be exported as a PDF or WhatsApp message directly from
                  ADIE.
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}
