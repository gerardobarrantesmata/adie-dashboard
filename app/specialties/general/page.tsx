"use client";

import React, { Suspense, useState } from "react";
import Link from "next/link";
import { SpecialtyTopActions } from "@/app/_components/SpecialtyTopActions";

/* ------------ UI BASICS ------------ */

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
    <section className="rounded-2xl border border-slate-800 bg-slate-950/70 px-4 py-4 md:px-5 md:py-5 shadow-[0_18px_60px_rgba(15,23,42,0.8)]">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-300">
            {title}
          </h2>
          {subtitle && (
            <p className="mt-1 text-[11px] text-slate-500">{subtitle}</p>
          )}
        </div>
        {badge && (
          <span className="rounded-full border border-emerald-500/40 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.18em] text-emerald-100">
            {badge}
          </span>
        )}
      </div>
      {children}
    </section>
  );
}

/* ------------ RISK HELPERS ------------ */

type Severity = "normal" | "borderline" | "critical";
type CariesRisk = "low" | "moderate" | "high" | "extreme";
type PerioStatus = "healthy" | "initial" | "moderate" | "severe";
type GlobalRisk = "ok" | "borderline" | "critical";

function severityClasses(severity: Severity): string {
  if (severity === "normal") {
    return "border-emerald-500/60 bg-emerald-500/10 text-emerald-100";
  }
  if (severity === "borderline") {
    return "border-amber-400/70 bg-amber-500/15 text-amber-100";
  }
  return "border-rose-500/70 bg-rose-500/15 text-rose-100";
}

function SeverityPill(props: {
  label: string;
  value: string;
  severity: Severity;
}) {
  const { label, value, severity } = props;
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[10px] font-medium ${severityClasses(
        severity
      )}`}
    >
      <span className="inline-block h-1.5 w-1.5 rounded-full bg-current" />
      <span>{label}</span>
      <span className="opacity-80">· {value}</span>
    </span>
  );
}

function getCariesSeverity(risk: CariesRisk): Severity {
  if (risk === "low") return "normal";
  if (risk === "moderate") return "borderline";
  return "critical"; // high & extreme
}

function getPerioSeverity(status: PerioStatus): Severity {
  if (status === "healthy") return "normal";
  if (status === "initial") return "borderline";
  return "critical"; // moderate & severe
}

function getPainSeverity(score: number): Severity {
  if (score <= 3) return "normal";
  if (score <= 6) return "borderline";
  return "critical";
}

function computeGlobalRisk(options: {
  caries: Severity;
  perio: Severity;
  pain: Severity;
  hasSystemicRedFlags: boolean;
}): GlobalRisk {
  const { caries, perio, pain, hasSystemicRedFlags } = options;

  if (
    hasSystemicRedFlags ||
    pain === "critical" ||
    caries === "critical" ||
    perio === "critical"
  ) {
    return "critical";
  }

  if (
    pain === "borderline" ||
    caries === "borderline" ||
    perio === "borderline"
  ) {
    return "borderline";
  }

  return "ok";
}

/* ------------ HEADER CLÍNICO CON ALERTA ------------ */

function GlobalRiskPill({ level }: { level: GlobalRisk }) {
  const map = {
    ok: {
      icon: "▲",
      label: "Cleared for elective dentistry · no systemic red flags",
      classes:
        "border-emerald-500/70 bg-emerald-500/10 text-emerald-100 shadow-[0_0_22px_rgba(16,185,129,0.55)]",
    },
    borderline: {
      icon: "▲",
      label: "Treat today · prioritize disease control & risk reduction",
      classes:
        "border-amber-500/80 bg-amber-500/15 text-amber-100 shadow-[0_0_22px_rgba(245,158,11,0.55)]",
    },
    critical: {
      icon: "▲",
      label: "Emergency / urgent · control pain & infection first",
      classes:
        "border-rose-500/80 bg-rose-500/18 text-rose-100 shadow-[0_0_22px_rgba(248,113,113,0.65)]",
    },
  } as const;

  const cfg = map[level];

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] ${cfg.classes}`}
    >
      <span className="text-base leading-none">{cfg.icon}</span>
      <span className="normal-case tracking-normal">{cfg.label}</span>
    </span>
  );
}

