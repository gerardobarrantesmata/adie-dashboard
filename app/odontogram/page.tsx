"use client";

import React from "react";
import FullMouthOdontogram from "./_components/FullMouthOdontogram";

export default function OdontogramPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <div className="mx-auto max-w-7xl px-6 py-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold tracking-[0.22em] uppercase text-slate-400">
              Dental Chart
            </p>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-50">
              Full Mouth Odontogram
            </h1>
            <p className="mt-1 text-sm text-slate-400">
              Clínica primero: estados por diente + notas (demo local), con toggles de layers.
            </p>
          </div>

          <a
            href="/dashboard"
            className="rounded-full border border-slate-700 bg-slate-900/70 px-4 py-2 text-xs font-semibold text-slate-200 hover:border-sky-500/40 hover:text-sky-100 transition"
          >
            ← Back to Dashboard
          </a>
        </div>

        {/* Content */}
        <div className="mt-6">
          <FullMouthOdontogram />
        </div>
      </div>
    </div>
  );
}
