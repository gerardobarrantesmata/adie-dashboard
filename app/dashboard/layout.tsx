import type { ReactNode } from "react";
import Link from "next/link";
import { AppShell } from "@/app/_components/AppShell";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <AppShell
      title="Dashboard"
      subtitle="Clinic Operations Overview"
      showRightRail
      topActions={
        <div className="flex items-center gap-2">
          <Link
            href="/calendar"
            className="hidden sm:inline-flex items-center rounded-full border border-sky-500/70 px-3 py-1.5 font-semibold text-[11px] text-sky-300 hover:bg-sky-500/10"
          >
            Open Calendar
          </Link>
          <Link
            href="/patients"
            className="inline-flex items-center rounded-full bg-sky-500 px-4 py-1.5 text-xs font-semibold text-slate-950 hover:bg-sky-400 transition"
          >
            New Appointment
          </Link>
        </div>
      }
    >
      {children}
    </AppShell>
  );
}
