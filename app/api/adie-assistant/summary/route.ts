import { NextResponse } from "next/server";

type RiskLevel = "ok" | "borderline" | "critical";

function toRiskLevel(score: number): RiskLevel {
  if (score >= 7) return "critical";
  if (score >= 4) return "borderline";
  return "ok";
}

function computeRiskFlags(input: {
  painScore: number;
  swelling: boolean;
  fever: boolean;
  onAnticoagulants: boolean;
  uncontrolledDiabetes: boolean;
  pregnancy: boolean;
  severeAllergy: boolean;
  immunosuppressed: boolean;
}) {
  const flags: Array<{
    label: string;
    level: RiskLevel;
    detail: string;
  }> = [];

  const infectionScore =
    (input.swelling ? 4 : 0) + (input.fever ? 4 : 0) + (input.painScore >= 7 ? 2 : 0);

  if (infectionScore > 0) {
    flags.push({
      label: "Infection / Emergency",
      level: toRiskLevel(infectionScore),
      detail:
        input.fever || input.swelling
          ? "Fever/swelling reported → consider urgent triage."
          : "Pain score elevated → evaluate for pulpal/periapical infection.",
    });
  }

  if (input.onAnticoagulants) {
    flags.push({
      label: "Bleeding risk",
      level: "borderline",
      detail: "Anticoagulants reported → verify INR/med list & plan hemostasis.",
    });
  }

  if (input.uncontrolledDiabetes) {
    flags.push({
      label: "Diabetes risk",
      level: "critical",
      detail: "Uncontrolled diabetes → higher infection risk, delayed healing.",
    });
  }

  if (input.immunosuppressed) {
    flags.push({
      label: "Immunosuppressed",
      level: "critical",
      detail: "Immunosuppression → strict infection control & medical coordination.",
    });
  }

  if (input.pregnancy) {
    flags.push({
      label: "Pregnancy",
      level: "borderline",
      detail: "Pregnancy reported → avoid contraindicated meds, timing & positioning.",
    });
  }

  if (input.severeAllergy) {
    flags.push({
      label: "Severe allergy",
      level: "critical",
      detail: "Severe allergy history → confirm triggers, emergency readiness.",
    });
  }

  // Global level (worst flag wins)
  const global: RiskLevel =
    flags.some((f) => f.level === "critical")
      ? "critical"
      : flags.some((f) => f.level === "borderline")
      ? "borderline"
      : "ok";

  return { global, flags };
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));

    // Inputs (defaults = demo)
    const patientName = String(body?.patientName ?? "Demo Patient");
    const patientId = String(body?.patientId ?? "ADIE-PT-0001");
    const age = Number(body?.age ?? 34);
    const sex = String(body?.sex ?? "Female");

    const painScore = Number(body?.painScore ?? 4);
    const swelling = Boolean(body?.swelling ?? false);
    const fever = Boolean(body?.fever ?? false);
    const onAnticoagulants = Boolean(body?.onAnticoagulants ?? false);
    const uncontrolledDiabetes = Boolean(body?.uncontrolledDiabetes ?? false);
    const pregnancy = Boolean(body?.pregnancy ?? false);
    const severeAllergy = Boolean(body?.severeAllergy ?? false);
    const immunosuppressed = Boolean(body?.immunosuppressed ?? false);

    const chiefComplaint = String(body?.chiefComplaint ?? "Dental pain when chewing (UR molar).");
    const meds = String(body?.meds ?? "None reported.");
    const allergies = String(body?.allergies ?? "NKDA.");
    const medical = String(body?.medical ?? "ASA II: controlled hypertension (demo).");

    const { global, flags } = computeRiskFlags({
      painScore,
      swelling,
      fever,
      onAnticoagulants,
      uncontrolledDiabetes,
      pregnancy,
      severeAllergy,
      immunosuppressed,
    });

    const summary = {
      patient: {
        name: patientName,
        id: patientId,
        age,
        sex,
      },
      chairSideSummary: [
        `Chief complaint: ${chiefComplaint}`,
        `Medical: ${medical}`,
        `Meds: ${meds}`,
        `Allergies: ${allergies}`,
        `Pain: ${painScore}/10`,
      ],
      risk: {
        global,
        flags,
      },
      suggestedNextSteps: [
        global === "critical"
          ? "Prioritize pain/infection control first (urgent triage)."
          : global === "borderline"
          ? "Proceed with caution; focus on disease control and risk reduction."
          : "Cleared for elective dentistry; proceed per standard protocol.",
        "Verify vitals and update med list/allergies before anesthesia.",
        "Document findings and informed consent in ADIE notes.",
      ],
    };

    return NextResponse.json(summary, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: "adie_assistant_summary_failed" },
      { status: 500 }
    );
  }
}
