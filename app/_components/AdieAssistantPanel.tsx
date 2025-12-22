"use client";

import React, { useEffect, useMemo, useState } from "react";

type RiskLevel = "ok" | "borderline" | "critical";

type Flag = {
  label: string;
  level: RiskLevel;
  detail: string;
};

type AssistantPayload = {
  patientName: string;
  patientId: string;
  age: number;
  sex: string;
  chiefComplaint: string;
  medical: string;
  meds: string;
  allergies: string;

  painScore: number; // 0-10
  swelling: boolean;
  fever: boolean;
  onAnticoagulants: boolean;
  uncontrolledDiabetes: boolean;
  pregnancy: boolean;
  severeAllergy: boolean;
  immunosuppressed: boolean;
};

type AssistantResult = {
  patient: { name: string; id: string; age: number; sex: string };
  chairSideSummary: string[];
  risk: { global: RiskLevel; flags: Flag[] };
  suggestedNextSteps: string[];
  source?: string;
};

function levelStyles(level: RiskLevel) {
  if (level === "critical")
    return "border-rose-500/70 bg-rose-500/10 text-rose-100";
  if (level === "borderline")
    return "border-amber-400/70 bg-amber-500/10 text-amber-100";
  return "border-emerald-500/70 bg-emerald-500/10 text-emerald-100";
}

function LevelPill({ level, text }: { level: RiskLevel; text: string }) {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] ${levelStyles(
        level
      )}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      <span className="normal-case tracking-normal">{text}</span>
    </span>
  );
}

/** WORLD SCALE RULES:
 * - Pain >= 7 => CRITICAL (URGENT)
 * - Swelling or Fever => CRITICAL (URGENT)
 * - Severe allergy => CRITICAL
 * - Borderline triggers => anticoagulants, uncontrolled diabetes, pregnancy, immunosuppressed, pain 4-6
 */
function computeLocal(payload: AssistantPayload): AssistantResult {
  const flags: Flag[] = [];

  // Pain flag
  if (payload.painScore >= 7) {
    flags.push({
      label: "Severe pain",
      level: "critical",
      detail: `Pain score ${payload.painScore}/10 (world scale: ≥7 = urgent).`,
    });
  } else if (payload.painScore >= 4) {
    flags.push({
      label: "Moderate pain",
      level: "borderline",
      detail: `Pain score ${payload.painScore}/10 (monitor and prioritize control).`,
    });
  }

  // Infection / emergency
  if (payload.swelling || payload.fever) {
    const parts: string[] = [];
    if (payload.swelling) parts.push("swelling/abscess");
    if (payload.fever) parts.push("fever/malaise");
    flags.push({
      label: "Infection / Emergency",
      level: "critical",
      detail: `${parts.join(" + ")} reported → urgent triage and infection control.`,
    });
  }

  // Bleeding risk
  if (payload.onAnticoagulants) {
    flags.push({
      label: "Bleeding risk",
      level: "borderline",
      detail:
        "Anticoagulants reported → verify INR/med list, plan hemostasis, consider consult.",
    });
  }

  // Metabolic
  if (payload.uncontrolledDiabetes) {
    flags.push({
      label: "Metabolic risk",
      level: "borderline",
      detail:
        "Uncontrolled diabetes suspected → confirm HbA1c/glucose, higher infection/healing risk.",
    });
  }

  // Pregnancy
  if (payload.pregnancy) {
    flags.push({
      label: "Pregnancy considerations",
      level: "borderline",
      detail:
        "Pregnancy reported → adjust meds/radiographs/anesthesia and timing per guidelines.",
    });
  }

  // Severe allergy
  if (payload.severeAllergy) {
    flags.push({
      label: "Severe allergy risk",
      level: "critical",
      detail:
        "Severe allergy reported → verify triggers, emergency plan (epi), avoid contraindicated meds.",
    });
  }

  // Immunosuppressed
  if (payload.immunosuppressed) {
    flags.push({
      label: "Immunosuppressed",
      level: "borderline",
      detail:
        "Immunosuppression reported → increased infection risk; consider medical coordination.",
    });
  }

  const hasCritical = flags.some((f) => f.level === "critical");
  const hasBorderline = flags.some((f) => f.level === "borderline");
  const global: RiskLevel = hasCritical ? "critical" : hasBorderline ? "borderline" : "ok";

  const chairSideSummary: string[] = [
    `Chief complaint: ${payload.chiefComplaint || "—"}`,
    `Medical: ${payload.medical || "—"}`,
    `Meds: ${payload.meds || "—"}`,
    `Allergies: ${payload.allergies || "—"}`,
    `Pain: ${payload.painScore}/10`,
  ];

  const suggestedNextSteps: string[] = (() => {
    if (global === "critical") {
      return [
        "Proceed as URGENT: control pain and infection first.",
        "Confirm vitals, review meds/allergies before anesthesia.",
        "Consider same-day triage: drainage/endo access/extraction as indicated.",
        "Document findings + informed consent in ADIE notes.",
      ];
    }
    if (global === "borderline") {
      return [
        "Proceed with CAUTION: prioritize disease control and risk reduction.",
        "Verify medical history/med list; coordinate if needed.",
        "Document risks + plan (hemostasis, diabetes control, pregnancy precautions).",
      ];
    }
    return [
      "Cleared for elective dentistry (no major red flags reported).",
      "Proceed with standard clinical workflow and documentation.",
    ];
  })();

  return {
    patient: {
      name: payload.patientName,
      id: payload.patientId,
      age: payload.age,
      sex: payload.sex,
    },
    chairSideSummary,
    risk: { global, flags },
    suggestedNextSteps,
    source: `local-engine · ${new Date().toLocaleString()}`,
  };
}

