"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";

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

  // Regla clínica simple:
  //  - 0.5–1.0 mm corto → ideal
  //  - 0–0.5 o 1.0–1.5 mm → borderline
  //  - <0 (sobreobturación) o >1.5 → crítico
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

function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`w-full rounded-xl border border-slate-700 bg-slate-950/70 px-3 py-2 text-xs text-slate-100 outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-500/60 ${
        props.className ?? ""
      }`}
    />
  );
}

function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={`w-full rounded-xl border border-slate-700 bg-slate-950/70 px-3 py-2 text-xs text-slate-100 outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-500/60 ${
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
      className={`w-full rounded-xl border border-slate-700 bg-slate-950/70 px-3 py-2 text-xs text-slate-100 outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-500/60 ${
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

export default function EndodonticsWowPage() {
  const [tooth, setTooth] = useState("16");
  const [arch, setArch] = useState("Maxilla");
  const [region, setRegion] = useState("Molar");
  const [caseId, setCaseId] = useState("ADIE-ENDO-0001");

  const [navidentStudyId, setNavidentStudyId] = useState("");
  const [endoMotor, setEndoMotor] = useState("X-Smart IQ");
  const [cbctStudyId, setCbctStudyId] = useState("");

  const [canals, setCanals] = useState<Canal[]>(INITIAL_CANALS);

  const handleCanalChange = (
    canalId: string,
    field: keyof Canal,
    value: string
  ) => {
    setCanals((prev) =>
      prev.map((c) => (c.id === canalId ? { ...c, [field]: value } : c))
    );
  };

  const autoFillFromWL = (canalId: string) => {
    setCanals((prev) =>
      prev.map((c) => {
        if (c.id !== canalId) return c;
        const wl = parseFloat(c.workingLength);
        if (!isFinite(wl)) return c;
        return {
          ...c,
          obturationLength: (wl - 0.5).toFixed(1),
          coneSize: c.coneSize || "30 / .04",
          sealer: c.sealer || "Bioceramic",
          technique: c.technique || "Warm vertical",
          status: c.status === "planned" ? "in-progress" : c.status,
        };
      })
    );
  };

  const applyStandardMolarProtocol = () => {
    setCanals((prev) =>
      prev.map((c) => {
        const wl = parseFloat(c.workingLength);
        const hasWL = isFinite(wl);
        return {
          ...c,
          obturationLength:
            (!c.obturationLength || !isFinite(parseFloat(c.obturationLength))) &&
            hasWL
              ? (wl - 0.5).toFixed(1)
              : c.obturationLength,
          coneSize: c.coneSize || (c.id === "MB2" ? "25 / .04" : "30 / .04"),
          sealer: c.sealer || "Bioceramic",
          technique: c.technique || "Warm vertical",
          status:
            c.status === "planned" && hasWL ? "in-progress" : c.status,
        };
      })
    );
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

  return (
    <main className="min-h-screen bg-slate-950 text-slate-50">
      <div className="mx-auto max-w-6xl px-4 pb-24 pt-8">
        {/* HEADER TÍTULO + BOTONES */}
        <header className="mb-3 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-[0.28em] text-sky-400">
              Specialties · Endodontics
            </p>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-50 md:text-3xl">
              Endodontics · 3D Canal Intelligence & Surgical Record
            </h1>
            <p className="mt-1 max-w-3xl text-xs text-slate-400 md:text-sm">
              High-resolution endodontic layer for general dentists and
              specialists. Track canals, lengths, obturation quality, diagnosis
              and device data — fully ready to sync with radiology, implants and
              ADIE&apos;s global dental chart.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-end gap-2">
            <button className="rounded-full border border-slate-700 bg-slate-900/80 px-3 py-1.5 text-[11px] text-slate-200 hover:border-sky-400 hover:text-sky-100 transition-colors">
              View full EMR
            </button>
            <button className="rounded-full border border-slate-700 bg-slate-900/80 px-3 py-1.5 text-[11px] text-slate-200 hover:border-emerald-400 hover:text-emerald-100 transition-colors">
              Endo timeline
            </button>
            <Link
              href="/specialties"
              className="rounded-full border border-slate-700 bg-slate-900/80 px-3 py-1.5 text-[11px] text-slate-300 hover:border-slate-400 hover:text-slate-50 transition-colors"
            >
              ← Back to Specialties Universe
            </Link>
          </div>
        </header>

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
              <button className="rounded-full border border-slate-700 bg-slate-900/80 px-3 py-1 text-[11px] text-slate-200 hover:border-sky-400 hover:text-sky-100 transition-colors">
                ⬆ Upload
              </button>
            </div>

            {/* DATOS + FLAGS */}
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-300">
                <span className="rounded-full bg-slate-900/80 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-400">
                  Active endodontic patient
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
                  Chief complaint: Spontaneous pain · 2–3 days
                </span>
              </div>

              <div className="grid gap-2 text-[10px] text-slate-400 md:grid-cols-2">
                <div>
                  <p className="mb-0.5 font-medium text-slate-300">
                    Systemic & medical flags
                  </p>
                  <p className="leading-snug">
                    No anticoagulants · controlled hypertension · no history of
                    bisphosphonates or radiotherapy.
                  </p>
                </div>
                <div>
                  <p className="mb-0.5 font-medium text-slate-300">
                    Endo & restorative quick flags
                  </p>
                  <p className="leading-snug">
                    Deep distal caries · existing composite · crack suspected ·
                    full coverage crown planned after Endo.
                  </p>
                </div>
              </div>
            </div>

            {/* RIESGO GLOBAL ENDO */}
            <div className="flex flex-col items-end gap-2.5">
              <div className="flex items-center gap-3">
                <div className="flex flex-col items-end text-right">
                  <span className="text-[10px] uppercase tracking-[0.24em] text-slate-400">
                    Global endo risk
                  </span>
                  <div className="mt-1 flex items-center gap-2">
                    <div className="relative h-9 w-9">
                      <div className="absolute left-1/2 top-0 -translate-x-1/2 border-l-[9px] border-r-[9px] border-b-[16px] border-l-transparent border-r-transparent border-b-emerald-400/80" />
                      <div className="absolute left-1/2 top-[5px] -translate-x-1/2 border-l-[9px] border-r-[9px] border-b-[16px] border-l-transparent border-r-transparent border-b-amber-400/90" />
                      <div className="absolute left-1/2 top-[10px] -translate-x-1/2 border-l-[9px] border-r-[9px] border-b-[16px] border-l-transparent border-r-transparent border-b-rose-500/90" />
                    </div>
                    <div className="flex flex-col text-[10px] text-slate-300">
                      <span>Endo Complexity Score: 72/100</span>
                      <span className="text-amber-300">
                        Moderate complexity · Multi-canal molar
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <button className="rounded-full border border-emerald-500/70 bg-emerald-500/10 px-3 py-1.5 text-[11px] font-semibold text-emerald-100 hover:bg-emerald-500/20 transition-colors">
                Cleared for endo treatment · No systemic contraindications
              </button>

              <div className="flex flex-col items-end text-[10px] text-slate-400">
                <span>Pain control: NSAIDs + local · no antibiotics indicated</span>
                <span>Implant / extraction alternative discussed with patient</span>
              </div>
            </div>
          </div>
        </section>

        {/* LAYOUT PRINCIPAL */}
        <div className="grid gap-5 lg:grid-cols-[1.7fr,1.2fr]">
          {/* COLUMNA IZQUIERDA */}
          <div className="space-y-5">
            {/* AI SAFETY OVERVIEW */}
            <Card
              title="Endodontic AI Safety Overview"
              subtitle="Endodontic safety per canal based on working length vs obturation."
              badge="AI Safety"
            >
              <div className="mb-2 flex items-center justify-between text-[11px]">
                <p className="text-slate-400">
                  Live summary of canal safety. Colors follow classic endo
                  logic: ideal, borderline and outside safety zone.
                </p>
                <div className="flex gap-2">
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
                  ✅ No canals currently classified as “outside safety zone”.
                  You can still refine lengths once CBCT and electronic apex
                  data are fully imported.
                </p>
              ) : (
                <div className="text-[11px] text-rose-100">
                  <p className="mb-1">
                    ⚠ ADIE Endo AI suggests reviewing the following canals:
                  </p>
                  <ul className="list-disc space-y-0.5 pl-4">
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
            </Card>

            {/* CONTEXTO DEL CASO + EQUIPOS */}
            <Card
              title="Endodontic Case Context & Devices"
              subtitle="Tooth, region and integration with navigation systems, motors and CBCT."
              badge="Context"
            >
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                {/* Lado izquierdo: contexto básico */}
                <div className="flex-1 space-y-3 text-[11px]">
                  <div className="grid gap-3 md:grid-cols-2">
                    <div>
                      <label className="mb-1 block font-medium text-slate-300">
                        Endo case ID
                      </label>
                      <Input
                        value={caseId}
                        onChange={(e) => setCaseId(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="mb-1 block font-medium text-slate-300">
                        Link to EMR patient
                      </label>
                      <button className="w-full rounded-full border border-slate-700 bg-slate-900/80 px-3 py-2 text-[11px] text-slate-200 hover:border-sky-400 hover:text-sky-100">
                        Select patient from EMR
                      </button>
                    </div>
                  </div>

                  <div className="grid gap-3 md:grid-cols-3">
                    <div>
                      <label className="mb-1 block font-medium text-slate-300">
                        Tooth / site
                      </label>
                      <Input
                        value={tooth}
                        onChange={(e) => setTooth(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="mb-1 block font-medium text-slate-300">
                        Arch
                      </label>
                      <Select
                        value={arch}
                        onChange={(e) => setArch(e.target.value)}
                      >
                        <option>Maxilla</option>
                        <option>Mandible</option>
                      </Select>
                    </div>
                    <div>
                      <label className="mb-1 block font-medium text-slate-300">
                        Region
                      </label>
                      <Select
                        value={region}
                        onChange={(e) => setRegion(e.target.value)}
                      >
                        <option>Molar</option>
                        <option>Premolar</option>
                        <option>Anterior</option>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <label className="mb-1 block font-medium text-slate-300">
                      Endo indication / reason
                    </label>
                    <Select defaultValue="">
                      <option value="">Select…</option>
                      <option>Irreversible pulpitis</option>
                      <option>Necrotic pulp with lesion</option>
                      <option>Cracked tooth with pulpal involvement</option>
                      <option>Prosthetic reason (post space required)</option>
                      <option>Retreatment of previous RCT</option>
                    </Select>
                  </div>
                </div>

                {/* Lado derecho: integración con equipos */}
                <div className="w-full space-y-3 rounded-2xl border border-slate-800 bg-slate-950/80 p-3 text-[11px] md:w-[260px]">
                  <p className="text-[10px] uppercase tracking-[0.16em] text-slate-500">
                    Device integration
                  </p>

                  <div>
                    <p className="mb-1 text-[10px] text-slate-400">
                      Navigation / guidance (Navident, X-Nav…)
                    </p>
                    <Input
                      placeholder="External study ID / series…"
                      value={navidentStudyId}
                      onChange={(e) => setNavidentStudyId(e.target.value)}
                    />
                    <button className="mt-1 w-full rounded-full border border-sky-500 bg-sky-500/10 px-2 py-1 text-[10px] text-sky-200 hover:bg-sky-500/20">
                      Simulate import from navigation system
                    </button>
                  </div>

                  <div>
                    <p className="mb-1 text-[10px] text-slate-400">
                      Endodontic motor
                    </p>
                    <Select
                      value={endoMotor}
                      onChange={(e) => setEndoMotor(e.target.value)}
                    >
                      <option>X-Smart IQ</option>
                      <option>VDW Reciproc</option>
                      <option>WaveOne Gold motor</option>
                      <option>Other</option>
                    </Select>
                    <button className="mt-1 w-full rounded-full border border-emerald-500 bg-emerald-500/10 px-2 py-1 text-[10px] text-emerald-200 hover:bg-emerald-500/20">
                      Simulate import of file sequence
                    </button>
                  </div>

                  <div>
                    <p className="mb-1 text-[10px] text-slate-400">CBCT link</p>
                    <Input
                      placeholder="CBCT study ID or URL…"
                      value={cbctStudyId}
                      onChange={(e) => setCbctStudyId(e.target.value)}
                    />
                    <p className="mt-1 text-[10px] text-slate-500">
                      Future: open CBCT canal path viewer inside ADIE.
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            {/* MAPA DE CONDUCTOS */}
            <Card
              title="Canal Map & Length Safety"
              subtitle="Working length, apex readings, obturation and materials per canal."
              badge="Canals"
            >
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2 text-[11px]">
                <div>
                  <p className="text-slate-400">
                    Each canal behaves like a mini-workspace. Safety color shows
                    how obturation relates to working length.
                  </p>
                  <p className="mt-1 text-[10px] text-slate-500">
                    Tip: use the auto-fill buttons to quickly set obturation
                    0.5&nbsp;mm short of WL with standard cone and sealer.
                  </p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="rounded-full border border-slate-700 bg-slate-900/80 px-3 py-0.5 text-[10px] text-slate-300">
                    Tooth {tooth} · {arch} · {region}
                  </span>
                  <button
                    type="button"
                    onClick={applyStandardMolarProtocol}
                    className="rounded-full border border-sky-500 bg-sky-500/10 px-3 py-1 text-[10px] text-sky-200 hover:bg-sky-500/20"
                  >
                    Apply standard molar protocol
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
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
                      className="space-y-3 rounded-2xl border border-slate-800 bg-slate-950/70 p-4 text-xs"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div>
                          <p className="font-semibold text-slate-100">
                            {canal.label}
                          </p>
                          <p className="text-[10px] text-slate-500">
                            Individual canal record — synchronized with
                            navigation, motors and CBCT (future).
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
                          <button
                            type="button"
                            onClick={() => autoFillFromWL(canal.id)}
                            className="rounded-full border border-sky-500 bg-sky-500/10 px-2 py-0.5 text-[10px] text-sky-200 hover:bg-sky-500/20"
                          >
                            Auto-fill from WL
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
                        <div>
                          <label className="mb-1 block text-[10px] uppercase tracking-[0.16em] text-slate-500">
                            Working length (mm)
                          </label>
                          <Input
                            type="number"
                            step="0.1"
                            value={canal.workingLength}
                            onChange={(e) =>
                              handleCanalChange(
                                canal.id,
                                "workingLength",
                                e.target.value
                              )
                            }
                          />
                        </div>
                        <div>
                          <label className="mb-1 block text-[10px] uppercase tracking-[0.16em] text-slate-500">
                            Apex locator (mm)
                          </label>
                          <Input
                            type="number"
                            step="0.1"
                            value={canal.apexReading}
                            onChange={(e) =>
                              handleCanalChange(
                                canal.id,
                                "apexReading",
                                e.target.value
                              )
                            }
                          />
                        </div>
                        <div>
                          <label className="mb-1 block text-[10px] uppercase tracking-[0.16em] text-slate-500">
                            Obturation length (mm)
                          </label>
                          <Input
                            type="number"
                            step="0.1"
                            value={canal.obturationLength}
                            onChange={(e) =>
                              handleCanalChange(
                                canal.id,
                                "obturationLength",
                                e.target.value
                              )
                            }
                          />
                        </div>
                        <div>
                          <label className="mb-1 block text-[10px] uppercase tracking-[0.16em] text-slate-500">
                            Δ vs WL
                          </label>
                          <div className="flex items-center justify-between rounded-xl border border-slate-700 bg-slate-950/70 px-3 py-2 text-xs text-slate-200">
                            <span>{marginText}</span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-1">
                        <div className="h-2 overflow-hidden rounded-full border border-slate-800 bg-slate-900">
                          <div
                            className={`h-full ${safetyBarClasses(
                              safety.level
                            )}`}
                            style={{ width: barWidth }}
                          />
                        </div>
                        <p className="mt-1 text-[10px] text-slate-500">
                          Color band shows how far obturation is from working
                          length. 0–2 mm range is visualized; anything beyond is
                          treated as critical.
                        </p>
                      </div>

                      <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
                        <div>
                          <label className="mb-1 block text-[10px] uppercase tracking-[0.16em] text-slate-500">
                            Cone size
                          </label>
                          <Select
                            value={canal.coneSize}
                            onChange={(e) =>
                              handleCanalChange(
                                canal.id,
                                "coneSize",
                                e.target.value
                              )
                            }
                          >
                            <option value="">Select…</option>
                            <option>25 / .04</option>
                            <option>30 / .04</option>
                            <option>35 / .04</option>
                            <option>40 / .04</option>
                            <option>Custom (see notes)</option>
                          </Select>
                        </div>
                        <div>
                          <label className="mb-1 block text-[10px] uppercase tracking-[0.16em] text-slate-500">
                            Sealer
                          </label>
                          <Select
                            value={canal.sealer}
                            onChange={(e) =>
                              handleCanalChange(
                                canal.id,
                                "sealer",
                                e.target.value
                              )
                            }
                          >
                            <option value="">Select…</option>
                            <option>Bioceramic</option>
                            <option>Resin</option>
                            <option>ZnO-eugenol</option>
                            <option>Calcium hydroxide-based</option>
                            <option>Other</option>
                          </Select>
                        </div>
                        <div>
                          <label className="mb-1 block text-[10px] uppercase tracking-[0.16em] text-slate-500">
                            Technique
                          </label>
                          <Select
                            value={canal.technique}
                            onChange={(e) =>
                              handleCanalChange(
                                canal.id,
                                "technique",
                                e.target.value
                              )
                            }
                          >
                            <option value="">Select…</option>
                            <option>Warm vertical</option>
                            <option>Continuous wave</option>
                            <option>Single cone</option>
                            <option>Thermafil / carrier-based</option>
                            <option>Cold lateral</option>
                            <option>Other</option>
                          </Select>
                        </div>
                        <div>
                          <label className="mb-1 block text-[10px] uppercase tracking-[0.16em] text-slate-500">
                            Canal status
                          </label>
                          <Select
                            value={canal.status}
                            onChange={(e) =>
                              handleCanalChange(
                                canal.id,
                                "status",
                                e.target.value
                              )
                            }
                          >
                            <option value="planned">Planned</option>
                            <option value="in-progress">In progress</option>
                            <option value="completed">Completed</option>
                          </Select>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>

          {/* COLUMNA DERECHA */}
          <div className="space-y-5">
            {/* DIAGNÓSTICO PULPAR / PERIAPICAL */}
            <Card
              title="Pulp & Periapical Diagnosis"
              subtitle="Pre-operative and post-operative diagnosis plus testing."
              badge="Diagnosis"
            >
              <div className="grid gap-3 text-[11px] md:grid-cols-2">
                <div>
                  <label className="mb-1 block font-medium text-slate-300">
                    Pre-operative pulpal diagnosis
                  </label>
                  <Select defaultValue="">
                    <option value="">Select…</option>
                    <option>Reversible pulpitis</option>
                    <option>Irreversible pulpitis</option>
                    <option>Symptomatic irreversible pulpitis</option>
                    <option>Asymptomatic irreversible pulpitis</option>
                    <option>Necrotic pulp</option>
                  </Select>
                </div>
                <div>
                  <label className="mb-1 block font-medium text-slate-300">
                    Pre-operative periapical diagnosis
                  </label>
                  <Select defaultValue="">
                    <option value="">Select…</option>
                    <option>Normal apical tissues</option>
                    <option>Symptomatic apical periodontitis</option>
                    <option>Asymptomatic apical periodontitis</option>
                    <option>Acute apical abscess</option>
                    <option>Chronic apical abscess</option>
                  </Select>
                </div>
              </div>

              <div className="mt-3 grid gap-3 text-[11px] md:grid-cols-3">
                <div>
                  <label className="mb-1 block font-medium text-slate-300">
                    Vitality tests
                  </label>
                  <Select defaultValue="">
                    <option value="">Select…</option>
                    <option>Cold only</option>
                    <option>Cold + EPT</option>
                    <option>Heat</option>
                    <option>No response to any test</option>
                  </Select>
                </div>
                <div>
                  <label className="mb-1 block font-medium text-slate-300">
                    Percussion / palpation
                  </label>
                  <Select defaultValue="">
                    <option value="">Select…</option>
                    <option>Negative to both</option>
                    <option>Positive percussion / negative palpation</option>
                    <option>Positive percussion & palpation</option>
                    <option>Slight tenderness</option>
                  </Select>
                </div>
                <div>
                  <label className="mb-1 block font-medium text-slate-300">
                    Swelling / sinus tract
                  </label>
                  <Select defaultValue="">
                    <option value="">Select…</option>
                    <option>No swelling or sinus tract</option>
                    <option>Localized swelling</option>
                    <option>Fluctuant swelling</option>
                    <option>Sinus tract present</option>
                  </Select>
                </div>
              </div>

              <div className="mt-3 grid gap-3 text-[11px] md:grid-cols-2">
                <div>
                  <label className="mb-1 block font-medium text-slate-300">
                    Post-operative pulpal status
                  </label>
                  <Select defaultValue="">
                    <option value="">Select…</option>
                    <option>Root canal treatment completed</option>
                    <option>Partial treatment / medicament placed</option>
                    <option>Pulp capping / pulpotomy</option>
                    <option>Treatment deferred</option>
                  </Select>
                </div>
                <div>
                  <label className="mb-1 block font-medium text-slate-300">
                    Post-operative apical status
                  </label>
                  <Select defaultValue="">
                    <option value="">Select…</option>
                    <option>Asymptomatic · normal function</option>
                    <option>Mild tenderness expected</option>
                    <option>Persistent symptoms · review at recall</option>
                    <option>Urgent review required</option>
                  </Select>
                </div>
              </div>
            </Card>

            {/* PLAN RESTAURADOR / PROSTHO */}
            <Card
              title="Restorative & Prosthodontic Plan"
              subtitle="What happens after the root canal is finished."
              badge="Restoration"
            >
              <div className="grid gap-3 text-[11px] md:grid-cols-2">
                <div>
                  <label className="mb-1 block font-medium text-slate-300">
                    Coronal restoration plan
                  </label>
                  <Select defaultValue="">
                    <option value="">Select…</option>
                    <option>Direct composite</option>
                    <option>Indirect onlay / inlay</option>
                    <option>Full coverage crown</option>
                    <option>Temporary only (re-evaluate)</option>
                  </Select>
                </div>
                <div>
                  <label className="mb-1 block font-medium text-slate-300">
                    Post / core
                  </label>
                  <Select defaultValue="">
                    <option value="">Select…</option>
                    <option>No post required</option>
                    <option>Fiber post</option>
                    <option>Cast post</option>
                    <option>Other post system</option>
                  </Select>
                </div>
              </div>

              <div className="mt-3 grid gap-3 text-[11px] md:grid-cols-3">
                <div>
                  <label className="mb-1 block font-medium text-slate-300">
                    Ferrule / crack risk
                  </label>
                  <Select defaultValue="">
                    <option value="">Select…</option>
                    <option>Good ferrule · low fracture risk</option>
                    <option>Limited ferrule · moderate risk</option>
                    <option>High fracture risk · guarded prognosis</option>
                  </Select>
                </div>
                <div>
                  <label className="mb-1 block font-medium text-slate-300">
                    Occlusal scheme
                  </label>
                  <Select defaultValue="">
                    <option value="">Select…</option>
                    <option>Low occlusal load</option>
                    <option>Normal occlusal load</option>
                    <option>Parafunction / bruxism</option>
                  </Select>
                </div>
                <div>
                  <label className="mb-1 block font-medium text-slate-300">
                    Long-term plan
                  </label>
                  <Select defaultValue="">
                    <option value="">Select…</option>
                    <option>Maintain tooth as long as possible</option>
                    <option>Monitor, possible future extraction / implant</option>
                    <option>Interim tooth prior to prosthetic replacement</option>
                  </Select>
                </div>
              </div>

              <div className="mt-3">
                <label className="mb-1 block text-[11px] font-medium text-slate-300">
                  Restorative & prostho notes
                </label>
                <TextArea
                  rows={4}
                  placeholder="Communication with prosthodontist, occlusal adjustments, need for night guard, crown timing, etc."
                />
              </div>
            </Card>

            {/* TÉCNICA, IRRIGACIÓN & FOLLOW-UP */}
            <Card
              title="Technique, Irrigation & Follow-up"
              subtitle="Complete protocol to feed future BI and retreatment analytics."
              badge="Technique"
            >
              <div className="grid gap-4 text-[11px] md:grid-cols-3">
                <div>
                  <label className="mb-1 block font-medium text-slate-300">
                    Instrumentation protocol
                  </label>
                  <TextArea
                    rows={4}
                    placeholder="System used (Protaper, WaveOne, Reciproc…), glide path, tapers, torque/RPM settings…"
                  />
                </div>
                <div>
                  <label className="mb-1 block font-medium text-slate-300">
                    Irrigation & activation
                  </label>
                  <TextArea
                    rows={4}
                    placeholder="NaOCl %, EDTA, CHX, activation (PUI, sonic, negative pressure), total irrigation time…"
                  />
                </div>
                <div>
                  <label className="mb-1 block font-medium text-slate-300">
                    Post-op & recall plan
                  </label>
                  <TextArea
                    rows={4}
                    placeholder="Immediate post-op instructions, recall (6, 12, 24 months), radiographic checks, retreatment triggers…"
                  />
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}
