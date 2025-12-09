"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { SpecialtyTopActions } from "@/app/_components/SpecialtyTopActions";

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
          <span className="rounded-full border border-sky-500/40 bg-sky-500/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.2em] text-sky-200">
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
        {/* HEADER TÍTULO + BOTONES */}
        <header className="mb-3 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-[0.28em] text-sky-400">
              Specialties · Pediatric Dentistry
            </p>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-50 md:text-3xl">
              Pediatric Dentistry · Growth, Family & Prevention Record
            </h1>
            <p className="mt-1 max-w-2xl text-xs text-slate-400 md:text-sm">
              Hospital-level pediatric cockpit for ADIE: caregivers, behavior,
              systemic conditions, school context, prevention and treatment
              plans — ready to sync with the pediatric chart, ortho layer and
              vaccines / systemic modules.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-end gap-2">
            <button className="rounded-full border border-slate-700 bg-slate-900/80 px-3 py-1.5 text-[11px] text-slate-200 hover:border-sky-400 hover:text-sky-100 transition-colors">
              View full EMR
            </button>
            <button className="rounded-full border border-slate-700 bg-slate-900/80 px-3 py-1.5 text-[11px] text-slate-200 hover:border-emerald-400 hover:text-emerald-100 transition-colors">
              Pediatric timeline
            </button>
            <Link
              href="/specialties"
              className="rounded-full border border-slate-700 bg-slate-900/80 px-3 py-1.5 text-[11px] text-slate-300 hover:border-slate-400 hover:text-slate-50 transition-colors"
            >
              ← Back to Specialties Universe
            </Link>
          </div>
        </header>

        {/* BARRA ESTÁNDAR: BACK TO MPR + SAVE & DASHBOARD */}
        <Suspense fallback={null}>
          <SpecialtyTopActions specialtyLabel="Pediatric Dentistry" />
        </Suspense>

        {/* HEADER CLÍNICO TIPO ORTHO/IMPLANTS/PERIO */}
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
              <button className="rounded-full border border-slate-700 bg-slate-900/80 px-3 py-1 text-[11px] text-slate-200 hover:border-sky-400 hover:text-sky-100 transition-colors">
                ⬆ Upload
              </button>
            </div>

            {/* DATOS + FLAGS */}
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-300">
                <span className="rounded-full bg-slate-900/80 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-400">
                  Active pediatric patient
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2 text-[13px] font-medium text-slate-50">
                <span>John / Jane Kid</span>
                <span className="text-slate-500">·</span>
                <span className="text-[11px] text-slate-300">
                  ID ADIE-PT-CH-0001
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2 text-[10px] text-slate-400">
                <span>DOB: 2017-05-23</span>
                <span>· Age: 7y</span>
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
                  Pediatric profile: Medium caries risk · Anxious
                </span>
              </div>

              <div className="grid gap-2 text-[10px] text-slate-400 md:grid-cols-2">
                <div>
                  <p className="mb-0.5 font-medium text-slate-300">
                    Pediatric & medical flags
                  </p>
                  <p className="leading-snug">
                    Asthma · seasonal allergies · no hospitalizations · vaccines
                    up to date · no known drug allergies.
                  </p>
                </div>
                <div>
                  <p className="mb-0.5 font-medium text-slate-300">
                    Behavior & school flags
                  </p>
                  <p className="leading-snug">
                    Mild anxiety in new environments · good school performance ·
                    possible attention difficulties reported by teacher.
                  </p>
                </div>
              </div>
            </div>

            {/* RIESGO GLOBAL + CLEARANCE */}
            <div className="flex flex-col items-end gap-2.5">
              <div className="flex items-center gap-3">
                <div className="flex flex-col items-end text-right">
                  <span className="text-[10px] uppercase tracking-[0.24em] text-slate-400">
                    Global pediatric risk
                  </span>
                  <div className="mt-1 flex items-center gap-2">
                    <div className="relative h-9 w-9">
                      <div className="absolute left-1/2 top-0 -translate-x-1/2 border-l-[9px] border-r-[9px] border-b-[16px] border-l-transparent border-r-transparent border-b-emerald-400/80" />
                      <div className="absolute left-1/2 top-[5px] -translate-x-1/2 border-l-[9px] border-r-[9px] border-b-[16px] border-l-transparent border-r-transparent border-b-amber-400/90" />
                      <div className="absolute left-1/2 top-[10px] -translate-x-1/2 border-l-[9px] border-r-[9px] border-b-[16px] border-l-transparent border-r-transparent border-b-rose-500/90" />
                    </div>
                    <div className="flex flex-col text-[10px] text-slate-300">
                      <span>Pedia Safety Score: 84/100</span>
                      <span className="text-emerald-300">
                        Stable · chair-side care appropriate
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <button className="rounded-full border border-emerald-500/70 bg-emerald-500/10 px-3 py-1.5 text-[11px] font-semibold text-emerald-100 hover:bg-emerald-500/20 transition-colors">
                Cleared for pediatric dental care · No critical alerts
              </button>

              <div className="flex flex-col items-end text-[10px] text-slate-400">
                <span>Sedation: not required · consider nitrous if anxious</span>
                <span>Emergency contact verified today</span>
              </div>
            </div>
          </div>
        </section>

        {/* LAYOUT PRINCIPAL */}
        <div className="grid gap-5 lg:grid-cols-[1.7fr,1.2fr]">
          {/* COLUMNA IZQUIERDA */}
          <div className="space-y-5">
            {/* CONTEXTO & CUIDADORES */}
            <Card
              title="Pediatric Context & Caregivers"
              subtitle="Quién trae al niño, quién firma, custodia, teléfonos y contexto familiar."
              badge="Caregivers"
            >
              <div className="grid gap-3 text-[11px] md:grid-cols-4">
                <div className="md:col-span-2">
                  <label className="mb-1 block font-medium text-slate-300">
                    Patient (link EMR)
                  </label>
                  <button className="w-full rounded-full border border-sky-500/70 bg-sky-500/10 px-3 py-2 text-[11px] font-semibold text-sky-100 hover:bg-sky-500/20 transition">
                    Select patient from EMR
                  </button>
                </div>
                <div>
                  <label className="mb-1 block font-medium text-slate-300">
                    Pediatric case ID
                  </label>
                  <Input placeholder="ADIE-PEDIA-0001" />
                </div>
                <div>
                  <label className="mb-1 block font-medium text-slate-300">
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

              <div className="mt-4 grid gap-3 text-[11px] md:grid-cols-4">
                <div>
                  <label className="mb-1 block font-medium text-slate-300">
                    Primary caregiver name
                  </label>
                  <Input placeholder="Full name" />
                </div>
                <div>
                  <label className="mb-1 block font-medium text-slate-300">
                    Relationship to child
                  </label>
                  <Select defaultValue="">
                    <option value="">Select…</option>
                    <option>Mother</option>
                    <option>Father</option>
                    <option>Both parents</option>
                    <option>Grandparent</option>
                    <option>Legal guardian</option>
                    <option>Foster parent</option>
                    <option>Other relative</option>
                    <option>Other (non-relative)</option>
                  </Select>
                </div>
                <div>
                  <label className="mb-1 block font-medium text-slate-300">
                    Lives with child?
                  </label>
                  <Select defaultValue="">
                    <option value="">Select…</option>
                    <option>Yes, full time</option>
                    <option>Yes, shared custody</option>
                    <option>No, different household</option>
                  </Select>
                </div>
                <div>
                  <label className="mb-1 block font-medium text-slate-300">
                    Caregiver phone
                  </label>
                  <Input placeholder="+1 (___) ___-____" />
                </div>
              </div>

              <div className="mt-4 grid gap-3 text-[11px] md:grid-cols-3">
                <div>
                  <label className="mb-1 block font-medium text-slate-300">
                    Legal guardianship / custody
                  </label>
                  <Select defaultValue="">
                    <option value="">Select…</option>
                    <option>Both parents</option>
                    <option>Mother only</option>
                    <option>Father only</option>
                    <option>Shared custody (court order)</option>
                    <option>Legal guardian / foster care</option>
                    <option>Other (specify in notes)</option>
                  </Select>
                </div>
                <div>
                  <label className="mb-1 block font-medium text-slate-300">
                    Who can sign consent?
                  </label>
                  <Select defaultValue="">
                    <option value="">Select…</option>
                    <option>Any legal parent / guardian</option>
                    <option>Only primary caregiver present</option>
                    <option>Specific person (see notes)</option>
                  </Select>
                </div>
                <div>
                  <label className="mb-1 block font-medium text-slate-300">
                    Consent notes
                  </label>
                  <Input placeholder="Court orders, limitations, extra authorizations…" />
                </div>
              </div>

              <div className="mt-4 grid gap-3 text-[11px] md:grid-cols-2">
                <div>
                  <label className="mb-1 block font-medium text-slate-300">
                    Secondary contact / emergency
                  </label>
                  <Input placeholder="Name & relationship" />
                </div>
                <div>
                  <label className="mb-1 block font-medium text-slate-300">
                    Secondary phone
                  </label>
                  <Input placeholder="+1 (___) ___-____" />
                </div>
              </div>
            </Card>

            {/* MEDICAL, DESARROLLO & NECESIDADES ESPECIALES */}
            <Card
              title="Medical, Development & Special Needs"
              subtitle="Condiciones sistémicas, desarrollo, comunicación y necesidades especiales."
              badge="Medical / Dev"
            >
              <div className="grid gap-3 text-[11px] md:grid-cols-4">
                <div>
                  <label className="mb-1 block font-medium text-slate-300">
                    Systemic conditions
                  </label>
                  <Select defaultValue="">
                    <option value="">Select…</option>
                    <option>No relevant systemic disease</option>
                    <option>Asthma</option>
                    <option>Diabetes</option>
                    <option>Congenital heart disease</option>
                    <option>Epilepsy / seizures</option>
                    <option>Bleeding disorder</option>
                    <option>Autism spectrum</option>
                    <option>ADHD</option>
                    <option>Genetic syndrome</option>
                    <option>Other (see notes)</option>
                  </Select>
                </div>
                <div>
                  <label className="mb-1 block font-medium text-slate-300">
                    Pediatrician
                  </label>
                  <Input placeholder="Name / clinic" />
                </div>
                <div>
                  <label className="mb-1 block font-medium text-slate-300">
                    Pediatrician contact
                  </label>
                  <Input placeholder="Phone / email" />
                </div>
                <div>
                  <label className="mb-1 block font-medium text-slate-300">
                    ASA status (if known)
                  </label>
                  <Select defaultValue="">
                    <option value="">Select…</option>
                    <option>ASA I</option>
                    <option>ASA II</option>
                    <option>ASA III</option>
                    <option>ASA IV or higher</option>
                  </Select>
                </div>
              </div>

              <div className="mt-3 grid gap-3 text-[11px] md:grid-cols-3">
                <div>
                  <label className="mb-1 block font-medium text-slate-300">
                    Medications
                  </label>
                  <TextArea
                    rows={3}
                    placeholder="Asthma inhalers, ADHD meds, anticonvulsants, others…"
                  />
                </div>
                <div>
                  <label className="mb-1 block font-medium text-slate-300">
                    Allergies (sync with EMR)
                  </label>
                  <TextArea
                    rows={3}
                    placeholder="Drug allergies, food allergies, latex, local anesthetics…"
                  />
                </div>
                <div>
                  <label className="mb-1 block font-medium text-slate-300">
                    Development & communication
                  </label>
                  <Select defaultValue="">
                    <option value="">Select…</option>
                    <option>Typical development · verbal</option>
                    <option>Typical development · shy / limited speech</option>
                    <option>Developmental delay · verbal</option>
                    <option>Developmental delay · non-verbal / uses devices</option>
                    <option>Autism spectrum · sensory sensitive</option>
                    <option>Other neurodiversity (see notes)</option>
                  </Select>
                  <TextArea
                    rows={2}
                    className="mt-2"
                    placeholder="Best way to communicate, sensory triggers, coping strategies…"
                  />
                </div>
              </div>
            </Card>

            {/* COMPORTAMIENTO & LOGÍSTICA DE VISITA */}
            <Card
              title="Behavior & Visit Logistics"
              subtitle="Comportamiento esperado, tipo de cita, horarios ideales y apoyos necesarios."
              badge="Behavior"
            >
              <div className="grid gap-3 text-[11px] md:grid-cols-4">
                <div>
                  <label className="mb-1 block font-medium text-slate-300">
                    Behavior in chair
                  </label>
                  <Select defaultValue="">
                    <option value="">Select…</option>
                    <option>Cooperative</option>
                    <option>Cooperative with breaks</option>
                    <option>Potentially anxious</option>
                    <option>Non-cooperative</option>
                    <option>Needs pharmacologic support</option>
                  </Select>
                </div>
                <div>
                  <label className="mb-1 block font-medium text-slate-300">
                    Visit type
                  </label>
                  <Select defaultValue="">
                    <option value="">Select…</option>
                    <option>New patient exam</option>
                    <option>Recall / check-up</option>
                    <option>Emergency / pain</option>
                    <option>Trauma</option>
                    <option>Special needs extended visit</option>
                  </Select>
                </div>
                <div>
                  <label className="mb-1 block font-medium text-slate-300">
                    Preferred time of day
                  </label>
                  <Select defaultValue="">
                    <option value="">Select…</option>
                    <option>Early morning</option>
                    <option>Mid-morning</option>
                    <option>Afternoon (after school)</option>
                    <option>Flexible</option>
                  </Select>
                </div>
                <div>
                  <label className="mb-1 block font-medium text-slate-300">
                    Interpreter / language support
                  </label>
                  <Select defaultValue="">
                    <option value="">Select…</option>
                    <option>Not needed</option>
                    <option>Spanish interpreter</option>
                    <option>Sign language</option>
                    <option>Other language</option>
                  </Select>
                </div>
              </div>

              <div className="mt-3 grid gap-3 text-[11px] md:grid-cols-4">
                <div>
                  <label className="mb-1 block font-medium text-slate-300">
                    Pain level (0–10)
                  </label>
                  <Input placeholder="e.g. 3/10" />
                </div>
                <div>
                  <label className="mb-1 block font-medium text-slate-300">
                    Transport to clinic
                  </label>
                  <Select defaultValue="">
                    <option value="">Select…</option>
                    <option>Car with caregiver</option>
                    <option>Public transport</option>
                    <option>School transport</option>
                    <option>Other (see notes)</option>
                  </Select>
                </div>
                <div className="md:col-span-2">
                  <label className="mb-1 block font-medium text-slate-300">
                    Visit logistics notes
                  </label>
                  <TextArea
                    rows={3}
                    placeholder="Need extra time, quiet room, sibling appointments together, pre-visit call, etc."
                  />
                </div>
              </div>
            </Card>
          </div>

          {/* COLUMNA DERECHA */}
          <div className="space-y-5">
            {/* CARIES & PREVENCIÓN */}
            <Card
              title="Caries & Preventive Risk Engine"
              subtitle="Exposición a azúcar, flúor, hábitos nocturnos y riesgo de caries."
              badge="Caries Risk"
            >
              <div className="grid gap-3 text-[11px] md:grid-cols-2">
                <div>
                  <label className="mb-1 block font-medium text-slate-300">
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
                  <label className="mb-1 block font-medium text-slate-300">
                    Fluoride exposure at home
                  </label>
                  <Select defaultValue="">
                    <option value="">Select…</option>
                    <option>Fluoride toothpaste 2×/day</option>
                    <option>Toothpaste 1×/day</option>
                    <option>No fluoride toothpaste</option>
                    <option>Fluoridated water</option>
                    <option>Systemic + topical</option>
                  </Select>
                </div>
              </div>

              <div className="mt-3 grid gap-3 text-[11px] md:grid-cols-2">
                <div>
                  <label className="mb-1 block font-medium text-slate-300">
                    Diet & sugar pattern
                  </label>
                  <Select defaultValue="">
                    <option value="">Select…</option>
                    <option>Low sugar · occasional treats</option>
                    <option>Daily sweets / drinks</option>
                    <option>Frequent sipping of sugary drinks</option>
                    <option>Night-time bottle / sippy with sugar</option>
                  </Select>
                  <TextArea
                    rows={3}
                    className="mt-2"
                    placeholder="Details on juice, soda, snacks, night feeding, etc."
                  />
                </div>
                <div>
                  <label className="mb-1 block font-medium text-slate-300">
                    Home hygiene pattern
                  </label>
                  <Select defaultValue="">
                    <option value="">Select…</option>
                    <option>Brushing 2×/day + caregiver checks</option>
                    <option>Brushing 2×/day self-performed</option>
                    <option>Brushing 1×/day</option>
                    <option>Irregular brushing</option>
                    <option>No routine brushing</option>
                  </Select>
                  <label className="mt-2 mb-1 block font-medium text-slate-300">
                    Sealants / preventive resin status
                  </label>
                  <TextArea
                    rows={3}
                    placeholder="Which molars sealed, dates, materials, retention checks…"
                  />
                </div>
              </div>

              <div className="mt-3 rounded-2xl border border-slate-800 bg-slate-950/90 px-3 py-3 text-[10px]">
                <div className="mb-1 flex items-center justify-between">
                  <span className="font-medium text-slate-200">
                    Quick risk summary (concept)
                  </span>
                  <span className="rounded-full bg-amber-500/10 px-2 py-0.5 text-amber-200">
                    Global caries risk: Moderate–High
                  </span>
                </div>
                <p className="text-slate-400">
                  Future: ADIE will calculate a pediatric caries risk score
                  combining diet, hygiene, fluoride, socio-economic and previous
                  caries experience.
                </p>
              </div>
            </Card>

            {/* PLAN DE TRATAMIENTO */}
            <Card
              title="Pediatric Treatment & Visit Plan"
              subtitle="Qué se hará hoy, qué se hará por fases y cómo estabilizar al paciente."
              badge="Treatment"
            >
              <div className="grid gap-3 text-[11px] md:grid-cols-2">
                <div>
                  <label className="mb-1 block font-medium text-slate-300">
                    Today&apos;s visit focus
                  </label>
                  <Select defaultValue="">
                    <option value="">Select…</option>
                    <option>Comprehensive exam + prophy</option>
                    <option>Recall prophy + fluoride</option>
                    <option>Restorative (fillings)</option>
                    <option>Pulp therapy / crowns</option>
                    <option>Trauma management</option>
                    <option>Behavior / acclimatization visit</option>
                  </Select>
                </div>
                <div>
                  <label className="mb-1 block font-medium text-slate-300">
                    Planned anesthesia / analgesia
                  </label>
                  <Select defaultValue="">
                    <option value="">Select…</option>
                    <option>Local only</option>
                    <option>Nitrous oxide</option>
                    <option>Oral sedation (external provider)</option>
                    <option>General anesthesia (hospital)</option>
                    <option>None / not needed</option>
                  </Select>
                </div>
              </div>

              <div className="mt-3 grid gap-3 text-[11px] md:grid-cols-3">
                <div>
                  <label className="mb-1 block font-medium text-slate-300">
                    Phase 1 · Stabilization
                  </label>
                  <TextArea
                    rows={3}
                    placeholder="Emergency treatments, pain control, infection, temporary restorations…"
                  />
                </div>
                <div>
                  <label className="mb-1 block font-medium text-slate-300">
                    Phase 2 · Definitive treatment
                  </label>
                  <TextArea
                    rows={3}
                    placeholder="Definitive restorations, pulpotomies, extractions, space maintenance…"
                  />
                </div>
                <div>
                  <label className="mb-1 block font-medium text-slate-300">
                    Phase 3 · Maintenance
                  </label>
                  <TextArea
                    rows={3}
                    placeholder="Recall frequency, sealant checks, ortho monitoring, trauma follow-up…"
                  />
                </div>
              </div>

              <div className="mt-3 rounded-2xl border border-slate-800 bg-slate-950/90 px-3 py-3 text-[11px]">
                <label className="mb-1 block font-medium text-slate-300">
                  Trauma / emergency protocol notes
                </label>
                <TextArea
                  rows={3}
                  placeholder="Avulsed tooth management, splinting dates, radiographic follow-up schedule…"
                />
              </div>
            </Card>

            {/* ESCUELA & CONTEXTO SOCIAL */}
            <Card
              title="School & Social Context"
              subtitle="Escolaridad, rendimiento, apoyo educativo y actividades."
              badge="School / Social"
            >
              <div className="grid gap-3 text-[11px] md:grid-cols-3">
                <div>
                  <label className="mb-1 block font-medium text-slate-300">
                    School grade
                  </label>
                  <Select defaultValue="">
                    <option value="">Select…</option>
                    <option>Pre-K / Kindergarten</option>
                    <option>1st–3rd grade</option>
                    <option>4th–6th grade</option>
                    <option>7th–9th grade</option>
                    <option>10th–12th grade</option>
                  </Select>
                </div>
                <div>
                  <label className="mb-1 block font-medium text-slate-300">
                    School type
                  </label>
                  <Select defaultValue="">
                    <option value="">Select…</option>
                    <option>Public</option>
                    <option>Private</option>
                    <option>Homeschool</option>
                    <option>Special education center</option>
                  </Select>
                </div>
                <div>
                  <label className="mb-1 block font-medium text-slate-300">
                    Academic performance
                  </label>
                  <Select defaultValue="">
                    <option value="">Select…</option>
                    <option>Excellent / above average</option>
                    <option>Average</option>
                    <option>Needs support</option>
                    <option>Not evaluated / unknown</option>
                  </Select>
                </div>
              </div>

              <div className="mt-3 grid gap-3 text-[11px] md:grid-cols-2">
                <div>
                  <label className="mb-1 block font-medium text-slate-300">
                    Special education / IEP
                  </label>
                  <Select defaultValue="">
                    <option value="">Select…</option>
                    <option>No IEP / no special education</option>
                    <option>Has IEP / special education services</option>
                    <option>IEP in process</option>
                    <option>Unknown</option>
                  </Select>
                </div>
                <div>
                  <label className="mb-1 block font-medium text-slate-300">
                    Sports & activities
                  </label>
                  <TextArea
                    rows={3}
                    placeholder="Soccer, basketball, gymnastics, martial arts… (mouthguard recommendation)."
                  />
                </div>
              </div>

              <div className="mt-3 grid gap-3 text-[11px] md:grid-cols-2">
                <div>
                  <label className="mb-1 block font-medium text-slate-300">
                    Oral habits & sleep
                  </label>
                  <Select defaultValue="">
                    <option value="">Select…</option>
                    <option>No relevant habits reported</option>
                    <option>Thumb / finger sucking</option>
                    <option>Pacifier beyond age 3</option>
                    <option>Mouth breathing</option>
                    <option>Bruxism / grinding</option>
                  </Select>
                </div>
                <div>
                  <label className="mb-1 block font-medium text-slate-300">
                    Social / family notes
                  </label>
                  <TextArea
                    rows={3}
                    placeholder="Recent changes at home, stressors, supports that may affect dental care…"
                  />
                </div>
              </div>
            </Card>

            {/* EDUCACIÓN & CONSENTIMIENTO */}
            <Card
              title="Family Education & Consent Summary"
              subtitle="Mensajes clave entregados a la familia y acuerdos de tratamiento."
              badge="Education / Consent"
            >
              <TextArea
                rows={6}
                placeholder={`Example template:
- Reviewed caries risk, diet and brushing technique with caregiver.
- Explained need for sealants and fluoride; caregiver agreed to proposed plan.
- Discussed behavior management strategy (tell-show-do, nitrous, breaks).
- Clarified who can sign future consents and emergency contact procedures.
- Family questions and decisions documented here…`}
              />
              <p className="mt-2 text-[10px] text-slate-500">
                Future: this section will auto-generate a parent-friendly
                summary in plain language and could be exported as a PDF or
                WhatsApp message directly from ADIE.
              </p>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}
