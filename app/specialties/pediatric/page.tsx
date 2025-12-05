"use client";

import React, { useState } from "react";
import Link from "next/link";

type ToothStatus =
  | "sound"
  | "caries"
  | "restored"
  | "sealed"
  | "extracted"
  | "erupting"
  | "missing";

const TOOTH_STATUS_OPTIONS: { value: ToothStatus; label: string }[] = [
  { value: "sound", label: "Sound" },
  { value: "caries", label: "Caries" },
  { value: "restored", label: "Restored" },
  { value: "sealed", label: "Sealed" },
  { value: "erupting", label: "Erupting" },
  { value: "extracted", label: "Extracted" },
  { value: "missing", label: "Missing" },
];

// Odontograma temporal universal: A–T
const PRIMARY_UPPER: string[] = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
const PRIMARY_LOWER: string[] = ["T", "S", "R", "Q", "P", "O", "N", "M", "L", "K"];

// Erupción permanente rápida (solo mapa simple)
const PERMANENT_ERUPTION_TEETH: string[] = [
  "Permanent 6s",
  "Permanent 1s/2s",
  "Premolars",
  "Canines",
  "Second molars",
];

function Select({ children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={`w-full rounded-lg border border-slate-700 bg-slate-900/60 px-3 py-2 text-xs text-slate-100 outline-none ring-sky-500/60 focus:border-sky-400 focus:ring-1 ${props.className ?? ""}`}
    >
      {children}
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
      className={`w-full rounded-lg border border-slate-700 bg-slate-900/60 px-3 py-2 text-xs text-slate-100 outline-none ring-sky-500/60 focus:border-sky-400 focus:ring-1 resize-none ${props.className ?? ""}`}
    />
  );
}

function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`w-full rounded-lg border border-slate-700 bg-slate-900/60 px-3 py-2 text-xs text-slate-100 outline-none ring-sky-500/60 focus:border-sky-400 focus:ring-1 ${props.className ?? ""}`}
    />
  );
}

function Card({
  title,
  subtitle,
  children,
  badge,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  badge?: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950/60 px-4 py-4 md:px-5 md:py-5">
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
          <span className="rounded-full border border-emerald-500/40 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.18em] text-emerald-300">
            {badge}
          </span>
        )}
      </div>
      {children}
    </div>
  );
}

