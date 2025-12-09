"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { SpecialtyTopActions } from "@/app/_components/SpecialtyTopActions";

type SafetyLevel = "ideal" | "borderline" | "critical";
type CanalStatus = "planned" | "in-progress" | "completed";

type Canal = {
  id: string;
  label: string;
  workingLength: string; // mm
  apexReading: string; // mm
  obturationLength: string; // mm
  coneSize: string;
  sealer: string;
  technique: string;
  status: CanalStatus;
};

type CanalSafety = {
  level: SafetyLevel;
  label: string;
  margin: number | null;
  description: string;
};

type EndoCaseStatus = "draft" | "in-treatment" | "completed";

type EndoVisit = {
  id: string;
  date: string; // ISO
  note: string;
};

type CompletedCase = {
  id: string;
  tooth: string;
  arch: string;
  region: string;
  closedAt: string;
};

// 32 piezas (FDI): 18–11, 21–28, 38–31, 41–48
const TOOTH_OPTIONS = [
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
  "38",
  "37",
  "36",
  "35",
  "34",
  "33",
  "32",
  "31",
  "41",
  "42",
  "43",
  "44",
  "45",
  "46",
  "47",
  "48",
];

const INITIAL_CANALS: Canal[] = [
  {
    id: "MB1",
    label: "MB1 – Mesiobuccal 1",
    workingLength: "21.0",
    apexReading: "21.5",
    obturationLength: "20.5",
    coneSize: "30 / .04",
    sealer: "Bioceramic",
    technique: "Warm vertical",
    status: "completed",
  },
  {
    id: "MB2",
    label: "MB2 – Mesiobuccal 2",
    workingLength: "20.5",
    apexReading: "21.0",
    obturationLength: "19.6",
    coneSize: "25 / .04",
    sealer: "Resin",
    technique: "Single cone",
    status: "completed",
  },
  {
    id: "DB",
    label: "DB – Distobuccal",
    workingLength: "21.5",
    apexReading: "22.0",
    obturationLength: "20.0",
    coneSize: "30 / .04",
    sealer: "Bioceramic",
    technique: "Thermafil",
    status: "in-progress",
  },
  {
    id: "P",
    label: "P – Palatal",
    workingLength: "",
    apexReading: "",
    obturationLength: "",
    coneSize: "",
    sealer: "",
    technique: "",
    status: "planned",
  },
];

function classifyWorkingLength(
  workingLengthStr: string,
  obturationLengthStr: string
): CanalSafety {
  const wl = parseFloat(workingLengthStr);
  const obt = parseFloat(obturationLengthStr);

  if (!isFinite(wl) || !isFinite(obt)) {
    return {
      level: "borderline",
      label: "No data",
      margin: null,
      description:
        "Enter working length and obturation length to see the safety zone for this canal.",
    };
  }

  const margin = parseFloat((wl - obt).toFixed(2)); // mm short of WL (negative = overfill)
  let level: SafetyLevel = "borderline";
  let label = "Borderline safety";
  let description =
    "Combination close to the limits. Review radiographic and clinical findings.";

  // 0.5–1.0 mm short → ideal
  // 0–0.5 or 1.0–1.5 mm → borderline
  // <0 (overfill) or >1.5 → critical
  if (margin >= 0.5 && margin <= 1.0) {
    level = "ideal";
    label = "Ideal endodontic length";
    description =
      "Obturation ends 0.5–1.0 mm short of working length. This is usually a safe and desired range.";
  } else if (margin < 0 || margin > 1.5) {
    level = "critical";
    label = "Outside safety zone";
    if (margin < 0) {
      description =
        "Obturation goes beyond working length (overfill). Monitor symptoms and periapical status closely.";
    } else {
      description =
        "Obturation is more than 1.5 mm short of working length (underfill). Risk of persistent lesion or retreatment.";
    }
  }

  return { level, label, margin, description };
}

