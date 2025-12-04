"use client";

import React from "react";
import Link from "next/link";

export default function OrthodonticsRecordPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-50 px-6 md:px-10 py-8">
      {/* Top header */}
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <p className="text-[11px] uppercase tracking-[0.24em] text-sky-400 mb-1">
            Specialties · Layer 3
          </p>
          <h1 className="text-2xl md:text-3xl font-semibold text-slate-50">
            Orthodontics Clinical Record
          </h1>
          <p className="text-xs md:text-sm text-slate-400 mt-2 max-w-2xl">
            Complete orthodontic chart to document assessments, records,
            treatment plans, appliances and long-term retention for each
            patient.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 text-xs">
          <Link
            href="/specialties"
            className="inline-flex items-center gap-1 rounded-full border border-sky-500/60 px-4 py-1.5 text-sky-200 hover:bg-sky-500/15 hover:text-sky-50 transition"
          >
            <span>←</span>
            <span>Back to Specialties Universe</span>
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-1 rounded-full border border-slate-700 px-4 py-1.5 text-slate-300 hover:bg-slate-800 hover:text-slate-50 transition"
          >
            <span>🏠</span>
            <span>Back to Dashboard</span>
          </Link>
        </div>
      </header>

      {/* Main layout: left form + right panel */}
      <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,2.1fr)_minmax(0,1fr)] gap-6">
        {/* LEFT COLUMN – clinical form */}
        <section className="space-y-6">
          {/* Patient context */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 px-5 py-4">
            <p className="text-[11px] font-semibold tracking-[0.22em] uppercase text-slate-500 mb-3">
              Patient context
            </p>
            <div className="flex flex-wrap items-center gap-3 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-slate-500">Name:</span>
                <button className="rounded-full border border-sky-500/60 bg-sky-500/10 px-3 py-1 text-sky-200 hover:bg-sky-500/20">
                  [Select patient from EMR]
                </button>
              </div>
              <div className="flex items-center gap-1 text-slate-400">
                <span className="text-slate-500">ID:</span>
                <span className="font-mono text-sky-300">ADIE-ORTO-0001</span>
              </div>
              <div className="flex items-center gap-1 text-slate-400">
                <span className="text-slate-500">Age:</span>
                <span>—</span>
              </div>
              <div className="flex items-center gap-2 text-slate-400">
                <span className="text-slate-500">Status:</span>
                <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-3 py-0.5 text-[11px] text-emerald-300 border border-emerald-500/40">
                  ● Active treatment
                </span>
              </div>
            </div>
          </div>

          {/* Chief complaint & history */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-4">
            <p className="text-[11px] font-semibold tracking-[0.22em] uppercase text-slate-500">
              Chief complaint &amp; history
            </p>

            <div className="space-y-3 text-xs">
              <FieldBlock
                label="Chief complaint"
                placeholder="Example: Crowding in upper front teeth, wants aligners instead of brackets."
              />
              <FieldBlock
                label="Medical / dental history"
                placeholder="Systemic conditions, medications, allergies, previous orthodontic treatment…"
              />
              <FieldBlock
                label="Habits / functional findings"
                placeholder="Mouth breathing, tongue thrust, bruxism, posture, etc."
              />
            </div>
          </div>

          {/* Clinical classification */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-4">
            <p className="text-[11px] font-semibold tracking-[0.22em] uppercase text-slate-500">
              Clinical classification
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              {/* Skeletal pattern */}
              <div>
                <LabelSmall>Skeletal pattern (Angle)</LabelSmall>
                <select className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950/60 px-3 py-2 text-xs text-slate-100">
                  <option>Select class…</option>
                  <option>Class I</option>
                  <option>Class II</option>
                  <option>Class III</option>
                </select>
              </div>

              {/* Growth pattern */}
              <div>
                <LabelSmall>Growth pattern</LabelSmall>
                <select className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950/60 px-3 py-2 text-xs text-slate-100">
                  <option>Select pattern…</option>
                  <option>Horizontal</option>
                  <option>Vertical</option>
                  <option>Neutral</option>
                </select>
              </div>

              {/* Malocclusion summary */}
              <div>
                <LabelSmall>Malocclusion summary</LabelSmall>
                <textarea
                  className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950/60 px-3 py-2 text-xs text-slate-100 min-h-[44px]"
                  placeholder="Example: Skeletal Class II, dental crowding, increased overjet, mild open bite…"
                />
              </div>
            </div>

            <div className="mt-3">
              <LabelSmall>Diagnosis notes</LabelSmall>
              <textarea
                className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950/60 px-3 py-2 text-xs text-slate-100 min-h-[48px]"
                placeholder="Short narrative tying clinical findings with ceph measurements and photos."
              />
            </div>
          </div>

          {/* Treatment plan & appliances */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-4">
            <p className="text-[11px] font-semibold tracking-[0.22em] uppercase text-slate-500">
              Treatment plan &amp; appliances
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div>
                <LabelSmall>Main strategy</LabelSmall>
                <select className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950/60 px-3 py-2 text-xs text-slate-100">
                  <option>Select option…</option>
                  <option>Fixed appliances</option>
                  <option>Clear aligners</option>
                  <option>Hybrid (brackets + aligners)</option>
                  <option>Interceptive / limited treatment</option>
                </select>
              </div>

              <div>
                <LabelSmall>Planned extractions / IPR</LabelSmall>
                <textarea
                  className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950/60 px-3 py-2 text-xs text-slate-100 min-h-[44px]"
                  placeholder="List any extractions, stripping (IPR), anchorage control or mini-screws."
                />
              </div>
            </div>

            <div className="mt-3">
              <LabelSmall>Timeline &amp; appliance notes</LabelSmall>
              <textarea
                className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950/60 px-3 py-2 text-xs text-slate-100 min-h-[56px]"
                placeholder="Stage sequence, aligner sets, wire sequence, retention protocol."
              />
            </div>
          </div>
        </section>

        {/* RIGHT COLUMN – records + aligner workflow */}
        <section className="space-y-6">
          {/* Clinical records */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-3 text-xs">
            <p className="text-[11px] font-semibold tracking-[0.22em] uppercase text-slate-500">
              Clinical records
            </p>
            <p className="text-[11px] text-slate-400 mb-2">
              Later we will link each item with Radiology, Photos and Dental
              Chart modules.
            </p>

            <div className="space-y-2">
              <CheckboxRow label="Panoramic radiograph" />
              <CheckboxRow label="Cephalometric radiograph" />
              <CheckboxRow label="Intraoral photos" />
              <CheckboxRow label="Extraoral photos" />
              <CheckboxRow label="Study models / intraoral scan" />
              <CheckboxRow label="Cephalometric analysis completed" />
            </div>
          </div>

          {/* CLEAR ALIGNER WORKFLOW (Invisalign-like) */}
          <div className="rounded-2xl border border-sky-700/70 bg-gradient-to-b from-slate-900/80 to-slate-950 px-5 py-5 space-y-4">
            <div className="flex items-center justify-between gap-2">
              <div>
                <p className="text-[11px] font-semibold tracking-[0.22em] uppercase text-sky-400">
                  Clear aligner workflow
                </p>
                <p className="text-xs text-slate-300">
                  Use this when the clinic has scanners / aligner systems (e.g.
                  Invisalign, Spark, in-house).
                </p>
              </div>
              <span className="rounded-full border border-sky-500/40 bg-sky-500/10 px-3 py-0.5 text-[10px] text-sky-200">
                Digital ready
              </span>
            </div>

            {/* Where is the aligner system? */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-[11px]">
              <AlignerModeCard
                title="In-house aligner system"
                description="Clinic owns scanner + aligner planning software."
              />
              <AlignerModeCard
                title="External lab (Invisalign, etc.)"
                description="Digital impressions sent to external provider."
              />
              <AlignerModeCard
                title="Not available yet"
                description="Mark clinics that still need an aligner pathway."
              />
            </div>

            {/* Step-by-step aligner pipeline */}
            <div className="mt-3 space-y-2">
              <p className="text-[11px] font-semibold tracking-[0.18em] uppercase text-slate-400">
                Aligner pipeline (per case)
              </p>
              <div className="space-y-2">
                <AlignerStep
                  label="Digital scan & records uploaded"
                  description="Intraoral scan, photos and X-rays sent to provider / software."
                />
                <AlignerStep
                  label="ClinCheck / setup approved"
                  description="Doctor has reviewed virtual setup and approved treatment plan."
                />
                <AlignerStep
                  label="Aligners delivered & start date"
                  description="Patient received first set, instructions and monitoring schedule."
                />
                <AlignerStep
                  label="Mid-treatment control"
                  description="Refinement scans, additional aligners, and tracking of compliance."
                />
                <AlignerStep
                  label="Retention phase"
                  description="Fixed / removable retainers, retention checks and long-term follow-up."
                />
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

/* ---------- Small helper components ---------- */

type FieldBlockProps = {
  label: string;
  placeholder: string;
};

function FieldBlock({ label, placeholder }: FieldBlockProps) {
  return (
    <div>
      <LabelSmall>{label}</LabelSmall>
      <textarea
        className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950/60 px-3 py-2 text-xs text-slate-100 min-h-[52px]"
        placeholder={placeholder}
      />
    </div>
  );
}

type CheckboxRowProps = {
  label: string;
};

function CheckboxRow({ label }: CheckboxRowProps) {
  return (
    <label className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-950/60 px-3 py-2 hover:border-sky-500/50 hover:bg-slate-900/80 cursor-pointer">
      <input
        type="checkbox"
        className="h-3 w-3 rounded border-slate-600 bg-slate-950 text-sky-500"
      />
      <span className="text-xs text-slate-200">{label}</span>
    </label>
  );
}

type LabelSmallProps = {
  children: React.ReactNode;
};

function LabelSmall({ children }: LabelSmallProps) {
  return (
    <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
      {children}
    </p>
  );
}

type AlignerModeCardProps = {
  title: string;
  description: string;
};

function AlignerModeCard({ title, description }: AlignerModeCardProps) {
  return (
    <div className="rounded-xl border border-sky-700/40 bg-slate-950/70 px-3 py-3">
      <p className="text-[11px] font-semibold text-sky-200 mb-1">{title}</p>
      <p className="text-[11px] text-slate-300">{description}</p>
    </div>
  );
}

type AlignerStepProps = {
  label: string;
  description: string;
};

function AlignerStep({ label, description }: AlignerStepProps) {
  return (
    <label className="flex items-start gap-3 rounded-xl border border-slate-800 bg-slate-950/70 px-3 py-2 hover:border-sky-500/60 cursor-pointer">
      <input
        type="checkbox"
        className="mt-1 h-3 w-3 rounded border-slate-600 bg-slate-950 text-sky-500"
      />
      <div>
        <p className="text-[11px] font-semibold text-slate-100">{label}</p>
        <p className="text-[11px] text-slate-400">{description}</p>
      </div>
    </label>
  );
}
