// app/specialties/layout.tsx
import type { ReactNode } from "react";
import Link from "next/link";

type SpecialtiesLayoutProps = {
  children: ReactNode;
};

export default function SpecialtiesLayout({ children }: SpecialtiesLayoutProps) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 flex">
      {/* LEFT SIDEBAR – MAIN NAVIGATION */}
      <aside className="hidden lg:flex w-64 flex-col border-r border-slate-900 bg-slate-950/95">
        {/* Brand / logo */}
        <div className="flex items-center gap-2 px-4 pt-4 pb-3 border-b border-slate-900">
          <div className="h-7 w-7 rounded-xl bg-sky-500/15 flex items-center justify-center border border-sky-500/40">
            <span className="text-[11px] font-semibold text-sky-300">AD</span>
          </div>
          <div className="leading-tight">
            <p className="text-xs font-semibold tracking-[0.16em] uppercase text-slate-200">
              Astra Dental Intelligence
            </p>
            <p className="text-[10px] text-slate-500">Clinical & BI cockpit</p>
          </div>
        </div>

        {/* MAIN MENU */}
        <nav className="flex-1 px-3 py-4 space-y-6 text-[11px]">
          <div>
            <p className="px-2 mb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
              Main
            </p>
            <ul className="space-y-1">
              <li>
                <Link
                  href="/dashboard"
                  className="flex items-center justify-between rounded-lg px-2.5 py-1.5 text-slate-300 hover:bg-slate-900 hover:text-sky-100"
                >
                  <span>Dashboard</span>
                  <span className="text-[9px] text-slate-500">Home</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/specialties"
                  className="flex items-center justify-between rounded-lg px-2.5 py-1.5 text-sky-100 bg-sky-500/10 border border-sky-500/40"
                >
                  <span>Specialties</span>
                  <span className="text-[9px] uppercase tracking-[0.16em] text-sky-300">
                    Layers 2–3
                  </span>
                </Link>
              </li>
              <li>
                <Link
                  href="/patients"
                  className="flex items-center justify-between rounded-lg px-2.5 py-1.5 text-slate-300 hover:bg-slate-900 hover:text-sky-100"
                >
                  <span>Patients</span>
                  <span className="text-[9px] text-slate-500">Registry</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/calendar"
                  className="flex items-center justify-between rounded-lg px-2.5 py-1.5 text-slate-300 hover:bg-slate-900 hover:text-sky-100"
                >
                  <span>Calendar</span>
                  <span className="text-[9px] text-slate-500">Schedule</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/dental-chart"
                  className="flex items-center justify-between rounded-lg px-2.5 py-1.5 text-slate-300 hover:bg-slate-900 hover:text-sky-100"
                >
                  <span>Dental Chart</span>
                  <span className="text-[9px] text-slate-500">Global</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/radiology"
                  className="flex items-center justify-between rounded-lg px-2.5 py-1.5 text-slate-300 hover:bg-slate-900 hover:text-sky-100"
                >
                  <span>Radiology</span>
                  <span className="text-[9px] text-slate-500">Images</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/pharmacy"
                  className="flex items-center justify-between rounded-lg px-2.5 py-1.5 text-slate-300 hover:bg-slate-900 hover:text-sky-100"
                >
                  <span>Pharmacy</span>
                  <span className="text-[9px] text-slate-500">Medications</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/operations"
                  className="flex items-center justify-between rounded-lg px-2.5 py-1.5 text-slate-300 hover:bg-slate-900 hover:text-sky-100"
                >
                  <span>Operations Hub</span>
                  <span className="text-[9px] text-slate-500">Admin</span>
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="px-2 mb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
              Analytics
            </p>
            <ul className="space-y-1">
              <li>
                <Link
                  href="/analytics/daily-bi"
                  className="flex items-center justify-between rounded-lg px-2.5 py-1.5 text-slate-300 hover:bg-slate-900 hover:text-sky-100"
                >
                  <span>Daily BI</span>
                  <span className="text-[9px] text-slate-500">Chair time</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/analytics/financial"
                  className="flex items-center justify-between rounded-lg px-2.5 py-1.5 text-slate-300 hover:bg-slate-900 hover:text-sky-100"
                >
                  <span>Financial</span>
                  <span className="text-[9px] text-slate-500">Revenue</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/analytics/implants-perio"
                  className="flex items-center justify-between rounded-lg px-2.5 py-1.5 text-slate-300 hover:bg-slate-900 hover:text-sky-100"
                >
                  <span>Implants &amp; Perio</span>
                  <span className="text-[9px] text-slate-500">Outcomes</span>
                </Link>
              </li>
            </ul>
          </div>
        </nav>

        {/* FOOTER SMALL AVATAR */}
        <div className="px-4 py-3 border-t border-slate-900 flex items-center justify-between text-[11px] text-slate-500">
          <span>v0.1 · ADIE Beta</span>
          <div className="h-6 w-6 rounded-full bg-slate-800 flex items-center justify-center text-[10px]">
            N
          </div>
        </div>
      </aside>

      {/* CENTER CONTENT */}
      <main className="flex-1 flex justify-center">
        <div className="w-full max-w-6xl px-4 py-6 lg:py-8">{children}</div>
      </main>

      {/* RIGHT RAIL – ADIE ASSISTANT / UPDATES / HELP */}
      <aside className="hidden xl:flex w-80 flex-col border-l border-slate-900 bg-slate-950/95 px-4 py-5 gap-4">
        {/* ADIE Assistant */}
        <section className="rounded-2xl border border-sky-500/30 bg-sky-500/5 px-4 py-4">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-sky-300 mb-1">
            Adie Assistant
          </p>
          <p className="text-xs font-semibold text-slate-50 mb-1.5">
            Smart layer for dental decisions
          </p>
          <p className="text-[11px] text-slate-300 mb-3">
            Ask ADIE for medical risks, medication alerts, or a quick patient
            summary before entering the operatory.
          </p>
          <button className="w-full rounded-full bg-sky-500 hover:bg-sky-400 text-xs font-semibold text-slate-950 py-2.5 transition-colors">
            Open Chair-side Chat
          </button>
          <p className="mt-2 text-[10px] text-slate-500">
            Next step: connect with your ADIE / Postgres database.
          </p>
        </section>

        {/* ADIE Updates */}
        <section className="rounded-2xl border border-emerald-500/25 bg-emerald-500/5 px-4 py-3">
          <div className="flex items-center justify-between mb-1.5">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-emerald-300">
              Adie Updates
            </p>
            <span className="rounded-full border border-emerald-500/40 bg-emerald-500/10 px-2 py-[2px] text-[9px] font-medium uppercase tracking-[0.16em] text-emerald-200">
              Beta
            </span>
          </div>
          <ul className="text-[11px] text-slate-300 space-y-1.5">
            <li>• Perio pockets chart v2 connected to patient_tooth_chart.</li>
            <li>• Endo apex tracker ready for clinical testing.</li>
            <li>• Implants module linked with radiology &amp; CBCT.</li>
          </ul>
        </section>

        {/* Help & Guides */}
        <section className="rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400 mb-1.5">
            Help &amp; Guides
          </p>
          <ul className="text-[11px] text-slate-300 space-y-1.5">
            <li>• How to use the daily dashboard.</li>
            <li>• Check-in flow on tablet for new patients.</li>
            <li>• Connect ADIE with DBeaver / Postgres in production.</li>
          </ul>
        </section>
      </aside>
    </div>
  );
}
