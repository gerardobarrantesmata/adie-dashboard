"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

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
        props.className ?? ""}`}
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

type UploadedImageState = {
  file: File | null;
  previewUrl: string | null;
};

export default function RadiologyPage() {
  const [uploaded, setUploaded] = useState<UploadedImageState>({
    file: null,
    previewUrl: null,
  });

  const [aiStatus, setAiStatus] = useState<
    "idle" | "analyzing" | "done"
  >("idle");

  const [aiResult, setAiResult] = useState({
    boneLevel: "—",
    cariesRisk: "—",
    periapicalFindings: "—",
    periodontalFindings: "—",
    otherNotes: "Upload an image and run AI to see a simulated analysis.",
  });

  // limpiar URL cuando cambie archivo
  useEffect(() => {
    return () => {
      if (uploaded.previewUrl) {
        URL.revokeObjectURL(uploaded.previewUrl);
      }
    };
  }, [uploaded.previewUrl]);

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    setUploaded({
      file,
      previewUrl: url,
    });
    setAiStatus("idle");
    setAiResult({
      boneLevel: "—",
      cariesRisk: "—",
      periapicalFindings: "—",
      periodontalFindings: "—",
      otherNotes: "Image loaded. Ready for AI analysis.",
    });
  };

  const handleRunAi = () => {
    if (!uploaded.file) {
      alert("Please upload an image first.");
      return;
    }

    // Aquí en el futuro se llamaría a un endpoint /api/adie-radiology
    setAiStatus("analyzing");

    setTimeout(() => {
      setAiStatus("done");
      setAiResult({
        boneLevel:
          "Generalized horizontal bone loss 15–25% in posterior regions; localized vertical defect around tooth 26.",
        cariesRisk:
          "Suspicious proximal radiolucencies on 16M and 27D compatible with incipient caries — recommend clinical correlation.",
        periapicalFindings:
          "Periapical radiolucency compatible with chronic apical periodontitis on 36; others within normal limits.",
        periodontalFindings:
          "Calculus deposits suspected in molar regions, furcation involvement not clearly visible — consider dedicated perio chart.",
        otherNotes:
          "AI prototype output only. Final diagnosis must be confirmed by the clinician. Future version will connect to CBCT / SVG chart.",
      });
    }, 1200);
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-50">
      <div className="mx-auto max-w-6xl px-4 pb-24 pt-8">
        {/* Header */}
        <header className="mb-8 flex items-center justify-between gap-4">
          <div>
            <p className="text-[11px] uppercase tracking-[0.28em] text-sky-400">
              Specialties · Layer 3
            </p>
            <h1 className="mt-1 text-2xl md:text-3xl font-semibold tracking-tight text-slate-50">
              Radiology · Imaging & ADIE AI
            </h1>
            <p className="mt-2 max-w-2xl text-xs md:text-sm text-slate-400">
              Upload intraoral, panoramic or CBCT-derived images, attach them
              to the patient record and let ADIE&apos;s future AI layer assist
              with bone levels, caries suspicion and periapical findings.
            </p>
          </div>

          <Link
            href="/specialties"
            className="rounded-full border border-slate-700 bg-slate-900/70 px-4 py-1.5 text-xs md:text-sm text-slate-200 hover:border-sky-500 hover:text-sky-100 transition-colors"
          >
            ← Back to Specialties Universe
          </Link>
        </header>

        {/* Context */}
        <Card
          title="Radiology Context"
          subtitle="Link the study to a patient, visit and imaging modality."
          badge="Meta"
        >
          <div className="grid gap-4 md:grid-cols-4">
            <div>
              <label className="mb-1 block text-[11px] font-medium text-slate-300">
                Patient (link EMR)
              </label>
              <button className="w-full rounded-full border border-sky-500/70 bg-sky-500/10 px-3 py-2 text-[11px] font-semibold text-sky-100 hover:bg-sky-500/20 transition">
                Select patient from EMR
              </button>
            </div>
            <div>
              <label className="mb-1 block text-[11px] font-medium text-slate-300">
                Radiology study ID
              </label>
              <Input placeholder="ADIE-RAD-0001" />
            </div>
            <div>
              <label className="mb-1 block text-[11px] font-medium text-slate-300">
                Modality
              </label>
              <Select defaultValue="">
                <option value="">Select…</option>
                <option>Intraoral periapical</option>
                <option>Bitewing</option>
                <option>Panoramic</option>
                <option>CBCT volume (screenshot)</option>
                <option>Cephalometric</option>
                <option>Other dental imaging</option>
              </Select>
            </div>
            <div>
              <label className="mb-1 block text-[11px] font-medium text-slate-300">
                Region of interest
              </label>
              <Select defaultValue="">
                <option value="">Select…</option>
                <option>Anterior maxilla</option>
                <option>Posterior maxilla</option>
                <option>Anterior mandible</option>
                <option>Posterior mandible</option>
                <option>Full arch</option>
                <option>Multiple regions</option>
              </Select>
            </div>
          </div>
        </Card>

        {/* Main grid */}
        <div className="mt-6 grid gap-5 lg:grid-cols-[1.5fr,1.5fr]">
          {/* Left: upload + preview */}
          <div className="space-y-5">
            <Card
              title="Image Upload"
              subtitle="Upload a radiographic image from your computer and attach it to the case."
              badge="Upload"
            >
              <div className="grid gap-4 md:grid-cols-[1.2fr,1fr]">
                {/* Dropzone */}
                <div>
                  <label className="mb-2 block text-[11px] font-medium text-slate-300">
                    Radiograph file
                  </label>
                  <label className="flex h-40 cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-slate-700 bg-slate-950/70 px-3 text-center hover:border-sky-500/70 hover:bg-slate-900/60 transition">
                    <span className="text-xs font-medium text-slate-200">
                      Drop image here or click to browse
                    </span>
                    <span className="mt-1 text-[11px] text-slate-500">
                      PNG, JPG, JPEG — Panoramic, periapical, bitewing, CBCT
                      screenshot
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                  </label>
                  {uploaded.file && (
                    <p className="mt-2 text-[11px] text-slate-400">
                      Selected file:{" "}
                      <span className="font-semibold text-slate-100">
                        {uploaded.file.name}
                      </span>
                    </p>
                  )}
                </div>

                {/* Quick meta info */}
                <div className="space-y-2">
                  <div>
                    <label className="mb-1 block text-[11px] font-medium text-slate-300">
                      View type
                    </label>
                    <Select defaultValue="">
                      <option value="">Select…</option>
                      <option>Single tooth</option>
                      <option>Quadrant</option>
                      <option>Full arch</option>
                      <option>Both arches</option>
                    </Select>
                  </div>
                  <div>
                    <label className="mb-1 block text-[11px] font-medium text-slate-300">
                      Acquisition source
                    </label>
                    <Select defaultValue="">
                      <option value="">Select…</option>
                      <option>In-clinic sensor</option>
                      <option>Imported from external center</option>
                      <option>CBCT exported image</option>
                      <option>Other source</option>
                    </Select>
                  </div>
                  <div>
                    <label className="mb-1 block text-[11px] font-medium text-slate-300">
                      Technician / radiology center (optional)
                    </label>
                    <Input placeholder="Name or center…" />
                  </div>
                </div>
              </div>

              {/* Preview */}
              {uploaded.previewUrl && (
                <div className="mt-4">
                  <p className="mb-2 text-[11px] font-medium text-slate-300">
                    Preview
                  </p>
                  <div className="overflow-hidden rounded-2xl border border-slate-800 bg-black max-h-80 flex items-center justify-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={uploaded.previewUrl}
                      alt="Uploaded radiograph"
                      className="max-h-80 w-auto object-contain"
                    />
                  </div>
                </div>
              )}
            </Card>
          </div>

          {/* Right: AI + report */}
          <div className="space-y-5">
            <Card
              title="ADIE Radiology AI"
              subtitle="Prototype view of AI-assisted findings. Later this will connect to a real model."
              badge="AI layer"
            >
              <p className="mb-3 text-[11px] text-slate-400">
                Once integrated, this module will send the image to an AI model
                specialized in dental radiology (bone levels, caries, periapical
                and implant-related findings). For now, you can simulate the
                result to understand the workflow.
              </p>

              <div className="mb-3 flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={handleRunAi}
                  disabled={aiStatus === "analyzing"}
                  className="rounded-full border border-sky-500/70 bg-sky-500/10 px-4 py-1.5 text-xs font-semibold text-sky-100 hover:bg-sky-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  {aiStatus === "analyzing"
                    ? "Analyzing with ADIE AI…"
                    : "Run ADIE AI analysis (prototype)"}
                </button>
                <span className="text-[10px] text-slate-500">
                  Future: call /api/adie-radiology and store structured results
                  in Postgres.
                </span>
              </div>

              <div className="grid gap-3 md:grid-cols-2 text-[11px]">
                <div className="space-y-2">
                  <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-3">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-emerald-300 mb-1">
                      Bone level (AI)
                    </p>
                    <p className="text-slate-200">{aiResult.boneLevel}</p>
                  </div>
                  <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-3">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-amber-300 mb-1">
                      Caries suspicion (AI)
                    </p>
                    <p className="text-slate-200">{aiResult.cariesRisk}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-3">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-sky-300 mb-1">
                      Periapical / endodontic findings (AI)
                    </p>
                    <p className="text-slate-200">
                      {aiResult.periapicalFindings}
                    </p>
                  </div>
                  <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-3">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-teal-300 mb-1">
                      Periodontal / other (AI)
                    </p>
                    <p className="text-slate-200">
                      {aiResult.periodontalFindings}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-3">
                <label className="mb-1 block text-[11px] font-medium text-slate-300">
                  AI notes (prototype)
                </label>
                <p className="rounded-xl border border-slate-800 bg-slate-950/80 p-3 text-[11px] text-slate-200">
                  {aiResult.otherNotes}
                </p>
              </div>
            </Card>

            <Card
              title="Radiology Report (Human)"
              subtitle="Space for the clinician&apos;s final interpretation and diagnostic report."
              badge="Report"
            >
              <div className="grid gap-3 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-[11px] font-medium text-slate-300">
                    Reporting clinician
                  </label>
                  <Input placeholder="Name and credentials…" />
                </div>
                <div>
                  <label className="mb-1 block text-[11px] font-medium text-slate-300">
                    Report status
                  </label>
                  <Select defaultValue="">
                    <option value="">Select…</option>
                    <option>Draft</option>
                    <option>Final</option>
                    <option>Amended</option>
                  </Select>
                </div>
              </div>

              <div className="mt-3">
                <label className="mb-1 block text-[11px] font-medium text-slate-300">
                  Radiology report
                </label>
                <TextArea
                  rows={5}
                  placeholder="Structured radiology report, including findings, impression, and recommendations…"
                />
              </div>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}