/** If API returns something inconsistent, we normalize using world-scale rules. */
function normalizeWithLocal(apiData: any, local: AssistantResult): AssistantResult {
  // If API is missing fields or global doesn't match our world-scale critical triggers, use local.
  const apiGlobal: RiskLevel | undefined = apiData?.risk?.global;
  const apiFlags: any[] = Array.isArray(apiData?.risk?.flags) ? apiData.risk.flags : [];

  const localMustBeCritical =
    local.risk.global === "critical" && (local.risk.flags ?? []).some((f) => f.level === "critical");

  if (!apiGlobal) return local;

  // If local says CRITICAL (e.g., pain>=7/swelling/fever) but API says not critical → trust local.
  if (localMustBeCritical && apiGlobal !== "critical") return local;

  // Otherwise, keep API but ensure it's well-formed
  return {
    patient: apiData?.patient ?? local.patient,
    chairSideSummary: Array.isArray(apiData?.chairSideSummary)
      ? apiData.chairSideSummary
      : local.chairSideSummary,
    risk: {
      global: apiGlobal,
      flags: apiFlags.length
        ? apiFlags.map((f) => ({
            label: String(f.label ?? "Flag"),
            level: (f.level as RiskLevel) ?? "borderline",
            detail: String(f.detail ?? ""),
          }))
        : local.risk.flags,
    },
    suggestedNextSteps: Array.isArray(apiData?.suggestedNextSteps)
      ? apiData.suggestedNextSteps
      : local.suggestedNextSteps,
    source: apiData?.source ?? local.source ?? "api",
  };
}

