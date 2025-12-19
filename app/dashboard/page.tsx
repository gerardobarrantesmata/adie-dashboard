"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";

type Theme = "dark" | "light";

/* ---------- Sidebar Nav Item ---------- */

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
          active ? "bg-sky-400" : dark ? "bg-slate-500" : "bg-slate-400"
        }`}
      />
      {children}
    </Link>
  );
}

/* ---------- Visits By Hour (dynamic) helpers ---------- */

const HOURS_START = 7; // 7:00
const BUCKETS = 12; // 7..18 (12 buckets)

function pad2(n: number) {
  return String(n).padStart(2, "0");
}

function todayISO(): string {
  const d = new Date();
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}

// Tries very hard to read an appointment "start" time from various shapes.
function extractStartDate(input: any): Date | null {
  if (!input || typeof input !== "object") return null;

  const cand =
    input.start ??
    input.startTime ??
    input.start_time ??
    input.scheduledAt ??
    input.scheduled_at ??
    input.datetime ??
    input.dateTime ??
    input.time ??
    input.slot ??
    null;

  if (!cand) return null;

  if (typeof cand === "string") {
    const hhmm = cand.match(/^([01]?\d|2[0-3]):([0-5]\d)$/);
    if (hhmm) {
      const d = new Date();
      d.setHours(Number(hhmm[1]), Number(hhmm[2]), 0, 0);
      return d;
    }

    const dt = new Date(cand);
    return isNaN(dt.getTime()) ? null : dt;
  }

  if (typeof cand === "number") {
    const dt = new Date(cand);
    return isNaN(dt.getTime()) ? null : dt;
  }

  if (typeof cand === "object") {
    const nested =
      cand.dateTime ?? cand.datetime ?? cand.start ?? cand.value ?? null;
    if (typeof nested === "string") {
      const dt = new Date(nested);
      return isNaN(dt.getTime()) ? null : dt;
    }
  }

  return null;
}

function bucketizeByHour(appointments: any[]): number[] {
  const counts = Array(BUCKETS).fill(0);

  for (const appt of appointments ?? []) {
    const dt = extractStartDate(appt);
    if (!dt) continue;

    const h = dt.getHours();
    if (h < HOURS_START || h >= HOURS_START + BUCKETS) continue;

    counts[h - HOURS_START] += 1;
  }

  return counts;
}

/* ---------- MAIN PAGE (Dashboard) ---------- */

export default function Home() {
  const [theme, setTheme] = useState<Theme>("dark");
  const dark = theme === "dark";

  // Dynamic visits-by-hour state
  const [hourCounts, setHourCounts] = useState<number[]>(
    Array(BUCKETS).fill(0)
  );
  const [visitsLoading, setVisitsLoading] = useState<boolean>(true);

  const toggleTheme = () =>
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));

  const fallbackMock = useMemo(
    () => [10, 25, 40, 35, 55, 50, 30, 20, 15, 10, 8, 5],
    []
  );

  const hourHeights = useMemo(() => {
    const max = Math.max(...hourCounts, 0);
    if (max <= 0) return Array(BUCKETS).fill(0);

    return hourCounts.map((c) => {
      if (c <= 0) return 0;
      const pct = Math.round((c / max) * 83 + 12);
      return Math.min(95, Math.max(12, pct));
    });
  }, [hourCounts]);

  async function loadVisits() {
    setVisitsLoading(true);

    try {
      const date = todayISO();
      const res = await fetch(
        `/api/appointments?date=${encodeURIComponent(date)}`,
        { cache: "no-store" }
      );
      if (!res.ok) throw new Error("appointments_api_not_ok");

      const data = await res.json();
      const arr = Array.isArray(data)
        ? data
        : Array.isArray(data?.appointments)
        ? data.appointments
        : [];

      const counts = bucketizeByHour(arr);
      const anyData = counts.some((n) => n > 0);

      setHourCounts(anyData ? counts : Array(BUCKETS).fill(0));
    } catch {
      setHourCounts(Array(BUCKETS).fill(0));
    } finally {
      setVisitsLoading(false);
    }
  }

  useEffect(() => {
    loadVisits();
    const id = window.setInterval(loadVisits, 60_000);
    return () => window.clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      className={`min-h-screen flex ${
        dark ? "bg-slate-950 text-slate-50" : "bg-slate-100 text-slate-900"
      }`}
    >
      {/* Sidebar */}
      <aside
        className={`hidden md:flex w-60 flex-col border-r ${
          dark ? "border-slate-800 bg-slate-950/80" : "border-slate-200 bg-white"
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

          <NavItem href="/dashboard" active theme={theme}>
            Dashboard
          </NavItem>
          <NavItem href="/specialties" theme={theme}>
            Specialties
          </NavItem>
          <NavItem href="/patients" theme={theme}>
            Patients
          </NavItem>
          <NavItem href="/calendar" theme={theme}>
            Calendar
          </NavItem>

          <NavItem href="odontogram" theme={theme}>
            Dental Chart
          </NavItem>
          <NavItem href="radiology" theme={theme}>
            Radiology
          </NavItem>
          <NavItem href="Pharmacy" theme={theme}>
            Pharmacy
          </NavItem>

          <NavItem href="/operations-hub" theme={theme}>
            Operations Hub
          </NavItem>

          <p className="px-3 pt-4 text-[11px] font-semibold tracking-[0.18em] text-slate-500 uppercase mb-2">
            Analytics
          </p>
          <NavItem href="Daily Bi" theme={theme}>
            Daily BI
          </NavItem>
          <NavItem href="Financial" theme={theme}>
            Financial
          </NavItem>
          <NavItem href="#" theme={theme}>
            Implants &amp; Perio
          </NavItem>
        </nav>

        <div className="border-t border-slate-800/60 px-4 py-3 text-xs text-slate-400">
          <p className="font-semibold text-sm">Gerardo Barrantes</p>
          <p>Admin · ADIE Pilot</p>
        </div>
      </aside>

      {/* Main layout */}
      <div className="flex-1 flex flex-col">
        {/* Top bar */}
        <header
          className={`h-16 border-b flex items-center justify-between px-4 md:px-8 ${
            dark
              ? "border-slate-800 bg-slate-950/60 backdrop-blur"
              : "border-slate-200 bg-white/80 backdrop-blur"
          }`}
        >
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-block text-xs font-semibold tracking-[0.18em] uppercase text-slate-500">
              Dashboard
            </span>
            <h1 className="text-lg md:text-xl font-semibold">
              Clinic Operations Overview
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

            <Link
              href="/calendar"
              className="hidden sm:inline-flex items-center rounded-full border border-sky-500/70 px-3 py-1.5 font-semibold text-[11px] text-sky-300 hover:bg-sky-500/10"
            >
              Open Calendar
            </Link>

            <Link
              href="/patients"
              className="rounded-full bg-sky-500 px-4 py-1.5 text-xs font-semibold text-slate-950 hover:bg-sky-400 transition"
            >
              New Appointment
            </Link>
          </div>
        </header>

        <div className="flex-1 flex flex-col lg:flex-row">
          <main className="flex-1 px-4 md:px-8 py-5 space-y-5 overflow-auto">
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
              <section className="xl:col-span-2 rounded-2xl border border-slate-800 bg-slate-900/60 p-4 md:p-5">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-xs font-semibold tracking-[0.18em] uppercase text-slate-500">
                      Daily Snapshot
                    </p>
                    <p className="text-sm text-slate-200">
                      Today&apos;s activity at a glance
                    </p>
                  </div>
                </div>

                {/* ✅ Cards limpias: solo label + número + Open */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
                  <StatCard
                    label="Scheduled"
                    value="12"
                    tone="indigo"
                    dark={dark}
                    href="/operations-hub?tab=scheduled"
                  />
                  <StatCard
                    label="Confirmed"
                    value="9"
                    tone="emerald"
                    dark={dark}
                    href="/operations-hub?tab=confirmed"
                  />
                  <StatCard
                    label="Completed"
                    value="6"
                    tone="sky"
                    dark={dark}
                    href="/operations-hub?tab=completed"
                  />
                  <StatCard
                    label="Emergency"
                    value="1"
                    tone="rose"
                    dark={dark}
                    href="/operations-hub?tab=emergency"
                  />
                </div>

                {/* Visits by Hour (Today) */}
                <div className="mt-1">
                  <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500 mb-2">
                    Visits by Hour (Today)
                  </p>

                  <div
                    className="h-28 rounded-xl border border-slate-800 bg-slate-950 flex items-end gap-1 px-3 pb-3"
                    aria-label="Visits by hour chart"
                  >
                    {(hourHeights.some((v) => v > 0)
                      ? hourHeights
                      : fallbackMock
                    ).map((h, i) => (
                      <div key={i} className="flex-1 flex flex-col justify-end">
                        <div
                          className={`w-full rounded-t-full bg-gradient-to-t from-sky-500 to-emerald-400 ${
                            visitsLoading ? "opacity-60" : "opacity-100"
                          }`}
                          style={{ height: `${h}%` }}
                        />
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-between text-[10px] text-slate-500 mt-1.5 px-1">
                    <span>7:00</span>
                    <span>10:00</span>
                    <span>13:00</span>
                    <span>16:00</span>
                    <span>19:00</span>
                  </div>
                </div>
              </section>

              {/* Patients by specialty */}
              <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 md:p-5 flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-xs font-semibold tracking-[0.18em] uppercase text-slate-500">
                      Patients by Specialty
                    </p>
                    <p className="text-xs text-slate-400">
                      Active cases (last 6 months)
                    </p>
                  </div>
                  <select className="bg-slate-950 border border-slate-700 rounded-lg text-xs px-2 py-1">
                    <option>All clinics</option>
                    <option>Lake Nona</option>
                    <option>San José</option>
                  </select>
                </div>

                <div className="space-y-2 flex-1">
                  <BarRow label="General" value={72} color="bg-sky-500" />
                  <BarRow label="Perio" value={45} color="bg-emerald-400" />
                  <BarRow label="Endo" value={31} color="bg-cyan-400" />
                  <BarRow label="Prosth" value={28} color="bg-violet-400" />
                  <BarRow label="Ortho" value={22} color="bg-amber-400" />
                  <BarRow label="Pedia" value={18} color="bg-rose-400" />
                </div>

                <p className="mt-4 text-[11px] text-slate-500">
                  Click a bar (soon) to open that specialty workspace.
                </p>
              </section>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <MiniKpi label="Active Patients" value="248" sub="+18 this month" />
              <MiniKpi label="Visits (30 days)" value="162" sub="On track" />
              <MiniKpi label="Total Procedures" value="459" sub="Clinical" />
              <MiniKpi
                label="Implants in progress"
                value="32"
                sub="Across 3 clinics"
              />
            </div>

            {/* Third row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 md:p-5">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-sm font-semibold text-slate-100">
                    Most Common Procedures
                  </h2>
                  <button className="text-[11px] text-sky-400 hover:text-sky-300">
                    View CPT / code map
                  </button>
                </div>
                <div className="space-y-2 text-xs">
                  <ProcedureRow
                    name="Adult Prophylaxis &amp; Recall"
                    count="96"
                    code="D1110 + exam"
                  />
                  <ProcedureRow
                    name="Composite Restoration"
                    count="74"
                    code="D2332 / D2392"
                  />
                  <ProcedureRow
                    name="Root Canal – Molar"
                    count="31"
                    code="Endo Mx/Md"
                  />
                  <ProcedureRow
                    name="Implant placement"
                    count="22"
                    code="Surgical guide + fixture"
                  />
                  <ProcedureRow
                    name="Clear aligner cases"
                    count="12"
                    code="ADIE Ortho Engine"
                  />
                </div>
              </section>

              <section className="lg:col-span-2 rounded-2xl border border-slate-800 bg-slate-900/60 p-4 md:p-5">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-sm font-semibold text-slate-100">
                    Today&apos;s Chair-time Map
                  </h2>
                  <span className="text-[11px] text-slate-400">
                    Drag &amp; drop (future) to reorganize schedule
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <TimelineRow
                    time="08:00"
                    patient="María López"
                    detail="Perio maintenance · Room 2"
                    badge="PERIO"
                  />
                  <TimelineRow
                    time="09:30"
                    patient="David Chen"
                    detail="Implant surgery · AOX planning"
                    badge="IMPLANT"
                  />
                  <TimelineRow
                    time="11:00"
                    patient="Ana Rodríguez"
                    detail="Ortho aligner check · Set 6/24"
                    badge="ORTHO"
                  />
                  <TimelineRow
                    time="14:00"
                    patient="Carlos Vega"
                    detail="Emergency – pain UR6"
                    badge="EMERGENCY"
                  />
                  <TimelineRow
                    time="16:00"
                    patient="Gina Park"
                    detail="Pedo recall &amp; sealants"
                    badge="PEDIA"
                  />
                </div>
              </section>
            </div>
          </main>

          {/* Right rail */}
          <aside
            className={`w-full lg:w-80 border-t lg:border-t-0 lg:border-l px-4 py-4 space-y-4 ${
              dark
                ? "border-slate-800 bg-slate-950/70"
                : "border-slate-200 bg-slate-50"
            }`}
          >
            <section className="rounded-2xl border border-slate-800 bg-gradient-to-b from-slate-900 to-slate-950 p-4 space-y-3">
              <p className="text-xs font-semibold tracking-[0.18em] uppercase text-slate-400">
                ADIE Assistant
              </p>
              <p className="text-sm font-semibold text-slate-50">
                Smart layer for dental decisions
              </p>
              <p className="text-xs text-slate-400">
                Ask ADIE for medical risks, medication alerts, or a quick patient
                summary before entering the operatory.
              </p>
              <button className="w-full rounded-xl bg-sky-500 py-2 text-xs font-semibold text-slate-950 hover:bg-sky-400 transition">
                Open Chair-side Chat
              </button>
              <p className="text-[10px] text-slate-500">
                Next step: connect with your ADIE-Postgres database.
              </p>
            </section>

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
          </aside>
        </div>
      </div>
    </div>
  );
}

/* ---------- Small UI components ---------- */

type StatCardProps = {
  label: string;
  value: string;
  tone: "indigo" | "emerald" | "sky" | "rose";
  dark: boolean;
  href?: string;
};

function StatCard({ label, value, tone, dark, href }: StatCardProps) {
  const toneMapDark: Record<StatCardProps["tone"], string> = {
    indigo:
      "bg-gradient-to-b from-indigo-950/90 to-slate-950/70 text-indigo-100 border-indigo-400/60",
    emerald:
      "bg-gradient-to-b from-emerald-950/85 to-slate-950/70 text-emerald-100 border-emerald-400/60",
    sky: "bg-gradient-to-b from-sky-950/85 to-slate-950/70 text-sky-100 border-sky-400/60",
    rose:
      "bg-gradient-to-b from-rose-950/85 to-slate-950/70 text-rose-100 border-rose-400/60",
  };

  const toneMapLight: Record<StatCardProps["tone"], string> = {
    indigo: "bg-indigo-50 text-indigo-900 border-indigo-200",
    emerald: "bg-emerald-50 text-emerald-900 border-emerald-200",
    sky: "bg-sky-50 text-sky-900 border-sky-200",
    rose: "bg-rose-50 text-rose-900 border-rose-200",
  };

  const toneClass = dark ? toneMapDark[tone] : toneMapLight[tone];

  const CardInner = (
    <div
      className={`rounded-2xl border px-3 py-3 ${toneClass} ${
        href
          ? "cursor-pointer hover:brightness-110 hover:border-white/25 transition"
          : ""
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <p className="text-[11px] uppercase tracking-[0.18em] opacity-80">
          {label}
        </p>
        {href && (
          <span className="text-[10px] opacity-70 whitespace-nowrap">
            Open →
          </span>
        )}
      </div>

      <p className="text-xl font-semibold leading-none mt-1">{value}</p>
    </div>
  );

  return href ? <Link href={href}>{CardInner}</Link> : CardInner;
}

type BarRowProps = { label: string; value: number; color: string };

function BarRow({ label, value, color }: BarRowProps) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-[11px] text-slate-400">
        <span>{label}</span>
        <span>{value}</span>
      </div>
      <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
        <div
          className={`h-full ${color}`}
          style={{ width: `${Math.min(value, 100)}%` }}
        />
      </div>
    </div>
  );
}

type MiniKpiProps = { label: string; value: string; sub: string };

function MiniKpi({ label, value, sub }: MiniKpiProps) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
      <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500 mb-1">
        {label}
      </p>
      <p className="text-xl font-semibold text-slate-50">{value}</p>
      <p className="text-[11px] text-slate-400 mt-1">{sub}</p>
    </div>
  );
}

type ProcedureRowProps = { name: string; count: string; code: string };

function ProcedureRow({ name, count, code }: ProcedureRowProps) {
  return (
    <div className="flex items-center justify-between py-1.5 border-b border-slate-800/60 last:border-0">
      <div>
        <p className="text-xs text-slate-100">{name}</p>
        <p className="text-[11px] text-slate-500">{code}</p>
      </div>
      <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[11px] text-slate-200">
        {count}
      </span>
    </div>
  );
}

type TimelineRowProps = {
  time: string;
  patient: string;
  detail: string;
  badge: string;
};

function TimelineRow({ time, patient, detail, badge }: TimelineRowProps) {
  const href = `/calendar?from=dashboard&time=${encodeURIComponent(
    time
  )}&patient=${encodeURIComponent(patient)}`;

  return (
    <Link href={href} className="block">
      <div className="flex gap-3 items-start">
        <div className="w-12 text-[11px] text-slate-500 mt-1">{time}</div>
        <div className="flex-1 rounded-xl border border-slate-800 bg-slate-950/70 px-3 py-2.5 hover:border-sky-500/40 hover:bg-slate-950/85 transition">
          <div className="flex justify-between items-center mb-1">
            <p className="text-xs font-semibold text-slate-100">{patient}</p>
            <span className="text-[10px] rounded-full bg-slate-800 px-2 py-0.5 text-slate-300">
              {badge}
            </span>
          </div>
          <p className="text-[11px] text-slate-400">{detail}</p>
        </div>
      </div>
    </Link>
  );
}
