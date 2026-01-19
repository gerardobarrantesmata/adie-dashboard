// app/settings/layout.tsx
import React from "react";
import Link from "next/link";

function NavLink({ href, label, active }: { href: string; label: string; active?: boolean }) {
  return (
    <Link
      href={href}
      className={`flex items-center rounded-xl px-3 py-2 text-xs transition-colors ${
        active
          ? "bg-sky-500/20 text-sky-200 font-semibold border border-sky-500/50 shadow-[0_0_16px_rgba(56,189,248,0.6)]"
          : "text-slate-300 hover:bg-slate-800/80 hover:text-sky-200"
      }`}
    >
      <span className="w-1.5 h-1.5 rounded-full mr-2 bg-sky-400 opacity-80" />
      {label}
    </Link>
  );
}

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 flex">
      {/* Sidebar */}
      <aside className="hidden md:flex w-56 flex-col border-r border-slate-800 bg-slate-950/90">
        <div className="h-16 flex items-center px-5 border-b border-slate-800/60">
          <div className="h-9 w-9 rounded-xl bg-sky-500 flex items-center justify-center text-xs font-bold text-slate-950">
            AD
          </div>
          <div className="ml-3">
            <p className="text-[10px] uppercase tracking-[0.18em] text-slate-400">ADIE</p>
            <p className="text-sm font-semibold">Settings</p>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 text-xs">
          <p className="px-3 text-[10px] font-semibold tracking-[0.18em] text-slate-500 uppercase mb-2">
            Navigation
          </p>
          <NavLink href="/dashboard" label="Dashboard" />
          <NavLink href="/patients" label="Patients" />
          <NavLink href="/specialties" label="Specialties" />
          <NavLink href="/calendar" label="Calendar" />
          <div className="pt-2" />
          <NavLink href="/settings" label="Settings" active />
          <NavLink href="/settings/providers" label="Providers" />
        </nav>

        <div className="border-t border-slate-800/60 px-4 py-3 text-[11px] text-slate-400">
          <p className="font-semibold text-sm">Gerardo Barrantes</p>
          <p>Admin · ADIE Pilot</p>
        </div>
      </aside>

      {/* Content */}
      <div className="flex-1 flex flex-col">
        <header className="h-16 border-b border-slate-800 bg-slate-950/70 backdrop-blur flex items-center justify-between px-4 md:px-6">
          <div>
            <p className="text-[10px] font-semibold tracking-[0.18em] uppercase text-slate-500">Settings</p>
            <h1 className="text-base md:text-lg font-semibold">Clinic Administration</h1>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