export default function PediatricDentistryRecordPage() {
  // Estado simple para el odontograma temporal
  const [primaryToothStatus, setPrimaryToothStatus] = useState<
    Record<string, ToothStatus>
  >(() => {
    const initial: Record<string, ToothStatus> = {};
    [...PRIMARY_UPPER, ...PRIMARY_LOWER].forEach((tooth) => {
      initial[tooth] = "sound";
    });
    return initial;
  });

  // Estado para rápido mapa de erupción permanente
  const [eruptionStatus, setEruptionStatus] = useState<
    Record<string, string>
  >(() => {
    const initial: Record<string, string> = {};
    PERMANENT_ERUPTION_TEETH.forEach((key) => {
      initial[key] = "Age-appropriate";
    });
    return initial;
  });

  const handleToothStatusChange = (tooth: string, next: ToothStatus) => {
    setPrimaryToothStatus((prev) => ({ ...prev, [tooth]: next }));
  };

  const handleEruptionChange = (item: string, value: string) => {
    setEruptionStatus((prev) => ({ ...prev, [item]: value }));
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-50">
      <div className="mx-auto max-w-6xl px-4 pb-24 pt-8">
        {/* Header */}
        <header className="mb-8 flex items-center justify-between gap-4">
          <div>
            <p className="text-[11px] uppercase tracking-[0.28em] text-emerald-400">
              Specialties · Layer 3
            </p>
            <h1 className="mt-1 text-2xl md:text-3xl font-semibold tracking-tight text-slate-50">
              Pediatric Dentistry Clinical Record
            </h1>
            <p className="mt-2 max-w-xl text-xs md:text-sm text-slate-400">
              Complete pediatric chart to document chief complaint, history,
              behavior, risk assessment, eruption and temporal dentition status.
            </p>
          </div>

          <Link
            href="/specialties"
            className="rounded-full border border-slate-700 bg-slate-900/70 px-4 py-1.5 text-xs md:text-sm text-slate-200 hover:border-sky-500 hover:text-sky-100 transition-colors"
          >
            ← Back to Specialties Universe
          </Link>
        </header>

        {/* Patient context */}
        <section className="mb-6 rounded-2xl border border-slate-800 bg-slate-950/70 px-4 py-4 md:px-6 md:py-5">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-300">
                Patient & Case Context
              </h2>
              <p className="mt-1 text-[11px] text-slate-500">
                Link with EMR and define pediatric case metadata.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-[11px] md:text-xs">
              <button className="rounded-full border border-sky-500/60 bg-sky-500/10 px-3 py-1 font-medium text-sky-100 hover:bg-sky-500/20 transition">
                Select patient from EMR
              </button>
              <div className="flex items-center gap-1 text-slate-400">
                <span className="text-slate-500">ID:</span>
                <span className="font-mono text-[11px] text-slate-200">
                  ADIE-PED-0001
                </span>
              </div>
              <div className="flex items-center gap-1 text-slate-400">
                <span className="text-slate-500">Age:</span>
                <span>—</span>
              </div>
              <div className="flex items-center gap-1 text-slate-400">
                <span className="text-slate-500">Status:</span>
                <span className="rounded-full border border-emerald-500/40 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.16em] text-emerald-300">
                  Active care
                </span>
              </div>
            </div>
          </div>

          {/* Responsible adult */}
          <div className="mt-4 grid gap-4 md:grid-cols-[2.2fr,1.3fr]">
            <div className="grid gap-3 md:grid-cols-3">
              <div className="md:col-span-2">
                <label className="mb-1 block text-[11px] font-medium text-slate-300">
                  Responsible adult / parent
                </label>
                <Input placeholder="Full name of parent or legal guardian…" />
              </div>
              <div>
                <label className="mb-1 block text-[11px] font-medium text-slate-300">
                  Relationship
                </label>
                <Select defaultValue="">
                  <option value="">Select…</option>
                  <option>Mother</option>
                  <option>Father</option>
                  <option>Grandparent</option>
                  <option>Sibling</option>
                  <option>Legal guardian</option>
                  <option>Other caregiver</option>
                </Select>
              </div>
              <div>
                <label className="mb-1 block text-[11px] font-medium text-slate-300">
                  Contact phone
                </label>
                <Input placeholder="+1 (___) ___-____" />
              </div>
              <div>
                <label className="mb-1 block text-[11px] font-medium text-slate-300">
                  Accompanied by
                </label>
                <Input placeholder="Person present at the visit…" />
              </div>
              <div>
                <label className="mb-1 block text-[11px] font-medium text-slate-300">
                  Consent status
                </label>
                <Select defaultValue="complete">
                  <option value="complete">Signed – complete</option>
                  <option value="limited">Signed – limited</option>
                  <option value="pending">Pending</option>
                  <option value="refused">Refused</option>
                </Select>
              </div>
            </div>

            <div>
              <label className="mb-1 block text-[11px] font-medium text-slate-300">
                Medical alerts & pediatric notes
              </label>
              <TextArea placeholder="Asthma, congenital heart disease, medications, allergies, hospitalizations, special needs…" />
            </div>
          </div>
        </section>

        {/* Main grid */}
        <section className="grid gap-5 lg:grid-cols-[1.5fr,1.5fr]">
          {/* Left column: complaint, behavior, risk */}
          <div className="space-y-5">
            <Card
              title="Chief Complaint & History"
              subtitle="Document why the child is here today, plus relevant dental / medical history."
            >
              <div className="grid gap-3 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-[11px] font-medium text-slate-300">
                    Chief complaint (parent / child)
                  </label>
                  <TextArea placeholder="Example: Pain at night on lower left molar, difficulty chewing, swelling reported by parent…" />
                </div>
                <div>
                  <label className="mb-1 block text-[11px] font-medium text-slate-300">
                    Dental / medical history
                  </label>
                  <TextArea placeholder="Previous treatments, trauma, systemic diseases, long-term medications, hospitalizations…" />
                </div>
              </div>
            </Card>

            <Card
              title="Behavior & Cooperation"
              subtitle="Pediatric behavior evaluation to plan management strategies."
            >
              <div className="grid gap-3 md:grid-cols-3">
                <div>
                  <label className="mb-1 block text-[11px] font-medium text-slate-300">
                    Frankl behavior scale
                  </label>
                  <Select defaultValue="">
                    <option value="">Select level…</option>
                    <option>1 — Definitely negative</option>
                    <option>2 — Negative</option>
                    <option>3 — Positive</option>
                    <option>4 — Definitely positive</option>
                  </Select>
                </div>
                <div>
                  <label className="mb-1 block text-[11px] font-medium text-slate-300">
                    Cooperation summary
                  </label>
                  <Select defaultValue="">
                    <option value="">Select option…</option>
                    <option>Excellent</option>
                    <option>Acceptable with guidance</option>
                    <option>Anxious but manageable</option>
                    <option>Requires advanced behavior guidance</option>
                    <option>Consider pharmacologic management</option>
                  </Select>
                </div>
                <div>
                  <label className="mb-1 block text-[11px] font-medium text-slate-300">
                    Non-pharmacologic techniques
                  </label>
                  <Select defaultValue="">
                    <option value="">Select…</option>
                    <option>Tell-show-do</option>
                    <option>Positive reinforcement</option>
                    <option>Distraction</option>
                    <option>Voice control</option>
                    <option>Parental presence / absence</option>
                    <option>Desensitization</option>
                  </Select>
                </div>
              </div>
              <div className="mt-3">
                <label className="mb-1 block text-[11px] font-medium text-slate-300">
                  Behavior notes
                </label>
                <TextArea placeholder="Describe how the child responded, triggers, and successful strategies…" />
              </div>
            </Card>

            <Card
              title="Caries Risk & Habits"
              subtitle="Global caries risk, diet, hygiene and oral habits."
            >
              <div className="grid gap-3 md:grid-cols-3">
                <div>
                  <label className="mb-1 block text-[11px] font-medium text-slate-300">
                    Global caries risk
                  </label>
                  <Select defaultValue="">
                    <option value="">Select…</option>
                    <option>Low</option>
                    <option>Moderate</option>
                    <option>High</option>
                    <option>Extreme</option>
                  </Select>
                </div>
                <div>
                  <label className="mb-1 block text-[11px] font-medium text-slate-300">
                    Fluoride exposure
                  </label>
                  <Select defaultValue="">
                    <option value="">Select…</option>
                    <option>Optimal – fluoridated water / toothpaste</option>
                    <option>Suboptimal – no systemic fluoride</option>
                    <option>Topical only – toothpaste / varnish</option>
                    <option>High – multiple sources, monitor fluorosis</option>
                  </Select>
                </div>
                <div>
                  <label className="mb-1 block text-[11px] font-medium text-slate-300">
                    Diet & snacking pattern
                  </label>
                  <Select defaultValue="">
                    <option value="">Select…</option>
                    <option>Low sugar, structured meals</option>
                    <option>Frequent sugary snacks / drinks</option>
                    <option>Night-time bottle / breastfeeding with sugar</option>
                    <option>High cariogenic diet, poor structure</option>
                  </Select>
                </div>
              </div>

              <div className="mt-3 grid gap-3 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-[11px] font-medium text-slate-300">
                    Oral hygiene habits
                  </label>
                  <TextArea placeholder="Frequency of brushing, supervision by adult, flossing, use of fluoridated toothpaste…" />
                </div>
                <div>
                  <label className="mb-1 block text-[11px] font-medium text-slate-300">
                    Oral habits
                  </label>
                  <TextArea placeholder="Thumb sucking, pacifier use, mouth breathing, bruxism, nail biting, lip sucking…" />
                </div>
              </div>
            </Card>

            <Card
              title="Trauma & Radiographs"
              subtitle="History of trauma and radiographic plan."
            >
              <div className="grid gap-3 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-[11px] font-medium text-slate-300">
                    Trauma history
                  </label>
                  <TextArea placeholder="Falls, sports injuries, dental trauma, emergency visits, sequelae…" />
                </div>
                <div>
                  <label className="mb-1 block text-[11px] font-medium text-slate-300">
                    Radiographic plan
                  </label>
                  <Select defaultValue="">
                    <option value="">Select plan…</option>
                    <option>No radiographs this visit</option>
                    <option>Bitewings</option>
                    <option>Periapicals – specific teeth</option>
                    <option>Panoramic</option>
                    <option>CBCT (only if necessary)</option>
                  </Select>
                  <label className="mt-2 mb-1 block text-[11px] font-medium text-slate-300">
                    Radiographic notes
                  </label>
                  <TextArea rows={2} placeholder="Justification, ALARA considerations, previous images…" />
                </div>
              </div>
            </Card>
          </div>

          {/* Right column: odontogram & eruption */}
          <div className="space-y-5">
            <Card
              title="Temporal Odontogram · Primary Teeth (A–T)"
              subtitle="Click status for each primary tooth. Later this will sync with the SVG dental chart and analytics."
              badge="Temporal dentition"
            >
              {/* Upper arch */}
              <div className="mb-3">
                <p className="mb-1 text-[11px] font-medium text-emerald-300">
                  Upper arch — primary dentition
                </p>
                <p className="mb-2 text-[10px] text-slate-500">
                  From right to left · A → J
                </p>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
                  {PRIMARY_UPPER.map((tooth) => (
                    <div
                      key={tooth}
                      className="rounded-xl border border-slate-800 bg-slate-950/80 px-2 py-2"
                    >
                      <div className="mb-1 flex items-center justify-between gap-1">
                        <span className="text-[11px] font-semibold text-slate-100">
                          {tooth}
                        </span>
                        <span className="rounded-full bg-slate-800 px-1.5 py-0.5 text-[9px] uppercase tracking-[0.16em] text-slate-400">
                          {primaryToothStatus[tooth]}
                        </span>
                      </div>
                      <Select
                        value={primaryToothStatus[tooth]}
                        onChange={(e) =>
                          handleToothStatusChange(
                            tooth,
                            e.target.value as ToothStatus
                          )
                        }
                        className="text-[11px]"
                      >
                        {TOOTH_STATUS_OPTIONS.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </Select>
                    </div>
                  ))}
                </div>
              </div>

              {/* Lower arch */}
              <div className="mt-4">
                <p className="mb-1 text-[11px] font-medium text-emerald-300">
                  Lower arch — primary dentition
                </p>
                <p className="mb-2 text-[10px] text-slate-500">
                  From left to right · K → T
                </p>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
                  {PRIMARY_LOWER.map((tooth) => (
                    <div
                      key={tooth}
                      className="rounded-xl border border-slate-800 bg-slate-950/80 px-2 py-2"
                    >
                      <div className="mb-1 flex items-center justify-between gap-1">
                        <span className="text-[11px] font-semibold text-slate-100">
                          {tooth}
                        </span>
                        <span className="rounded-full bg-slate-800 px-1.5 py-0.5 text-[9px] uppercase tracking-[0.16em] text-slate-400">
                          {primaryToothStatus[tooth]}
                        </span>
                      </div>
                      <Select
                        value={primaryToothStatus[tooth]}
                        onChange={(e) =>
                          handleToothStatusChange(
                            tooth,
                            e.target.value as ToothStatus
                          )
                        }
                        className="text-[11px]"
                      >
                        {TOOTH_STATUS_OPTIONS.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </Select>
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            <Card
              title="Eruption & Mixed Dentition Map"
              subtitle="Quick snapshot of permanent eruption status for age-appropriate evaluation."
              badge="Growth"
            >
              <div className="grid gap-3">
                {PERMANENT_ERUPTION_TEETH.map((item) => (
                  <div
                    key={item}
                    className="flex flex-col gap-1 rounded-xl border border-slate-800 bg-slate-950/80 px-3 py-2 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="text-[11px] text-slate-200">
                      <p className="font-medium">{item}</p>
                    </div>
                    <div className="sm:w-48">
                      <Select
                        value={eruptionStatus[item]}
                        onChange={(e) =>
                          handleEruptionChange(item, e.target.value)
                        }
                        className="text-[11px]"
                      >
                        <option>Age-appropriate</option>
                        <option>Delayed eruption</option>
                        <option>Early eruption</option>
                        <option>Impaction / need to monitor</option>
                        <option>Appliances in place</option>
                      </Select>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-3">
                <label className="mb-1 block text-[11px] font-medium text-slate-300">
                  Eruption / growth notes
                </label>
                <TextArea rows={3} placeholder="Asymmetries, space loss, early loss of primary teeth, crowding, crossbite, need for interceptive orthodontics…" />
              </div>
            </Card>

            <Card
              title="Treatment Plan & Recall"
              subtitle="High-level plan for this child and recall strategy."
            >
              <div className="grid gap-3 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-[11px] font-medium text-slate-300">
                    Treatment priority
                  </label>
                  <Select defaultValue="">
                    <option value="">Select…</option>
                    <option>Emergency – pain / infection control</option>
                    <option>Stabilization – caries control</option>
                    <option>Definitive restorative treatment</option>
                    <option>Behavior / desensitization phase</option>
                    <option>Interceptive orthodontics</option>
                  </Select>
                  <label className="mt-2 mb-1 block text-[11px] font-medium text-slate-300">
                    Treatment summary
                  </label>
                  <TextArea rows={3} placeholder="Sealants, restorations, pulpotomies, SSCs, extractions, space maintainers, behavior visits, ortho consult…" />
                </div>
                <div>
                  <label className="mb-1 block text-[11px] font-medium text-slate-300">
                    Recall interval
                  </label>
                  <Select defaultValue="">
                    <option value="">Select…</option>
                    <option>3 months</option>
                    <option>4 months</option>
                    <option>6 months</option>
                    <option>12 months</option>
                  </Select>
                  <label className="mt-2 mb-1 block text-[11px] font-medium text-slate-300">
                    Home care / education notes
                  </label>
                  <TextArea rows={3} placeholder="Instructions given to child and parent, brushing demo, diet advice, written materials, follow-up plan…" />
                </div>
              </div>
            </Card>
          </div>
        </section>
      </div>
    </main>
  );
}
