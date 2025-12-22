import type { ReactNode } from "react";
import Link from "next/link";
import { RightRail } from "@/app/_components/RightRail";

type AppShellProps = {
  children: ReactNode;
  title: string;
  subtitle?: string;
  topActions?: ReactNode;
  showRightRail?: boolean;
};

export function AppShell({
  children,
  title,
  subtitle,
  topActions,
  showRightRail = true,
}: AppShellProps) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 flex">
      {/* LEFT SIDEBAR */}
      <aside className="hidden lg:flex w-64 flex-col border-r border-slate-900 bg-slate-950/95">
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
                  className="flex items-center justify-between rounded-lg px-2.5 py-1.5 text-slate-300 hover:bg-slate-900 hover:text-sky-100"
                >
                  <span>Specialties</span>
                  <span className="text-[9px] text-slate-500">Layers</span>
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
                  href="/odontogram"
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
                  href="/operations-hub"
                  className="flex items-center justify-between rounded-lg px-2.5 py-1.5 text-slate-300 hover:bg-slate-900 hover:text-sky-100"
                >
                  <span>Operations Hub</span>
                  <span className="text-[9px] text-slate-500">Admin</span>
                </Link>
              </li>
            </ul>
          </div>
        </nav>

        <div className="px-4 py-3 border-t border-slate-900 flex items-center justify-between text-[11px] text-slate-500">
          <span>v0.1 · ADIE Beta</span>
          <div className="h-6 w-6 rounded-full bg-slate-800 flex items-center justify-center text-[10px]">
            N
          </div>
        </div>
      </aside>

      {/* CENTER */}
      <main className="flex-1 min-w-0">
        {/* Top header */}
        <header className="border-b border-slate-900 bg-slate-950/70 px-4 py-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                {subtitle ?? "ADIE workspace"}
              </p>
              <h1 className="text-lg font-semibold text-slate-50 truncate">
                {title}
              </h1>
            </div>

            {topActions ? (
              <div className="shrink-0">{topActions}</div>
            ) : null}
          </div>
        </header>

        <div className="px-4 py-6 lg:py-8">
          <div className="w-full max-w-6xl mx-auto">{children}</div>
        </div>
      </main>

      {/* RIGHT RAIL */}
      {showRightRail ? <RightRail /> : null}
    </div>
  );
}
