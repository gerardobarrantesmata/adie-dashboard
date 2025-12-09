"use client";

import React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

type RiskTone = "ok" | "warn" | "critical";

type SpecialtyBase = {
  id: string;
  title: string;
  code: string;
  lastUpdate: string;
  lastProcedure: string;
  statusLabel: string;
  tone: RiskTone;
  keyPoints: string[];
  baseRoute: string;
};

type SpecialtyWithRoute = SpecialtyBase & { route: string };

const SPECIALTIES_BASE: SpecialtyBase[] = [
  {
    id: "perio",
    title: "Periodontics · Maintenance & Surgery",
    code: "PERIO",
    lastUpdate: "2025-11-28",
    lastProcedure: "Quadrant SRP + maintenance UL/LL",
    statusLabel: "Stage III · Grade B – maintenance overdue",
    tone: "warn",
    keyPoints: [
      "Last BOP 28%, residual pockets on UL molars.",
      "Peri-implant mucositis ruled out on UL full-arch.",
      "Recommended recall: 3–4 months, high-risk protocol.",
    ],
    baseRoute: "/specialties/periodontics",
  },
  {
    id: "endo",
    title: "Endodontics · Root Canal Status",
    code: "ENDO",
    lastUpdate: "2025-10-05",
    lastProcedure: "Retreatment tooth #16 – MB2 completed",
    statusLabel: "All treated canals in green safety zone",
    tone: "ok",
    keyPoints: [
      "Tooth #16: WL–obturation 0.7 mm average short of apex.",
      "No current symptoms, PA lesion shrinking on latest CBCT.",
      "Next control: radiographic check at 12 months.",
    ],
    baseRoute: "/specialties/endodontics",
  },
  {
    id: "implants-prostho",
    title: "Implants & Prosthodontics · Fixed Rehab",
    code: "IMPLANTS / PROSTHO",
    lastUpdate: "2025-09-20",
    lastProcedure: "Full-arch zirconia prosthesis UL delivered",
    statusLabel: "Implants stable · prosthesis in function",
    tone: "ok",
    keyPoints: [
      "6 implants UL, insertion torque ≥ 40 Ncm, no mobility.",
      "Zirconia full-arch with mutually protected occlusion.",
      "Nightguard indicated due to bruxism – in fabrication.",
    ],
    baseRoute: "/specialties/implants",
  },
  {
    id: "oms",
    title: "Oral & Maxillofacial Surgery",
    code: "OMS",
    lastUpdate: "2025-08-03",
    lastProcedure: "Bilateral mandibular tori removal",
    statusLabel: "Healed without complications",
    tone: "ok",
    keyPoints: [
      "ASA II – controlled hypertension, cleared by MD.",
      "IV sedation uneventful, total time 55 minutes.",
      "Next review only if symptoms or prostho adjustments.",
    ],
    baseRoute: "/specialties/oral-surgery",
  },
  {
    id: "ortho",
    title: "Orthodontics · Alignment & Space",
    code: "ORTHO",
    lastUpdate: "2025-07-15",
    lastProcedure: "Clear aligner control – stage 10/18",
    statusLabel: "Active ortho treatment – good cooperation",
    tone: "ok",
    keyPoints: [
      "Mild Class II camouflage with aligners.",
      "IPR performed between 13–23, well tolerated.",
      "Estimated finishing in 6–8 months if compliance remains.",
    ],
    baseRoute: "/specialties/orthodontics",
  },
  {
    id: "pedia",
    title: "Pediatric Dentistry · Growth & Prevention",
    code: "PEDIA",
    lastUpdate: "2025-06-02",
    lastProcedure: "Fluoride varnish + sealants on 36/46",
    statusLabel: "Moderate caries risk – family educated",
    tone: "warn",
    keyPoints: [
      "Bottle at night discontinued, sugars still > 3x/day.",
      "Mixed dentition – early crowding on lower incisors.",
      "Recall every 6 months with high-fluoride toothpaste.",
    ],
    baseRoute: "/specialties/pediatric",
  },
  {
    id: "general",
    title: "General Dentistry · Restorations & Emergencies",
    code: "GENERAL",
    lastUpdate: "2025-11-02",
    lastProcedure: "Composite replacement tooth #25 – cervical lesion",
    statusLabel: "Most restorations stable · no acute issues",
    tone: "ok",
    keyPoints: [
      "Composite restorations checked – marginal integrity acceptable.",
      "No current pain, emergency risk considered low.",
      "Next clinical control aligned with Perio / recall plan.",
    ],
    baseRoute: "/specialties/general",
  },
];

