"use client";

import React, { useMemo, useState, KeyboardEvent } from "react";
import Link from "next/link";

type Patient = {
  id: string; // ADIE patient ID, e.g. ADIE-PT-0001
  name: string;
  dob: string;
  country: string;
  city: string;
  phone: string;
  email: string;
  language: string;
};

const PATIENTS: Patient[] = [
  {
    id: "ADIE-PT-0001",
    name: "Nazareni Cova",
    dob: "03/29/1985",
    country: "United States",
    city: "Orlando",
    phone: "+1 6894447329",
    email: "naza.jeova@gmail.com",
    language: "Spanish / English",
  },
  {
    id: "ADIE-PT-0002",
    name: "Humberto Soto Mora",
    dob: "12/03/1986",
    country: "Costa Rica",
    city: "Heredia",
    phone: "+506 Costa Rica 89456215",
    email: "hostomora@hotmail.com",
    language: "Spanish",
  },
  {
    id: "ADIE-PT-0003",
    name: "Sebastian Acuna Solis",
    dob: "11/01/1990",
    country: "Costa Rica",
    city: "—",
    phone: "+506 Costa Rica 87564213",
    email: "sebaass@gmail.com",
    language: "Spanish",
  },
  {
    id: "ADIE-PT-0004",
    name: "Sergio Ramos Perez",
    dob: "05/31/1971",
    country: "Costa Rica",
    city: "San José",
    phone: "+506 Costa Rica 84568958",
    email: "seergioramos@gmail.com",
    language: "Spanish",
  },
  {
    id: "ADIE-PT-0005",
    name: "Juan Pérez",
    dob: "10/05/1990",
    country: "Costa Rica",
    city: "San José",
    phone: "+50688888888",
    email: "juan.perez@example.com",
    language: "Spanish",
  },
  {
    id: "ADIE-PT-0006",
    name: "Marco Vargas",
    dob: "11/21/1978",
    country: "Costa Rica",
    city: "San José",
    phone: "+506-8888-2020",
    email: "marco.vargas@example.com",
    language: "Spanish",
  },
  {
    id: "ADIE-PT-0007",
    name: "Sofia Castro",
    dob: "10/20/2000",
    country: "Costa Rica",
    city: "San José",
    phone: "+506-8888-1010",
    email: "sofia.castro@example.com",
    language: "Spanish",
  },
  {
    id: "ADIE-PT-0008",
    name: "Luis Martínez",
    dob: "03/09/1985",
    country: "USA",
    city: "Orlando",
    phone: "+1-407-555-2020",
    email: "luis.martinez@example.com",
    language: "Spanish / English",
  },
  {
    id: "ADIE-PT-0009",
    name: "Ana Guzmán",
    dob: "12/05/1990",
    country: "USA",
    city: "Orlando",
    phone: "+1-407-555-2010",
    email: "ana.guzman@example.com",
    language: "Spanish / English",
  },
];

