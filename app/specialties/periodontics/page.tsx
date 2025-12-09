"use client";

import React, { useState } from "react";
import Link from "next/link";
import { SpecialtyTopActions } from "@/app/_components/SpecialtyTopActions";

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
          <span className="rounded-full border border-emerald-500/40 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.2em] text-emerald-200">
            {badge}
          </span>
        )}
      </div>
      {children}
    </section>
  );
}

type RiskLevel = "low" | "moderate" | "high";

function riskDotClasses(risk: RiskLevel) {
  switch (risk) {
    case "low":
      return "bg-emerald-400 shadow-[0_0_18px_rgba(52,211,153,0.7)]";
    case "moderate":
      return "bg-amber-400 shadow-[0_0_18px_rgba(251,191,36,0.7)]";
    case "high":
      return "bg-rose-500 shadow-[0_0_18px_rgba(244,63,94,0.8)]";
    default:
      return "bg-slate-500";
  }
}

type ToothData = {
  id: string;
  pocket: number; // mm
  boneLoss: number; // %
};

function getPocketRisk(pocket: number): RiskLevel {
  if (pocket <= 3) return "low";
  if (pocket <= 5) return "moderate";
  return "high";
}

const initialUpperTeeth: ToothData[] = [
  { id: "18", pocket: 3, boneLoss: 10 },
  { id: "17", pocket: 3, boneLoss: 12 },
  { id: "16", pocket: 4, boneLoss: 18 },
  { id: "15", pocket: 4, boneLoss: 22 },
  { id: "14", pocket: 6, boneLoss: 40 },
  { id: "13", pocket: 6, boneLoss: 45 },
  { id: "12", pocket: 4, boneLoss: 28 },
  { id: "11", pocket: 4, boneLoss: 30 },
  { id: "21", pocket: 6, boneLoss: 42 },
  { id: "22", pocket: 6, boneLoss: 40 },
  { id: "23", pocket: 4, boneLoss: 26 },
  { id: "24", pocket: 4, boneLoss: 24 },
  { id: "25", pocket: 3, boneLoss: 18 },
  { id: "26", pocket: 3, boneLoss: 14 },
  { id: "27", pocket: 3, boneLoss: 12 },
  { id: "28", pocket: 3, boneLoss: 10 },
];

const initialLowerTeeth: ToothData[] = [
  { id: "48", pocket: 3, boneLoss: 10 },
  { id: "47", pocket: 3, boneLoss: 12 },
  { id: "46", pocket: 3, boneLoss: 14 },
  { id: "45", pocket: 4, boneLoss: 22 },
  { id: "44", pocket: 6, boneLoss: 40 },
  { id: "43", pocket: 6, boneLoss: 42 },
  { id: "42", pocket: 4, boneLoss: 26 },
  { id: "41", pocket: 4, boneLoss: 24 },
  { id: "31", pocket: 4, boneLoss: 24 },
  { id: "32", pocket: 4, boneLoss: 26 },
  { id: "33", pocket: 6, boneLoss: 42 },
  { id: "34", pocket: 6, boneLoss: 40 },
  { id: "35", pocket: 4, boneLoss: 22 },
  { id: "36", pocket: 3, boneLoss: 16 },
  { id: "37", pocket: 3, boneLoss: 14 },
  { id: "38", pocket: 3, boneLoss: 12 },
];

const surgicalRows = [
  { id: 1, label: "UR – 14/15 site" },
  { id: 2, label: "UL – 24/25 site" },
  { id: 3, label: "LL – 33/34 site" },
];

