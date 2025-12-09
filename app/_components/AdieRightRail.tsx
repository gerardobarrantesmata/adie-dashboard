"use client";

import React from "react";

export function AdieRightRail() {
  return (
    <aside className="hidden w-[280px] shrink-0 lg:block">
      <div className="space-y-4">
        {/* ADIE ASSISTANT */}
        <section className="rounded-2xl border border-slate-800 bg-slate-950/80 px-4 py-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
            ADIE Assistant
          </p>
          <h3 className="mt-2 text-sm font-semibold text-slate-50">
            Smart layer for dental decisions
          </h3>
          <p className="mt-2 text-[11px] text-slate-400">
            Ask ADIE for medical risks, medication alerts, or a quick patient
            summary before entering the operatory.
          </p>
          <button className="mt-3 w-full rounded-full bg-sky-500 px-3 py-1.5 text-xs font-semibold text-slate-950 hover:bg-sky-400 transition-colors">
            Open Chair-side Chat
          </button>
          <p className="mt-1 text-[10px] text-slate-500">
            Next step: connect with your ADIE / Postgres database.
          </p>
        </section>

        {/* ADIE UPDATES */}
        <section className="rounded-2xl border border-slate-800 bg-slate-950/80 px-4 py-4">
          <div className="flex items-center justify-between gap-2">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
              ADIE Updates
            </p>
            <span className="rounded-full bg-emerald-500/10 px-2 py-[2px] text-[9px] font-semibold uppercase tracking-[0.14em] text-emerald-300">
              Beta
            </span>
          </div>
          <ul className="mt-2 space-y-1.5 text-[11px] text-slate-400">
            <li>• Perio pockets chart v2 connected to patient_tooth_chart.</li>
            <li>• Endo apex tracker ready for clinical testing.</li>
            <li>• Implants module linked with radiology &amp; CBCT.</li>
          </ul>
        </section>

        {/* HELP & GUIDES */}
        <section className="rounded-2xl border border-slate-800 bg-slate-950/80 px-4 py-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
            Help &amp; Guides
          </p>
          <ul className="mt-2 space-y-1.5 text-[11px] text-slate-400">
            <li>• How to use the daily dashboard.</li>
            <li>• Check-in flow on tablet for new patients.</li>
            <li>• Connect ADIE with DBeaver / Postgres in production.</li>
          </ul>
        </section>
      </div>
    </aside>
  );
}