export default function PatientsPage() {
  const [searchName, setSearchName] = useState("");
  const [searchId, setSearchId] = useState("");

  const filteredPatients = useMemo(() => {
    const name = searchName.trim().toLowerCase();
    const id = searchId.trim().toLowerCase();

    return PATIENTS.filter((p) => {
      const matchesName = name ? p.name.toLowerCase().includes(name) : true;
      const matchesId = id ? p.id.toLowerCase().includes(id) : true;
      return matchesName && matchesId;
    });
  }, [searchName, searchId]);

  const handleIdKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "Enter") return;

    e.preventDefault();
    const value = searchId.trim();
    if (!value) return;

    const match = PATIENTS.find(
      (p) => p.id.toLowerCase() === value.toLowerCase()
    );

    if (match) {
      window.location.href = `/patients/${match.id}`;
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-50">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 pb-24 pt-8">
        {/* HEADER */}
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-[11px] uppercase tracking-[0.28em] text-sky-400">
              Registry · Patients
            </p>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight md:text-3xl">
              Patients
            </h1>
            <p className="mt-2 max-w-2xl text-xs text-slate-400 md:text-sm">
              Global patient registry for ADIE: demographics, geography and
              clinical profile for epidemiology &amp; BI — and as the entry
              point to each patient&apos;s Master EMR.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-[11px]">
            <Link
              href="/dashboard"
              className="rounded-full border border-slate-700 bg-slate-900/70 px-3 py-1.5 text-slate-200 hover:border-sky-400 hover:text-sky-100"
            >
              ← Dashboard
            </Link>
            <Link
              href="/specialties"
              className="rounded-full border border-slate-700 bg-slate-900/70 px-3 py-1.5 text-slate-200 hover:border-emerald-400 hover:text-emerald-100"
            >
              Specialties
            </Link>
            <button className="rounded-full border border-slate-700 bg-slate-900/70 px-3 py-1.5 text-slate-100">
              Existing patients
            </button>
            <button className="rounded-full border border-sky-500/60 bg-sky-500/10 px-3 py-1.5 text-sky-100 hover:bg-sky-500/20">
              New patient
            </button>
          </div>
        </header>

        {/* TOOLBAR: SEARCH */}
        <section className="rounded-2xl border border-slate-800 bg-slate-950/80 px-4 py-3 md:px-5">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-[11px] uppercase tracking-[0.2em] text-slate-500">
                Patient search
              </p>
              <p className="text-[11px] text-slate-400">
                Type a name to filter the registry, or enter a full ADIE ID and
                press <span className="font-semibold">Enter</span> to open the
                Master EMR.
              </p>
            </div>

            <div className="grid w-full max-w-xl grid-cols-1 gap-2 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-[10px] uppercase tracking-[0.16em] text-slate-500">
                  Search by name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Juan, Guzmán…"
                  value={searchName}
                  onChange={(e) => setSearchName(e.target.value)}
                  className="w-full rounded-full border border-slate-700 bg-slate-900/70 px-3 py-2 text-xs text-slate-100 outline-none ring-sky-500/60 focus:border-sky-400 focus:ring-1"
                />
              </div>
              <div>
                <label className="mb-1 block text-[10px] uppercase tracking-[0.16em] text-slate-500">
                  Search by Patient ID
                </label>
                <input
                  type="text"
                  placeholder="e.g. ADIE-PT-0001"
                  value={searchId}
                  onChange={(e) => setSearchId(e.target.value)}
                  onKeyDown={handleIdKeyDown}
                  className="w-full rounded-full border border-emerald-600 bg-slate-900/70 px-3 py-2 text-xs text-slate-100 outline-none ring-emerald-500/60 focus:border-emerald-400 focus:ring-1"
                />
                <p className="mt-1 text-[10px] text-slate-500">
                  Press <span className="font-semibold">Enter</span> to jump
                  directly to the EMR if the ID exists.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* TABLE */}
        <section className="rounded-2xl border border-slate-800 bg-slate-950/80 px-4 py-4 md:px-5 md:py-5">
          <div className="mb-3 flex items-center justify-between gap-2">
            <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
              Epidemiology view · {filteredPatients.length} patients
            </p>
          </div>

          <div className="overflow-hidden rounded-2xl border border-slate-800">
            <table className="min-w-full divide-y divide-slate-800 text-xs">
              <thead className="bg-slate-900/80 text-[11px] uppercase tracking-[0.16em] text-slate-400">
                <tr>
                  <th className="px-4 py-3 text-left">Name</th>
                  <th className="px-4 py-3 text-left">ADIE ID</th>
                  <th className="px-4 py-3 text-left">DOB</th>
                  <th className="px-4 py-3 text-left">Country / City</th>
                  <th className="px-4 py-3 text-left">Phone</th>
                  <th className="px-4 py-3 text-left">Email</th>
                  <th className="px-4 py-3 text-left">Language</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 bg-slate-950/60">
                {filteredPatients.map((patient) => (
                  <tr
                    key={patient.id}
                    className="transition-colors hover:bg-slate-900/90"
                  >
                    <td className="px-4 py-2">
                      <Link
                        href={`/patients/${patient.id}`}
                        className="text-sky-300 hover:underline"
                      >
                        {patient.name}
                      </Link>
                    </td>
                    <td className="px-4 py-2 text-slate-300">
                      <Link
                        href={`/patients/${patient.id}`}
                        className="hover:underline"
                      >
                        {patient.id}
                      </Link>
                    </td>
                    <td className="px-4 py-2 text-slate-300">
                      {patient.dob}
                    </td>
                    <td className="px-4 py-2 text-slate-300">
                      {patient.country} · {patient.city}
                    </td>
                    <td className="px-4 py-2 text-slate-300">
                      {patient.phone}
                    </td>
                    <td className="px-4 py-2 text-slate-300">
                      {patient.email}
                    </td>
                    <td className="px-4 py-2 text-slate-300">
                      {patient.language}
                    </td>
                  </tr>
                ))}

                {filteredPatients.length === 0 && (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-4 py-6 text-center text-[11px] text-slate-500"
                    >
                      No patients match the current filters. Adjust the name or
                      ID search to see results.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}