export default function PerioLayerPage() {
  const [upperTeeth, setUpperTeeth] = useState<ToothData[]>(initialUpperTeeth);
  const [lowerTeeth, setLowerTeeth] = useState<ToothData[]>(initialLowerTeeth);

  const updateTooth = (
    arch: "upper" | "lower",
    index: number,
    field: "pocket" | "boneLoss",
    delta: number
  ) => {
    if (arch === "upper") {
      setUpperTeeth((prev) => {
        const next = [...prev];
        const value = next[index][field] + delta;
        if (field === "pocket") {
          next[index][field] = Math.min(12, Math.max(0, value));
        } else {
          next[index][field] = Math.min(100, Math.max(0, value));
        }
        return next;
      });
    } else {
      setLowerTeeth((prev) => {
        const next = [...prev];
        const value = next[index][field] + delta;
        if (field === "pocket") {
          next[index][field] = Math.min(12, Math.max(0, value));
        } else {
          next[index][field] = Math.min(100, Math.max(0, value));
        }
        return next;
      });
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-50">
      <div className="mx-auto max-w-6xl px-4 pb-24 pt-8">
        {/* HEADER TÍTULO + BOTONES */}
        <header className="mb-3 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-[0.28em] text-emerald-400">
              Specialties · Periodontics
            </p>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-50 md:text-3xl">
              Periodontal Intelligence · Bone, Pockets & Regeneration
            </h1>
            <p className="mt-1 max-w-2xl text-xs text-slate-400 md:text-sm">
              Advanced perio cockpit for ADIE: staging, pockets, bone, implants
              and maintenance orchestrated in one AI-ready workspace, fully
              connected to ADIE&apos;s global dental chart.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-end gap-2">
            <button className="rounded-full border border-slate-700 bg-slate-900/80 px-3 py-1.5 text-[11px] text-slate-200 hover:border-emerald-400 hover:text-emerald-100 transition-colors">
              View full EMR
            </button>
            <button className="rounded-full border border-slate-700 bg-slate-900/80 px-3 py-1.5 text-[11px] text-slate-200 hover:border-sky-400 hover:text-sky-100 transition-colors">
              Perio timeline
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
        <SpecialtyTopActions specialtyLabel="Periodontics & Regeneration" />

        {/* HEADER CLÍNICO COMPARTIDO */}
        <section className="mb-4 rounded-3xl border border-slate-800 bg-slate-950/80 px-5 py-3 shadow-[0_24px_80px_rgba(15,23,42,0.95)]">
          <div className="grid gap-4 md:grid-cols-[0.9fr,2fr,1.2fr] md:items-center">
            {/* Foto / upload */}
            <div className="space-y-2">
              <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-slate-400">
                Patient photo
              </p>
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-slate-700 bg-slate-900/80 text-[11px] text-slate-500">
                Photo
              </div>
              <button className="rounded-full border border-slate-700 bg-slate-900/80 px-3 py-1 text-[11px] text-slate-200 hover:border-emerald-400 hover:text-emerald-100 transition-colors">
                ⬆ Upload
              </button>
            </div>

            {/* Datos paciente + flags rápidos */}
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-300">
                <span className="rounded-full bg-slate-900/80 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-400">
                  Active periodontal patient
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
                <span>DOB: 1986-03-12</span>
                <span>· Age: 39y</span>
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
                  Perio Stage III · Grade C
                </span>
              </div>

              <div className="grid gap-2 text-[10px] text-slate-400 md:grid-cols-2">
                <div>
                  <p className="mb-0.5 font-medium text-slate-300">
                    Systemic & medical flags
                  </p>
                  <p className="leading-snug">
                    Diabetes type II · HbA1c 7.4 · Hypertension · Medications:
                    Metformin, ACE inhibitor.
                  </p>
                </div>
                <div>
                  <p className="mb-0.5 font-medium text-slate-300">
                    Perio & dental quick flags
                  </p>
                  <p className="leading-snug">
                    Generalized Stage III · multiple 6–8 mm pockets · mobility
                    grade II molars · prior failed implants.
                  </p>
                </div>
              </div>
            </div>

            {/* Riesgo global + botón verde */}
            <div className="flex flex-col items-end gap-2.5">
              <div className="flex items-center gap-3">
                <div className="flex flex-col items-end text-right">
                  <span className="text-[10px] uppercase tracking-[0.24em] text-slate-400">
                    Global perio risk
                  </span>
                  <div className="mt-1 flex items-center gap-2">
                    <div className="relative h-9 w-9">
                      <div className="absolute left-1/2 top-0 -translate-x-1/2 border-l-[9px] border-r-[9px] border-b-[16px] border-l-transparent border-r-transparent border-b-emerald-400/80" />
                      <div className="absolute left-1/2 top-[5px] -translate-x-1/2 border-l-[9px] border-r-[9px] border-b-[16px] border-l-transparent border-r-transparent border-b-amber-400/90" />
                      <div className="absolute left-1/2 top-[10px] -translate-x-1/2 border-l-[9px] border-r-[9px] border-b-[16px] border-l-transparent border-r-transparent border-b-rose-500/90" />
                    </div>
                    <div className="flex flex-col text-[10px] text-slate-300">
                      <span>AI Perio Score: 78/100</span>
                      <span className="text-amber-300">
                        High risk · Tight maintenance
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <button className="rounded-full border border-emerald-500/70 bg-emerald-500/10 px-3 py-1.5 text-[11px] font-semibold text-emerald-100 hover:bg-emerald-500/20 transition-colors">
                Cleared for perio surgery · No critical alerts
              </button>

              <div className="flex flex-col items-end text-[10px] text-slate-400">
                <span>Caries risk: low · Ortho: not active</span>
                <span>Medical alerts: already reviewed today</span>
              </div>
            </div>
          </div>
        </section>

        {/* LAYOUT PRINCIPAL */}
        <div className="grid gap-5 lg:grid-cols-[1.7fr,1.2fr]">
          {/* COLUMNA IZQUIERDA */}
          <div className="space-y-5">
            {/* TRIAGE PERIO */}
            <Card
              title="Perio Triage & Global Risk Matrix"
              subtitle="Diagnóstico de base, factores sistémicos, hábitos y fenotipo periodontitis."
              badge="Triage"
            >
              <div className="grid gap-3 text-[11px] md:grid-cols-4">
                <div className="md:col-span-2">
                  <label className="mb-1 block font-medium text-slate-300">
                    Link to ADIE EMR patient
                  </label>
                  <button className="w-full rounded-full border border-emerald-500/70 bg-emerald-500/10 px-3 py-2 text-[11px] font-semibold text-emerald-100 hover:bg-emerald-500/20 transition">
                    Select patient from EMR
                  </button>
                </div>
                <div>
                  <label className="mb-1 block font-medium text-slate-300">
                    Perio case ID
                  </label>
                  <Input placeholder="ADIE-PERIO-0012" />
                </div>
                <div>
                  <label className="mb-1 block font-medium text-slate-300">
                    Perio phenotype
                  </label>
                  <Select defaultValue="">
                    <option value="">Select…</option>
                    <option>Localized</option>
                    <option>Generalized</option>
                    <option>Molar-incisor pattern</option>
                  </Select>
                </div>
              </div>

              <div className="mt-4 grid gap-3 text-[11px] md:grid-cols-5">
                <div>
                  <label className="mb-1 block font-medium text-slate-300">
                    Stage
                  </label>
                  <Select defaultValue="">
                    <option value="">Select…</option>
                    <option>Stage I</option>
                    <option>Stage II</option>
                    <option>Stage III</option>
                    <option>Stage IV</option>
                  </Select>
                </div>
                <div>
                  <label className="mb-1 block font-medium text-slate-300">
                    Grade
                  </label>
                  <Select defaultValue="">
                    <option value="">Select…</option>
                    <option>Grade A (slow)</option>
                    <option>Grade B (moderate)</option>
                    <option>Grade C (rapid)</option>
                  </Select>
                </div>
                <div>
                  <label className="mb-1 block font-medium text-slate-300">
                    BOP %
                  </label>
                  <Input placeholder="e.g. 52%" />
                </div>
                <div>
                  <label className="mb-1 block font-medium text-slate-300">
                    Plaque %
                  </label>
                  <Input placeholder="e.g. 68%" />
                </div>
                <div>
                  <label className="mb-1 block font-medium text-slate-300">
                    Furcation involvement
                  </label>
                  <Select defaultValue="">
                    <option value="">Select…</option>
                    <option>No furcation</option>
                    <option>Class I</option>
                    <option>Class II</option>
                    <option>Class III</option>
                  </Select>
                </div>
              </div>

              <div className="mt-4 grid gap-3 text-[11px] md:grid-cols-4">
                <div>
                  <label className="mb-1 block font-medium text-slate-300">
                    Smoking / habits
                  </label>
                  <Select defaultValue="">
                    <option value="">Select…</option>
                    <option>Non-smoker</option>
                    <option>Former smoker</option>
                    <option>Smoker (&lt;10 cig/day)</option>
                    <option>Smoker (&gt;10 cig/day)</option>
                    <option>Vaping / other</option>
                  </Select>
                </div>
                <div>
                  <label className="mb-1 block font-medium text-slate-300">
                    Diabetes status
                  </label>
                  <Select defaultValue="">
                    <option value="">Select…</option>
                    <option>No diabetes</option>
                    <option>Pre-diabetes</option>
                    <option>Diabetes (controlled)</option>
                    <option>Diabetes (uncontrolled)</option>
                  </Select>
                </div>
                <div>
                  <label className="mb-1 block font-medium text-slate-300">
                    Cardiovascular disease
                  </label>
                  <Select defaultValue="">
                    <option value="">Select…</option>
                    <option>No CVD</option>
                    <option>CVD under control</option>
                    <option>Recent event (&lt;6m)</option>
                  </Select>
                </div>
                <div>
                  <label className="mb-1 block font-medium text-slate-300">
                    Systemic notes
                  </label>
                  <Input placeholder="Physician, medications, INR, etc." />
                </div>
              </div>

              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-800 bg-slate-950/80 px-3 py-3 text-[11px]">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-slate-400">
                    AI Perio risk engine (future):
                  </span>
                  <span className="rounded-full bg-rose-500/10 px-2 py-0.5 text-rose-200">
                    5-year tooth loss risk: 32%
                  </span>
                  <span className="rounded-full bg-amber-500/10 px-2 py-0.5 text-amber-200">
                    Systemic inflammation risk: elevated
                  </span>
                </div>
                <span className="text-[10px] text-slate-500">
                  Will auto-update from pockets, bone, habits & systemic data.
                </span>
              </div>
            </Card>

            {/* GLOBAL POCKET & BONE MAP FUNCIONAL */}
            <Card
              title="Global Pocket & Bone Map"
              subtitle="Arcada superior e inferior con controles interactivos para bolsas y pérdida ósea."
              badge="3D Perio Map"
            >
              <p className="mb-2 text-[11px] text-slate-400">
                Cada diente muestra su riesgo periodontal actual. Usa los
                botones − / + para simular las mediciones clínicas; el color se
                ajusta automáticamente según la profundidad de bolsa. En el
                futuro, estos valores vendrán del odontograma SVG y de la
                radiología.
              </p>

              <div className="mb-4 flex flex-wrap items-center gap-3 text-[10px]">
                <div className="flex items-center gap-1">
                  <span className={`h-2 w-2 rounded-full ${riskDotClasses("low")}`} />
                  <span className="text-slate-400">0–3 mm · Healthy / maintenance</span>
                </div>
                <div className="flex items-center gap-1">
                  <span
                    className={`h-2 w-2 rounded-full ${riskDotClasses("moderate")}`}
                  />
                  <span className="text-slate-400">
                    4–5 mm · Moderate · SRP / local therapy
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <span className={`h-2 w-2 rounded-full ${riskDotClasses("high")}`} />
                  <span className="text-slate-400">
                    ≥6 mm · Critical · Surgical / regenerative
                  </span>
                </div>
              </div>

              {/* Arcada superior */}
              <div className="mb-4 rounded-2xl border border-slate-800 bg-slate-950/80 px-3 py-3">
                <div className="mb-2 flex items-center justify-between text-[11px]">
                  <span className="font-medium text-slate-200">
                    Upper Arch · 18 → 28
                  </span>
                  <span className="text-slate-500">
                    Max pocket: 7–8 mm · Bone loss: 45%
                  </span>
                </div>
                <div className="grid grid-cols-8 gap-2">
                  {upperTeeth.map((tooth, index) => {
                    const risk = getPocketRisk(tooth.pocket);
                    return (
                      <div
                        key={tooth.id}
                        className="group flex flex-col items-center justify-center rounded-xl border border-slate-800 bg-slate-900/70 px-1.5 py-1.5 text-[10px] hover:border-emerald-400/70 hover:bg-slate-900 transition"
                      >
                        <span
                          className={`mb-1 h-2 w-2 rounded-full ${riskDotClasses(
                            risk
                          )}`}
                        />
                        <span className="font-semibold text-slate-100">
                          {tooth.id}
                        </span>

                        <div className="mt-1 flex items-center gap-1 text-[9px] text-slate-300">
                          <button
                            type="button"
                            onClick={() =>
                              updateTooth("upper", index, "pocket", -1)
                            }
                            className="h-4 w-4 rounded-full border border-slate-700 text-[9px] leading-none hover:border-emerald-400"
                          >
                            −
                          </button>
                          <span>Pocket {tooth.pocket} mm</span>
                          <button
                            type="button"
                            onClick={() =>
                              updateTooth("upper", index, "pocket", 1)
                            }
                            className="h-4 w-4 rounded-full border border-slate-700 text-[9px] leading-none hover:border-emerald-400"
                          >
                            +
                          </button>
                        </div>

                        <div className="mt-1 flex items-center gap-1 text-[9px] text-slate-400">
                          <button
                            type="button"
                            onClick={() =>
                              updateTooth("upper", index, "boneLoss", -5)
                            }
                            className="h-4 w-4 rounded-full border border-slate-700 text-[9px] leading-none hover:border-emerald-400"
                          >
                            −
                          </button>
                          <span>Bone {tooth.boneLoss}%</span>
                          <button
                            type="button"
                            onClick={() =>
                              updateTooth("upper", index, "boneLoss", 5)
                            }
                            className="h-4 w-4 rounded-full border border-slate-700 text-[9px] leading-none hover:border-emerald-400"
                          >
                            +
                          </button>
                        </div>

                        <span className="mt-1 text-[9px] text-slate-500 group-hover:text-emerald-200">
                          Open perio chart
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Arcada inferior */}
              <div className="rounded-2xl border border-slate-800 bg-slate-950/80 px-3 py-3">
                <div className="mb-2 flex items-center justify-between text-[11px]">
                  <span className="font-medium text-slate-200">
                    Lower Arch · 48 → 38
                  </span>
                  <span className="text-slate-500">
                    Max pocket: 8–9 mm · Bone loss: 52%
                  </span>
                </div>
                <div className="grid grid-cols-8 gap-2">
                  {lowerTeeth.map((tooth, index) => {
                    const risk = getPocketRisk(tooth.pocket);
                    return (
                      <div
                        key={tooth.id}
                        className="group flex flex-col items-center justify-center rounded-xl border border-slate-800 bg-slate-900/70 px-1.5 py-1.5 text-[10px] hover:border-emerald-400/70 hover:bg-slate-900 transition"
                      >
                        <span
                          className={`mb-1 h-2 w-2 rounded-full ${riskDotClasses(
                            risk
                          )}`}
                        />
                        <span className="font-semibold text-slate-100">
                          {tooth.id}
                        </span>

                        <div className="mt-1 flex items-center gap-1 text-[9px] text-slate-300">
                          <button
                            type="button"
                            onClick={() =>
                              updateTooth("lower", index, "pocket", -1)
                            }
                            className="h-4 w-4 rounded-full border border-slate-700 text-[9px] leading-none hover:border-emerald-400"
                          >
                            −
                          </button>
                          <span>Pocket {tooth.pocket} mm</span>
                          <button
                            type="button"
                            onClick={() =>
                              updateTooth("lower", index, "pocket", 1)
                            }
                            className="h-4 w-4 rounded-full border border-slate-700 text-[9px] leading-none hover:border-emerald-400"
                          >
                            +
                          </button>
                        </div>

                        <div className="mt-1 flex items-center gap-1 text-[9px] text-slate-400">
                          <button
                            type="button"
                            onClick={() =>
                              updateTooth("lower", index, "boneLoss", -5)
                            }
                            className="h-4 w-4 rounded-full border border-slate-700 text-[9px] leading-none hover:border-emerald-400"
                          >
                            −
                          </button>
                          <span>Bone {tooth.boneLoss}%</span>
                          <button
                            type="button"
                            onClick={() =>
                              updateTooth("lower", index, "boneLoss", 5)
                            }
                            className="h-4 w-4 rounded-full border border-slate-700 text-[9px] leading-none hover:border-emerald-400"
                          >
                            +
                          </button>
                        </div>

                        <span className="mt-1 text-[9px] text-slate-500 group-hover:text-emerald-200">
                          Open perio chart
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <p className="mt-3 text-[10px] text-slate-500">
                Future: this map will be fully driven by the SVG periodontal
                chart, radiographic bone levels and AI predictions. Clicking a
                tooth will zoom into 6-point pocket chart + furcation + mobility.
              </p>
            </Card>

            {/* CIRUGÍA PERIO / IMPLANTES */}
            <Card
              title="Implant & Regenerative Perio Surgery Board"
              subtitle="Planeación de cirugía ósea, implantes, membranas y materiales regenerativos."
              badge="Surgery"
            >
              <p className="mb-3 text-[11px] text-slate-400">
                Este tablero conecta al periodoncista con el módulo de implantes y
                radiología. Cada fila representa un sitio quirúrgico con todos los
                detalles: defecto, implante, membrana, injerto y notas de torque /
                estabilidad.
              </p>

              <div className="grid gap-2 text-[11px]">
                {surgicalRows.map((row) => (
                  <div
                    key={row.id}
                    className="grid grid-cols-1 gap-2 rounded-2xl border border-slate-800 bg-slate-950/90 px-3 py-3 md:grid-cols-[1.2fr,1.4fr,1.4fr]"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-200">
                          Site {row.id}
                        </span>
                        <span className="text-[10px] text-slate-500">
                          {row.label}
                        </span>
                      </div>
                      <div>
                        <label className="mb-1 block font-medium text-slate-300">
                          Defect type
                        </label>
                        <Select defaultValue="">
                          <option value="">Select…</option>
                          <option>Infrabony 1-wall</option>
                          <option>Infrabony 2-wall</option>
                          <option>Infrabony 3-wall</option>
                          <option>Furcation Class II</option>
                          <option>Peri-implantitis defect</option>
                        </Select>
                      </div>
                      <div>
                        <label className="mb-1 block font-medium text-slate-300">
                          Link to radiology
                        </label>
                        <Input placeholder="CBCT slice / PA ID…" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div>
                        <label className="mb-1 block font-medium text-slate-300">
                          Implant brand & line
                        </label>
                        <Select defaultValue="">
                          <option value="">Select…</option>
                          <option>Nobel Biocare</option>
                          <option>Straumann</option>
                          <option>BioHorizons</option>
                          <option>Zimmer Biomet</option>
                          <option>Other / custom</option>
                        </Select>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <div>
                          <label className="mb-1 block font-medium text-slate-300">
                            Diameter (mm)
                          </label>
                          <Input placeholder="4.0" />
                        </div>
                        <div>
                          <label className="mb-1 block font-medium text-slate-300">
                            Length (mm)
                          </label>
                          <Input placeholder="10" />
                        </div>
                        <div>
                          <label className="mb-1 block font-medium text-slate-300">
                            Torque (Ncm)
                          </label>
                          <Input placeholder="35" />
                        </div>
                      </div>
                      <div>
                        <label className="mb-1 block font-medium text-slate-300">
                          Primary stability / ISQ
                        </label>
                        <Input placeholder="e.g. High / ISQ 78" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="mb-1 block font-medium text-slate-300">
                            Membrane brand
                          </label>
                          <Select defaultValue="">
                            <option value="">Select…</option>
                            <option>Bio-Gide</option>
                            <option>OsseoGuard</option>
                            <option>Resorbable collagen</option>
                            <option>Non-resorbable PTFE</option>
                            <option>No membrane</option>
                          </Select>
                        </div>
                        <div>
                          <label className="mb-1 block font-medium text-slate-300">
                            Graft material
                          </label>
                          <Select defaultValue="">
                            <option value="">Select…</option>
                            <option>Autograft</option>
                            <option>Xenograft</option>
                            <option>Allograft</option>
                            <option>Alloplast</option>
                            <option>Combination</option>
                          </Select>
                        </div>
                      </div>
                      <div>
                        <label className="mb-1 block font-medium text-slate-300">
                          Perio–implant coordination notes
                        </label>
                        <TextArea
                          rows={3}
                          placeholder="Flap design, papilla preservation, regenerative strategy, suturing, provisionalization…"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-3 flex items-center justify-between text-[10px] text-slate-500">
                <span>
                  Future: auto-sync with implant module, brand catalogs and
                  inventory / lot tracking.
                </span>
                <button className="rounded-full border border-slate-700 bg-slate-900/80 px-2.5 py-1 text-[10px] text-slate-200 hover:border-emerald-400 hover:text-emerald-100 transition">
                  + Add surgery site
                </button>
              </div>
            </Card>
          </div>

          {/* COLUMNA DERECHA */}
          <div className="space-y-5">
            {/* MANTENIMIENTO */}
            <Card
              title="Perio Maintenance & Shared Care Program"
              subtitle="Intervalos, responsables y coordinación con odontología general y otras especialidades."
              badge="Maintenance"
            >
              <div className="grid gap-3 text-[11px] md:grid-cols-2">
                <div>
                  <label className="mb-1 block font-medium text-slate-300">
                    Maintenance interval
                  </label>
                  <Select defaultValue="">
                    <option value="">Select…</option>
                    <option>Every 3 months</option>
                    <option>Every 4 months</option>
                    <option>Every 6 months</option>
                    <option>Alternating 3 / 6 months</option>
                    <option>Custom</option>
                  </Select>
                </div>
                <div>
                  <label className="mb-1 block font-medium text-slate-300">
                    Maintenance risk level
                  </label>
                  <Select defaultValue="">
                    <option value="">Select…</option>
                    <option>Low (stable)</option>
                    <option>Moderate (monitor)</option>
                    <option>High (tight recall)</option>
                  </Select>
                </div>
              </div>

              <div className="mt-3 grid gap-3 text-[11px] md:grid-cols-2">
                <div>
                  <label className="mb-1 block font-medium text-slate-300">
                    Responsible provider
                  </label>
                  <Select defaultValue="">
                    <option value="">Select…</option>
                    <option>Periodontist only</option>
                    <option>Perio + General dentist</option>
                    <option>General dentist with perio oversight</option>
                  </Select>
                </div>
                <div>
                  <label className="mb-1 block font-medium text-slate-300">
                    Ortho / Prostho impact
                  </label>
                  <Select defaultValue="">
                    <option value="">Select…</option>
                    <option>No active ortho / prostho</option>
                    <option>Active ortho · need close perio</option>
                    <option>Complex prostho plan linked</option>
                  </Select>
                </div>
              </div>

              <div className="mt-3 grid gap-3 text-[11px] md:grid-cols-3">
                <div>
                  <label className="mb-1 block font-medium text-slate-300">
                    Last SRP / surgery
                  </label>
                  <Input placeholder="2025-11-02" />
                </div>
                <div>
                  <label className="mb-1 block font-medium text-slate-300">
                    Re-evaluation date
                  </label>
                  <Input placeholder="2026-01-15" />
                </div>
                <div>
                  <label className="mb-1 block font-medium text-slate-300">
                    Next maintenance visit
                  </label>
                  <Input placeholder="2026-03-15" />
                </div>
              </div>

              <div className="mt-4 rounded-2xl border border-slate-800 bg-slate-950/90 px-3 py-3 text-[11px]">
                <div className="mb-2 flex items-center justify-between">
                  <span className="font-medium text-slate-200">
                    Compliance & reminders (future AI)
                  </span>
                  <span className="rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] text-amber-200">
                    Compliance: 62%
                  </span>
                </div>
                <ul className="space-y-1 text-slate-400">
                  <li>• Smart reminders via app / WhatsApp / email.</li>
                  <li>• Alerts when patient misses 2+ visits in 12 months.</li>
                  <li>• Automatic notes in General & Implants about perio status.</li>
                </ul>
              </div>
            </Card>

            {/* AI INSIGHT */}
            <Card
              title="Perio AI Insight Dashboard"
              subtitle="Cockpit rápido para entender riesgo y prioridades del caso."
              badge="AI Core"
            >
              <div className="grid gap-3 text-[11px] md:grid-cols-2">
                <div className="rounded-2xl border border-slate-800 bg-slate-950/90 px-3 py-3">
                  <p className="mb-2 text-[10px] font-medium uppercase tracking-[0.16em] text-slate-400">
                    Key indicators
                  </p>
                  <ul className="space-y-1 text-slate-300">
                    <li>• Teeth at surgical risk: 6</li>
                    <li>• Teeth with ≥7 mm pockets: 4</li>
                    <li>• Sites with BOP: 46%</li>
                    <li>• Sites with suppuration: 7%</li>
                  </ul>
                </div>
                <div className="rounded-2xl border border-slate-800 bg-slate-950/90 px-3 py-3">
                  <p className="mb-2 text-[10px] font-medium uppercase tracking-[0.16em] text-slate-400">
                    AI-driven suggestions (future)
                  </p>
                  <ul className="space-y-1 text-slate-300">
                    <li>• Consider re-evaluation of LL molars within 6–8 weeks.</li>
                    <li>• Link with diabetes management plan (HbA1c &gt; 7.0).</li>
                    <li>• Prioritize plaque control coaching next visit.</li>
                    <li>• Flag case for prostho / implant meeting.</li>
                  </ul>
                </div>
              </div>

              <div className="mt-3 rounded-2xl border border-slate-800 bg-slate-950/90 px-3 py-3 text-[11px]">
                <p className="mb-2 text-[10px] font-medium uppercase tracking-[0.16em] text-slate-400">
                  Perio stability trend (concept)
                </p>
                <div className="relative mt-1 h-3 w-full overflow-hidden rounded-full bg-slate-900">
                  <div className="absolute left-0 top-0 h-full w-1/3 bg-emerald-500/60" />
                  <div className="absolute left-1/3 top-0 h-full w-1/3 bg-amber-500/70" />
                  <div className="absolute left-2/3 top-0 h-full w-1/3 bg-rose-500/80" />
                  <div className="absolute left-[58%] top-0 h-full w-[2px] bg-slate-50 shadow-[0_0_12px_rgba(248,250,252,0.9)]" />
                </div>
                <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400">
                  <span>Stable</span>
                  <span>Borderline</span>
                  <span>Decompensated</span>
                </div>
              </div>
            </Card>

            {/* NOTAS CLÍNICAS */}
            <Card
              title="Perio Notes & Clinical Templates"
              subtitle="Notas clínicas de alto nivel, educación al paciente y acuerdos interdisciplinarios."
              badge="Notes"
            >
              <TextArea
                rows={6}
                placeholder={`Example template:
- Initial diagnosis and justification of perio staging & grading
- Explanation to patient about bone loss and systemic links
- Agreed regenerative / surgical plan including brands (implants, membranes, grafts)
- Specific maintenance recommendations and home care instructions
- Notes for General / Ortho / Prostho / Medical team…`}
              />
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}
