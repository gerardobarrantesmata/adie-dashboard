"use client";

import React, { useState } from "react";
import Link from "next/link";

type Theme = "dark" | "light";

/* ---------- Sidebar Nav Item (mismo estilo que en Dashboard) ---------- */

type NavItemProps = {
  children: React.ReactNode;
  href: string;
  active?: boolean;
  theme: Theme;
};

function NavItem({ children, href, active, theme }: NavItemProps) {
  const dark = theme === "dark";

  return (
    <Link
      href={href}
      className={`w-full flex items-center rounded-xl px-3 py-2 text-xs justify-start transition-colors ${
        active
          ? dark
            ? "bg-sky-500/20 text-sky-200 font-semibold border border-sky-500/50 shadow-[0_0_16px_rgba(56,189,248,0.6)]"
            : "bg-sky-100 text-sky-700 font-semibold border border-sky-400"
          : dark
          ? "text-slate-300 hover:bg-slate-800/80 hover:text-sky-200"
          : "text-slate-700 hover:bg-slate-100 hover:text-sky-600"
      }`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full mr-2 opacity-80 ${
          active
            ? "bg-sky-400"
            : dark
            ? "bg-slate-500"
            : "bg-slate-400"
        }`}
      />
      {children}
    </Link>
  );
}

/* ---------- Specialties Universe components ---------- */

type SpecialtyId =
  | "general"
  | "preventive"
  | "implants"
  | "perio"
  | "prostho"
  | "radiology"
  | "pediatric";

const SPECIALTY_LABEL: Record<SpecialtyId, string> = {
  general: "General Dentistry",
  preventive: "Preventive Dentistry",
  implants: "Implants",
  perio: "Periodontics",
  prostho: "Prosthodontics",
  radiology: "Radiology",
  pediatric: "Pediatric Dentistry",
};

type SpecialtyButtonProps = {
  id: SpecialtyId;
  active: boolean;
  onSelect: (id: SpecialtyId) => void;
};

function SpecialtyButton({ id, active, onSelect }: SpecialtyButtonProps) {
  return (
    <button
      onClick={() => onSelect(id)}
      className={`min-w-[220px] rounded-2xl border px-5 py-3 text-sm text-center transition-all duration-200 ${
        active
          ? "border-sky-400/80 bg-sky-500/15 text-sky-100 shadow-[0_0_24px_rgba(56,189,248,0.6)]"
          : "border-slate-700 bg-slate-900/60 text-slate-200 hover:border-sky-400/60 hover:text-sky-100 hover:bg-slate-900"
      }`}
    >
      {SPECIALTY_LABEL[id]}
    </button>
  );
}

type CentralNodeProps = {
  active?: boolean;
};

function CentralNode({ active }: CentralNodeProps) {
  return (
    <div className="relative flex items-center justify-center">
      <div className="absolute -inset-6 rounded-full bg-sky-500/10 blur-3xl" />
      <div
        className={`relative rounded-3xl border px-8 py-6 md:px-10 md:py-7 text-center shadow-[0_0_32px_rgba(15,23,42,0.9)] ${
          active
            ? "border-sky-400/80 bg-slate-900/90"
            : "border-sky-500/40 bg-slate-900/80"
        }`}
      >
        <p className="text-[10px] uppercase tracking-[0.22em] text-sky-300 mb-1">
          Core Node
        </p>
        <p className="text-xl md:text-2xl font-semibold bg-gradient-to-r from-sky-200 via-cyan-200 to-emerald-200 bg-clip-text text-transparent">
          General Dentistry
        </p>
        <p className="mt-1 text-[11px] text-slate-300">
          Point of entry for all treatments.
        </p>
      </div>
    </div>
  );
}

/* ---------- PAGE ---------- */

export default function SpecialtiesPage() {
  const [theme, setTheme] = useState<Theme>("dark");
  const [selected, setSelected] = useState<SpecialtyId>("general");
  const dark = theme === "dark";

  const toggleTheme = () =>
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));

  return (
    <div
      className={`min-h-screen flex ${
        dark
          ? "bg-slate-950 text-slate-50"
          : "bg-slate-100 text-slate-900"
      }`}
    >
      {/* Sidebar */}
      <aside
        className={`hidden md:flex w-60 flex-col border-r ${
          dark
            ? "border-slate-800 bg-slate-950/80"
            : "border-slate-200 bg-white"
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
            <p className="text-sm font-semibold">
              Astra Dental Intelligence
            </p>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 text-sm">
          <p className="px-3 text-[11px] font-semibold tracking-[0.18em] text-slate-500 uppercase mb-2">
            Main
          </p>

          <NavItem href="/" theme={theme}>
            Dashboard
          </NavItem>

          <NavItem href="/specialties" active theme={theme}>
            Specialties
          </NavItem>

          <NavItem href="#" theme={theme}>
            Patients
          </NavItem>
          <NavItem href="#" theme={theme}>
            Calendar
          </NavItem>
          <NavItem href="#" theme={theme}>
            Dental Chart
          </NavItem>
          <NavItem href="#" theme={theme}>
            Radiology
          </NavItem>
          <NavItem href="#" theme={theme}>
            Pharmacy
          </NavItem>
          <NavItem href="#" theme={theme}>
            Operations Hub
          </NavItem>

          <p className="px-3 pt-4 text-[11px] font-semibold tracking-[0.18em] text-slate-500 uppercase mb-2">
            Analytics
          </p>
          <NavItem href="#" theme={theme}>
            Daily BI
          </NavItem>
          <NavItem href="#" theme={theme}>
            Financial
          </NavItem>
          <NavItem href="#" theme={theme}>
            Implants &amp; Perio
          </NavItem>
        </nav>

        <div className="border-t border-slate-800/60 px-4 py-3 text-xs text-slate-400">
          <p className="font-semibold text-sm">
            Gerardo Barrantes
          </p>
          <p>Admin · ADIE Pilot</p>
        </div>
      </aside>

      {/* Main area */}
      <div className="flex-1 flex flex-col">
        {/* Top bar */}
        <header
          className={`h-16 border-b flex items-center justify-between px-4 md:px-8 ${
            dark
              ? "border-slate-800 bg-slate-950/60 backdrop-blur"
              : "border-slate-200 bg-white/80 backdrop-blur"
          }`}
        >
          <div className="flex flex-col gap-0.5">
            <span className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
              Specialties
            </span>
            <h1 className="text-lg md:text-xl font-semibold">
              Specialties Universe
            </h1>
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
          </div>
        </header>

        {/* Universe content */}
        <main className="flex-1 px-4 md:px-8 py-6 overflow-auto">
          <section className="rounded-3xl border border-slate-800 bg-gradient-to-b from-slate-950 via-slate-950/95 to-slate-950/80 px-4 md:px-10 py-6 md:py-8 shadow-[0_0_60px_rgba(15,23,42,1)]">
            <div className="max-w-5xl mx-auto">
              {/* Intro */}
              <div className="mb-6">
                <p className="text-[11px] font-semibold tracking-[0.2em] uppercase text-slate-500">
                  Specialties Universe
                </p>
                <p className="text-sm text-slate-300 max-w-2xl">
                  Tap a specialty to enter its dedicated &quot;deep layer&quot;.
                  Each node will later connect to full clinical forms,
                  protocols and specialty-specific odontograms.
                </p>
              </div>

              {/* Universe grid */}
              <div className="relative">
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.15),transparent_55%)]" />

                <div className="relative grid grid-cols-1 gap-y-5">
                  {/* Top row */}
                  <div className="flex flex-wrap justify-center gap-4 mb-4">
                    <SpecialtyButton
                      id="preventive"
                      active={selected === "preventive"}
                      onSelect={setSelected}
                    />
                    <SpecialtyButton
                      id="radiology"
                      active={selected === "radiology"}
                      onSelect={setSelected}
                    />
                  </div>

                  {/* Middle row: left + center + right */}
                  <div className="flex flex-wrap items-center justify-center gap-6 mb-4">
                    <SpecialtyButton
                      id="implants"
                      active={selected === "implants"}
                      onSelect={setSelected}
                    />

                    <CentralNode active={selected === "general"} />

                    <SpecialtyButton
                      id="pediatric"
                      active={selected === "pediatric"}
                      onSelect={setSelected}
                    />
                  </div>

                  {/* Bottom row */}
                  <div className="flex flex-wrap justify-center gap-4">
                    <SpecialtyButton
                      id="perio"
                      active={selected === "perio"}
                      onSelect={setSelected}
                    />
                    <SpecialtyButton
                      id="prostho"
                      active={selected === "prostho"}
                      onSelect={setSelected}
                    />
                  </div>
                </div>
              </div>

              {/* Selected explanation */}
              <div className="mt-6 text-[12px] text-slate-300">
                <span className="font-semibold text-sky-300">
                  Selected specialty:
                </span>{" "}
                <span className="font-semibold text-slate-50">
                  {SPECIALTY_LABEL[selected]}
                </span>
                <p className="mt-1 text-slate-400">
                  In the next phase we will link this node to the full
                  clinical module, including diagnosis codes, procedures,
                  documentation, and a specialty-specific odontogram.
                </p>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
