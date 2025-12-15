"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

type Theme = "dark" | "light";
type Tab = "scheduled" | "confirmed" | "completed" | "emergency";

type OpsRow = {
  time: string;
  patient: string;
  specialty: string;
  provider: string;
  procedure: string;
  status: Tab;
};

const OPS_ROWS: OpsRow[] = [
  {
    time: "08:00",
    patient: "María López",
    specialty: "Perio",
    provider: "Dr. Barrantes",
    procedure: "Perio maintenance",
    status: "completed",
  },
  {
    time: "09:30",
    patient: "David Chen",
    specialty: "Implant",
    provider: "Dr. Rodríguez",
    procedure: "AOX planning",
    status: "confirmed",
  },
  {
    time: "10:00",
    patient: "Sofía Castro",
    specialty: "General",
    provider: "Dr. Barrantes",
    procedure: "Recall + exam",
    status: "scheduled",
  },
  {
    time: "11:00",
    patient: "Ana Rodríguez",
    specialty: "Ortho",
    provider: "Dr. Park",
    procedure: "Aligner check",
    status: "confirmed",
  },
  {
    time: "12:15",
    patient: "Nazareti Cova",
    specialty: "General",
    provider: "Dr. Chen",
    procedure: "Composite restore",
    status: "completed",
  },
  {
    time: "13:00",
    patient: "Marco Vargas",
    specialty: "Prosth",
    provider: "Dr. Chen",
    procedure: "Crown consult",
    status: "scheduled",
  },
  {
    time: "14:00",
    patient: "Carlos Vega",
    specialty: "Endo",
    provider: "Dr. Barrantes",
    procedure: "Pain UR6 triage",
    status: "emergency",
  },
];

function TabPill({
  active,
  label,
}: {
  active?: boolean;
  label: string;
}) {
  return (
    <span
      className={`rounded-full border px-3 py-1 text-[11px] ${
        active
          ? "border-sky-500/70 text-sky-300 bg-sky-500/10"
          : "border-slate-700 text-slate-300 hover:border-sky-400"
      }`}
    >
      {label}
    </span>
  );
}

