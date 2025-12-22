"use client";

import React from "react";
import AdieAdCarousel from "@/app/_components/AdieAdCarousel";
import { AdieAssistantPanel } from "@/app/_components/AdieAssistantPanel";

type RightRailProps = {
  className?: string;

  /**
   * Legacy prop (some pages still pass it).
   * The global ADIE UI is dark by default, so we keep it for compatibility.
   */
  dark?: boolean;

  /**
   * Optional slot: if a page wraps <RightRail>...</RightRail>,
   * we render that content here.
   */
  children?: React.ReactNode;
};

export function RightRail({ className = "", children }: RightRailProps) {
  return (
    <aside
      className={`w-full lg:w-80 border-t lg:border-t-0 lg:border-l px-4 py-4 border-slate-800 bg-slate-950/70 ${className}`}
    >
      <div className="space-y-4">
        <AdieAdCarousel />
        <AdieAssistantPanel />

        {/* Optional injected content from pages */}
        {children ? (
          <section className="space-y-4">{children}</section>
        ) : null}

        <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 space-y-3 text-xs">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-semibold tracking-[0.18em] uppercase text-slate-400">
              ADIE Updates
            </p>
            <span className="rounded-full bg-emerald-500/15 text-emerald-300 px-2 py-0.5 text-[10px]">
              Beta
            </span>
          </div>
          <ul className="space-y-2 text-slate-200">
            <li>• Perio pockets chart v2 connected to patient_tooth_chart.</li>
            <li>• Endo apex tracker ready for clinical testing.</li>
            <li>• Implants module linked with radiology &amp; CBCT.</li>
          </ul>
        </section>

        <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 space-y-3 text-xs">
          <p className="text-[11px] font-semibold tracking-[0.18em] uppercase text-slate-400">
            Help &amp; Guides
          </p>
          <div className="space-y-2 text-slate-200">
            <p>• How to use the daily dashboard.</p>
            <p>• Check-in flow on tablet for new patients.</p>
            <p>• Connect ADIE with DBeaver / Postgres in production.</p>
          </div>
        </section>
      </div>
    </aside>
  );
}
