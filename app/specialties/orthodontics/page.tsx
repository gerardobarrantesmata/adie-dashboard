"use client";

import React, { Suspense, useState } from "react";
import Link from "next/link";
import { SpecialtyTopActions } from "@/app/_components/SpecialtyTopActions";

/* ---------- UI BASICS ---------- */

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

/* ---------- ORTHO TYPES & HELPERS ---------- */

type OrthoPhase = "Assessment" | "Alignment" | "Finishing";
type Severity = "normal" | "borderline" | "critical";
type RiskLevel = "ok" | "warning" | "critical";

function getOverjetSeverity(value: number): Severity {
  if (value >= 1 && value <= 4) return "normal";
  if ((value > 4 && value <= 6) || (value >= 0 && value < 1)) return "borderline";
  return "critical";
}

function getOverbiteSeverity(value: number): Severity {
  if (value >= 20 && value <= 40) return "normal"; // porcentaje
  if ((value > 40 && value <= 60) || (value >= 10 && value < 20)) return "borderline";
  return "critical";
}

function getCrowdingSeverity(value: number): Severity {
  if (Math.abs(value) <= 2) return "normal";
  if (Math.abs(value) <= 4) return "borderline";
  return "critical";
}

function severityClasses(severity: Severity): string {
  if (severity === "normal") {
    return "border-emerald-500/50 bg-emerald-500/10 text-emerald-100";
  }
  if (severity === "borderline") {
    return "border-amber-400/60 bg-amber-500/15 text-amber-100";
  }
  return "border-rose-500/60 bg-rose-500/15 text-rose-100";
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

/* ---------- GLOBAL RISK PILL (VERDE / AMBAR / ROJO) ---------- */

function RiskStatusPill({ level }: { level: RiskLevel }) {
  let classes =
    "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-medium shadow-sm ";
  let iconClasses =
    "flex h-5 w-5 items-center justify-center rounded-full border-2 text-[11px] font-bold";
  let label = "";

  if (level === "ok") {
    classes +=
      "border-emerald-500/70 bg-emerald-500/10 text-emerald-100 shadow-[0_0_18px_rgba(16,185,129,0.6)]";
    iconClasses += " border-emerald-400 bg-emerald-500/80 text-slate-950";
    label = "Cleared for ortho · no critical alerts";
  } else if (level === "warning") {
    classes +=
      "border-amber-500/70 bg-amber-500/10 text-amber-100 shadow-[0_0_18px_rgba(245,158,11,0.6)]";
    iconClasses += " border-amber-400 bg-amber-500/80 text-slate-950";
    label = "Moderate ortho risk · monitor closely";
  } else {
    classes +=
      "border-rose-500/70 bg-rose-500/10 text-rose-100 shadow-[0_0_18px_rgba(248,113,113,0.6)]";
    iconClasses += " border-rose-400 bg-rose-500/80 text-slate-950";
    label = "High ortho risk · review before continuing";
  }

  return (
    <div className={classes}>
      <span className={iconClasses}>{level === "ok" ? "✓" : "!"}</span>
      <span>{label}</span>
    </div>
  );
}

/* ---------- PATIENT SNAPSHOT (HEADER CLÍNICO) ---------- */

function PatientSnapshotBar({ riskLevel }: { riskLevel: RiskLevel }) {
  return (
    <section className="mb-6 rounded-2xl border border-slate-800 bg-slate-950/80 px-5 py-4 md:py-5">
      <div className="flex flex-wrap items-start gap-4 md:gap-6">
        {/* Foto y flags */}
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-center gap-2">
            <div className="flex h-20 w-20 items-center justify-center rounded-full border border-slate-700 bg-slate-900 text-[10px] uppercase tracking-[0.18em] text-slate-400">
              Patient photo
            </div>
            <button className="rounded-full border border-sky-500/70 bg-sky-500/10 px-3 py-1 text-[10px] font-semibold text-sky-100 hover:bg-sky-500/20">
              ⬆ Upload
            </button>
          </div>
          <div className="space-y-2 text-[11px]">
            <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500">
              Active orthodontic patient
            </p>
            <p className="text-sm font-semibold text-slate-50">
              John / Jane Doe <span className="text-slate-500">·</span>{" "}
              <span className="text-slate-300">ID ADIE-PT-0001</span>
            </p>
            <p className="text-[11px] text-slate-400">
              DOB: 2008-05-17 · Age: 16y · Gender: Female · National ID / passport
            </p>
            <div className="flex flex-wrap gap-2">
              <button className="inline-flex items-center gap-1 rounded-full border border-amber-400/60 bg-amber-500/10 px-2.5 py-0.5 text-[10px] font-medium text-amber-100">
                ⭐ VIP
              </button>
              <button className="inline-flex items-center gap-1 rounded-full border border-rose-500/60 bg-rose-500/10 px-2.5 py-0.5 text-[10px] font-medium text-rose-100">
                💳 Financial hold
              </button>
              <button className="inline-flex items-center gap-1 rounded-full border border-sky-500/60 bg-sky-500/10 px-2.5 py-0.5 text-[10px] font-medium text-sky-100">
                🩺 View full EMR
              </button>
            </div>
          </div>
        </div>

        {/* Derecha: indicador global + mini resumen clínico */}
        <div className="ml-auto flex w-full flex-col gap-3 md:w-auto md:items-end">
          <div className="flex justify-end">
            <RiskStatusPill level={riskLevel} />
          </div>

          <div className="grid gap-3 text-[10px] text-slate-300 md:grid-cols-2">
            <div>
              <p className="mb-1 font-semibold text-slate-200">
                Systemic &amp; medical flags
              </p>
              <p className="text-slate-400">
                No known systemic disease. Allergies: Penicillin. Medications:
                none. <span className="text-emerald-300">ASA I</span>.
              </p>
            </div>
            <div>
              <p className="mb-1 font-semibold text-slate-200">
                Dental &amp; ortho quick flags
              </p>
              <ul className="space-y-0.5 text-slate-400">
                <li>• Previous ortho: no</li>
                <li>• Perio risk: low · caries risk: moderate</li>
                <li>• TMJ: no pain · no joint sounds</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- MAIN PAGE (INNER) ---------- */

function OrthodonticsWorkspacePageInner() {
  const [activePhase, setActivePhase] = useState<OrthoPhase>("Assessment");

  // Métricas clínicas clave
  const [overjet, setOverjet] = useState<number>(4); // mm
  const [overbite, setOverbite] = useState<number>(30); // %
  const [crowdingUpper, setCrowdingUpper] = useState<number>(3); // mm
  const [crowdingLower, setCrowdingLower] = useState<number>(4); // mm

  // Riesgo global ortodóncico
  const [riskFlag, setRiskFlag] = useState<string>("");

  // Alineadores / tiempo
  const [currentAligner, setCurrentAligner] = useState(5);
  const [totalAligners, setTotalAligners] = useState(24);
  const [monthsInTreatment, setMonthsInTreatment] = useState(6);

  const alignerProgress =
    totalAligners > 0
      ? Math.min(100, (currentAligner / totalAligners) * 100)
      : 0;

  // Mapear riskFlag → color global
  let globalRiskLevel: RiskLevel = "ok";
  if (riskFlag === "High caries risk") {
    globalRiskLevel = "warning";
  }
  if (
    riskFlag === "Periodontal compromise" ||
    riskFlag === "Root resorption history" ||
    riskFlag === "TMJ / facial pain"
  ) {
    globalRiskLevel = "critical";
  }

  /* ---------- BLOQUES QUE SE REUTILIZAN ENTRE FASES ---------- */

  const OrthoContextCard = (
    <Card
      title="Ortho Case Context"
      subtitle="Link EMR, growth status and baseline malocclusion."
      badge="Context"
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
            Ortho case ID
          </label>
          <Input placeholder="ADIE-ORTHO-0001" />
        </div>
        <div>
          <label className="mb-1 block text-[11px] font-medium text-slate-300">
            Growth status
          </label>
          <Select defaultValue="">
            <option value="">Select…</option>
            <option>Pre-growth spurt</option>
            <option>Peak growth</option>
            <option>Post-growth / adult</option>
            <option>Unknown</option>
          </Select>
        </div>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-4">
        <div>
          <label className="mb-1 block text-[11px] font-medium text-slate-300">
            Skeletal pattern
          </label>
          <Select defaultValue="">
            <option value="">Select…</option>
            <option>Class I</option>
            <option>Class II</option>
            <option>Class III</option>
            <option>Asymmetric / other</option>
          </Select>
        </div>
        <div>
          <label className="mb-1 block text-[11px] font-medium text-slate-300">
            Vertical pattern
          </label>
          <Select defaultValue="">
            <option value="">Select…</option>
            <option>Normodivergent</option>
            <option>Hyperdivergent (high angle)</option>
            <option>Hypodivergent (low angle)</option>
          </Select>
        </div>
        <div>
          <label className="mb-1 block text-[11px] font-medium text-slate-300">
            Main complaint (patient)
          </label>
          <Input placeholder="Crowding, open bite, smile aesthetics…" />
        </div>
        <div>
          <label className="mb-1 block text-[11px] font-medium text-slate-300">
            Risk flags
          </label>
          <Select
            value={riskFlag}
            onChange={(e) => setRiskFlag(e.target.value)}
          >
            <option value="">Select…</option>
            <option value="Normal risk">Normal risk</option>
            <option value="High caries risk">High caries risk</option>
            <option value="Periodontal compromise">Periodontal compromise</option>
            <option value="Root resorption history">Root resorption history</option>
            <option value="TMJ / facial pain">TMJ / facial pain</option>
          </Select>
        </div>
      </div>
    </Card>
  );

  const AppliancePlanCard = (
    <Card
      title="Appliance & Biomechanics Plan"
      subtitle="Brackets vs aligners, extractions, distalization and anchorage."
      badge="Planning"
    >
      <div className="grid gap-3 md:grid-cols-3">
        <div>
          <label className="mb-1 block text-[11px] font-medium text-slate-300">
            Main appliance
          </label>
          <Select defaultValue="">
            <option value="">Select…</option>
            <option>Metallic fixed brackets</option>
            <option>Esthetic fixed brackets</option>
            <option>Clear aligners (Invisalign-type)</option>
            <option>Lingual appliance</option>
            <option>Hybrid (aligners + fixed)</option>
          </Select>
        </div>
        <div>
          <label className="mb-1 block text-[11px] font-medium text-slate-300">
            Extraction plan
          </label>
          <Select defaultValue="">
            <option value="">Select…</option>
            <option>Non-extraction</option>
            <option>4 premolars</option>
            <option>Upper premolars only</option>
            <option>Lower premolars only</option>
            <option>Asymmetric / custom</option>
          </Select>
        </div>
        <div>
          <label className="mb-1 block text-[11px] font-medium text-slate-300">
            Anchorage strategy
          </label>
          <Select defaultValue="">
            <option value="">Select…</option>
            <option>Conventional anchorage</option>
            <option>TADs / mini-implants</option>
            <option>Transpalatal / lingual arch</option>
            <option>Headgear / extraoral</option>
          </Select>
        </div>
      </div>

      <div className="mt-3 grid gap-3 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-[11px] font-medium text-slate-300">
            Key treatment objectives
          </label>
          <TextArea
            rows={3}
            placeholder="Align incisors, correct overjet/overbite, close spaces, improve smile arc, coordinate arches…"
          />
        </div>
        <div>
          <label className="mb-1 block text-[11px] font-medium text-slate-300">
            Special considerations
          </label>
          <TextArea
            rows={3}
            placeholder="Thin biotype, short roots, trauma history, periodontal limits, interdisciplinary coordination…"
          />
        </div>
      </div>
    </Card>
  );

  const TimelineCard = (
    <Card
      title="Aligner / Braces Timeline"
      subtitle="Track stages, aligner number, refinements and total duration."
      badge="Timeline"
    >
      <div className="grid gap-3 md:grid-cols-3">
        <div>
          <label className="mb-1 block text-[10px] font-medium text-slate-300">
            Treatment mode
          </label>
          <Select defaultValue="">
            <option value="">Select…</option>
            <option>Clear aligners only</option>
            <option>Fixed appliances only</option>
            <option>Hybrid</option>
          </Select>
        </div>
        <div>
          <label className="mb-1 block text-[10px] font-medium text-slate-300">
            Total planned aligners
          </label>
          <Input
            type="number"
            min={0}
            value={totalAligners}
            onChange={(e) =>
              setTotalAligners(Math.max(0, Number(e.target.value || 0)))
            }
          />
        </div>
        <div>
          <label className="mb-1 block text-[10px] font-medium text-slate-300">
            Current aligner / activation
          </label>
          <Input
            type="number"
            min={0}
            value={currentAligner}
            onChange={(e) =>
              setCurrentAligner(Math.max(0, Number(e.target.value || 0)))
            }
          />
        </div>
      </div>

      <div className="mt-3 grid gap-3 md:grid-cols-3">
        <div>
          <label className="mb-1 block text-[10px] font-medium text-slate-300">
            Months in treatment
          </label>
          <Input
            type="number"
            min={0}
            value={monthsInTreatment}
            onChange={(e) =>
              setMonthsInTreatment(Math.max(0, Number(e.target.value || 0)))
            }
          />
        </div>
        <div>
          <label className="mb-1 block text-[10px] font-medium text-slate-300">
            Expected total duration (months)
          </label>
          <Input placeholder="e.g. 18–24" />
        </div>
        <div>
          <label className="mb-1 block text-[10px] font-medium text-slate-300">
            Refinement / finishing plan
          </label>
          <Select defaultValue="">
            <option value="">Select…</option>
            <option>No refinement planned</option>
            <option>1 refinement set</option>
            <option>2+ refinement sets</option>
            <option>Finishing with fixed appliances</option>
          </Select>
        </div>
      </div>

      <div className="mt-4">
        <p className="mb-1 text-[10px] font-medium text-slate-300">
          Visual progress
        </p>
        <div className="h-3 w-full overflow-hidden rounded-full bg-slate-800">
          <div
            className="h-full rounded-full bg-sky-400"
            style={{ width: `${alignerProgress}%` }}
          />
        </div>
        <p className="mt-1 text-[10px] text-slate-400">
          {currentAligner}/{totalAligners} aligners • {monthsInTreatment} months
          in treatment. Future step: connect this bar to the Dental Chart
          timeline.
        </p>
      </div>
    </Card>
  );

  const RetentionCard = (
    <Card
      title="Retention, Risks & Communication"
      subtitle="Long-term stability and key messages for the patient."
      badge="Retention"
    >
      <div className="grid gap-3 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-[10px] font-medium text-slate-300">
            Retention plan
          </label>
          <Select defaultValue="">
            <option value="">Select…</option>
            <option>Removable retainers (Essix)</option>
            <option>Hawley retainers</option>
            <option>Bonded fixed retainers</option>
            <option>Combination (fixed + removable)</option>
          </Select>
        </div>
        <div>
          <label className="mb-1 block text-[10px] font-medium text-slate-300">
            Retention risk level
          </label>
          <Select defaultValue="">
            <option value="">Select…</option>
            <option>Low relapse risk</option>
            <option>Moderate (crowding / rotations)</option>
            <option>High (spacing, open bite, severe rotations)</option>
          </Select>
        </div>
      </div>

      <div className="mt-3 grid gap-3 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-[10px] font-medium text-slate-300">
            Key warnings (roots, perio, TMJ)
          </label>
          <TextArea
            rows={3}
            placeholder="Root resorption risk, bone limits, perio support, TMJ monitoring…"
          />
        </div>
        <div>
          <label className="mb-1 block text-[10px] font-medium text-slate-300">
            Messages documented with patient
          </label>
          <TextArea
            rows={3}
            placeholder="Explained need for retention, hygiene expectations, missed-alignment risks, need for check-ups…"
          />
        </div>
      </div>
    </Card>
  );

  const InHouseAlignerLabCard = (
    <Card
      title="In-house Clear Aligner Lab"
      subtitle="For clinics that design and print their own aligners."
      badge="Lab"
    >
      <div className="grid gap-3 md:grid-cols-3">
        <div>
          <label className="mb-1 block text-[10px] font-medium text-slate-300">
            CBCT status
          </label>
          <Select defaultValue="">
            <option value="">Select…</option>
            <option>Not requested</option>
            <option>Requested · pending scan</option>
            <option>Imported &amp; segmented</option>
          </Select>
        </div>
        <div>
          <label className="mb-1 block text-[10px] font-medium text-slate-300">
            3D files (STL)
          </label>
          <Select defaultValue="">
            <option value="">Select…</option>
            <option>Upper &amp; lower scanned</option>
            <option>Upper only</option>
            <option>Lower only</option>
            <option>Pending capture</option>
          </Select>
        </div>
        <div>
          <label className="mb-1 block text-[10px] font-medium text-slate-300">
            Software pipeline
          </label>
          <Select defaultValue="">
            <option value="">Select…</option>
            <option>Exocad / 3Shape</option>
            <option>BlueSkyPlan</option>
            <option>uLab / OnyxCeph</option>
            <option>Custom in-house</option>
          </Select>
        </div>
      </div>

      <div className="mt-3 grid gap-3 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-[10px] font-medium text-slate-300">
            Lab workflow status
          </label>
          <Select defaultValue="">
            <option value="">Select…</option>
            <option>Digital setup in progress</option>
            <option>Setup approved · printing models</option>
            <option>Aligners thermoformed · trimming</option>
            <option>Delivered to patient</option>
          </Select>
        </div>
        <div>
          <label className="mb-1 block text-[10px] font-medium text-slate-300">
            Notes to in-house lab
          </label>
          <TextArea
            rows={3}
            placeholder="Torque control on upper incisors, expansion limits, occlusal goals, staging preferences…"
          />
        </div>
      </div>
    </Card>
  );

  const MetricsCard = (
    <Card
      title="Cephalometric & Diagnosis Metrics"
      subtitle="Color-coded overview of overjet, overbite, crowding and symmetry."
      badge="Assessment"
    >
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-3">
          <div>
            <label className="mb-1 block text-[10px] font-medium text-slate-300">
              Overjet (mm)
            </label>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                step="0.5"
                value={overjet}
                onChange={(e) => setOverjet(Number(e.target.value || 0))}
                className="max-w-[120px]"
              />
              <SeverityPill
                label="Overjet"
                value={`${overjet.toFixed(1)} mm`}
                severity={getOverjetSeverity(overjet)}
              />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-[10px] font-medium text-slate-300">
              Overbite (% incisal coverage)
            </label>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                step="1"
                value={overbite}
                onChange={(e) => setOverbite(Number(e.target.value || 0))}
                className="max-w-[120px]"
              />
              <SeverityPill
                label="Overbite"
                value={`${overbite.toFixed(0)} %`}
                severity={getOverbiteSeverity(overbite)}
              />
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <label className="mb-1 block text-[10px] font-medium text-slate-300">
              Upper arch crowding (mm)
            </label>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                step="0.5"
                value={crowdingUpper}
                onChange={(e) =>
                  setCrowdingUpper(Number(e.target.value || 0))
                }
                className="max-w-[120px]"
              />
              <SeverityPill
                label="Upper crowding"
                value={`${crowdingUpper.toFixed(1)} mm`}
                severity={getCrowdingSeverity(crowdingUpper)}
              />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-[10px] font-medium text-slate-300">
              Lower arch crowding (mm)
            </label>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                step="0.5"
                value={crowdingLower}
                onChange={(e) =>
                  setCrowdingLower(Number(e.target.value || 0))
                }
                className="max-w-[120px]"
              />
              <SeverityPill
                label="Lower crowding"
                value={`${crowdingLower.toFixed(1)} mm`}
                severity={getCrowdingSeverity(crowdingLower)}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-3 grid gap-3 md:grid-cols-3 text-[10px] text-slate-300">
        <div>
          <label className="mb-1 block font-medium">Midlines &amp; symmetry</label>
          <Input placeholder="Upper midline +2mm right, lower coincident…" />
        </div>
        <div>
          <label className="mb-1 block font-medium">TMJ / functional notes</label>
          <Input placeholder="No clicks, no pain, good range of motion." />
        </div>
        <div>
          <label className="mb-1 block font-medium">Global diagnosis</label>
          <Input placeholder="Skeletal Class II, dentoalveolar crowding, deep bite…" />
        </div>
      </div>
    </Card>
  );

  const StageTodayCard = (
    <Card
      title="Today’s Stage & Mechanics"
      subtitle="What is being activated or changed in this visit."
      badge="Live stage"
    >
      <div className="grid gap-3 md:grid-cols-3 text-[10px]">
        <div>
          <label className="mb-1 block font-medium text-slate-300">
            Current stage
          </label>
          <Select defaultValue="">
            <option value="">Select…</option>
            <option>Initial alignment / leveling</option>
            <option>Space closure</option>
            <option>Finishing &amp; detailing</option>
            <option>Refinement / re-treatment</option>
          </Select>
        </div>
        <div>
          <label className="mb-1 block font-medium text-slate-300">
            IPR / stripping today
          </label>
          <Input placeholder="e.g. 0.25 mm between 13–14, 23–24" />
        </div>
        <div>
          <label className="mb-1 block font-medium text-slate-300">
            Elastics &amp; auxiliaries
          </label>
          <Input placeholder="Class II elastics 3/16 6oz, box elastics posterior…" />
        </div>
      </div>

      <div className="mt-3 grid gap-3 md:grid-cols-2 text-[10px]">
        <div>
          <label className="mb-1 block font-medium text-slate-300">
            Attachments / brackets changes
          </label>
          <TextArea
            rows={3}
            placeholder="New attachments on upper canines, rebonded bracket 11 with +5° torque…"
          />
        </div>
        <div>
          <label className="mb-1 block font-medium text-slate-300">
            Clinical comments this visit
          </label>
          <TextArea
            rows={3}
            placeholder="Good hygiene, aligners fitting well, minor decalcification on 16 observed…"
          />
        </div>
      </div>
    </Card>
  );

  const FinishingChecklistCard = (
    <Card
      title="Finishing & Detailing Checklist"
      subtitle="Occlusion, smile design and final records."
      badge="Finishing"
    >
      <div className="grid gap-3 md:grid-cols-3 text-[10px]">
        <div>
          <label className="mb-1 block font-medium text-slate-300">
            Occlusion
          </label>
          <Select defaultValue="">
            <option value="">Select…</option>
            <option>Class I molars &amp; canines</option>
            <option>Residual Class II tendency</option>
            <option>Residual Class III tendency</option>
          </Select>
        </div>
        <div>
          <label className="mb-1 block font-medium text-slate-300">
            Smile &amp; midlines
          </label>
          <Select defaultValue="">
            <option value="">Select…</option>
            <option>Smile arc consonant, midlines coincident</option>
            <option>Midline discrepancy &lt; 2mm</option>
            <option>Midline discrepancy &gt;= 2mm</option>
          </Select>
        </div>
        <div>
          <label className="mb-1 block font-medium text-slate-300">
            Final records
          </label>
          <Select defaultValue="">
            <option value="">Select…</option>
            <option>Photos only</option>
            <option>Photos + models</option>
            <option>Photos + models + CBCT</option>
          </Select>
        </div>
      </div>

      <div className="mt-3 grid gap-3 md:grid-cols-2 text-[10px]">
        <div>
          <label className="mb-1 block font-medium text-slate-300">
            Finishing notes
          </label>
          <TextArea
            rows={3}
            placeholder="Minor rotations 32–42 accepted, overjet/overbite within normal limits, aesthetics excellent…"
          />
        </div>
        <div>
          <label className="mb-1 block font-medium text-slate-300">
            Long-term follow-up plan
          </label>
          <TextArea
            rows={3}
            placeholder="First year: 3, 6, 12 months; then yearly recall tied to general check-ups…"
          />
        </div>
      </div>
    </Card>
  );

  /* ---------- RENDER ---------- */

  return (
    <main className="min-h-screen bg-slate-950 text-slate-50">
      <div className="mx-auto max-w-6xl px-4 pb-24 pt-8">
        {/* HEADER PRINCIPAL */}
        <header className="mb-4 flex items-center justify-between gap-4">
          <div>
            <p className="text-[11px] uppercase tracking-[0.28em] text-sky-400">
              Specialties · Layer 3
            </p>
            <h1 className="mt-1 text-2xl md:text-3xl font-semibold tracking-tight text-slate-50">
              Orthodontics · Braces &amp; Clear Aligner Workspace
            </h1>
            <p className="mt-2 max-w-2xl text-xs md:text-sm text-slate-400">
              Document malocclusion, growth, appliance choices and aligner
              staging — with a live treatment timeline that syncs with ADIE&apos;s
              global dental chart and pediatric / TMJ layers.
            </p>
          </div>

          <Link
            href="/specialties"
            className="rounded-full border border-slate-700 bg-slate-900/70 px-4 py-1.5 text-xs md:text-sm text-slate-200 hover:border-sky-500 hover:text-sky-100 transition-colors"
          >
            ← Back to Specialties Universe
          </Link>
        </header>

        {/* BARRA ESTÁNDAR: BACK TO MPR + SAVE & DASHBOARD */}
        <SpecialtyTopActions specialtyLabel="Orthodontics" />

        {/* SNAPSHOT TIPO PATIENTS */}
        <PatientSnapshotBar riskLevel={globalRiskLevel} />

        {/* TABS DE FASES */}
        <div className="mb-5 flex flex-wrap gap-2 text-[11px]">
          {(["Assessment", "Alignment", "Finishing"] as OrthoPhase[]).map(
            (phase) => (
              <button
                key={phase}
                type="button"
                onClick={() => setActivePhase(phase)}
                className={`rounded-full border px-3 py-1 transition ${
                  activePhase === phase
                    ? "border-sky-500 bg-sky-500/20 text-sky-100"
                    : "border-slate-700 bg-slate-900/70 text-slate-300 hover:border-sky-500/70 hover:text-sky-100"
                }`}
              >
                {phase}
              </button>
            )
          )}
        </div>

        {/* CONTENIDO SEGÚN FASE */}

        {activePhase === "Assessment" && (
          <div className="grid gap-5 lg:grid-cols-[1.5fr,1.5fr]">
            <div className="space-y-5">
              {OrthoContextCard}
              {MetricsCard}
            </div>
            <div className="space-y-5">
              {AppliancePlanCard}
              {TimelineCard}
            </div>
          </div>
        )}

        {activePhase === "Alignment" && (
          <div className="grid gap-5 lg:grid-cols-[1.5fr,1.5fr]">
            <div className="space-y-5">
              {AppliancePlanCard}
              {StageTodayCard}
            </div>
            <div className="space-y-5">
              {TimelineCard}
              {InHouseAlignerLabCard}
            </div>
          </div>
        )}

        {activePhase === "Finishing" && (
          <div className="grid gap-5 lg:grid-cols-[1.5fr,1.5fr]">
            <div className="space-y-5">
              {FinishingChecklistCard}
              {MetricsCard}
            </div>
            <div className="space-y-5">
              {RetentionCard}
              {TimelineCard}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

/* ---------- OUTER WRAPPER WITH SUSPENSE ---------- */

function OrthodonticsWorkspacePage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-slate-950 text-slate-50">
          <div className="mx-auto max-w-6xl px-4 pb-24 pt-8">
            <p className="text-xs text-slate-400">
              Loading orthodontics workspace…
            </p>
          </div>
        </main>
      }
    >
      <OrthodonticsWorkspacePageInner />
    </Suspense>
  );
}

export default OrthodonticsWorkspacePage;