export default function OperationsHubPage() {
  const [theme, setTheme] = useState<Theme>("dark");
  const dark = theme === "dark";
  const sp = useSearchParams();
  const tab = (sp.get("tab") as Tab) || "scheduled";

  const rows = useMemo(() => {
    return OPS_ROWS.filter((r) => r.status === tab);
  }, [tab]);

  const toggleTheme = () =>
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));

  return (
    <div
      className={`min-h-screen flex ${
        dark ? "bg-slate-950 text-slate-50" : "bg-slate-100 text-slate-900"
      }`}
    >
      {/* Sidebar (homogéneo con ADIE) */}
      <aside
        className={`hidden md:flex w-60 flex-col border-r ${
          dark ? "border-slate-800 bg-slate-950/80" : "border-slate-200 bg-white"
        }`}
      >
        <div className="h-16 flex items-center px-5 border-b border-slate-800/50">
          <div className="h-9 w-9 rounded-xl bg-sky-500 flex items-center justify-center text-xs font-bold text-slate-950">
            AD
          </div>
          <div className="ml-3">
            <p className="text-xs uppercase tracking-[0.15em] text-slate-400">
              ADIE
            </p>
            <p className="text-sm font-semibold">Operations Hub</p>
            <div className="text-[10px] tracking-[0.28em] uppercase text-slate-400/90">
              EcoSystem
            </div>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 text-sm">
          <Link
            href="/dashboard"
            className="w-full flex items-center rounded-xl px-3 py-2 text-xs text-slate-300 hover:bg-slate-800/80 hover:text-sky-200 transition-colors"
          >
            <span className="w-1.5 h-1.5 rounded-full mr-2 bg-slate-500 opacity-80" />
            Dashboard
          </Link>

          <Link
            href="/operations-hub"
            className="w-full flex items-center rounded-xl px-3 py-2 text-xs bg-sky-500/20 text-sky-200 font-semibold border border-sky-500/50 shadow-[0_0_16px_rgba(56,189,248,0.6)]"
          >
            <span className="w-1.5 h-1.5 rounded-full mr-2 bg-sky-400 opacity-80" />
            Operations Hub
          </Link>

          <Link
            href="/patients"
            className="w-full flex items-center rounded-xl px-3 py-2 text-xs text-slate-300 hover:bg-slate-800/80 hover:text-sky-200 transition-colors"
          >
            <span className="w-1.5 h-1.5 rounded-full mr-2 bg-slate-500 opacity-80" />
            Patients
          </Link>

          <Link
            href="/calendar"
            className="w-full flex items-center rounded-xl px-3 py-2 text-xs text-slate-300 hover:bg-slate-800/80 hover:text-sky-200 transition-colors"
          >
            <span className="w-1.5 h-1.5 rounded-full mr-2 bg-slate-500 opacity-80" />
            Calendar
          </Link>
        </nav>

        <div className="border-t border-slate-800/60 px-4 py-3 text-xs text-slate-400">
          <p className="font-semibold text-sm">Gerardo Barrantes</p>
          <p>Admin · ADIE Pilot</p>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col">
        <header
          className={`h-16 border-b flex items-center justify-between px-4 md:px-8 ${
            dark
              ? "border-slate-800 bg-slate-950/60 backdrop-blur"
              : "border-slate-200 bg-white/80 backdrop-blur"
          }`}
        >
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-block text-xs font-semibold tracking-[0.18em] uppercase text-slate-500">
              Operations
            </span>
            <h1 className="text-lg md:text-xl font-semibold">Operations Hub</h1>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <button
              onClick={toggleTheme}
              className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 transition ${
                dark
                  ? "border-slate-700 text-slate-300 hover:border-sky-400 hover:text-sky-300"
                  : "border-slate-300 text-slate-700 hover:border-sky-500 hover:text-sky-700"
              }`}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-sky-400" />
              Theme: {dark ? "Dark" : "Light"}
            </button>

            <Link
              href="/dashboard"
              className="rounded-full border border-slate-700 px-3 py-1 text-[11px] text-slate-300 hover:border-sky-400"
            >
              Back to dashboard
            </Link>
          </div>
        </header>

        <div className="flex-1 px-4 md:px-8 py-6">
          {/* Tabs */}
          <div className="flex flex-wrap gap-2 mb-4">
            <Link href="/operations-hub?tab=scheduled">
              <TabPill active={tab === "scheduled"} label="Scheduled" />
            </Link>
            <Link href="/operations-hub?tab=confirmed">
              <TabPill active={tab === "confirmed"} label="Confirmed" />
            </Link>
            <Link href="/operations-hub?tab=completed">
              <TabPill active={tab === "completed"} label="Completed" />
            </Link>
            <Link href="/operations-hub?tab=emergency">
              <TabPill active={tab === "emergency"} label="Emergency" />
            </Link>
          </div>

          {/* Queue Table */}
          <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
            <div className="flex items-center justify-between mb-3">
              <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                Queue · {rows.length} items
              </p>
              <p className="text-[11px] text-slate-400">
                (Next step: connect to DB → real-time)
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-[11px]">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400">
                    <th className="py-2 pr-4">Time</th>
                    <th className="py-2 pr-4">Patient</th>
                    <th className="py-2 pr-4">Specialty</th>
                    <th className="py-2 pr-4">Provider</th>
                    <th className="py-2 pr-4">Procedure</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r, idx) => (
                    <tr
                      key={`${r.patient}-${idx}`}
                      className={`border-b border-slate-850/50 last:border-0 ${
                        idx % 2 === 0 ? "bg-slate-900/60" : "bg-slate-900/30"
                      } hover:bg-slate-800/60 transition`}
                    >
                      <td className="py-2 pr-4 text-slate-300">{r.time}</td>
                      <td className="py-2 pr-4 text-sky-300">
                        {/* Futuro: Link real al Master EMR */}
                        {r.patient}
                      </td>
                      <td className="py-2 pr-4 text-slate-300">{r.specialty}</td>
                      <td className="py-2 pr-4 text-slate-300">{r.provider}</td>
                      <td className="py-2 pr-4 text-slate-200">{r.procedure}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
