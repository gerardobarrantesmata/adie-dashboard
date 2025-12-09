"use client";

import React from "react";
import Link from "next/link";
import { SpecialtyTopActions } from "@/app/_components/SpecialtyTopActions";

function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`w-full rounded-xl border border-slate-700 bg-slate-950/70 px-3 py-2 text-xs text-slate-100 outline-none focus:border-rose-400 focus:ring-1 focus:ring-rose-500/60 ${
        props.className ?? ""
      }`}
    />
  );
}

function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={`w-full rounded-xl border border-slate-700 bg-slate-950/70 px-3 py-2 text-xs text-slate-100 outline-none focus:border-rose-400 focus:ring-1 focus:ring-rose-500/60 ${
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
      className={`w-full rounded-xl border border-slate-700 bg-slate-950/70 px-3 py-2 text-xs text-slate-100 outline-none focus:border-rose-400 focus:ring-1 focus:ring-rose-500/60 ${
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
          <span className="rounded-full border border-rose-500/40 bg-rose-500/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.2em] text-rose-200">
            {badge}
          </span>
        )}
      </div>
      {children}
    </section>
  );
}

export default function OmsLayerPage() {
  const demoSites = ["18", "28", "38", "48"];

  return (
    <main className="min-h-screen bg-slate-950 text-slate-50">
      <div className="mx-auto max-w-6xl px-4 pb-24 pt-8">
        {/* HEADER TÍTULO + BOTONES */}
        <header className="mb-3 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-[0.28em] text-rose-400">
              Specialties · Oral &amp; Maxillofacial Surgery
            </p>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-50 md:text-3xl">
              OMS · Surgical, Anesthesia & Implant Command Center
            </h1>
            <p className="mt-1 max-w-3xl text-xs text-slate-400 md:text-sm">
              Hospital-level hub for extractions, third molars, trauma,
              orthognathic surgery, implants, grafts and pathology. Anesthesia,
              monitoring and surgical details in one AI-ready workspace, fully
              linked to Radiology, Implants and the medical EMR.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-end gap-2">
            <button className="rounded-full border border-slate-700 bg-slate-900/80 px-3 py-1.5 text-[11px] text-slate-200 hover:border-rose-400 hover:text-rose-100 transition-colors">
              View full EMR
            </button>
            <button className="rounded-full border border-slate-700 bg-slate-900/80 px-3 py-1.5 text-[11px] text-slate-200 hover:border-emerald-400 hover:text-emerald-100 transition-colors">
              OMS timeline
            </button>
            <Link
              href="/specialties"
              className="rounded-full border border-slate-700 bg-slate-900/80 px-3 py-1.5 text-[11px] text-slate-300 hover:border-slate-400 hover:text-slate-50 transition-colors"
            >
              ← Back to Specialties Universe
            </Link>
          </div>
        </header>

        {/* BARRA DE CONTROL: BACK TO MPR + SAVE & DASHBOARD */}
        <SpecialtyTopActions specialtyLabel="Oral & Maxillofacial Surgery" />

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
              <button className="rounded-full border border-slate-700 bg-slate-900/80 px-3 py-1 text-[11px] text-slate-200 hover:border-rose-400 hover:text-rose-100 transition-colors">
                ⬆ Upload
              </button>
            </div>

            {/* DATOS + FLAGS */}
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-300">
                <span className="rounded-full bg-slate-900/80 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-400">
                  Active OMS patient
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
                <span>DOB: 1989-02-11</span>
                <span>· Age: 35y</span>
                <span>· Gender: Male</span>
                <span>· Hospital MRN: 123456-01</span>
              </div>

              <div className="flex flex-wrap items-center gap-2 text-[10px]">
                <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 font-semibold uppercase tracking-[0.18em] text-emerald-200">
                  VIP
                </span>
                <span className="rounded-full bg-amber-500/10 px-2 py-0.5 text-amber-200">
                  Financial hold · Review balance
                </span>
                <span className="rounded-full bg-slate-900 px-2 py-0.5 text-slate-300">
                  Complex OMS case · Third molars + implants
                </span>
              </div>

              <div className="grid gap-2 text-[10px] text-slate-400 md:grid-cols-2">
                <div>
                  <p className="mb-0.5 font-medium text-slate-300">
                    Systemic & medical flags
                  </p>
                  <p className="leading-snug">
                    ASA II · controlled hypertension · no anticoagulants ·
                    previous general anesthesia without complications.
                  </p>
                </div>
                <div>
                  <p className="mb-0.5 font-medium text-slate-300">
                    OMS & implant quick flags
                  </p>
                  <p className="leading-snug">
                    Impacted 38/48 · planned implants 36/46 · moderate bone
                    loss · sinus proximity in 16/26 · no known airway anomalies.
                  </p>
                </div>
              </div>
            </div>

            {/* RIESGO GLOBAL QUIRÚRGICO */}
            <div className="flex flex-col items-end gap-2.5">
              <div className="flex items-center gap-3">
                <div className="flex flex-col items-end text-right">
                  <span className="text-[10px] uppercase tracking-[0.24em] text-slate-400">
                    Global surgical risk
                  </span>
                  <div className="mt-1 flex items-center gap-2">
                    <div className="relative h-9 w-9">
                      <div className="absolute left-1/2 top-0 -translate-x-1/2 border-l-[9px] border-r-[9px] border-b-[16px] border-l-transparent border-r-transparent border-b-emerald-400/80" />
                      <div className="absolute left-1/2 top-[5px] -translate-x-1/2 border-l-[9px] border-r-[9px] border-b-[16px] border-l-transparent border-r-transparent border-b-amber-400/90" />
                      <div className="absolute left-1/2 top-[10px] -translate-x-1/2 border-l-[9px] border-r-[9px] border-b-[16px] border-l-transparent border-r-transparent border-b-rose-500/90" />
                    </div>
                    <div className="flex flex-col text-[10px] text-slate-300">
                      <span>OMS risk score: 76/100</span>
                      <span className="text-amber-300">
                        Moderate complexity · sedation + implants
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <button className="rounded-full border border-emerald-500/70 bg-emerald-500/10 px-3 py-1.5 text-[11px] font-semibold text-emerald-100 hover:bg-emerald-500/20 transition-colors">
                Cleared for OMS · Anesthesia consult completed
              </button>

              <div className="flex flex-col items-end text-[10px] text-slate-400">
                <span>Medical alerts already reviewed today.</span>
                <span>Next: confirm fasting status & airway assessment.</span>
              </div>
            </div>
          </div>
        </section>

        {/* LAYOUT PRINCIPAL */}
        <div className="grid gap-5 lg:grid-cols-[1.7fr,1.2fr]">
          {/* COLUMNA IZQUIERDA */}
          <div className="space-y-5">
            {/* CONTEXTO DEL CASO */}
            <Card
              title="Surgical Case Context & Indication"
              subtitle="Why this patient is in OMS, hospital setting and linkage with radiology & EMR."
              badge="Context"
            >
              <div className="grid gap-3 text-[11px] md:grid-cols-4">
                <div className="md:col-span-2">
                  <label className="mb-1 block font-medium text-slate-300">
                    Patient (link EMR)
                  </label>
                  <button className="w-full rounded-full border border-slate-700 bg-slate-900/80 px-3 py-2 text-[11px] text-slate-200 hover:border-rose-400 hover:text-rose-100">
                    Select patient from EMR
                  </button>
                </div>
                <div>
                  <label className="mb-1 block font-medium text-slate-300">
                    OMS case ID
                  </label>
                  <Input placeholder="ADIE-OMS-0001" />
                </div>
                <div>
                  <label className="mb-1 block font-medium text-slate-300">
                    Setting
                  </label>
                  <Select defaultValue="">
                    <option value="">Select…</option>
                    <option>Clinic / office</option>
                    <option>Ambulatory surgery center</option>
                    <option>Hospital OR · outpatient</option>
                    <option>Hospital in-patient</option>
                    <option>ER / trauma bay</option>
                  </Select>
                </div>
              </div>

              <div className="mt-3 grid gap-3 text-[11px] md:grid-cols-3">
                <div>
                  <label className="mb-1 block font-medium text-slate-300">
                    Primary OMS diagnosis
                  </label>
                  <Select defaultValue="">
                    <option value="">Select…</option>
                    <option>Impacted third molars</option>
                    <option>Multiple extractions / alveoloplasty</option>
                    <option>Implant surgery (single / multiple)</option>
                    <option>Sinus lift / bone graft</option>
                    <option>Orthognathic surgery</option>
                    <option>Facial trauma</option>
                    <option>Pathology / cyst / tumor</option>
                    <option>TMJ surgery</option>
                    <option>Other OMS procedure</option>
                  </Select>
                </div>
                <div>
                  <label className="mb-1 block font-medium text-slate-300">
                    Urgency level
                  </label>
                  <Select defaultValue="">
                    <option value="">Select…</option>
                    <option>Elective</option>
                    <option>Urgent (within 24–72h)</option>
                    <option>Emergency (same day)</option>
                  </Select>
                </div>
                <div>
                  <label className="mb-1 block font-medium text-slate-300">
                    Radiology link
                  </label>
                  <Input placeholder="CBCT / CT / MRI study ID or URL…" />
                </div>
              </div>

              <div className="mt-3 grid gap-3 text-[11px] md:grid-cols-2">
                <div>
                  <label className="mb-1 block font-medium text-slate-300">
                    Surgical indication & objectives
                  </label>
                  <TextArea
                    rows={3}
                    placeholder="Pain, infection, cyst removal, implant placement, occlusal correction, airway improvement..."
                  />
                </div>
                <div>
                  <label className="mb-1 block font-medium text-slate-300">
                    Medical / specialist coordination
                  </label>
                  <TextArea
                    rows={3}
                    placeholder="Internal medicine, cardiology, hematology, anesthesiology, oncology, ICU team..."
                  />
                </div>
              </div>
            </Card>

            {/* ANESTESIA Y MONITOREO */}
            <Card
              title="Anesthesia, Sedation & Perioperative Monitoring"
              subtitle="ASA, airway, drugs, times and intra-op events — ready for hospital audits."
              badge="Anesthesia"
            >
              <div className="grid gap-3 text-[11px] md:grid-cols-4">
                <div>
                  <label className="mb-1 block font-medium text-slate-300">
                    ASA classification
                  </label>
                  <Select defaultValue="">
                    <option value="">Select…</option>
                    <option>ASA I</option>
                    <option>ASA II</option>
                    <option>ASA III</option>
                    <option>ASA IV</option>
                  </Select>
                </div>
                <div>
                  <label className="mb-1 block font-medium text-slate-300">
                    Anesthesia type
                  </label>
                  <Select defaultValue="">
                    <option value="">Select…</option>
                    <option>Local anesthesia only</option>
                    <option>Local + minimal sedation (oral / inhalation)</option>
                    <option>Local + IV moderate sedation</option>
                    <option>Deep sedation</option>
                    <option>General anesthesia</option>
                  </Select>
                </div>
                <div>
                  <label className="mb-1 block font-medium text-slate-300">
                    Anesthesia provider
                  </label>
                  <Select defaultValue="">
                    <option value="">Select…</option>
                    <option>OMS with sedation permit</option>
                    <option>Anesthesiologist (MD)</option>
                    <option>CRNA / nurse anesthetist</option>
                    <option>Other</option>
                  </Select>
                </div>
                <div>
                  <label className="mb-1 block font-medium text-slate-300">
                    Airway assessment (Mallampati)
                  </label>
                  <Select defaultValue="">
                    <option value="">Select…</option>
                    <option>Class I</option>
                    <option>Class II</option>
                    <option>Class III</option>
                    <option>Class IV</option>
                  </Select>
                </div>
              </div>

              <div className="mt-3 grid gap-3 text-[11px] md:grid-cols-4">
                <div>
                  <label className="mb-1 block font-medium text-slate-300">
                    NPO / fasting status
                  </label>
                  <Select defaultValue="">
                    <option value="">Select…</option>
                    <option>≥ 8h solids / 2h clear liquids</option>
                    <option>Not fully fasting · note risk</option>
                    <option>Emergency · NPO not possible</option>
                  </Select>
                </div>
                <div>
                  <label className="mb-1 block font-medium text-slate-300">
                    BMI (kg/m²)
                  </label>
                  <Input placeholder="e.g. 27.5" />
                </div>
                <div>
                  <label className="mb-1 block font-medium text-slate-300">
                    Start time (anesthesia)
                  </label>
                  <Input type="time" />
                </div>
                <div>
                  <label className="mb-1 block font-medium text-slate-300">
                    End time (anesthesia)
                  </label>
                  <Input type="time" />
                </div>
              </div>

              <div className="mt-3 grid gap-3 text-[11px] md:grid-cols-3">
                <div>
                  <label className="mb-1 block font-medium text-slate-300">
                    Sedation / GA agents
                  </label>
                  <TextArea
                    rows={3}
                    placeholder="Propofol, midazolam, fentanyl, ketamine, dexmedetomidine, sevoflurane, nitrous oxide..."
                  />
                </div>
                <div>
                  <label className="mb-1 block font-medium text-slate-300">
                    Local anesthetics
                  </label>
                  <TextArea
                    rows={3}
                    placeholder="Articaine 4% 1:100k · volume, lidocaine 2% 1:100k, plain mepivacaine · total mg..."
                  />
                </div>
                <div>
                  <label className="mb-1 block font-medium text-slate-300">
                    Monitoring & intra-op events
                  </label>
                  <TextArea
                    rows={3}
                    placeholder="Continuous ECG, SpO₂, NIBP; hypotension, desaturation, arrhythmia, airway difficulty, conversion to GA..."
                  />
                </div>
              </div>
            </Card>

            {/* ANESTESIA LOCAL & HEMOSTASIA */}
            <Card
              title="Local Anesthesia, Hemostasis & Biologics"
              subtitle="Blocks, vasoconstrictors, PRP/PRF and hemostatic strategies."
              badge="Adjuncts"
            >
              <div className="grid gap-3 text-[11px] md:grid-cols-3">
                <div>
                  <label className="mb-1 block font-medium text-slate-300">
                    Blocks / infiltration
                  </label>
                  <Select defaultValue="">
                    <option value="">Select…</option>
                    <option>IAN + lingual block</option>
                    <option>PSA + infraorbital + palatal</option>
                    <option>Gow-Gates / Akinosi</option>
                    <option>Local infiltration only</option>
                    <option>Combination / other</option>
                  </Select>
                </div>
                <div>
                  <label className="mb-1 block font-medium text-slate-300">
                    Vasoconstrictor strategy
                  </label>
                  <Select defaultValue="">
                    <option value="">Select…</option>
                    <option>Epinephrine 1:100k</option>
                    <option>Epinephrine 1:200k</option>
                    <option>Levonordefrin</option>
                    <option>No vasoconstrictor</option>
                    <option>Mixed (document in notes)</option>
                  </Select>
                </div>
                <div>
                  <label className="mb-1 block font-medium text-slate-300">
                    Hemostatic agents
                  </label>
                  <Select defaultValue="">
                    <option value="">Select…</option>
                    <option>Gauze + pressure only</option>
                    <option>Oxidized cellulose / collagen plug</option>
                    <option>Gel foam / surgicel</option>
                    <option>Tranexamic acid (local)</option>
                    <option>Electrocautery</option>
                  </Select>
                </div>
              </div>

              <div className="mt-3 grid gap-3 text-[11px] md:grid-cols-2">
                <div>
                  <label className="mb-1 block font-medium text-slate-300">
                    PRP / PRF / biologics
                  </label>
                  <TextArea
                    rows={3}
                    placeholder="PRF membranes (number, site), PRP injection, BMP, growth factors, use with grafts..."
                  />
                </div>
                <div>
                  <label className="mb-1 block font-medium text-slate-300">
                    Estimated blood loss & fluids
                  </label>
                  <TextArea
                    rows={3}
                    placeholder="EBL (mL), crystalloids, colloids, transfusions (RBC, platelets, plasma)..."
                  />
                </div>
              </div>
            </Card>
          </div>

          {/* COLUMNA DERECHA */}
          <div className="space-y-5">
            {/* MAPA DE PROCEDIMIENTOS */}
            <Card
              title="Surgical Procedure Map"
              subtitle="Per-site overview of the technique, access, osteotomy and closure."
              badge="Surgery Map"
            >
              <div className="mb-2 text-[11px] text-slate-400">
                Each row will eventually be generated from the Dental Chart +
                Radiology (third molars, cysts, fractures, implants).
              </div>

              <div className="grid gap-2 text-[11px]">
                {demoSites.map((site) => (
                  <div
                    key={site}
                    className="grid grid-cols-[minmax(0,0.5fr),minmax(0,1.2fr),minmax(0,1.3fr),minmax(0,1.1fr)] gap-2 rounded-xl border border-slate-800 bg-slate-950/80 px-3 py-2"
                  >
                    <div className="flex flex-col justify-center text-slate-200">
                      <span className="inline-flex items-center justify-center rounded-full bg-rose-500/15 px-2 py-0.5 text-[10px] font-semibold text-rose-200">
                        {site}
                      </span>
                      <span className="text-[10px] text-slate-500">
                        Tooth / region
                      </span>
                    </div>
                    <Select defaultValue="">
                      <option value="">Procedure</option>
                      <option>Simple extraction</option>
                      <option>Surgical extraction (3rd molar)</option>
                      <option>Cyst / lesion enucleation</option>
                      <option>Apicoectomy</option>
                      <option>Open reduction / fixation</option>
                      <option>Implant placement</option>
                    </Select>
                    <Select defaultValue="">
                      <option value="">Approach</option>
                      <option>Envelope flap</option>
                      <option>Triangular flap</option>
                      <option>Submarginal flap</option>
                      <option>Intraoral incision</option>
                      <option>Extraoral incision</option>
                    </Select>
                    <Select defaultValue="">
                      <option value="">Closure / status</option>
                      <option>Primary closure</option>
                      <option>Secondary intention</option>
                      <option>Drain placed</option>
                      <option>Exposed membrane</option>
                      <option>Staged / partial completion</option>
                    </Select>
                  </div>
                ))}
              </div>

              <p className="mt-2 text-[10px] text-slate-500">
                Future step: clicking a row will open the full 3D view (CT /
                CBCT), photos and implant grid for that site.
              </p>
            </Card>

            {/* IMPLANTES, INJERTOS & REGENERACIÓN */}
            <Card
              title="Implants, Bone Grafts & Regeneration"
              subtitle="Integrates implant surgery, graft types, membranes and sinus procedures."
              badge="Implants & Grafts"
            >
              <div className="grid gap-3 text-[11px] md:grid-cols-2">
                <div>
                  <label className="mb-1 block font-medium text-slate-300">
                    Implant surgery role
                  </label>
                  <Select defaultValue="">
                    <option value="">Select…</option>
                    <option>No implants in this procedure</option>
                    <option>Single implant placement</option>
                    <option>Multiple implants (quadrant)</option>
                    <option>Full-arch implants</option>
                    <option>Stage II / uncovering only</option>
                  </Select>
                </div>
                <div>
                  <label className="mb-1 block font-medium text-slate-300">
                    Implant system
                  </label>
                  <Select defaultValue="">
                    <option value="">Select…</option>
                    <option>Nobel Biocare</option>
                    <option>Straumann</option>
                    <option>Zimmer / Biomet</option>
                    <option>Implant Direct</option>
                    <option>Other system</option>
                  </Select>
                </div>
              </div>

              <div className="mt-3 grid gap-3 text-[11px] md:grid-cols-3">
                <div>
                  <label className="mb-1 block font-medium text-slate-300">
                    Bone graft type
                  </label>
                  <Select defaultValue="">
                    <option value="">Select…</option>
                    <option>Autogenous (intraoral)</option>
                    <option>Autogenous (extraoral)</option>
                    <option>Allograft</option>
                    <option>Xenograft</option>
                    <option>Alloplast / synthetic</option>
                    <option>Combination graft</option>
                  </Select>
                </div>
                <div>
                  <label className="mb-1 block font-medium text-slate-300">
                    Membrane
                  </label>
                  <Select defaultValue="">
                    <option value="">Select…</option>
                    <option>Collagen resorbable</option>
                    <option>Non-resorbable PTFE</option>
                    <option>Titanium mesh</option>
                    <option>No membrane</option>
                  </Select>
                </div>
                <div>
                  <label className="mb-1 block font-medium text-slate-300">
                    Sinus procedure
                  </label>
                  <Select defaultValue="">
                    <option value="">Select…</option>
                    <option>None</option>
                    <option>Crestal sinus lift</option>
                    <option>Lateral window sinus lift</option>
                    <option>Sinus repair / membrane perforation</option>
                  </Select>
                </div>
              </div>

              <div className="mt-3 grid gap-3 text-[11px] md:grid-cols-2">
                <div>
                  <label className="mb-1 block font-medium text-slate-300">
                    Graft / implant notes
                  </label>
                  <TextArea
                    rows={3}
                    placeholder="Sites grafted, implant dimensions and torque, primary stability, staged vs immediate approach..."
                  />
                </div>
                <div>
                  <label className="mb-1 block font-medium text-slate-300">
                    Ridge / torus surgery
                  </label>
                  <TextArea
                    rows={3}
                    placeholder="Ridge augmentation, alveoloplasty, mandibular torus removal, palatal torus, vestibuloplasty..."
                  />
                </div>
              </div>
            </Card>

            {/* POSTOP & COMPLICACIONES */}
            <Card
              title="Post-operative Status, Complications & Follow-up"
              subtitle="How the patient left the OR and what ADIE expects in recovery."
              badge="Post-op"
            >
              <div className="grid gap-3 text-[11px] md:grid-cols-3">
                <div>
                  <label className="mb-1 block font-medium text-slate-300">
                    Immediate status
                  </label>
                  <Select defaultValue="">
                    <option value="">Select…</option>
                    <option>Stable · discharged home</option>
                    <option>Stable · recovery room</option>
                    <option>Observation 23h</option>
                    <option>Admitted to ward</option>
                    <option>Transferred to ICU</option>
                  </Select>
                </div>
                <div>
                  <label className="mb-1 block font-medium text-slate-300">
                    Surgical complications
                  </label>
                  <Select defaultValue="">
                    <option value="">Select…</option>
                    <option>No complications</option>
                    <option>Minor · managed intra-op</option>
                    <option>Post-op bleeding</option>
                    <option>Infection / dry socket risk</option>
                    <option>Nerve injury suspected</option>
                    <option>Major event · report completed</option>
                  </Select>
                </div>
                <div>
                  <label className="mb-1 block font-medium text-slate-300">
                    Follow-up plan
                  </label>
                  <Select defaultValue="">
                    <option value="">Select…</option>
                    <option>24–48h post-op call</option>
                    <option>1 week suture removal</option>
                    <option>3–4 weeks radiographic control</option>
                    <option>Long-term implant / graft review</option>
                    <option>Custom protocol</option>
                  </Select>
                </div>
              </div>

              <div className="mt-3 grid gap-3 text-[11px] md:grid-cols-2">
                <div>
                  <label className="mb-1 block font-medium text-slate-300">
                    Medications & instructions
                  </label>
                  <TextArea
                    rows={3}
                    placeholder="Analgesics, NSAIDs, steroids, antibiotics, mouth rinses, antiemetics; diet, ice/heat, activity restrictions, emergency signs..."
                  />
                </div>
                <div>
                  <label className="mb-1 block font-medium text-slate-300">
                    Notes for referring dentist / medical team
                  </label>
                  <TextArea
                    rows={3}
                    placeholder="Implant stability, graft coverage, nerve status, pathology report pending, coordination with prostho and perio..."
                  />
                </div>
              </div>
            </Card>

            {/* AI / FUTURO */}
            <Card
              title="ADIE AI · OMS, Implants & Trauma (Future Layer)"
              subtitle="How this surgical hub will talk to AI, Radiology and BI."
              badge="AI Roadmap"
            >
              <ul className="space-y-1 text-[11px] text-slate-400">
                <li>
                  • AI-assisted risk score combining ASA, airway, meds and
                  planned procedures to suggest anesthesia level.
                </li>
                <li>
                  • Automatic mapping of third molars, implants, grafts and
                  trauma from CBCT / CT into this OMS grid.
                </li>
                <li>
                  • Outcomes analytics for complications, nerve injuries,
                  implant success and graft survival.
                </li>
                <li>
                  • Structured surgical summary exportable to hospital EMR and
                  to referring dentists.
                </li>
              </ul>

              <div className="mt-3 flex flex-wrap gap-2 text-[11px]">
                <button className="rounded-full border border-rose-500 bg-rose-500/10 px-3 py-1 text-rose-200 hover:bg-rose-500/20">
                  Simulate AI OMS summary
                </button>
                <button className="rounded-full border border-slate-700 bg-slate-900/80 px-3 py-1 text-slate-200 hover:border-emerald-400 hover:text-emerald-100">
                  Preview outcomes BI (mock)
                </button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}
