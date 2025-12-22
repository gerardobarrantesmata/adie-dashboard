"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";

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

export default function DashboardPage() {
  // Dynamic visits-by-hour state
  const [hourCounts, setHourCounts] = useState<number[]>(
    Array(BUCKETS).fill(0)
  );
  const [visitsLoading, setVisitsLoading] = useState<boolean>(true);

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
    <div className="space-y-5">
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

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
            <StatCard
              label="Scheduled"
              value="12"
              tone="indigo"
              href="/operations-hub?tab=scheduled"
            />
            <StatCard
              label="Confirmed"
              value="9"
              tone="emerald"
              href="/operations-hub?tab=confirmed"
            />
            <StatCard
              label="Completed"
              value="6"
              tone="sky"
              href="/operations-hub?tab=completed"
            />
            <StatCard
              label="Emergency"
              value="1"
              tone="rose"
              href="/operations-hub?tab=emergency"
            />
          </div>

          <div className="mt-1">
            <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500 mb-2">
              Visits by Hour (Today)
            </p>

            <div
              className="h-28 rounded-xl border border-slate-800 bg-slate-950 flex items-end gap-1 px-3 pb-3"
              aria-label="Visits by hour chart"
            >
              {(hourHeights.some((v) => v > 0) ? hourHeights : fallbackMock).map(
                (h, i) => (
                  <div key={i} className="flex-1 flex flex-col justify-end">
                    <div
                      className={`w-full rounded-t-full bg-gradient-to-t from-sky-500 to-emerald-400 ${
                        visitsLoading ? "opacity-60" : "opacity-100"
                      }`}
                      style={{ height: `${h}%` }}
                    />
                  </div>
                )
              )}
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

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <MiniKpi label="Active Patients" value="248" sub="+18 this month" />
        <MiniKpi label="Visits (30 days)" value="162" sub="On track" />
        <MiniKpi label="Total Procedures" value="459" sub="Clinical" />
        <MiniKpi label="Implants in progress" value="32" sub="Across 3 clinics" />
      </div>

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

      <div className="text-[11px] text-slate-500">
        <Link href="/specialties" className="text-sky-400 hover:text-sky-300">
          Go to Specialties
        </Link>
        <span className="mx-2">•</span>
        <Link href="/patients" className="text-sky-400 hover:text-sky-300">
          Open Patients
        </Link>
      </div>
    </div>
  );
}

/* ---------- Small UI components ---------- */

type StatCardProps = {
  label: string;
  value: string;
  tone: "indigo" | "emerald" | "sky" | "rose";
  href?: string;
};

function StatCard({ label, value, tone, href }: StatCardProps) {
  const toneMapDark: Record<StatCardProps["tone"], string> = {
    indigo:
      "bg-gradient-to-b from-indigo-950/90 to-slate-950/70 text-indigo-100 border-indigo-400/60",
    emerald:
      "bg-gradient-to-b from-emerald-950/85 to-slate-950/70 text-emerald-100 border-emerald-400/60",
    sky: "bg-gradient-to-b from-sky-950/85 to-slate-950/70 text-sky-100 border-sky-400/60",
    rose:
      "bg-gradient-to-b from-rose-950/85 to-slate-950/70 text-rose-100 border-rose-400/60",
  };

  const toneClass = toneMapDark[tone];

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