function safetyBadgeClasses(level: SafetyLevel): string {
  if (level === "ideal")
    return "bg-emerald-500/20 border-emerald-400 text-emerald-200";
  if (level === "borderline")
    return "bg-amber-500/20 border-amber-400 text-amber-200";
  return "bg-rose-500/20 border-rose-400 text-rose-200";
}

function safetyBarClasses(level: SafetyLevel): string {
  if (level === "ideal") return "bg-emerald-400";
  if (level === "borderline") return "bg-amber-400";
  return "bg-rose-400";
}

function statusChip(status: CanalStatus): { label: string; classes: string } {
  switch (status) {
    case "planned":
      return {
        label: "Planned",
        classes: "border-slate-600 text-slate-200 bg-slate-900/80",
      };
    case "in-progress":
      return {
        label: "In progress",
        classes: "border-sky-400 text-sky-200 bg-sky-500/10",
      };
    case "completed":
      return {
        label: "Completed",
        classes: "border-emerald-400 text-emerald-200 bg-emerald-500/10",
      };
  }
}

function caseStatusChip(
  status: EndoCaseStatus
): { label: string; classes: string } {
  switch (status) {
    case "draft":
      return {
        label: "Draft",
        classes: "border-slate-500 text-slate-200 bg-slate-900/80",
      };
    case "in-treatment":
      return {
        label: "In treatment",
        classes: "border-sky-400 text-sky-200 bg-sky-500/10",
      };
    case "completed":
      return {
        label: "Completed",
        classes: "border-emerald-400 text-emerald-200 bg-emerald-500/10",
      };
  }
}

function formatDateTime(iso: string) {
  const date = new Date(iso);
  return date.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  } as Intl.DateTimeFormatOptions);
}

