"use client";

import React from "react";
import Link from "next/link";

/* ---------- Sidebar Nav Item ---------- */

type NavItemProps = {
  children: React.ReactNode;
  href: string;
  active?: boolean;
};

function NavItem({ children, href, active }: NavItemProps) {
  return (
    <Link
      href={href}
      className={`w-full flex items-center rounded-xl px-3 py-2 text-xs justify-start transition-colors ${
        active
          ? "bg-sky-500/20 text-sky-200 font-semibold border border-sky-500/50 shadow-[0_0_16px_rgba(56,189,248,0.6)]"
          : "text-slate-300 hover:bg-slate-800/80 hover:text-sky-200"
      }`}
    >
      <span className="w-1.5 h-1.5 rounded-full mr-2 bg-sky-400 opacity-80" />
      {children}
    </Link>
  );
}

/* ---------- MOCK PATIENTS (igual estilo tabla) ---------- */

type Patient = {
  id: string;
  adieId: string;
  name: string;
  dob: string;
  countryCity: string;
  phone: string;
  email: string;
  language: string;
};

const PATIENTS: Patient[] = [
  {
    id: "1",
    adieId: "ADIE-PT-0001",
    name: "Nazareti Cova",
    dob: "03/29/1985",
    countryCity: "United States - Orlando",
    phone: "+1 6894447329",
    email: "naza.jeova@gmail.com",
    language: "Spanish / English",
  },
  {
    id: "2",
    adieId: "ADIE-PT-0002",
    name: "Humberto Soto Mora",
    dob: "12/03/1986",
    countryCity: "Costa Rica - Heredia",
    phone: "+506 Costa Rica 89456215",
    email: "hostomora@hotmail.com",
    language: "Spanish",
  },
  {
    id: "3",
    adieId: "ADIE-PT-0003",
    name: "Sebastián Acuna Solís",
    dob: "11/01/1990",
    countryCity: "Costa Rica - —",
    phone: "+506 Costa Rica 87564213",
    email: "sebaass@gmail.com",
    language: "Spanish",
  },
  {
    id: "4",
    adieId: "ADIE-PT-0004",
    name: "Sergio Ramos Pérez",
    dob: "05/31/1971",
    countryCity: "Costa Rica - San José",
    phone: "+506 Costa Rica 84569859",
    email: "sergioramos@gmail.com",
    language: "Spanish",
  },
  {
    id: "5",
    adieId: "ADIE-PT-0005",
    name: "Juan Pérez",
    dob: "10/05/1990",
    countryCity: "Costa Rica - San José",
    phone: "+50688888888",
    email: "juan.perez@example.com",
    language: "Spanish",
  },
  {
    id: "6",
    adieId: "ADIE-PT-0006",
    name: "Marco Vargas",
    dob: "11/21/1978",
    countryCity: "Costa Rica - San José",
    phone: "+506-8888-2020",
    email: "marco.vargas@example.com",
    language: "Spanish",
  },
  {
    id: "7",
    adieId: "ADIE-PT-0007",
    name: "Sofía Castro",
    dob: "10/02/2000",
    countryCity: "Costa Rica - San José",
    phone: "+506-8888-1010",
    email: "sofia.castro@example.com",
    language: "Spanish",
  },
  {
    id: "8",
    adieId: "ADIE-PT-0008",
    name: "Luis Martínez",
    dob: "03/09/1985",
    countryCity: "USA - Orlando",
    phone: "+1-407-555-2020",
    email: "luis.martinez@example.com",
    language: "Spanish / English",
  },
  {
    id: "9",
    adieId: "ADIE-PT-0009",
    name: "Ana Guzmán",
    dob: "12/05/1990",
    countryCity: "USA - Orlando",
    phone: "+1-407-555-2010",
    email: "ana.guzman@example.com",
    language: "Spanish",
  },
];

/* ---------- PAGE ---------- */