export function AdieAssistantPanel() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  // Inputs (demo but useful)
  const [patientName, setPatientName] = useState("Demo Patient");
  const [patientId, setPatientId] = useState("ADIE-PT-0001");
  const [age, setAge] = useState<number>(34);
  const [sex, setSex] = useState("Female");

  const [chiefComplaint, setChiefComplaint] = useState(
    "Dental pain when chewing (UR molar)."
  );
  const [medical, setMedical] = useState("ASA II: controlled hypertension (demo).");
  const [meds, setMeds] = useState("None reported.");
  const [allergies, setAllergies] = useState("NKDA.");

  const [painScore, setPainScore] = useState<number>(4);
  const [swelling, setSwelling] = useState(false);
  const [fever, setFever] = useState(false);
  const [onAnticoagulants, setOnAnticoagulants] = useState(false);
  const [uncontrolledDiabetes, setUncontrolledDiabetes] = useState(false);
  const [pregnancy, setPregnancy] = useState(false);
  const [severeAllergy, setSevereAllergy] = useState(false);
  const [immunosuppressed, setImmunosuppressed] = useState(false);

  const payload: AssistantPayload = useMemo(
    () => ({
      patientName,
      patientId,
      age,
      sex,
      chiefComplaint,
      medical,
      meds,
      allergies,
      painScore,
      swelling,
      fever,
      onAnticoagulants,
      uncontrolledDiabetes,
      pregnancy,
      severeAllergy,
      immunosuppressed,
    }),
    [
      patientName,
      patientId,
      age,
      sex,
      chiefComplaint,
      medical,
      meds,
      allergies,
      painScore,
      swelling,
      fever,
      onAnticoagulants,
      uncontrolledDiabetes,
      pregnancy,
      severeAllergy,
      immunosuppressed,
    ]
  );

  const preview = useMemo(() => computeLocal(payload), [payload]);

  const [result, setResult] = useState<AssistantResult | null>(null);
  const global: RiskLevel = (result?.risk?.global ?? preview.risk.global) as RiskLevel;

  const canCopyText = useMemo(() => {
    const r = result ?? preview;
    if (!r) return "";
    const lines: string[] = [];
    lines.push(`ADIE Chair-side Summary`);
    lines.push(`Patient: ${r.patient.name} (${r.patient.id})`);
    lines.push(`Age/Sex: ${r.patient.age} / ${r.patient.sex}`);
    lines.push("");
    lines.push(...(r.chairSideSummary ?? []));
    lines.push("");
    lines.push(`Global Risk: ${String(r.risk.global).toUpperCase()}`);
    for (const f of r.risk.flags ?? []) {
      lines.push(`- ${f.label} [${String(f.level).toUpperCase()}]: ${f.detail}`);
    }
    lines.push("");
    lines.push("Suggested next steps:");
    for (const s of r.suggestedNextSteps ?? []) lines.push(`- ${s}`);
    if (r.source) lines.push(`\nSource: ${r.source}`);
    return lines.join("\n");
  }, [result, preview]);

  async function generateSummary() {
    setLoading(true);
    setCopied(false);

    const local = computeLocal(payload);

    try {
      const res = await fetch("/api/adie-assistant/summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("assistant_api_not_ok");
      const data = await res.json();

      // Normalize with world-scale rules
      const normalized = normalizeWithLocal(data, local);
      setResult(normalized);
    } catch {
      // If API fails, we still deliver a correct world-scale result
      setResult(local);
    } finally {
      setLoading(false);
    }
  }

  async function copyToClipboard() {
    try {
      await navigator.clipboard.writeText(canCopyText || "");
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1400);
    } catch {
      // ignore
    }
  }

  // ESC to close
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      {/* Right-rail card */}
      <section className="rounded-2xl border border-slate-800 bg-gradient-to-b from-slate-900 to-slate-950 p-4 space-y-3">
        <p className="text-xs font-semibold tracking-[0.18em] uppercase text-slate-400">
          ADIE Assistant
        </p>

        <div className="flex items-center justify-between gap-2">
          <p className="text-sm font-semibold text-slate-50">
            Patient Summary + Risk Flags
          </p>

          <LevelPill
            level={global}
            text={
              global === "critical"
                ? "Urgent"
                : global === "borderline"
                ? "Caution"
                : "Cleared"
            }
          />
        </div>

        <p className="text-xs text-slate-400">
          World-scale triage. Pain ≥ 7/10 or swelling/fever ={" "}
          <span className="text-rose-200">URGENT</span>.
        </p>

        <button
          onClick={() => setOpen(true)}
          className="w-full rounded-xl bg-sky-500 py-2 text-xs font-semibold text-slate-950 hover:bg-sky-400 transition"
        >
          Open Chair-side Chat
        </button>

        <p className="text-[10px] text-slate-500">
          Live preview is computed locally. “Generate” saves a snapshot.
        </p>
      </section>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setOpen(false)}
          />
          <div className="absolute right-0 top-0 h-full w-full max-w-[560px] border-l border-slate-800 bg-slate-950 text-slate-50 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 px-5 py-4">
              <div>
                <p className="text-[11px] uppercase tracking-[0.22em] text-slate-400">
                  Chair-side Assistant
                </p>
                <p className="text-sm font-semibold">
                  Patient Summary + Risk Flags
                </p>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="rounded-full border border-slate-700 bg-slate-900/60 px-3 py-1 text-xs text-slate-200 hover:border-sky-500 hover:text-sky-200"
              >
                Close
              </button>
            </div>

            <div className="h-[calc(100%-64px)] overflow-auto px-5 py-5 space-y-4">
              {/* Inputs */}
              <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">
                      Patient name
                    </label>
                    <input
                      value={patientName}
                      onChange={(e) => setPatientName(e.target.value)}
                      className="w-full rounded-xl border border-slate-700 bg-slate-950/60 px-3 py-2 text-xs outline-none focus:border-sky-400"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">
                      ADIE ID
                    </label>
                    <input
                      value={patientId}
                      onChange={(e) => setPatientId(e.target.value)}
                      className="w-full rounded-xl border border-slate-700 bg-slate-950/60 px-3 py-2 text-xs outline-none focus:border-sky-400"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">
                      Age
                    </label>
                    <input
                      type="number"
                      value={age}
                      onChange={(e) => setAge(Number(e.target.value || 0))}
                      className="w-full rounded-xl border border-slate-700 bg-slate-950/60 px-3 py-2 text-xs outline-none focus:border-sky-400"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">
                      Sex
                    </label>
                    <input
                      value={sex}
                      onChange={(e) => setSex(e.target.value)}
                      className="w-full rounded-xl border border-slate-700 bg-slate-950/60 px-3 py-2 text-xs outline-none focus:border-sky-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">
                    Chief complaint
                  </label>
                  <textarea
                    rows={2}
                    value={chiefComplaint}
                    onChange={(e) => setChiefComplaint(e.target.value)}
                    className="w-full resize-none rounded-xl border border-slate-700 bg-slate-950/60 px-3 py-2 text-xs outline-none focus:border-sky-400"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">
                      Medical
                    </label>
                    <textarea
                      rows={2}
                      value={medical}
                      onChange={(e) => setMedical(e.target.value)}
                      className="w-full resize-none rounded-xl border border-slate-700 bg-slate-950/60 px-3 py-2 text-xs outline-none focus:border-sky-400"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">
                      Meds / Allergies
                    </label>
                    <textarea
                      rows={2}
                      value={`${meds} | ${allergies}`}
                      onChange={(e) => {
                        const v = e.target.value;
                        const parts = v.split("|");
                        setMeds((parts[0] ?? "").trim() || "None reported.");
                        setAllergies((parts[1] ?? "").trim() || "NKDA.");
                      }}
                      className="w-full resize-none rounded-xl border border-slate-700 bg-slate-950/60 px-3 py-2 text-xs outline-none focus:border-sky-400"
                    />
                  </div>
                </div>

                {/* Quick risk inputs */}
                <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-3">
                  <div className="flex items-center justify-between">
                    <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                      Quick Risk Inputs
                    </p>

                    <LevelPill
                      level={preview.risk.global}
                      text={
                        preview.risk.global === "critical"
                          ? "Urgent"
                          : preview.risk.global === "borderline"
                          ? "Caution"
                          : "Cleared"
                      }
                    />
                  </div>

                  <div className="mt-2">
                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span>Pain</span>
                      <span>{painScore}/10</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={10}
                      value={painScore}
                      onChange={(e) => setPainScore(Number(e.target.value || 0))}
                      className="w-full accent-sky-400 mt-2"
                    />
                    <p className="mt-1 text-[10px] text-slate-500">
                      World scale:{" "}
                      <span className="text-rose-200">pain ≥ 7/10 = urgent</span>
                    </p>
                  </div>

                  <div className="mt-3 grid grid-cols-2 gap-2 text-[11px] text-slate-300">
                    <label className="inline-flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={swelling}
                        onChange={(e) => setSwelling(e.target.checked)}
                        className="h-3.5 w-3.5 rounded border-slate-600 bg-slate-900"
                      />
                      Swelling / abscess
                    </label>

                    <label className="inline-flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={fever}
                        onChange={(e) => setFever(e.target.checked)}
                        className="h-3.5 w-3.5 rounded border-slate-600 bg-slate-900"
                      />
                      Fever / malaise
                    </label>

                    <label className="inline-flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={onAnticoagulants}
                        onChange={(e) => setOnAnticoagulants(e.target.checked)}
                        className="h-3.5 w-3.5 rounded border-slate-600 bg-slate-900"
                      />
                      Anticoagulants
                    </label>

                    <label className="inline-flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={uncontrolledDiabetes}
                        onChange={(e) => setUncontrolledDiabetes(e.target.checked)}
                        className="h-3.5 w-3.5 rounded border-slate-600 bg-slate-900"
                      />
                      Uncontrolled diabetes
                    </label>

                    <label className="inline-flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={pregnancy}
                        onChange={(e) => setPregnancy(e.target.checked)}
                        className="h-3.5 w-3.5 rounded border-slate-600 bg-slate-900"
                      />
                      Pregnancy
                    </label>

                    <label className="inline-flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={severeAllergy}
                        onChange={(e) => setSevereAllergy(e.target.checked)}
                        className="h-3.5 w-3.5 rounded border-slate-600 bg-slate-900"
                      />
                      Severe allergy
                    </label>

                    <label className="inline-flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={immunosuppressed}
                        onChange={(e) => setImmunosuppressed(e.target.checked)}
                        className="h-3.5 w-3.5 rounded border-slate-600 bg-slate-900"
                      />
                      Immunosuppressed
                    </label>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={generateSummary}
                    disabled={loading}
                    className="flex-1 rounded-xl bg-sky-500 py-2 text-xs font-semibold text-slate-950 hover:bg-sky-400 disabled:opacity-60"
                  >
                    {loading ? "Generating…" : "Generate Summary"}
                  </button>

                  <button
                    onClick={copyToClipboard}
                    className="rounded-xl border border-slate-700 bg-slate-900/60 px-3 py-2 text-xs text-slate-200 hover:border-sky-500"
                  >
                    {copied ? "Copied ✓" : "Copy"}
                  </button>
                </div>

                <p className="text-[10px] text-slate-500">
                  Tip: even if the API isn’t ready, this panel works using the local engine.
                </p>
              </div>

              {/* Output */}
              <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                    Output
                  </p>
                  <LevelPill
                    level={(result ?? preview).risk.global}
                    text={`Global risk: ${(result ?? preview).risk.global.toUpperCase()}`}
                  />
                </div>

                <div className="text-xs text-slate-200 space-y-1">
                  {(result ?? preview).chairSideSummary.map((l, i) => (
                    <p key={i}>• {l}</p>
                  ))}
                </div>

                <div className="mt-2">
                  <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500 mb-2">
                    Risk Flags
                  </p>

                  <div className="space-y-2">
                    {(result ?? preview).risk.flags.length === 0 ? (
                      <p className="text-xs text-slate-400">No flags reported.</p>
                    ) : (
                      (result ?? preview).risk.flags.map((f, idx) => (
                        <div
                          key={idx}
                          className="rounded-xl border border-slate-800 bg-slate-950/40 p-3"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <p className="text-xs font-semibold">{f.label}</p>
                            <LevelPill
                              level={f.level}
                              text={String(f.level).toUpperCase()}
                            />
                          </div>
                          <p className="mt-1 text-[11px] text-slate-400">
                            {f.detail}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                <div className="mt-2">
                  <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500 mb-2">
                    Suggested Next Steps
                  </p>
                  <div className="text-xs text-slate-200 space-y-1">
                    {(result ?? preview).suggestedNextSteps.map((l, i) => (
                      <p key={i}>• {l}</p>
                    ))}
                  </div>
                </div>

                <p className="text-[10px] text-slate-500 pt-2">
                  Source: {(result ?? preview).source ?? "local-engine"}
                </p>
              </div>

              <p className="text-[10px] text-slate-500">
                Next phase: connect to ADIE Postgres to auto-pull by patient ID or “next appointment”.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
