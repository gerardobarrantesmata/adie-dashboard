"use client";

import React from "react";
import Link from "next/link";

// ----------------- Configuración básica -----------------

const UPPER_TEETH = [
  "18",
  "17",
  "16",
  "15",
  "14",
  "13",
  "12",
  "11",
  "21",
  "22",
  "23",
  "24",
  "25",
  "26",
  "27",
  "28",
];

const LOWER_TEETH = [
  "48",
  "47",
  "46",
  "45",
  "44",
  "43",
  "42",
  "41",
  "31",
  "32",
  "33",
  "34",
  "35",
  "36",
  "37",
  "38",
];

const SITES = [
  { id: "mb", label: "MB" },
  { id: "b", label: "B" },
  { id: "db", label: "DB" },
  { id: "ml", label: "ML" },
  { id: "l", label: "L" },
  { id: "dl", label: "DL" },
] as const;

type Severity = "none" | "mild" | "moderate" | "severe";

function getSeverity(mm: number): Severity {
  if (mm === 0) return "none";
  if (mm <= 3) return "mild";
  if (mm <= 5) return "moderate";
  return "severe";
}

const SEVERITY_LABEL: Record<Severity, string> = {
  none: "–",
  mild: "Mild",
  moderate: "Moderate",
  severe: "Severe",
};

const SEVERITY_CLASS: Record<Severity, string> = {
  none: "border-slate-700 bg-slate-950/70 text-slate-200",
  mild: "border-emerald-500/50 bg-emerald-950/40 text-emerald-100",
  moderate: "border-amber-500/60 bg-amber-950/40 text-amber-100",
  severe: "border-rose-500/70 bg-rose-950/40 text-rose-100",
};

// ----------------- Componentes de UI simples -----------------

type CardProps = {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
};

function Card({ title, subtitle, children, className }: CardProps) {
  return (
    <section
      className={`rounded-3xl border border-slate-800/70 bg-slate-950/70 p-5 shadow-[0_18px_60px_rgba(0,0,0,0.65)] ${className ?? ""}`}
    >
      <div className="mb-3 flex items-baseline justify-between gap-3">
        <h2 className="text-[13px] font-semibold tracking-[0.28em] text-emerald-300 uppercase">
          {title}
        </h2>
        {subtitle && (
          <p className="text-[11px] text-slate-400 text-right">{subtitle}</p>
        )}
      </div>
      {children}
    </section>
  );
}

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
};

function TextInput({ label, ...rest }: InputProps) {
  return (
    <label className="flex flex-col gap-1 text-[11px] text-slate-300">
      {label && <span className="text-[11px] text-slate-400">{label}</span>}
      <input
        {...rest}
        className="h-9 rounded-xl border border-slate-800/80 bg-slate-950/70 px-3 text-[11px] text-slate-100 outline-none ring-emerald-500/40 focus:border-emerald-400/80 focus:ring-2"
      />
    </label>
  );
}

type TextAreaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string;
};

function TextArea({ label, ...rest }: TextAreaProps) {
  return (
    <label className="flex flex-col gap-1 text-[11px] text-slate-300">
      {label && <span className="text-[11px] text-slate-400">{label}</span>}
      <textarea
        {...rest}
        className="min-h-[70px] rounded-xl border border-slate-800/80 bg-slate-950/70 px-3 py-2 text-[11px] text-slate-100 outline-none ring-emerald-500/40 focus:border-emerald-400/80 focus:ring-2"
      />
    </label>
  );
}

type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string;
};

function Select({ label, children, ...rest }: SelectProps) {
  return (
    <label className="flex flex-col gap-1 text-[11px] text-slate-300">
      {label && <span className="text-[11px] text-slate-400">{label}</span>}
      <select
        {...rest}
        className="h-9 rounded-xl border border-slate-800/80 bg-slate-950/70 px-3 text-[11px] text-slate-100 outline-none ring-emerald-500/40 focus:border-emerald-400/80 focus:ring-2"
      >
        {children}
      </select>
    </label>
  );
}

type ToggleRowProps = {
  label: string;
  description?: string;
};

function ToggleRow({ label, description }: ToggleRowProps) {
  const [on, setOn] = React.useState(false);
  return (
    <button
      type="button"
      onClick={() => setOn((v) => !v)}
      className={`flex w-full items-center justify-between rounded-2xl border px-3 py-2 text-left text-[11px] transition ${
        on
          ? "border-emerald-500/60 bg-emerald-950/40 text-emerald-100"
          : "border-slate-800/80 bg-slate-950/60 text-slate-200 hover:border-slate-700"
      }`}
    >
      <span className="flex flex-col">
        <span className="font-medium">{label}</span>
        {description && (
          <span className="text-[10px] text-slate-400">{description}</span>
        )}
      </span>
      <span
        className={`flex h-4 w-7 items-center rounded-full border transition ${
          on
            ? "border-emerald-400 bg-emerald-500/60"
            : "border-slate-500 bg-slate-700/60"
        }`}
      >
        <span
          className={`h-3 w-3 rounded-full bg-slate-950 transition ${
            on ? "translate-x-3" : "translate-x-0.5"
          }`}
        />
      </span>
    </button>
  );
}