function riskToneClasses(tone: RiskTone): string {
  if (tone === "ok")
    return "border-emerald-400 bg-emerald-500/10 text-emerald-200";
  if (tone === "warn")
    return "border-amber-400 bg-amber-500/10 text-amber-200";
  return "border-rose-400 bg-rose-500/10 text-rose-200";
}

export default function PatientMasterRecordPage() {
  const params = useParams();
  const patientId = (params?.patientId as string) || "ADIE-PT-0001";

  const specialties: SpecialtyWithRoute[] = React.useMemo(
    () =>
      SPECIALTIES_BASE.map((s) => ({
        ...s,
        route: `${s.baseRoute}?patientId=${encodeURIComponent(patientId)}`,
      })),
    [patientId]
  );

  return (
    <main className="min-h-screen bg-slate-950 text-slate-50">
      <div className="mx-auto max-w-6xl px-4 pb-24 pt-8">
        {/* HEADER SUPERIOR */}
        <header className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-[11px] uppercase tracking-[0.28em] text-sky-400">
              Master EMR · Patient overview
            </p>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight md:text-3xl">
              Master patient record
            </h1>
            <p className="mt-2 max-w-2xl text-xs text-slate-400 md:text-sm">
              Unified clinical view for this patient. Later we will pull real
              data from General, Perio, Ortho, Implants, OMS and the hospital
              EMR — orchestrated in one timeline.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-end gap-2 text-[11px]">
            <Link
              href="/patients"
              className="rounded-full border border-slate-700 bg-slate-900/70 px-3 py-1.5 text-slate-200 hover:border-sky-400 hover:text-sky-100"
            >
              ← Patients list
            </Link>
            <Link
              href="/dashboard"
              className="rounded-full border border-slate-700 bg-slate-900/70 px-3 py-1.5 text-slate-200 hover:border-emerald-400 hover:text-emerald-100"
            >
              Dashboard
            </Link>
            <Link
              href={`/specialties?patientId=${encodeURIComponent(patientId)}`}
              className="rounded-full border border-sky-500 bg-sky-500/10 px-3 py-1.5 text-sky-100 hover:bg-sky-500/20"
            >
              Open Specialties Hub
            </Link>
          </div>
        </header>

        {/* BLOQUE SUPERIOR: FOTO + RESUMEN + RIESGO */}
        <section className="mb-6 rounded-2xl border border-slate-800 bg-slate-950/80 px-5 py-4 shadow-[0_20px_70px_rgba(15,23,42,0.9)]">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            {/* FOTO + IDENTIDAD */}
            <div className="flex flex-1 gap-4">
              <div className="flex flex-col items-center gap-2">
                <div className="flex h-16 w-16 items-center justify-center rounded-full border border-slate-700 bg-slate-900 text-[11px] text-slate-400">
                  Photo
                </div>
                <button className="rounded-full border border-slate-700 bg-slate-900/80 px-3 py-1 text-[10px] text-slate-200 hover:border-sky-400 hover:text-sky-100">
                  ↑ Upload
                </button>
              </div>

              <div className="flex-1 text-xs">
                <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500">
                  Master patient record
                </p>
                <div className="mt-1 flex flex-wrap items-center gap-2">
                  <p className="text-sm font-semibold text-slate-100">
                    John / Jane Doe
                  </p>
                  <span className="rounded-full border border-emerald-400 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.18em] text-emerald-200">
                    VIP
                  </span>
                  <span className="rounded-full border border-amber-400 bg-amber-500/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.18em] text-amber-200">
                    Financial hold · Review balance
                  </span>
                  <span className="rounded-full border border-sky-400 bg-sky-500/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.18em] text-sky-100">
                    All specialties compiled
                  </span>
                </div>

                <div className="mt-2 grid gap-1 text-[11px] text-slate-300 md:grid-cols-2">
                  <p>
                    <span className="text-slate-500">ADIE ID · </span>
                    <span className="font-mono text-sky-300">
                      {patientId}
                    </span>{" "}
                    · <span className="text-slate-500">Hospital MRN · </span>
                    <span className="font-mono text-slate-200">123456-01</span>
                  </p>
                  <p>
                    <span className="text-slate-500">DOB · </span>1980-02-01 ·{" "}
                    <span className="text-slate-500">Age · </span>45y ·{" "}
                    <span className="text-slate-500">Gender · </span>Male
                  </p>
                  <p>
                    <span className="text-slate-500">Last visit · </span>
                    2025-12-01 (OMS) · Orlando, FL
                  </p>
                  <p>
                    <span className="text-slate-500">Systemic flags · </span>
                    Hypertension (controlled), BMI 27, no anticoagulants.
                  </p>
                </div>
              </div>
            </div>

            {/* RIESGO GLOBAL / BOTONES RÁPIDOS */}
            <div className="mt-2 w-full max-w-xs rounded-2xl border border-slate-800 bg-slate-950/90 px-4 py-3 text-[11px] md:mt-0">
              <p className="text-[10px] uppercase tracking-[0.18em] text-slate-500">
                Global risk score
              </p>
              <p className="mt-1 text-[11px] text-slate-300">
                Clinical risk index:{" "}
                <span className="font-semibold text-amber-200">72 / 100</span>
              </p>
              <p className="text-[11px] text-slate-400">
                Moderate · perio + implants + systemic.
              </p>

              <div className="mt-2 h-2 w-full overflow-hidden rounded-full border border-slate-800 bg-slate-900">
                <div className="h-full w-[72%] rounded-full bg-gradient-to-r from-emerald-400 via-amber-400 to-rose-500" />
              </div>

              <p className="mt-2 text-[10px] text-slate-500">
                Future: this bar will be calculated automatically from all
                specialties, BI rules and CDS.
              </p>

              <div className="mt-3 flex flex-wrap gap-2">
                <Link
                  href={`/specialties?patientId=${encodeURIComponent(
                    patientId
                  )}`}
                  className="rounded-full border border-sky-500 bg-sky-500/10 px-3 py-1 text-[11px] text-sky-100 hover:bg-sky-500/20"
                >
                  Open Specialties Hub
                </Link>
                <Link
                  href="/patients"
                  className="rounded-full border border-slate-700 bg-slate-900/80 px-3 py-1 text-[11px] text-slate-200 hover:border-sky-400 hover:text-sky-100"
                >
                  ← Patients list
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* CUERPO: COLUMNA IZQUIERDA + DERECHA */}
        <div className="grid gap-5 lg:grid-cols-[1.5fr,1.3fr]">
          {/* COLUMNA IZQUIERDA */}
          <div className="space-y-5">
            {/* PROBLEMAS ACTIVOS */}
            <section className="rounded-2xl border border-slate-800 bg-slate-950/80 px-5 py-4">
              <div className="mb-2 flex items-center justify-between">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                    Active problems & diagnoses
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Unified problem list from General, Perio, OMS, Medical EMR
                    and more.
                  </p>
                </div>
                <button className="rounded-full border border-slate-700 bg-slate-900/70 px-3 py-1 text-[10px] text-slate-200 hover:border-sky-400 hover:text-sky-100">
                  Clinical summary
                </button>
              </div>

              <div className="space-y-1 text-[11px]">
                {[
                  "Generalized periodontitis Stage III, Grade B.",
                  "Post-endodontic tooth #16 – asymptomatic.",
                  "Full-arch prosthesis UL on implants.",
                  "History of bilateral mandibular tori removal.",
                  "Hypertension · controlled.",
                  "Former smoker · quit 5 years ago.",
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950/90 px-3 py-1.5"
                  >
                    <span className="text-slate-200">• {item}</span>
                    <span className="text-[10px] text-slate-500">
                      Problem ID: P-{idx + 1}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            {/* RIESGO SISTÉMICO + PERIO */}
            <section className="grid gap-4 md:grid-cols-2">
              {/* SISTÉMICO */}
              <div className="rounded-2xl border border-slate-800 bg-slate-950/80 px-4 py-4 text-[11px]">
                <p className="text-[10px] uppercase tracking-[0.18em] text-slate-500">
                  Systemic risk & behavioral snapshot
                </p>
                <p className="mt-1 text-slate-300">
                  ASA II · controlled hypertension · low anesthetic risk.
                </p>

                <div className="mt-2 space-y-1 text-slate-300">
                  <p>
                    <span className="text-slate-500">ASA Class · </span>ASA II –
                    controlled hypertension.
                  </p>
                  <p>
                    <span className="text-slate-500">Medications · </span>
                    Amlodipine 5 mg qd, no anticoagulants.
                  </p>
                  <p>
                    <span className="text-slate-500">Habits · </span>
                    Former smoker, occasional alcohol, no illicit drugs.
                  </p>
                </div>

                <p className="mt-3 text-[10px] text-slate-500">
                  Future: this box will sync directly with the Medical EMR and
                  anesthesia clearance forms.
                </p>
              </div>

              {/* PERIO SNAPSHOT */}
              <div className="rounded-2xl border border-slate-800 bg-slate-950/80 px-4 py-4 text-[11px]">
                <div className="mb-1 flex items-center justify-between">
                  <p className="text-[10px] uppercase tracking-[0.18em] text-slate-500">
                    Perio maintenance risk
                  </p>
                  <Link
                    href={`/specialties/periodontics?patientId=${encodeURIComponent(
                      patientId
                    )}`}
                    className="rounded-full border border-emerald-500 bg-emerald-500/10 px-3 py-1 text-[10px] text-emerald-200 hover:bg-emerald-500/20"
                  >
                    Perio module
                  </Link>
                </div>

                <p className="text-slate-300">
                  <span className="font-semibold text-amber-200">
                    Moderate risk · maintenance overdue
                  </span>
                  .
                </p>
                <p className="text-[11px] text-slate-400">
                  Sites ≥4mm: 32% · BOP: 20% · extraction/implant stable.
                </p>

                <ul className="mt-2 list-disc pl-4 text-slate-300">
                  <li>Residual pockets UL molars, especially around implants.</li>
                  <li>
                    Last maintenance 9 months ago – recall should be 3–4 months.
                  </li>
                  <li>
                    Home care improving but still variable; needs reinforcement.
                  </li>
                </ul>
              </div>
            </section>

            {/* FINANZAS + TIMELINE VISITAS */}
            <section className="grid gap-4 md:grid-cols-2">
              {/* FINANCIAL */}
              <div className="rounded-2xl border border-slate-800 bg-slate-950/80 px-4 py-4 text-[11px]">
                <div className="mb-2 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.18em] text-slate-500">
                      Financial & insurance snapshot
                    </p>
                    <p className="text-[11px] text-slate-400">
                      Quick view of balances, insurance and authorizations.
                    </p>
                  </div>
                  <button className="rounded-full border border-slate-700 bg-slate-900/70 px-3 py-1 text-[10px] text-slate-200 hover:border-amber-400 hover:text-amber-100">
                    Billing
                  </button>
                </div>

                <div className="space-y-1 text-slate-300">
                  <p>
                    <span className="text-slate-500">Primary insurance · </span>
                    Delta Dental PPO
                  </p>
                  <p>
                    <span className="text-slate-500">
                      Annual max remaining ·{" "}
                    </span>
                    $850 · implant coverage partial.
                  </p>
                  <p>
                    <span className="text-slate-500">Open balance · </span>
                    $179.00 · plan: 3 installments.
                  </p>
                </div>

                <button className="mt-3 w-full rounded-full border border-slate-700 bg-slate-900/80 px-3 py-1.5 text-[11px] text-slate-200 hover:border-amber-400 hover:text-amber-100">
                  Open full billing & insurance
                </button>
              </div>

              {/* TIMELINE */}
              <div className="rounded-2xl border border-slate-800 bg-slate-950/80 px-4 py-4 text-[11px]">
                <div className="mb-2 flex items-center justify-between">
                  <p className="text-[10px] uppercase tracking-[0.18em] text-slate-500">
                    Last visits timeline
                  </p>
                  <button className="rounded-full border border-slate-700 bg-slate-900/70 px-3 py-1 text-[10px] text-slate-200 hover:border-sky-400 hover:text-sky-100">
                    Timeline
                  </button>
                </div>

                <ul className="space-y-1 text-slate-300">
                  <li>
                    <span className="font-mono text-slate-400">
                      2025-12-01 ·
                    </span>{" "}
                    OMS – full-arch surgery control & suture removal.
                  </li>
                  <li>
                    <span className="font-mono text-slate-400">
                      2025-09-20 ·
                    </span>{" "}
                    Prostho – zirconia full-arch delivery & occlusal check.
                  </li>
                  <li>
                    <span className="font-mono text-slate-400">
                      2025-06-10 ·
                    </span>{" "}
                    Perio – maintenance + SRP UR/UL.
                  </li>
                  <li>
                    <span className="font-mono text-slate-400">
                      2025-04-03 ·
                    </span>{" "}
                    Endo – retreatment #16 MB2 + recall.
                  </li>
                </ul>

                <p className="mt-2 text-[10px] text-slate-500">
                  Future: this list will be auto-generated from the full ADIE
                  timeline (appointments, encounters, procedures).
                </p>
              </div>
            </section>
          </div>

          {/* COLUMNA DERECHA: ESPECIALIDADES */}
          <div className="space-y-4">
            {specialties.map((spec) => (
              <section
                key={spec.id}
                className="rounded-2xl border border-slate-800 bg-slate-950/80 px-4 py-4 text-[11px]"
              >
                <div className="mb-2 flex items-start justify-between gap-2">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.18em] text-slate-500">
                      {spec.code}
                    </p>
                    <p className="text-sm font-semibold text-slate-100">
                      {spec.title}
                    </p>
                    <p className="mt-1 text-[11px] text-slate-400">
                      Last update: {spec.lastUpdate} · Last procedure:{" "}
                      {spec.lastProcedure}
                    </p>
                  </div>
                  <span
                    className={`mt-1 inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] ${riskToneClasses(
                      spec.tone
                    )}`}
                  >
                    {spec.statusLabel}
                  </span>
                </div>

                <ul className="mb-3 list-disc pl-4 text-slate-300">
                  {spec.keyPoints.map((point, idx) => (
                    <li key={idx}>{point}</li>
                  ))}
                </ul>

                <div className="flex justify-between gap-2">
                  <Link
                    href={spec.route}
                    className="rounded-full border border-sky-500 bg-sky-500/10 px-3 py-1 text-[11px] text-sky-100 hover:bg-sky-500/20"
                  >
                    Open module
                  </Link>
                  <span className="self-center text-[10px] text-slate-500">
                    Patient: <span className="font-mono">{patientId}</span>
                  </span>
                </div>
              </section>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
