"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type Theme = "dark" | "light";

type Specialty = {
  id: string;
  name: string;
  tag: string;
  activeCases: number;
  waitingList: number;
  clinicians: number;
  subtitle: string;
  detail: string;
};

const SPECIALTIES: Specialty[] = [
  {
    id: "general",
    name: "General Dentistry",
    tag: "GEN",
    activeCases: 72,
    waitingList: 5,
    clinicians: 4,
    subtitle: "Core node · Entry for all treatments",
    detail:
      "Receives every new patient. From here ADIE will route cases to Perio, Endo, Implants, Prostho or Ortho when clinical flags are detected.",
  },
  {
    id: "perio",
    name: "Periodontic Dentistry",
    tag: "PERIO",
    activeCases: 45,
    waitingList: 3,
    clinicians: 3,
    subtitle: "Gums, bone level & peri-implant health",
    detail:
      "Manages periodontal diagnosis, maintenance programs and surgical procedures, including peri-implantitis workflows.",
  },
  {
    id: "endo",
    name: "Endodontics",
    tag: "ENDO",
    activeCases: 31,
    waitingList: 2,
    clinicians: 2,
    subtitle: "Root canal therapy & follow up",
    detail:
      "Covers diagnostic tests, endodontic treatments and post-op tracking aligned with CBCT / radiology layers.",
  },
  {
    id: "prostho",
    name: "Prosthodontics",
    tag: "PROSTH",
    activeCases: 28,
    waitingList: 4,
    clinicians: 2,
    subtitle: "Rehab, crowns, bridges and full-mouth cases",
    detail:
      "Handles complex restorative plans, smile design and full-mouth rehab, linked to lab workflows and dental chart.",
  },
  {
    id: "ortho",
    name: "Orthodontics",
    tag: "ORTHO",
    activeCases: 22,
    waitingList: 1,
    clinicians: 2,
    subtitle: "Braces & clear aligner journeys",
    detail:
      "Tracks ortho stages, aligner sets and chair-time, feeding progress into the global ADIE timeline and BI.",
  },
  {
    id: "pedia",
    name: "Pediatric Dentistry",
    tag: "PEDIA",
    activeCases: 18,
    waitingList: 0,
    clinicians: 1,
    subtitle: "Kids, growth and prevention",
    detail:
      "Focuses on prevention, growth monitoring and behavior management, linked to vaccines and systemic risk flags.",
  },
  {
    id: "oms",
    name: "Oral & Maxillofacial Surgery",
    tag: "OMS",
    activeCases: 12,
    waitingList: 2,
    clinicians: 1,
    subtitle: "Surgical hub",
    detail:
      "Manages extractions, complex surgery and trauma, integrated with radiology and peri-operative medical alerts.",
  },
  {
    id: "implants",
    name: "Implants",
    tag: "IMPL",
    activeCases: 32,
    waitingList: 1,
    clinicians: 2,
    subtitle: "Surgical & prosthetic implant workflows",
    detail:
      "Covers planning, guided surgery and prosthetic restoration, connected to bone-level charts and CBCT analysis.",
  },
  {
    id: "radiology",
    name: "Radiology",
    tag: "RAD",
    activeCases: 40,
    waitingList: 0,
    clinicians: 2,
    subtitle: "2D / 3D imaging hub",
    detail:
      "Centralizes panoramic, CBCT and intraoral imaging, later powering AI diagnostics and clinical decision support.",
  },
];