// ----------------- Pocket depth chart -----------------

function PeriodontalPocketChart() {
  const [values, setValues] = React.useState<Record<string, number>>({});

  function changeValue(key: string, delta: number) {
    setValues((prev) => {
      const current = prev[key] ?? 0;
      let next = current + delta;
      if (next < 0) next = 0;
      if (next > 10) next = 10;
      return { ...prev, [key]: next };
    });
  }

  function renderTable(label: string, teeth: string[]) {
    return (
      <div className="w-full">
        <p className="mb-2 text-[12px] font-semibold tracking-[0.22em] text-emerald-300 uppercase">
          {label}
        </p>
        <div className="overflow-x-auto rounded-2xl border border-slate-800/80 bg-slate-950/70 p-2">
          <table className="min-w-full border-collapse text-[11px]">
            <thead>
              <tr className="text-slate-400">
                <th className="px-2 py-1 text-left text-[11px]">Tooth</th>
                {SITES.map((site) => (
                  <th key={site.id} className="px-1 py-1 text-center">
                    {site.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {teeth.map((tooth) => (
                <tr key={tooth} className="border-t border-slate-800/80">
                  <td className="px-2 py-1 text-[11px] font-semibold text-slate-200">
                    {tooth}
                  </td>
                  {SITES.map((site) => {
                    const key = `${tooth}-${site.id}`;
                    const mm = values[key] ?? 0;
                    const sev = getSeverity(mm);
                    const sevLabel = SEVERITY_LABEL[sev];

                    return (
                      <td key={site.id} className="px-1 py-1">
                        <div
                          className={`flex flex-col items-center rounded-lg border px-1.5 py-1 ${SEVERITY_CLASS[sev]}`}
                        >
                          <span className="text-[9px] text-slate-300">
                            {site.label}
                          </span>
                          <div className="mt-0.5 flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => changeValue(key, -1)}
                              className="h-4 w-4 rounded-full border border-slate-500 text-[11px] leading-none text-slate-200 hover:border-emerald-400 hover:text-emerald-200"
                            >
                              −
                            </button>
                            <span className="text-[11px] font-semibold">
                              {mm}
                            </span>
                            <button
                              type="button"
                              onClick={() => changeValue(key, +1)}
                              className="h-4 w-4 rounded-full border border-slate-500 text-[11px] leading-none text-slate-200 hover:border-emerald-400 hover:text-emerald-200"
                            >
                              +
                            </button>
                          </div>
                          <span className="mt-0.5 text-[9px] leading-tight text-slate-300">
                            {sevLabel}
                          </span>
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-[11px] text-slate-400">
        Use the − / + buttons to set probing depth in millimetres for each site
        (MB, B, DB, ML, L, DL). Cells change colour depending on severity:
        green = mild (≤3&nbsp;mm), amber = moderate (4–5&nbsp;mm), red =
        severe (≥6&nbsp;mm). Later we will link this grid to the SVG periodontal
        chart and Postgres database.
      </p>

      <div className="space-y-6">
        {renderTable("UPPER ARCH · MAXILLARY TEETH", UPPER_TEETH)}
        {renderTable("LOWER ARCH · MANDIBULAR TEETH", LOWER_TEETH)}
      </div>
    </div>
  );
}

// ----------------- Página principal -----------------

export default function PeriodonticsRecordPage() {
  return (
    <main className="min-h-screen bg-slate-950 px-6 py-8 text-slate-100">
      {/* Encabezado */}
      <header className="mx-auto flex max-w-6xl items-center justify-between gap-4 pb-6">
        <div>
          <p className="text-[11px] font-semibold tracking-[0.32em] text-emerald-300 uppercase">
            Specialties · Layer 3
          </p>
          <h1 className="mt-1 text-xl font-semibold text-slate-50">
            Periodontics Clinical Record
          </h1>
          <p className="mt-1 text-[11px] text-slate-400 max-w-xl">
            Complete periodontal chart to document pockets, diagnosis, risk
            factors, non-surgical and surgical treatment and long-term
            maintenance.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/specialties"
            className="rounded-full border border-slate-700 bg-slate-900/80 px-4 py-2 text-[11px] font-medium text-slate-200 shadow hover:border-emerald-400 hover:text-emerald-200"
          >
            ← Back to Specialties Universe
          </Link>
        </div>
      </header>

      <div className="mx-auto flex max-w-6xl flex-col gap-6 pb-10">
        {/* Contexto del paciente */}
        <Card
          title="Patient Context"
          subtitle="Link this record to the EMR patient list. Later we will connect EMR ID, age and treatment status."
        >
          <div className="grid gap-4 md:grid-cols-[minmax(0,2.2fr),minmax(0,3fr)]">
            <div className="grid gap-3 sm:grid-cols-2">
              <TextInput
                label="Name"
                placeholder="[Select patient from EMR]"
                defaultValue=""
              />
              <TextInput label="ID" placeholder="ADIE-PERIO-0001" />
              <TextInput label="Age" placeholder="—" />
              <TextInput label="Status" defaultValue="Active treatment" />
            </div>
            <div className="flex flex-col justify-between gap-2 text-[11px] text-slate-400">
              <p>
                This header will later display alerts from the medical record
                (systemic risks, allergies, medications) and a quick summary of
                previous periodontal treatments.
              </p>
            </div>
          </div>
        </Card>

        {/* Fila principal: Historia / Pocket records */}
        <div className="grid gap-6 lg:grid-cols-[minmax(0,3fr),minmax(0,2.2fr)]">
          <Card title="Chief Complaint & History">
            <div className="grid gap-4">
              <TextArea
                label="Chief complaint"
                placeholder="Example: Bleeding gums, bad breath and tooth mobility when chewing."
              />
              <TextArea
                label="Medical / dental history"
                placeholder="Systemic diseases (diabetes, cardiovascular), medications, smoking, previous periodontal treatment, oral hygiene habits..."
              />
            </div>
          </Card>

          <Card
            title="Periodontal Records & Pocket Chart"
            subtitle="Later we will link each item with Radiology, Photos and the SVG periodontal chart."
          >
            <div className="space-y-2">
              <ToggleRow label="Full mouth pocket chart recorded" />
              <ToggleRow label="Mobility and furcation chart completed" />
              <ToggleRow label="Radiographic bone loss evaluated" />
              <ToggleRow label="Plaque index / bleeding index recorded" />
              <ToggleRow label="Implant sites charted" />
            </div>
          </Card>
        </div>

        {/* Clasificación clínica y plan de tratamiento */}
        <div className="grid gap-6 lg:grid-cols-[minmax(0,3fr),minmax(0,2.2fr)]">
          <Card title="Clinical Classification">
            <div className="grid gap-4 md:grid-cols-2">
              <Select label="Periodontal diagnosis (stage)">
                <option value="">Select stage…</option>
                <option>Stage I</option>
                <option>Stage II</option>
                <option>Stage III</option>
                <option>Stage IV</option>
              </Select>
              <Select label="Grade (progression)">
                <option value="">Select grade…</option>
                <option>Grade A</option>
                <option>Grade B</option>
                <option>Grade C</option>
              </Select>
              <Select label="Pattern of bone loss">
                <option value="">Select option…</option>
                <option>Horizontal</option>
                <option>Vertical</option>
                <option>Combined</option>
              </Select>
              <Select label="Furcation involvement">
                <option value="">Select option…</option>
                <option>Class I</option>
                <option>Class II</option>
                <option>Class III</option>
              </Select>
              <TextArea
                label="Clinical attachment loss summary"
                placeholder="Worst sites, mean CAL, distribution by sextants, teeth with hopeless prognosis…"
              />
              <TextArea
                label="Bleeding on probing / inflammation"
                placeholder="Percentage of sites with BOP, suppuration, swollen or fibrotic tissues."
              />
            </div>
          </Card>

          <Card title="Treatment Plan & Maintenance">
            <div className="grid gap-4">
              <TextArea
                label="Initial (non-surgical) phase"
                placeholder="Oral hygiene instruction, supragingival / subgingival scaling and root planing, locally-delivered antibiotics, re-evaluation timing…"
              />
              <TextArea
                label="Surgical / regenerative phase"
                placeholder="Indication for flap surgery, regenerative procedures, resective surgery, mucogingival surgery, peri-implantitis therapy…"
              />
              <TextArea
                label="Supportive periodontal therapy"
                placeholder="Recall interval (e.g. every 3–4 months), parameters to monitor, criteria for retreatment…"
              />
            </div>
          </Card>
        </div>

        {/* Risk factors + Pocket chart */}
        <div className="grid gap-6 lg:grid-cols-[minmax(0,2.4fr),minmax(0,3fr)]">
          <Card title="Risk Factors & Modifiers">
            <div className="grid gap-4">
              <TextArea
                label="Systemic risk factors"
                placeholder="Diabetes, cardiovascular disease, osteoporosis, stress, genetic predisposition…"
              />
              <TextArea
                label="Local risk factors"
                placeholder="Plaque retention, calculus, defective restorations, anatomical factors, occlusal trauma…"
              />
              <TextArea
                label="Habits"
                placeholder="Smoking status, oral hygiene frequency and quality, bruxism, mouth breathing…"
              />
              <TextArea
                label="Global risk assessment"
                placeholder="Low / moderate / high risk and explanation."
              />
            </div>
          </Card>

          <Card title="Pocket Depth Chart (mm)">
            <PeriodontalPocketChart />
          </Card>
        </div>

        {/* Notas clínicas finales */}
        <Card title="Clinical Notes">
          <TextArea
            placeholder="Short narrative tying periodontal findings, diagnosis, treatment decisions and patient communication. This note will sync with the main EMR timeline."
          />
        </Card>
      </div>
    </main>
  );
}