export default function EndodonticsWowPage() {
  const [tooth, setTooth] = useState("16");
  const [arch, setArch] = useState("Maxilla");
  const [region, setRegion] = useState("Molar");
  const [caseId, setCaseId] = useState("ADIE-ENDO-0001");

  const [navidentStudyId, setNavidentStudyId] = useState("");
  const [endoMotor, setEndoMotor] = useState("X-Smart IQ");
  const [cbctStudyId, setCbctStudyId] = useState("");

  const [canals, setCanals] = useState<Canal[]>(INITIAL_CANALS);

  const [caseStatus, setCaseStatus] = useState<EndoCaseStatus>("draft");
  const [visits, setVisits] = useState<EndoVisit[]>([]);
  const [currentVisitNote, setCurrentVisitNote] = useState("");
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(null);
  const [completedCases, setCompletedCases] = useState<CompletedCase[]>([]);

  const isReadOnly = caseStatus === "completed";

  const handleCanalChange = (
    canalId: string,
    field: keyof Canal,
    value: string
  ) => {
    if (isReadOnly) return;
    setCanals((prev) =>
      prev.map((c) => (c.id === canalId ? { ...c, [field]: value } : c))
    );
  };

  const handleSaveVisit = () => {
    if (isReadOnly) return;
    const nowIso = new Date().toISOString();
    const newVisit: EndoVisit = {
      id: `V${visits.length + 1}`,
      date: nowIso,
      note:
        currentVisitNote.trim() ||
        `Visit ${visits.length + 1} saved for tooth ${tooth}.`,
    };
    setVisits((prev) => [...prev, newVisit]);
    setLastSavedAt(nowIso);
    setCaseStatus("in-treatment");
  };

  const handleFinalizeCase = () => {
    if (isReadOnly || visits.length === 0) return;
    const nowIso = new Date().toISOString();
    setCaseStatus("completed");
    setLastSavedAt((prev) => prev ?? nowIso);
    setCompletedCases((prev) => [
      ...prev,
      {
        id: caseId,
        tooth,
        arch,
        region,
        closedAt: nowIso,
      },
    ]);
  };

  const canalSafeties: Record<string, CanalSafety> = useMemo(() => {
    const result: Record<string, CanalSafety> = {};
    for (const canal of canals) {
      result[canal.id] = classifyWorkingLength(
        canal.workingLength,
        canal.obturationLength
      );
    }
    return result;
  }, [canals]);

  const summary = useMemo(() => {
    let ideal = 0;
    let borderline = 0;
    let critical = 0;
    for (const canal of canals) {
      const s = canalSafeties[canal.id];
      if (!s || s.margin === null) continue;
      if (s.level === "ideal") ideal++;
      else if (s.level === "borderline") borderline++;
      else critical++;
    }
    return { ideal, borderline, critical };
  }, [canals, canalSafeties]);

  const criticalCanals = canals.filter(
    (c) => canalSafeties[c.id]?.level === "critical"
  );

  const caseStatusUi = caseStatusChip(caseStatus);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 flex justify-center">
      <main className="w-full max-w-6xl px-4 py-10">
        {/* HEADER */}
        <header className="flex items-center justify-between mb-4">
          <div>
            <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500 mb-1">
              Specialties · Layer 3
            </p>
            <h1 className="text-2xl md:text-3xl font-semibold">
              Endodontics · Intelligent Root Canal Record
            </h1>
            <p className="text-xs md:text-sm text-slate-400 mt-1 max-w-3xl">
              High-resolution endodontic layer for general dentists and
              specialists. Track canals, lengths, obturation quality and device
              data (Navident, endo motors, CBCT) — fully ready to sync with
              radiology, implants and the global dental chart.
            </p>
          </div>

          <Link
            href="/specialties"
            className="rounded-full border border-slate-700 px-4 py-1.5 text-xs hover:border-sky-400"
          >
            ← Back to Specialties Universe
          </Link>
        </header>

        {/* TOP ACTION BAR */}
        <SpecialtyTopActions specialtyLabel="Endodontics" />

        <div className="space-y-5">
          {/* 1. SAFETY OVERVIEW */}
          <section className="rounded-2xl border border-slate-800 bg-slate-900/80 px-5 py-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                Endo safety overview (per tooth)
              </p>
              <div className="flex gap-2 text-[10px]">
                <span className="rounded-full border border-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 text-emerald-200">
                  Ideal: {summary.ideal}
                </span>
                <span className="rounded-full border border-amber-400 bg-amber-500/10 px-2.5 py-0.5 text-amber-200">
                  Borderline: {summary.borderline}
                </span>
                <span className="rounded-full border border-rose-400 bg-rose-500/10 px-2.5 py-0.5 text-rose-200">
                  Critical: {summary.critical}
                </span>
              </div>
            </div>

            {criticalCanals.length === 0 ? (
              <p className="text-[11px] text-emerald-200">
                ✅ No canals currently classified as “outside safety zone”. You
                can still refine lengths once CBCT and electronic apex data are
                fully imported.
              </p>
            ) : (
              <div className="text-[11px] text-rose-100">
                <p className="mb-1">
                  ⚠ ADIE Endo AI suggests reviewing the following canals:
                </p>
                <ul className="list-disc pl-4 space-y-0.5">
                  {criticalCanals.map((c) => {
                    const s = canalSafeties[c.id];
                    return (
                      <li key={c.id}>
                        <span className="font-semibold">{c.label}</span>{" "}
                        {s?.margin !== null &&
                          `— difference vs WL: ${
                            s.margin > 0
                              ? `${s.margin} mm short`
                              : `${Math.abs(s.margin)} mm beyond`
                          }.`}{" "}
                        {s?.description}
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </section>

          {/* 2. CASE CONTEXT + DEVICES */}
          <section className="rounded-2xl border border-slate-800 bg-slate-900/70 px-5 py-5">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-1">
                  <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                    Endo case context
                  </p>
                  <div className="flex flex-wrap items-center gap-2 text-[10px]">
                    <span
                      className={`rounded-full border px-2.5 py-0.5 ${caseStatusUi.classes}`}
                    >
                      {caseStatusUi.label}
                    </span>
                    {lastSavedAt && (
                      <span className="text-slate-500">
                        Last saved: {formatDateTime(lastSavedAt)}
                      </span>
                    )}
                  </div>
                </div>

                <p className="text-xs text-slate-400 mb-3">
                  Link this Endo case to the EMR, tooth, region and radiology.
                  Later this will sync to the global dental chart, chair-time
                  timeline and MPR Endo panel.
                </p>

                <div className="flex flex-wrap gap-2 mb-3">
                  <button
                    type="button"
                    onClick={handleSaveVisit}
                    disabled={isReadOnly}
                    className="rounded-full border border-sky-500 bg-sky-500/10 px-4 py-1.5 text-[11px] text-sky-100 hover:bg-sky-500/20 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    💾 Save visit / progress
                  </button>
                  <button
                    type="button"
                    onClick={handleFinalizeCase}
                    disabled={isReadOnly || visits.length === 0}
                    className="rounded-full border border-emerald-500 bg-emerald-500/10 px-4 py-1.5 text-[11px] text-emerald-100 hover:bg-emerald-500/20 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    ✅ Mark treatment as finished
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs mb-3">
                  <div>
                    <label className="block text-[10px] uppercase tracking-[0.16em] text-slate-500 mb-1">
                      Endo case ID
                    </label>
                    <input
                      className="w-full rounded-xl border border-slate-700 bg-slate-950/70 px-3 py-2 text-xs"
                      value={caseId}
                      onChange={(e) => setCaseId(e.target.value)}
                      disabled={isReadOnly}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-[0.16em] text-slate-500 mb-1">
                      Link to EMR patient
                    </label>
                    <button
                      className="w-full rounded-full bg-slate-950/70 border border-slate-700 px-3 py-2 text-xs text-slate-200 hover:border-sky-400 disabled:opacity-40 disabled:cursor-not-allowed"
                      disabled={isReadOnly}
                    >
                      Select patient from EMR
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs mb-3">
                  <div>
                    <label className="block text-[10px] uppercase tracking-[0.16em] text-slate-500 mb-1">
                      Tooth / site
                    </label>
                    <select
                      className="w-full rounded-xl border border-slate-700 bg-slate-950/70 px-3 py-2 text-xs"
                      value={tooth}
                      onChange={(e) => setTooth(e.target.value)}
                      disabled={isReadOnly}
                    >
                      {TOOTH_OPTIONS.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-[0.16em] text-slate-500 mb-1">
                      Arch
                    </label>
                    <select
                      className="w-full rounded-xl border border-slate-700 bg-slate-950/70 px-3 py-2 text-xs"
                      value={arch}
                      onChange={(e) => setArch(e.target.value)}
                      disabled={isReadOnly}
                    >
                      <option>Maxilla</option>
                      <option>Mandible</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-[0.16em] text-slate-500 mb-1">
                      Region
                    </label>
                    <select
                      className="w-full rounded-xl border border-slate-700 bg-slate-950/70 px-3 py-2 text-xs"
                      value={region}
                      onChange={(e) => setRegion(e.target.value)}
                      disabled={isReadOnly}
                    >
                      <option>Molar</option>
                      <option>Premolar</option>
                      <option>Anterior</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-[0.16em] text-slate-500 mb-1">
                    Visit note (optional)
                  </label>
                  <textarea
                    className="w-full min-h-[60px] rounded-xl border border-slate-700 bg-slate-950/70 px-3 py-2 text-xs"
                    placeholder="Today: instrumentation, irrigation, temp restoration, symptoms…"
                    value={currentVisitNote}
                    onChange={(e) => setCurrentVisitNote(e.target.value)}
                    disabled={isReadOnly}
                  />
                </div>
              </div>

              {/* Device integration */}
              <div className="w-full md:w-[260px] rounded-2xl border border-slate-800 bg-slate-950/80 p-3 text-[11px] space-y-3">
                <p className="uppercase tracking-[0.16em] text-slate-500 mb-1">
                  Device integration
                </p>

                <div>
                  <p className="text-[10px] text-slate-400 mb-1">
                    Navigation / guidance (Navident, X-Nav…)
                  </p>
                  <input
                    className="w-full rounded-xl border border-slate-700 bg-slate-950/70 px-2 py-1.5 text-[11px]"
                    placeholder="External study ID / series…"
                    value={navidentStudyId}
                    onChange={(e) => setNavidentStudyId(e.target.value)}
                    disabled={isReadOnly}
                  />
                  <button
                    className="mt-1 w-full rounded-full border border-sky-500 bg-sky-500/10 px-2 py-1 text-[10px] text-sky-200 hover:bg-sky-500/20 disabled:opacity-40 disabled:cursor-not-allowed"
                    disabled={isReadOnly}
                  >
                    Simulate import from navigation system
                  </button>
                </div>

                <div>
                  <p className="text-[10px] text-slate-400 mb-1">
                    Endodontic motor
                  </p>
                  <select
                    className="w-full rounded-xl border border-slate-700 bg-slate-950/70 px-2 py-1.5 text-[11px]"
                    value={endoMotor}
                    onChange={(e) => setEndoMotor(e.target.value)}
                    disabled={isReadOnly}
                  >
                    <option>X-Smart IQ</option>
                    <option>VDW Reciproc</option>
                    <option>WaveOne Gold motor</option>
                    <option>Other</option>
                  </select>
                  <button
                    className="mt-1 w-full rounded-full border border-emerald-500 bg-emerald-500/10 px-2 py-1 text-[10px] text-emerald-200 hover:bg-emerald-500/20 disabled:opacity-40 disabled:cursor-not-allowed"
                    disabled={isReadOnly}
                  >
                    Simulate import of file sequence
                  </button>
                </div>

                <div>
                  <p className="text-[10px] text-slate-400 mb-1">CBCT link</p>
                  <input
                    className="w-full rounded-xl border border-slate-700 bg-slate-950/70 px-2 py-1.5 text-[11px]"
                    placeholder="CBCT study ID or URL…"
                    value={cbctStudyId}
                    onChange={(e) => setCbctStudyId(e.target.value)}
                    disabled={isReadOnly}
                  />
                  <p className="mt-1 text-[10px] text-slate-500">
                    Future step: call ADIE-radiology to visualize canal path
                    and 3D length.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* 3. CANAL MAP */}
          <section className="rounded-2xl border border-slate-800 bg-slate-900/70 px-5 py-5">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500 mb-1">
                  Canal map &amp; length safety
                </p>
                <p className="text-xs text-slate-400">
                  For each canal, capture working length, obturation length,
                  technique and materials. The color band indicates safety vs.
                  working length.
                </p>
              </div>
              <span className="text-[10px] rounded-full border border-slate-700 px-3 py-0.5 text-slate-300">
                Tooth {tooth} · {arch} · {region}
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {canals.map((canal) => {
                const safety = canalSafeties[canal.id];
                const status = statusChip(canal.status);

                const marginText =
                  safety.margin === null
                    ? "—"
                    : safety.margin > 0
                    ? `${safety.margin} mm short`
                    : `${Math.abs(safety.margin)} mm beyond`;

                const normalizedMargin = safety.margin
                  ? Math.max(0, Math.min(2, Math.abs(safety.margin)))
                  : 0;
                const barWidth = `${(normalizedMargin / 2) * 100}%`;

                return (
                  <div
                    key={canal.id}
                    className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4 text-xs space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-slate-100">
                          {canal.label}
                        </p>
                        <p className="text-[10px] text-slate-500">
                          Individual canal view — ready to sync with Navident,
                          endo motors and CBCT.
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <span
                          className={`rounded-full border px-2 py-0.5 text-[10px] ${status.classes}`}
                        >
                          {status.label}
                        </span>
                        <span
                          className={`rounded-full border px-2 py-0.5 text-[10px] ${safetyBadgeClasses(
                            safety.level
                          )}`}
                        >
                          {safety.label}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                      <div>
                        <label className="block text-[10px] uppercase tracking-[0.16em] text-slate-500 mb-1">
                          Working length (mm)
                        </label>
                        <input
                          type="number"
                          step="0.1"
                          className="w-full rounded-xl border border-slate-700 bg-slate-950/70 px-3 py-2 text-xs"
                          value={canal.workingLength}
                          onChange={(e) =>
                            handleCanalChange(
                              canal.id,
                              "workingLength",
                              e.target.value
                            )
                          }
                          disabled={isReadOnly}
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase tracking-[0.16em] text-slate-500 mb-1">
                          Apex locator (mm)
                        </label>
                        <input
                          type="number"
                          step="0.1"
                          className="w-full rounded-xl border border-slate-700 bg-slate-950/70 px-3 py-2 text-xs"
                          value={canal.apexReading}
                          onChange={(e) =>
                            handleCanalChange(
                              canal.id,
                              "apexReading",
                              e.target.value
                            )
                          }
                          disabled={isReadOnly}
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase tracking-[0.16em] text-slate-500 mb-1">
                          Obturation length (mm)
                        </label>
                        <input
                          type="number"
                          step="0.1"
                          className="w-full rounded-xl border border-slate-700 bg-slate-950/70 px-3 py-2 text-xs"
                          value={canal.obturationLength}
                          onChange={(e) =>
                            handleCanalChange(
                              canal.id,
                              "obturationLength",
                              e.target.value
                            )
                          }
                          disabled={isReadOnly}
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase tracking-[0.16em] text-slate-500 mb-1">
                          Δ vs WL
                        </label>
                        <div className="w-full rounded-xl border border-slate-700 bg-slate-950/70 px-3 py-2 text-xs flex items-center justify-between">
                          <span>{marginText}</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-1">
                      <div className="h-2 rounded-full bg-slate-900 border border-slate-800 overflow-hidden">
                        <div
                          className={`h-full ${safetyBarClasses(
                            safety.level
                          )}`}
                          style={{ width: barWidth }}
                        />
                      </div>
                      <p className="mt-1 text-[10px] text-slate-500">
                        Color band represents how far obturation is from
                        working length. 0–2 mm range is visualized; anything
                        beyond is considered critical.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[10px] uppercase tracking-[0.16em] text-slate-500 mb-1">
                          Cone size
                        </label>
                        <input
                          className="w-full rounded-xl border border-slate-700 bg-slate-950/70 px-3 py-2 text-xs"
                          placeholder="e.g. 30 / .04"
                          value={canal.coneSize}
                          onChange={(e) =>
                            handleCanalChange(
                              canal.id,
                              "coneSize",
                              e.target.value
                            )
                          }
                          disabled={isReadOnly}
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase tracking-[0.16em] text-slate-500 mb-1">
                          Sealer
                        </label>
                        <input
                          className="w-full rounded-xl border border-slate-700 bg-slate-950/70 px-3 py-2 text-xs"
                          placeholder="Bioceramic, resin, etc."
                          value={canal.sealer}
                          onChange={(e) =>
                            handleCanalChange(
                              canal.id,
                              "sealer",
                              e.target.value
                            )
                          }
                          disabled={isReadOnly}
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase tracking-[0.16em] text-slate-500 mb-1">
                          Technique
                        </label>
                        <select
                          className="w-full rounded-xl border border-slate-700 bg-slate-950/70 px-3 py-2 text-xs"
                          value={canal.technique}
                          onChange={(e) =>
                            handleCanalChange(
                              canal.id,
                              "technique",
                              e.target.value
                            )
                          }
                          disabled={isReadOnly}
                        >
                          <option value="">Select…</option>
                          <option>Warm vertical</option>
                          <option>Continuous wave</option>
                          <option>Single cone</option>
                          <option>Thermafil / carrier-based</option>
                          <option>Other</option>
                        </select>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* 4. ADVANCED NOTES + HISTORY */}
          <section className="rounded-2xl border border-slate-800 bg-slate-900/70 px-5 py-5">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500 mb-1">
                  Technique, irrigation &amp; follow-up
                </p>
                <p className="text-xs text-slate-400">
                  Capture the protocol used for this tooth — this will later
                  feed BI and retreatment analytics.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block text-[10px] uppercase tracking-[0.16em] text-slate-500 mb-1">
                  Instrumentation protocol
                </label>
                <textarea
                  className="w-full min-h-[96px] rounded-xl border border-slate-700 bg-slate-950/70 px-3 py-2 text-xs"
                  placeholder="System used (Protaper, WaveOne, Reciproc…), glide path, taper, torque and RPM notes..."
                  disabled={isReadOnly}
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-[0.16em] text-slate-500 mb-1">
                  Irrigation &amp; activation
                </label>
                <textarea
                  className="w-full min-h-[96px] rounded-xl border border-slate-700 bg-slate-950/70 px-3 py-2 text-xs"
                  placeholder="NaOCl %, EDTA, activation method (PUI, sonic, negative pressure), time and sequence..."
                  disabled={isReadOnly}
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-[0.16em] text-slate-500 mb-1">
                  Post-op &amp; recall plan
                </label>
                <textarea
                  className="w-full min-h-[96px] rounded-xl border border-slate-700 bg-slate-950/70 px-3 py-2 text-xs"
                  placeholder="Immediate post-op instructions, recall intervals (6, 12, 24 months), symptoms to monitor, retreatment triggers..."
                  disabled={isReadOnly}
                />
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-4 text-xs">
              <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                    Visit history for this tooth
                  </p>
                  <span className="text-[10px] text-slate-500">
                    {visits.length} visit(s)
                  </span>
                </div>
                {visits.length === 0 ? (
                  <p className="text-[11px] text-slate-400">
                    No visits saved yet. Save the first visit to start tracking
                    this Endo case across appointments.
                  </p>
                ) : (
                  <ul className="space-y-2">
                    {visits.map((v) => (
                      <li
                        key={v.id}
                        className="rounded-xl border border-slate-800 bg-slate-900/80 px-3 py-2"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[11px] font-semibold">
                            {v.id}
                          </span>
                          <span className="text-[10px] text-slate-500">
                            {formatDateTime(v.date)}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-300">{v.note}</p>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                    Completed Endo cases (this patient)
                  </p>
                </div>
                {completedCases.length === 0 ? (
                  <p className="text-[11px] text-slate-400">
                    Once you mark the treatment as finished, ADIE will pin the
                    case here and push it to the Master EMR / MPR Endo box.
                  </p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-[11px] text-left border-collapse">
                      <thead>
                        <tr className="text-slate-400 border-b border-slate-800">
                          <th className="py-1 pr-3">Case ID</th>
                          <th className="py-1 pr-3">Tooth</th>
                          <th className="py-1 pr-3">Arch</th>
                          <th className="py-1 pr-3">Region</th>
                          <th className="py-1 pr-3">Closed</th>
                        </tr>
                      </thead>
                      <tbody>
                        {completedCases.map((c) => (
                          <tr key={c.id} className="border-b border-slate-900">
                            <td className="py-1 pr-3 text-slate-100">
                              {c.id}
                            </td>
                            <td className="py-1 pr-3 text-slate-200">
                              {c.tooth}
                            </td>
                            <td className="py-1 pr-3 text-slate-200">
                              {c.arch}
                            </td>
                            <td className="py-1 pr-3 text-slate-200">
                              {c.region}
                            </td>
                            <td className="py-1 pr-3 text-slate-400">
                              {formatDateTime(c.closedAt)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
