"use client";

import React from "react";
import Link from "next/link";

function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`w-full rounded-lg border border-slate-700 bg-slate-900/60 px-3 py-2 text-xs text-slate-100 outline-none ring-rose-500/60 focus:border-rose-400 focus:ring-1 ${
        props.className ?? ""
      }`}
    />
  );
}

function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={`w-full rounded-lg border border-slate-700 bg-slate-900/60 px-3 py-2 text-xs text-slate-100 outline-none ring-rose-500/60 focus:border-rose-400 focus:ring-1 ${
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
      className={`w-full resize-none rounded-lg border border-slate-700 bg-slate-900/60 px-3 py-2 text-xs text-slate-100 outline-none ring-rose-500/60 focus:border-rose-400 focus:ring-1 ${
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
          <span className="rounded-full border border-rose-500/40 bg-rose-500/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.18em] text-rose-200">
            {badge}
          </span>
        )}
      </div>
      {children}
    </section>
  );
}

export default function OmsLayerPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-50">
      <div className="mx-auto max-w-6xl px-4 pb-24 pt-8">
        <header className="mb-8 flex items-center justify-between gap-4">
          <div>
            <p className="text-[11px] uppercase tracking-[0.28em] text-rose-400">
              Specialties · Layer 3
            </p>
            <h1 className="mt-1 text-2xl md:text-3xl font-semibold tracking-tight text-slate-50">
              Oral &amp; Maxillofacial Surgery · Surgical Hub
            </h1>
            <p className="mt-2 max-w-2xl text-xs md:text-sm text-slate-400">
              Future OMS layer for extractions, biopsies, orthognathic surgery,
              trauma and hospital cases — integrated with radiology, implants and
              medical alerts.
            </p>
          </div>

          <Link
            href="/specialties"
            className="rounded-full border border-slate-700 bg-slate-900/70 px-4 py-1.5 text-xs md:text-sm text-slate-200 hover:border-rose-400 hover:text-rose-100 transition-colors"
          >
            ← Back to Specialties Universe
          </Link>
        </header>

        <div className="space-y-5">
          <Card
            title="Surgical Case Context"
            subtitle="Why this patient is in OMS, and how it links with EMR & radiology."
            badge="Context"
          >
            <div className="grid gap-3 md:grid-cols-4">
              <div className="md:col-span-2">
                <label className="mb-1 block text-[11px] font-medium text-slate-300">
                  Patient (link EMR)
                </label>
                <button className="w-full rounded-full border border-rose-500/70 bg-rose-500/10 px-3 py-2 text-[11px] font-semibold text-rose-100 hover:bg-rose-500/20 transition">
                  Select patient from EMR
                </button>
              </div>
              <div>
                <label className="mb-1 block text-[11px] font-medium text-slate-300">
                  OMS case ID
                </label>
                <Input placeholder="ADIE-OMS-0001" />
              </div>
              <div>
                <label className="mb-1 block text-[11px] font-medium text-slate-300">
                  Setting
                </label>
                <Select defaultValue="">
                  <option value="">Select…</option>
                  <option>Clinic / office</option>
                  <option>Outpatient surgery center</option>
                  <option>Hospital in-patient</option>
                </Select>
              </div>
            </div>
          </Card>

          <div className="grid gap-5 lg:grid-cols-[1.4fr,1.6fr]">
            <Card
              title="Procedure & Anesthesia"
              subtitle="High-level structure until we design detailed forms."
              badge="Surgery"
            >
              <div className="grid gap-3 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-[11px] font-medium text-slate-300">
                    Procedure type
                  </label>
                  <Select defaultValue="">
                    <option value="">Select…</option>
                    <option>Simple / surgical extraction</option>
                    <option>Third molar surgery</option>
                    <option>Biopsy / pathology</option>
                    <option>Orthognathic surgery</option>
                    <option>Trauma management</option>
                    <option>TMJ surgery</option>
                  </Select>
                </div>
                <div>
                  <label className="mb-1 block text-[11px] font-medium text-slate-300">
                    Anesthesia
                  </label>
                  <Select defaultValue="">
                    <option value="">Select…</option>
                    <option>Local anesthesia only</option>
                    <option>Local + sedation</option>
                    <option>General anesthesia</option>
                  </Select>
                </div>
              </div>

              <div className="mt-3">
                <label className="mb-1 block text-[11px] font-medium text-slate-300">
                  Surgical notes (high level)
                </label>
                <TextArea
                  rows={4}
                  placeholder="Approach, osteotomies, flap design, fixation method, intra-op complications, blood loss, special findings…"
                />
              </div>
            </Card>

            <Card
              title="Post-operative Care & Outcomes"
              subtitle="How the patient left the OR and what we expect in follow-up."
              badge="Post-op"
            >
              <div className="grid gap-3 md:grid-cols-3">
                <div>
                  <label className="mb-1 block text-[11px] font-medium text-slate-300">
                    Immediate status
                  </label>
                  <Select defaultValue="">
                    <option value="">Select…</option>
                    <option>Stable</option>
                    <option>Needs short-term observation</option>
                    <option>Transferred to ICU / ward</option>
                  </Select>
                </div>
                <div>
                  <label className="mb-1 block text-[11px] font-medium text-slate-300">
                    Complications
                  </label>
                  <Select defaultValue="">
                    <option value="">Select…</option>
                    <option>No complications</option>
                    <option>Minor (managed in OR)</option>
                    <option>Major (reported)</option>
                  </Select>
                </div>
                <div>
                  <label className="mb-1 block text-[11px] font-medium text-slate-300">
                    Follow-up schedule
                  </label>
                  <Select defaultValue="">
                    <option value="">Select…</option>
                    <option>24–48h control</option>
                    <option>1 week</option>
                    <option>1 month</option>
                    <option>Custom protocol</option>
                  </Select>
                </div>
              </div>

              <div className="mt-3">
                <label className="mb-1 block text-[11px] font-medium text-slate-300">
                  Post-op instructions / coordination
                </label>
                <TextArea
                  rows={4}
                  placeholder="Medications, diet, emergency signs, coordination with medical team, radiology controls, implant / prostho links…"
                />
              </div>

              <p className="mt-2 text-[10px] text-slate-500">
                Future step: this OMS hub will pull images directly from the
                Radiology layer and send structured outcomes to BI and General
                Dentistry risk flags.
              </p>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}
