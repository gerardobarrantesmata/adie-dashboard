// app/patients/new/layout.tsx
import React from "react";
import Link from "next/link";

type Props = { children: React.ReactNode };

function NavItem({
  href,
  label,
}: {
  href: string;
  label: string;
}) {
  return (
    <Link
      href={href}
      className="w-full flex items-center rounded-xl px-3 py-2 text-xs justify-start transition-colors text-slate-300 hover:bg-slate-800/80 hover:text-sky-200"
    >
      <span className="w-1.5 h-1.5 rounded-full mr-2 bg-slate-500 opacity-80" />
      {label}
    </Link>
  );
}

export default function NewPatientLayout({ children }: Props) {
  return (
    <div className="min-h-screen flex bg-slate-950 text-slate-50">
      {/* ✅ LEFT SIDEBAR (ADIE main menu) */}
      <aside className="hidden md:flex w-60 flex-col border-r border-slate-800 bg-slate-950/85">
        <div className="h-16 flex items-center px-5 border-b border-slate-800/60">
          <div className="h-9 w-9 rounded-xl bg-sky-500 flex items-center justify-center text-xs font-bold text-slate-950">
            AD
          </div>
          <div className="ml-3">
            <p className="text-xs uppercase tracking-[0.15em] text-slate-400">
              ADIE
            </p>
            <p className="text-sm font-semibold">Astra Dental Intelligence</p>
            <div className="text-[10px] tracking-[0.28em] uppercase text-slate-400/90">
              EcoSystem
            </div>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 text-sm">
          <p className="px-3 text-[11px] font-semibold tracking-[0.18em] text-slate-500 uppercase mb-2">
            Main
          </p>

          <NavItem href="/dashboard" label="Dashboard" />
          <NavItem href="/specialties" label="Specialties" />
          <NavItem href="/patients" label="Patients" />
          <NavItem href="/calendar" label="Calendar" />

          <NavItem href="#" label="Dental Chart" />
          <NavItem href="#" label="Radiology" />
          <NavItem href="#" label="Pharmacy" />
          <NavItem href="#" label="Operations Hub" />

          <p className="px-3 pt-4 text-[11px] font-semibold tracking-[0.18em] text-slate-500 uppercase mb-2">
            Analytics
          </p>
          <NavItem href="#" label="Daily BI" />
          <NavItem href="#" label="Financial" />
          <NavItem href="#" label="Implants & Perio" />
        </nav>

        <div className="border-t border-slate-800/60 px-4 py-3 text-xs text-slate-400">
          <p className="font-semibold text-sm">Gerardo Barrantes</p>
          <p>Admin · ADIE Pilot</p>
        </div>
      </aside>

      {/* CENTER + RIGHT */}
      <div className="flex-1 flex">
        {/* ✅ CENTER CONTENT (your existing /patients/new page stays untouched) */}
        <main className="flex-1 min-w-0">{children}</main>

        {/* ✅ RIGHT RAIL (ADIE right panel) */}
        <aside className="hidden xl:flex w-80 flex-col border-l border-slate-800 bg-slate-950/75 px-4 py-4 space-y-4">
          <section className="rounded-2xl border border-slate-800 bg-gradient-to-b from-slate-900 to-slate-950 p-4 space-y-3 text-xs">
            <p className="text-[11px] font-semibold tracking-[0.18em] uppercase text-slate-400">
              ADIE Assistant
            </p>
            <p className="text-sm font-semibold text-slate-50">
              Intake quality guardrails
            </p>
            <p className="text-xs text-slate-400">
              Next step: real-time validation + duplicate detection (name + DOB + phone)
              before allowing “Create patient”.
            </p>
            <button className="w-full rounded-xl bg-sky-500 py-2 text-xs font-semibold text-slate-950 hover:bg-sky-400 transition">
              Run intake checklist
            </button>
            <p className="text-[10px] text-slate-500">
              Market-ready: consistent UI + consistent workflow.
            </p>
          </section>

          <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-semibold tracking-[0.18em] uppercase text-slate-400">
                Intake checklist
              </p>
              <span className="rounded-full bg-emerald-500/15 text-emerald-300 px-2 py-0.5 text-[10px]">
                Ready
              </span>
            </div>
            <ul className="space-y-2 text-slate-200">
              <li>• ADIE ID present and unique</li>
              <li>• DOB complete (month/day/year)</li>
              <li>• Phone with country code</li>
              <li>• Emergency contact captured</li>
              <li>• Preferred language + consent</li>
            </ul>
          </section>

          <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 space-y-3 text-xs">
            <p className="text-[11px] font-semibold tracking-[0.18em] uppercase text-slate-400">
              Quick navigation
            </p>
            <div className="space-y-2">
              <Link
                href="/patients"
                className="block rounded-xl border border-slate-800 bg-slate-950/60 px-3 py-2 text-[11px] text-slate-200 hover:border-sky-500/40 hover:bg-slate-950/80 transition"
              >
                ← Back to registry
              </Link>
              <Link
                href="/calendar"
                className="block rounded-xl border border-slate-800 bg-slate-950/60 px-3 py-2 text-[11px] text-slate-200 hover:border-sky-500/40 hover:bg-slate-950/80 transition"
              >
                Open Calendar →
              </Link>
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}