export default function SpecialtiesPage() {
  const [theme, setTheme] = useState<Theme>("dark");
  const dark = theme === "dark";
  const [selectedSpecialtyId, setSelectedSpecialtyId] =
    useState<string>("general");

  const router = useRouter();

  const toggleTheme = () =>
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));

  const selectedSpecialty =
    SPECIALTIES.find((s) => s.id === selectedSpecialtyId) ?? SPECIALTIES[0];

  const totalActive = SPECIALTIES.length;
  const maxCases = Math.max(
    ...SPECIALTIES.map((sp) => sp.activeCases || 0),
    1
  );

  return (
    <div
      className={`min-h-screen ${
        dark ? "bg-slate-950 text-slate-50" : "bg-slate-100 text-slate-900"
      }`}
    >
      <div className="min-h-screen flex">
        {/* NAV LATERAL IZQUIERDO */}
        <aside className="hidden md:flex w-56 flex-col border-r border-slate-800 bg-slate-950/95 px-4 py-4">
          <div className="mb-6 flex items-center gap-2">
            <div className="h-9 w-9 rounded-xl bg-sky-500 text-slate-950 flex items-center justify-center text-xs font-bold">
              AD
            </div>
            <div>
              <div className="text-[11px] font-semibold tracking-[0.18em] uppercase text-slate-400">
                ADIE
              </div>
              <div className="text-xs text-slate-300">
                Astra Dental Intelligence
              </div>
            </div>
          </div>

          <nav className="flex-1 space-y-6 text-xs">
            <div>
              <div className="mb-2 text-[10px] tracking-[0.16em] uppercase text-slate-500">
                Main
              </div>
              <div className="space-y-1">
                <Link
                  href="/"
                  className="flex items-center justify-between rounded-lg px-3 py-2 text-slate-300 hover:bg-slate-800/80"
                >
                  <span>Dashboard</span>
                </Link>
                <Link
                  href="/specialties"
                  className="flex items-center justify-between rounded-lg px-3 py-2 bg-slate-800 text-slate-50"
                >
                  <span>Specialties</span>
                </Link>
                <Link
                  href="/patients"
                  className="flex items-center justify-between rounded-lg px-3 py-2 text-slate-300 hover:bg-slate-800/80"
                >
                  <span>Patients</span>
                </Link>
                <button className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-slate-400 hover:bg-slate-800/80">
                  <span>Calendar</span>
                </button>
                <button className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-slate-400 hover:bg-slate-800/80">
                  <span>Dental Chart</span>
                </button>
                <button className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-slate-400 hover:bg-slate-800/80">
                  <span>Radiology</span>
                </button>
                <button className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-slate-400 hover:bg-slate-800/80">
                  <span>Pharmacy</span>
                </button>
                <button className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-slate-400 hover:bg-slate-800/80">
                  <span>Operations Hub</span>
                </button>
              </div>
            </div>

            <div>
              <div className="mb-2 text-[10px] tracking-[0.16em] uppercase text-slate-500">
                Analytics
              </div>
              <div className="space-y-1">
                <button className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-slate-400 hover:bg-slate-800/80">
                  <span>Daily BI</span>
                </button>
                <button className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-slate-400 hover:bg-slate-800/80">
                  <span>Financial</span>
                </button>
                <button className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-slate-400 hover:bg-slate-800/80">
                  <span>Implants &amp; Perio</span>
                </button>
              </div>
            </div>
          </nav>

          <div className="mt-4 text-[10px] text-slate-500">
            Logged in as <span className="text-slate-300">ADIE Pilot</span>
          </div>
        </aside>

        {/* COLUMNA CENTRAL */}
        <main className="flex-1 px-4 md:px-8 py-6">
          {/* HEADER */}
          <header className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-sky-500 flex items-center justify-center text-xs font-bold text-slate-950">
                SP
              </div>
              <div>
                <h1 className="text-lg md:text-2xl font-semibold">
                  Specialties Universe
                </h1>
                <p className="text-xs text-slate-400">
                  Clinical layers for ADIE. Each specialty will have its own
                  forms, protocols and dental chart, but all of them connect to
                  the same patient.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <button
                onClick={toggleTheme}
                className={`rounded-full border px-3 py-1 flex items-center gap-2 ${
                  dark
                    ? "border-slate-700 text-slate-300"
                    : "border-slate-300 text-slate-800"
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
                Theme: {dark ? "Dark" : "Light"}
              </button>

              <Link
                href="/"
                className="rounded-full border border-slate-700 px-3 py-1 hover:border-sky-400"
              >
                ← Dashboard
              </Link>
              <Link
                href="/patients"
                className="rounded-full border border-slate-700 px-3 py-1 hover:border-sky-400"
              >
                Patients →
              </Link>
            </div>
          </header>

          {/* CONTENIDO PRINCIPAL */}
          <section className="max-w-6xl mx-auto space-y-5">
            {/* SPECIALTIES UNIVERSE · LAYER 2 */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 px-5 py-5">
              <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500 mb-1">
                Specialties · Layer 2
              </p>
              <p className="text-xs text-slate-400 mb-5">
                Touch (or click) a specialty to enter its deep layer. Later,
                each one will have treatment forms, protocols and a
                specialty-specific dental chart connected with the global
                patient profile.
              </p>

              {/* GRID DE ESPECIALIDADES */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-5">
                {SPECIALTIES.map((s) => {
                  const isSelected = s.id === selectedSpecialtyId;
                  const isCore = s.id === "general";
                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => {
                        setSelectedSpecialtyId(s.id);
                        // Navega al tercer layer. Ajusta la ruta si tus páginas usan otro patrón.
                        router.push(`/specialties/${s.id}`);
                      }}
                      className={`w-full text-left rounded-2xl border px-4 py-3 transition-all ${
                        isSelected
                          ? "border-sky-400 bg-sky-500/10 shadow-[0_0_24px_rgba(56,189,248,0.6)]"
                          : "border-slate-700 bg-slate-950/60 hover:border-sky-400 hover:bg-slate-900/80"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-slate-50">
                          {s.name}
                        </span>
                        <div className="flex items-center gap-1">
                          {isCore && (
                            <span className="text-[9px] px-2 py-0.5 rounded-full border border-sky-400 text-sky-200">
                              Core
                            </span>
                          )}
                          <span className="text-[9px] px-2 py-0.5 rounded-full border border-slate-600 text-slate-300">
                            {s.tag}
                          </span>
                        </div>
                      </div>
                      <p className="text-[11px] text-slate-400">
                        {s.subtitle}
                      </p>
                    </button>
                  );
                })}
              </div>

              {/* ESPECIALIDAD SELECCIONADA */}
              <div className="rounded-2xl border border-slate-800 bg-slate-950/70 px-4 py-4">
                <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500 mb-1">
                  Selected specialty
                </p>
                <h2 className="text-sm font-semibold text-slate-50 mb-1">
                  {selectedSpecialty.name}
                </h2>
                <p className="text-xs text-slate-400 mb-3">
                  {selectedSpecialty.detail}
                </p>

                <div className="flex flex-wrap gap-2 text-[11px]">
                  <span className="px-3 py-1 rounded-full border border-slate-700 text-slate-300">
                    Will have its own forms &amp; protocols
                  </span>
                  <span className="px-3 py-1 rounded-full border border-slate-700 text-slate-300">
                    Linked to global dental chart
                  </span>
                  <span className="px-3 py-1 rounded-full border border-slate-700 text-slate-300">
                    Connected to patient timeline &amp; BI
                  </span>
                </div>
              </div>
            </div>

            {/* RESUMEN SUPERIOR */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="rounded-2xl border border-slate-800 bg-slate-900/70 px-4 py-3">
                <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500 mb-1">
                  Active specialties
                </p>
                <p className="text-2xl font-semibold">{totalActive}</p>
                <p className="text-[11px] text-slate-400">
                  Configured in this ADIE instance.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-900/70 px-4 py-3">
                <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500 mb-1">
                  Clinical programs
                </p>
                <p className="text-xs text-slate-300 mb-2">
                  Implants, perio maintenance, ortho, endo and full-mouth rehab
                  connected with the global dental chart.
                </p>
                <p className="text-[11px] text-slate-500">
                  Future step: link with protocol libraries &amp; CBCT.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-900/70 px-4 py-3">
                <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500 mb-1">
                  Layers status
                </p>
                <ul className="text-[11px] text-slate-300 space-y-1">
                  <li>• Perio pockets chart v2 – ✅ Connected</li>
                  <li>• Endo apex tracker – 🧪 Clinical testing</li>
                  <li>• Implants + radiology &amp; CBCT – 🔗 Linked</li>
                </ul>
              </div>
            </div>

            {/* MAPA Y BARRAS */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {/* IZQUIERDA: SPECIALTIES MAP */}
              <div className="rounded-2xl border border-slate-800 bg-slate-900/70 px-4 py-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                      Specialties map
                    </p>
                    <p className="text-xs text-slate-400">
                      Active cases, waiting list and clinician capacity.
                    </p>
                  </div>
                  <p className="text-[11px] text-slate-500">Clinic layers view</p>
                </div>

                <div className="overflow-x-auto rounded-xl border border-slate-800">
                  <table className="min-w-full text-xs">
                    <thead className="bg-slate-900/80 text-slate-400">
                      <tr>
                        <th className="px-4 py-2 text-left">Specialty</th>
                        <th className="px-4 py-2 text-left">Tag</th>
                        <th className="px-4 py-2 text-left">Active cases</th>
                        <th className="px-4 py-2 text-left">Waiting list</th>
                        <th className="px-4 py-2 text-left">Clinicians</th>
                      </tr>
                    </thead>
                    <tbody>
                      {SPECIALTIES.map((s) => {
                        const isSelected = s.id === selectedSpecialtyId;
                        return (
                          <tr
                            key={s.id}
                            className={`border-t border-slate-800/70 hover:bg-slate-900/70 ${
                              isSelected
                                ? "bg-slate-900 border-sky-500/70 shadow-[0_0_16px_rgba(56,189,248,0.5)]"
                                : ""
                            }`}
                          >
                            <td className="px-4 py-2">{s.name}</td>
                            <td className="px-4 py-2">
                              <span className="inline-flex items-center rounded-full border border-slate-700 px-2 py-0.5 text-[10px]">
                                {s.tag}
                              </span>
                            </td>
                            <td className="px-4 py-2">{s.activeCases}</td>
                            <td className="px-4 py-2">{s.waitingList}</td>
                            <td className="px-4 py-2">{s.clinicians}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* DERECHA: PATIENTS BY SPECIALTY */}
              <div className="rounded-2xl border border-slate-800 bg-slate-900/70 px-4 py-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                      Patients by specialty
                    </p>
                    <p className="text-xs text-slate-400">
                      Distribution of active cases in the last 6 months.
                    </p>
                  </div>
                  <span className="text-[11px] text-slate-500">
                    All clinics
                  </span>
                </div>

                <div className="space-y-2">
                  {SPECIALTIES.map((s) => {
                    const width = Math.round(
                      (s.activeCases / maxCases) * 100
                    );
                    const isSelected = s.id === selectedSpecialtyId;
                    return (
                      <div key={s.id} className="space-y-1">
                        <div className="flex items-center justify-between text-[11px] text-slate-300">
                          <span
                            className={
                              isSelected ? "text-sky-300 font-medium" : ""
                            }
                          >
                            {s.name}
                          </span>
                          <span className="text-slate-400">
                            {s.activeCases} cases
                          </span>
                        </div>
                        <div className="h-2 rounded-full bg-slate-900 border border-slate-800 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              isSelected ? "bg-sky-400" : "bg-sky-500/80"
                            }`}
                            style={{ width: `${width}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>

                <p className="mt-4 text-[10px] text-slate-500">
                  Click-through to each specialty will later open its own
                  odontogram layer, protocols and procedure libraries.
                </p>
              </div>
            </div>
          </section>
        </main>

        {/* COLUMNA DERECHA */}
        <aside className="hidden xl:block w-80 border-l border-slate-800 bg-slate-950/90 px-4 py-6 space-y-4">
          {/* ADIE ASSISTANT */}
          <section className="rounded-2xl border border-slate-700 bg-slate-900/80 p-4">
            <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400 mb-1">
              Adie Assistant
            </p>
            <p className="text-xs text-slate-300 mb-3">
              Smart layer for dental decisions
            </p>
            <p className="text-[11px] text-slate-400 mb-4">
              Ask ADIE for medical risks, medication alerts, or a quick patient
              summary before entering the operatory.
            </p>
            <button className="w-full rounded-full bg-sky-500 px-3 py-1.5 text-xs font-semibold text-slate-950 hover:bg-sky-400">
              Open Chair-side Chat
            </button>
            <p className="mt-3 text-[10px] text-slate-500">
              Next step: connect with your ADIE-Postgres database.
            </p>
          </section>

          {/* ADIE UPDATES */}
          <section className="rounded-2xl border border-slate-700 bg-slate-900/80 p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
                Adie Updates
              </p>
              <span className="rounded-full border border-emerald-500 px-2 py-0.5 text-[10px] text-emerald-300">
                Beta
              </span>
            </div>
            <ul className="space-y-1 text-[11px] text-slate-400">
              <li>• Perio pockets chart v2 connected to patient_tooth_chart.</li>
              <li>• Endo apex tracker ready for clinical testing.</li>
              <li>• Implants module linked with radiology &amp; CBCT.</li>
            </ul>
          </section>

          {/* HELP & GUIDES */}
          <section className="rounded-2xl border border-slate-700 bg-slate-900/80 p-4">
            <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400 mb-2">
              Help &amp; Guides
            </p>
            <ul className="space-y-1 text-[11px] text-slate-400">
              <li>• How to use the daily dashboard.</li>
              <li>• Check-in flow on tablet for new patients.</li>
              <li>• Connect ADIE with DBeaver / Postgres in production.</li>
            </ul>
          </section>
        </aside>
      </div>
    </div>
  );
}