export default function PatientsPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 flex">
      {/* Sidebar ADIE */}
      <aside className="hidden md:flex w-56 flex-col border-r border-slate-800 bg-slate-950/90">
        <div className="h-16 flex items-center px-5 border-b border-slate-800/60">
          <div className="h-9 w-9 rounded-xl bg-sky-500 flex items-center justify-center text-xs font-bold text-slate-950">
            AD
          </div>
          <div className="ml-3">
            <p className="text-[10px] uppercase tracking-[0.18em] text-slate-400">
              ADIE
            </p>
            <p className="text-sm font-semibold">Patient Registry</p>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 text-xs">
          <p className="px-3 text-[10px] font-semibold tracking-[0.18em] text-slate-500 uppercase mb-2">
            Navigation
          </p>
          <NavItem href="/dashboard">Dashboard</NavItem>
          <NavItem href="/calendar">Calendar</NavItem>
          <NavItem href="/patients" active>
            Patients
          </NavItem>
          <NavItem href="/specialties">Specialties</NavItem>
        </nav>

        <div className="border-t border-slate-800/60 px-4 py-3 text-[11px] text-slate-400">
          <p className="font-semibold text-sm">Gerardo Barrantes</p>
          <p>Admin · ADIE Pilot</p>
        </div>
      </aside>

      {/* Layout central */}
      <div className="flex-1 flex flex-col">
        {/* Top bar */}
        <header className="h-16 border-b border-slate-800 bg-slate-950/70 backdrop-blur flex items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-block text-[10px] font-semibold tracking-[0.18em] uppercase text-slate-500">
              Registry
            </span>
            <h1 className="text-base md:text-lg font-semibold">Patients</h1>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <Link
              href="/specialties"
              className="hidden sm:inline-flex items-center rounded-full border border-slate-700 px-3 py-1 hover:border-sky-400"
            >
              Specialties
            </Link>
            <Link
              href="/patients"
              className="hidden sm:inline-flex items-center rounded-full border border-slate-700 px-3 py-1 hover:border-sky-400"
            >
              Existing patients
            </Link>
            {/* 👉 AHORA SÍ FUNCIONA: lleva a /patients/new */}
            <Link
              href="/patients/new"
              className="inline-flex items-center rounded-full bg-sky-500 px-4 py-1.5 text-xs font-semibold text-slate-950 hover:bg-sky-400 transition"
            >
              New patient
            </Link>
          </div>
        </header>

        {/* Contenido + right rail */}
        <div className="flex-1 flex flex-col lg:flex-row">
          {/* Main content */}
          <main className="flex-1 px-4 md:px-8 py-5 space-y-5 overflow-auto">
            {/* Buscadores y descripción */}
            <section className="max-w-6xl mx-auto space-y-4">
              <div>
                <p className="text-xs text-slate-300">
                  Global patient registry for ADIE: demographics, geography and
                  clinical profile for epidemiology &amp; BI — and as the entry
                  point to each patient&apos;s Master EMR.
                </p>
              </div>

              {/* Search bar row */}
              <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 space-y-3 text-xs">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <p className="text-[11px] text-slate-400 mb-1">
                      Patient search
                    </p>
                    <input
                      className="w-full rounded-lg border border-slate-800 bg-slate-950/80 px-3 py-2 text-[11px] text-slate-100 outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-500/60"
                      placeholder="Type a name to filter the registry..."
                    />
                  </div>
                  <div>
                    <p className="text-[11px] text-slate-400 mb-1">
                      Search by name
                    </p>
                    <input
                      className="w-full rounded-lg border border-slate-800 bg-slate-950/80 px-3 py-2 text-[11px] text-slate-100 outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-500/60"
                      placeholder="e.g. Juan, Guzmán…"
                    />
                  </div>
                  <div>
                    <p className="text-[11px] text-slate-400 mb-1">
                      Search by ADIE ID
                    </p>
                    <input
                      className="w-full rounded-lg border border-slate-800 bg-slate-950/80 px-3 py-2 text-[11px] text-slate-100 outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-500/60"
                      placeholder="e.g. ADIE-PT-0001"
                    />
                  </div>
                </div>
              </div>

              {/* Tabla de pacientes */}
              <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 text-xs">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                      Epidemiology view · {PATIENTS.length} patients
                    </p>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full text-left text-[11px]">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400">
                        <th className="py-2 pr-4">Name</th>
                        <th className="py-2 pr-4">ADIE ID</th>
                        <th className="py-2 pr-4">DOB</th>
                        <th className="py-2 pr-4">Country / City</th>
                        <th className="py-2 pr-4">Phone</th>
                        <th className="py-2 pr-4">Email</th>
                        <th className="py-2 pr-4">Language</th>
                      </tr>
                    </thead>
                    <tbody>
                      {PATIENTS.map((p, idx) => (
                        <tr
                          key={p.id}
                          className={`border-b border-slate-850/50 last:border-0 ${
                            idx % 2 === 0 ? "bg-slate-900/60" : "bg-slate-900/30"
                          } hover:bg-slate-800/60 transition`}
                        >
                          <td className="py-2 pr-4 text-sky-300">
                            {/* futuro: link a EMR del paciente */}
                            {p.name}
                          </td>
                          <td className="py-2 pr-4 text-slate-200">
                            {p.adieId}
                          </td>
                          <td className="py-2 pr-4 text-slate-300">
                            {p.dob}
                          </td>
                          <td className="py-2 pr-4 text-slate-300">
                            {p.countryCity}
                          </td>
                          <td className="py-2 pr-4 text-slate-300">
                            {p.phone}
                          </td>
                          <td className="py-2 pr-4 text-slate-300">
                            {p.email}
                          </td>
                          <td className="py-2 pr-4 text-slate-300">
                            {p.language}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            </section>
          </main>

          {/* Right rail ADIE */}
          <aside className="w-full lg:w-80 bg-slate-950/90 border-t lg:border-t-0 lg:border-l border-slate-800 px-4 py-4 space-y-4 text-xs">
            <section className="rounded-2xl border border-slate-800 bg-gradient-to-b from-slate-900 to-slate-950 p-4 space-y-3">
              <p className="text-[11px] font-semibold tracking-[0.18em] uppercase text-slate-400">
                ADIE Assistant
              </p>
              <p className="text-sm font-semibold text-slate-50">
                Pre-visit risk &amp; summary
              </p>
              <p className="text-xs text-slate-400">
                Next step: connect this registry to the ADIE-Postgres database so
                each row opens the Master EMR with medical risks, meds and
                clinical history.
              </p>
              <button className="w-full rounded-xl bg-sky-500 py-2 text-xs font-semibold text-slate-950 hover:bg-sky-400 transition">
                Open population insights
              </button>
            </section>

            <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 space-y-3 text-xs">
              <p className="text-[11px] font-semibold tracking-[0.18em] uppercase text-slate-400">
                Registry KPIs
              </p>
              <ul className="space-y-1 text-slate-200">
                <li>• 9 pilot patients loaded (mock).</li>
                <li>• Ready to connect to patients table in Postgres.</li>
                <li>• Will feed BI dashboards &amp; cohort selection.</li>
              </ul>
            </section>
          </aside>
        </div>
      </div>
    </div>
  );
}