function PatientSnapshotBar({ level }: { level: GlobalRisk }) {
  return (
    <section className="mb-6 rounded-2xl border border-slate-800 bg-slate-950/80 px-5 py-4 md:py-5">
      <div className="flex flex-wrap items-start gap-4 md:gap-6">
        {/* Foto + datos básicos */}
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-center gap-2">
            <div className="flex h-20 w-20 items-center justify-center rounded-full border border-slate-700 bg-slate-900 text-[10px] uppercase tracking-[0.18em] text-slate-400">
              Patient photo
            </div>
            <button className="rounded-full border border-emerald-500/70 bg-emerald-500/10 px-3 py-1 text-[10px] font-semibold text-emerald-100 hover:bg-emerald-500/20">
              ⬆ Upload
            </button>
          </div>

          <div className="space-y-2 text-[11px]">
            <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500">
              Active general dentistry patient
            </p>
            <p className="text-sm font-semibold text-slate-50">
              John / Jane Doe{" "}
              <span className="text-slate-500">·</span>{" "}
              <span className="text-slate-300">ID ADIE-PT-0001</span>
            </p>
            <p className="text-[11px] text-slate-400">
              DOB: 1990-04-22 · Age: 34y · Gender: Female · National ID / passport
            </p>
            <div className="flex flex-wrap gap-2">
              <button className="inline-flex items-center gap-1 rounded-full border border-amber-400/60 bg-amber-500/10 px-2.5 py-0.5 text-[10px] font-medium text-amber-100">
                ⭐ VIP
              </button>
              <button className="inline-flex items-center gap-1 rounded-full border border-rose-500/60 bg-rose-500/10 px-2.5 py-0.5 text-[10px] font-medium text-rose-100">
                💳 Financial hold
              </button>
              <button className="inline-flex items-center gap-1 rounded-full border border-emerald-500/60 bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-medium text-emerald-100">
                🩺 View full EMR
              </button>
            </div>
          </div>
        </div>

        {/* Resumen + alerta global */}
        <div className="ml-auto flex flex-col gap-3 text-[10px] text-slate-300 md:w-[370px]">
          <GlobalRiskPill level={level} />

          <div className="grid gap-3">
            <div>
              <p className="mb-1 font-semibold text-slate-200">
                Systemic & medical flags
              </p>
              <p className="text-slate-400">
                ASA II: controlled hypertension. No anticoagulants. HbA1c in
                target. Non-smoker. No recent hospitalizations.
              </p>
            </div>
            <div>
              <p className="mb-1 font-semibold text-slate-200">
                Dental quick summary
              </p>
              <ul className="space-y-0.5 text-slate-400">
                <li>• Multiple posterior composites, 2 endo-treated molars.</li>
                <li>• Localized moderate periodontitis in lower molars.</li>
                <li>• Bruxism suspected · night guard recommended.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------ WRAPPER CON SUSPENSE ------------ */

export default function GeneralDentistryPageWrapper() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-slate-950 text-slate-50 flex items-center justify-center">
          <p className="text-xs text-slate-400">
            Loading general dentistry advanced record…
          </p>
        </main>
      }
    >
      <GeneralDentistryRecordPageInner />
    </Suspense>
  );
}

/* ------------ MAIN PAGE (INNER) ------------ */

function GeneralDentistryRecordPageInner() {
  const [cariesRisk, setCariesRisk] = useState<CariesRisk>("moderate");
  const [perioStatus, setPerioStatus] = useState<PerioStatus>("initial");
  const [painScore, setPainScore] = useState<number>(4);
  const [hasSwelling, setHasSwelling] = useState<boolean>(false);
  const [hasFever, setHasFever] = useState<boolean>(false);

  const cariesSeverity = getCariesSeverity(cariesRisk);
  const perioSeverity = getPerioSeverity(perioStatus);
  const painSeverity = getPainSeverity(painScore);
  const hasSystemicRedFlags = hasSwelling || hasFever;

  const globalRisk = computeGlobalRisk({
    caries: cariesSeverity,
    perio: perioSeverity,
    pain: painSeverity,
    hasSystemicRedFlags,
  });

  return (
    <main className="min-h-screen bg-slate-950 text-slate-50">
      <div className="mx-auto max-w-6xl px-4 pb-24 pt-8">
        {/* HEADER PRINCIPAL */}
        <header className="mb-4 flex items-center justify-between gap-4">
          <div>
            <p className="text-[11px] uppercase tracking-[0.28em] text-emerald-400">
              Specialties · Layer 3
            </p>
            <h1 className="mt-1 text-2xl md:text-3xl font-semibold tracking-tight text-slate-50">
              General Dentistry · Advanced Clinical Record
            </h1>
            <p className="mt-2 max-w-2xl text-xs md:text-sm text-slate-400">
              Triage pain and infection, summarize disease, and organize phased
              treatment — all in one screen that later syncs with caries, endo,
              perio, prostho and ortho modules.
            </p>
          </div>

          <Link
            href="/specialties"
            className="rounded-full border border-slate-700 bg-slate-900/70 px-4 py-1.5 text-xs md:text-sm text-slate-200 hover:border-emerald-500 hover:text-emerald-100 transition-colors"
          >
            ← Back to Specialties Universe
          </Link>
        </header>

        {/* BARRA DE CONTROL: BACK TO MPR + SAVE & DASHBOARD */}
        <SpecialtyTopActions specialtyLabel="General Dentistry" />

        {/* SNAPSHOT TIPO PATIENTS + ALERTA */}
        <PatientSnapshotBar level={globalRisk} />

        {/* GRID PRINCIPAL */}
        <div className="grid gap-5 lg:grid-cols-[1.6fr,1.4fr]">
          {/* LEFT COLUMN */}
          <div className="space-y-5">
            {/* Chief complaint & history */}
            <Card
              title="Chief complaint & visit reason"
              subtitle="Capture why the patient is here today and what they expect from treatment."
              badge="Intake"
            >
              <div className="grid gap-3 md:grid-cols-2">
                <div className="md:col-span-2">
                  <label className="mb-1 block text-[11px] font-medium text-slate-300">
                    Chief complaint
                  </label>
                  <TextArea
                    rows={3}
                    placeholder="Pain UR molar when chewing, wants whitening and to fix front teeth spacing…"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-[11px] font-medium text-slate-300">
                    Dental / medical history
                  </label>
                  <TextArea
                    rows={4}
                    placeholder="Previous RCT on 16 and 36, multiple fillings, past ortho, systemic conditions, medications, allergies…"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-[11px] font-medium text-slate-300">
                    Patient expectations / goals
                  </label>
                  <TextArea
                    rows={4}
                    placeholder="Wants to be pain-free, keep natural teeth as long as possible, improve smile aesthetics…"
                  />
                </div>
              </div>
            </Card>

            {/* Global risk & triage */}
            <Card
              title="Global risk & triage"
              subtitle="Color-coded overview of caries, periodontal status, pain and systemic red flags."
              badge="Triage"
            >
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-3">
                  <div>
                    <label className="mb-1 block text-[11px] font-medium text-slate-300">
                      Caries risk
                    </label>
                    <div className="flex items-center gap-2">
                      <Select
                        value={cariesRisk}
                        onChange={(e) =>
                          setCariesRisk(e.target.value as CariesRisk)
                        }
                      >
                        <option value="low">Low</option>
                        <option value="moderate">Moderate</option>
                        <option value="high">High</option>
                        <option value="extreme">Extreme</option>
                      </Select>
                      <SeverityPill
                        label="Caries"
                        value={cariesRisk}
                        severity={cariesSeverity}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-1 block text-[11px] font-medium text-slate-300">
                      Periodontal status (summary)
                    </label>
                    <div className="flex items-center gap-2">
                      <Select
                        value={perioStatus}
                        onChange={(e) =>
                          setPerioStatus(e.target.value as PerioStatus)
                        }
                      >
                        <option value="healthy">
                          Healthy / gingivitis only
                        </option>
                        <option value="initial">Initial periodontitis</option>
                        <option value="moderate">
                          Moderate periodontitis
                        </option>
                        <option value="severe">
                          Severe / generalized periodontitis
                        </option>
                      </Select>
                      <SeverityPill
                        label="Perio"
                        value={perioStatus}
                        severity={perioSeverity}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="mb-1 block text-[11px] font-medium text-slate-300">
                      Pain scale (0–10)
                    </label>
                    <div className="space-y-1">
                      <input
                        type="range"
                        min={0}
                        max={10}
                        value={painScore}
                        onChange={(e) =>
                          setPainScore(Number(e.target.value || 0))
                        }
                        className="w-full accent-emerald-400"
                      />
                      <div className="flex items-center justify-between text-[11px] text-slate-400">
                        <span>0</span>
                        <span>{painScore}</span>
                        <span>10</span>
                      </div>
                      <SeverityPill
                        label="Pain"
                        value={`${painScore}/10`}
                        severity={painSeverity}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-1 block text-[11px] font-medium text-slate-300">
                      Systemic / infection red flags
                    </label>
                    <div className="flex flex-col gap-1 text-[11px] text-slate-300">
                      <label className="inline-flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={hasSwelling}
                          onChange={(e) => setHasSwelling(e.target.checked)}
                          className="h-3.5 w-3.5 rounded border-slate-600 bg-slate-900 text-emerald-400 focus:ring-emerald-500"
                        />
                        <span>Facial swelling / abscess / trismus</span>
                      </label>
                      <label className="inline-flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={hasFever}
                          onChange={(e) => setHasFever(e.target.checked)}
                          className="h-3.5 w-3.5 rounded border-slate-600 bg-slate-900 text-emerald-400 focus:ring-emerald-500"
                        />
                        <span>Fever, malaise or systemic compromise</span>
                      </label>
                      <p className="mt-1 text-[10px] text-slate-500">
                        If any of these are present, ADIE will flag the case as
                        <span className="text-rose-300"> emergency</span> and
                        suggest antibiotic / hospital referral logic in future
                        versions.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Tooth status summary */}
            <Card
              title="Tooth status summary"
              subtitle="High-level tooth map before entering individual specialty workspaces."
              badge="Tooth map"
            >
              <div className="grid gap-3 md:grid-cols-3 text-[11px]">
                <div>
                  <label className="mb-1 block font-medium text-slate-300">
                    Teeth needing immediate care
                  </label>
                  <TextArea
                    rows={4}
                    placeholder="Example: 16 – symptomatic irreversible pulpitis; 26 – vertical fracture; 31 – mobility III…"
                  />
                </div>
                <div>
                  <label className="mb-1 block font-medium text-slate-300">
                    Teeth to monitor
                  </label>
                  <TextArea
                    rows={4}
                    placeholder="Incipient caries, cracked tooth without symptoms, deep restorations close to pulp…"
                  />
                </div>
                <div>
                  <label className="mb-1 block font-medium text-slate-300">
                    Hopeless / extraction indicated
                  </label>
                  <TextArea
                    rows={4}
                    placeholder="Non-restorable roots, furcation grade III with mobility, failed RCT with fracture…"
                  />
                </div>
              </div>
            </Card>

            {/* Clinical notes */}
            <Card
              title="Clinical notes"
              subtitle="Narrative tying diagnosis, risk and global treatment direction. Forms part of the legal record."
              badge="Record"
            >
              <TextArea
                rows={5}
                placeholder="Summary of findings, diagnosis codes, informed consent notes, discussion with patient…"
              />
            </Card>
          </div>

          {/* RIGHT COLUMN */}
          <div className="space-y-5">
            {/* Procedures today */}
            <Card
              title="Procedures for today"
              subtitle="What will be done in this visit: anesthesia, isolation, procedures and time."
              badge="Today"
            >
              <div className="grid gap-3 md:grid-cols-2 text-[11px]">
                <div>
                  <label className="mb-1 block font-medium text-slate-300">
                    Planned procedures
                  </label>
                  <TextArea
                    rows={4}
                    placeholder="e.g. RCT 16, composite restoration 15, emergency drainage 36…"
                  />
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="mb-1 block font-medium text-slate-300">
                      Anesthesia
                    </label>
                    <Select defaultValue="">
                      <option value="">Select…</option>
                      <option>None</option>
                      <option>Local infiltration</option>
                      <option>Nerve block</option>
                      <option>Local + nitrous oxide</option>
                      <option>Local + IV sedation</option>
                    </Select>
                  </div>
                  <div>
                    <label className="mb-1 block font-medium text-slate-300">
                      Isolation
                    </label>
                    <Select defaultValue="">
                      <option value="">Select…</option>
                      <option>Rubber dam</option>
                      <option>Partial isolation</option>
                      <option>Cotton rolls / suction only</option>
                    </Select>
                  </div>
                  <div>
                    <label className="mb-1 block font-medium text-slate-300">
                      Chair time for today (min)
                    </label>
                    <Input placeholder="e.g. 60" />
                  </div>
                </div>
              </div>
            </Card>

            {/* Phased treatment plan */}
            <Card
              title="Phased treatment plan"
              subtitle="Organize emergency, disease control and rehabilitation / aesthetics."
              badge="Plan"
            >
              <div className="space-y-3 text-[11px]">
                <div>
                  <label className="mb-1 block font-medium text-slate-300">
                    Phase 1 – Emergency / pain &amp; infection control
                  </label>
                  <TextArea
                    rows={3}
                    placeholder="Drain abscess 36, start RCT 36, temporary filling 16, prescribe analgesics / antibiotics as indicated…"
                  />
                </div>
                <div>
                  <label className="mb-1 block font-medium text-slate-300">
                    Phase 2 – Disease control
                  </label>
                  <TextArea
                    rows={3}
                    placeholder="Caries removal and definitive restorations, periodontal debridement, RCT completion, extractions of hopeless teeth…"
                  />
                </div>
                <div>
                  <label className="mb-1 block font-medium text-slate-300">
                    Phase 3 – Rehabilitation &amp; aesthetics
                  </label>
                  <TextArea
                    rows={3}
                    placeholder="Crowns, onlays, bridges, implants, ortho referral, whitening, veneers, occlusal guard…"
                  />
                </div>
              </div>
            </Card>

            {/* Recall & maintenance */}
            <Card
              title="Recall & maintenance"
              subtitle="Follow-up strategy once active treatment is completed."
              badge="Maintenance"
            >
              <div className="grid gap-3 md:grid-cols-2 text-[11px]">
                <div>
                  <label className="mb-1 block font-medium text-slate-300">
                    Recall interval
                  </label>
                  <Select defaultValue="">
                    <option value="">Select option…</option>
                    <option>Every 3 months</option>
                    <option>Every 6 months</option>
                    <option>Once a year</option>
                    <option>Custom · according to risk</option>
                  </Select>
                </div>
                <div>
                  <label className="mb-1 block font-medium text-slate-300">
                    Maintenance risk level
                  </label>
                  <Select defaultValue="">
                    <option value="">Select…</option>
                    <option>Low – standard recall</option>
                    <option>Moderate – closer follow-up</option>
                    <option>High – strict recall & adjunctive preventive care</option>
                  </Select>
                </div>
              </div>

              <div className="mt-3">
                <label className="mb-1 block text-[11px] font-medium text-slate-300">
                  Maintenance notes
                </label>
                <TextArea
                  rows={4}
                  placeholder="Prophylaxis, fluoride, sealants, maintenance for perio / implants, night guard checks, dietary counselling…"
                />
              </div>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}
