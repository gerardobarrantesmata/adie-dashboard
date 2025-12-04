'use client';

import { useState } from 'react';

export default function Home() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const isDark = theme === 'dark';

  // Paletas principales
  const shellClass = isDark
    ? 'bg-slate-950 text-slate-50'
    : 'bg-slate-100 text-slate-900';

  const sidebarClass = isDark
    ? 'bg-slate-950/80 border-slate-800'
    : 'bg-slate-50/90 border-slate-300';

  const headerClass = isDark
    ? 'bg-slate-950/60 border-slate-800'
    : 'bg-slate-50/90 border-slate-300';

  const mainCardClass = isDark
    ? 'border-slate-800 bg-slate-900/50'
    : 'border-slate-300 bg-slate-50';

  const rightRailBgClass = isDark
    ? 'bg-slate-950/70 border-slate-800'
    : 'bg-slate-100 border-slate-300';

  const rightRailCardClass = isDark
    ? 'border-slate-800 bg-slate-900/60'
    : 'border-slate-300 bg-slate-50';

  const assistantCardGradient = isDark
    ? 'from-slate-900 to-slate-950 border-slate-800'
    : 'from-sky-50 to-slate-50 border-slate-300';

  return (
    <div className={`min-h-screen flex ${shellClass}`}>
      {/* Sidebar */}
      <aside
        className={`hidden md:flex w-60 flex-col border-r ${sidebarClass}`}
      >
        <div className="h-16 flex items-center px-5 border-b border-inherit">
          <div className="h-9 w-9 rounded-xl bg-sky-500 flex items-center justify-center text-xs font-bold">
            AD
          </div>
          <div className="ml-3">
            <p
              className={`text-xs uppercase tracking-[0.15em] ${
                isDark ? 'text-slate-400' : 'text-slate-600'
              }`}
            >
              ADIE
            </p>
            <p
              className={`text-sm font-semibold ${
                isDark ? 'text-slate-100' : 'text-slate-900'
              }`}
            >
              Astra Dental Intelligence
            </p>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 text-sm">
          <p
            className={`px-3 text-[11px] font-semibold tracking-[0.18em] uppercase mb-2 ${
              isDark ? 'text-slate-500' : 'text-slate-700'
            }`}
          >
            Main
          </p>
          <NavItem active dark={isDark}>
            Dashboard
          </NavItem>
          <NavItem dark={isDark}>Specialties</NavItem>
          <NavItem dark={isDark}>Patients</NavItem>
          <NavItem dark={isDark}>Calendar</NavItem>
          <NavItem dark={isDark}>Dental Chart</NavItem>
          <NavItem dark={isDark}>Radiology</NavItem>
          <NavItem dark={isDark}>Pharmacy</NavItem>
          <NavItem dark={isDark}>Operations Hub</NavItem>

          <p
            className={`px-3 pt-4 text-[11px] font-semibold tracking-[0.18em] uppercase mb-2 ${
              isDark ? 'text-slate-500' : 'text-slate-700'
            }`}
          >
            Analytics
          </p>
          <NavItem dark={isDark}>Daily BI</NavItem>
          <NavItem dark={isDark}>Financial</NavItem>
          <NavItem dark={isDark}>Implants &amp; Perio</NavItem>
        </nav>

        <div className="border-t border-inherit px-4 py-3 text-xs">
          <p
            className={`font-semibold text-sm ${
              isDark ? 'text-slate-200' : 'text-slate-900'
            }`}
          >
            Gerardo Barrantes
          </p>
          <p className={isDark ? 'text-slate-400' : 'text-slate-700'}>
            Admin · ADIE Pilot
          </p>
        </div>
      </aside>

      {/* Main layout */}
      <div className="flex-1 flex flex-col">
        {/* Top bar */}
        <header
          className={`h-16 border-b flex items-center justify-between px-4 md:px-8 ${headerClass} backdrop-blur`}
        >
          <div className="flex items-center gap-3">
            <span
              className={`hidden sm:inline-block text-xs font-semibold tracking-[0.18em] uppercase ${
                isDark ? 'text-slate-500' : 'text-slate-700'
              }`}
            >
              Dashboard
            </span>
            <h1
              className={`text-lg md:text-xl font-semibold ${
                isDark ? 'text-slate-50' : 'text-slate-900'
              }`}
            >
              Clinic Operations Overview
            </h1>
          </div>

          <div className="flex items-center gap-3 text-xs">
            {/* Botón de cambio de tema */}
            <button
              onClick={() => setTheme(isDark ? 'light' : 'dark')}
              className={`hidden sm:inline-flex items-center gap-1 rounded-full border px-3 py-1 text-[11px] transition ${
                isDark
                  ? 'border-slate-700 bg-slate-900/70 text-slate-200 hover:border-sky-500'
                  : 'border-slate-300 bg-slate-100 text-slate-800 hover:border-sky-500'
              }`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  isDark ? 'bg-emerald-400' : 'bg-sky-500'
                }`}
              />
              Theme:{' '}
              <span className="font-semibold">{isDark ? 'Dark' : 'Light'}</span>
            </button>

            <button
              className={`hidden sm:inline-flex items-center gap-1 rounded-full border px-3 py-1 text-[11px] transition ${
                isDark
                  ? 'border-slate-700 text-slate-200 hover:border-sky-500 hover:text-sky-300'
                  : 'border-slate-300 text-slate-800 hover:border-sky-500 hover:text-sky-700'
              }`}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Today is ready for launch
            </button>
            <button className="rounded-full bg-sky-500 px-4 py-1.5 text-xs font-semibold text-slate-950 hover:bg-sky-400 transition">
              New Appointment
            </button>
          </div>
        </header>

        {/* Content + right rail */}
        <div className="flex-1 flex flex-col lg:flex-row">
          {/* Main content */}
          <main className="flex-1 px-4 md:px-8 py-5 space-y-5 overflow-auto">
            {/* Row: snapshot + specialty chart */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
              {/* Daily snapshot */}
              <section
                className={`xl:col-span-2 rounded-2xl border p-4 md:p-5 ${mainCardClass}`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p
                      className={`text-xs font-semibold tracking-[0.18em] uppercase ${
                        isDark ? 'text-slate-500' : 'text-slate-700'
                      }`}
                    >
                      Daily Snapshot
                    </p>
                    <p
                      className={`text-sm ${
                        isDark ? 'text-slate-300' : 'text-slate-800'
                      }`}
                    >
                      Today&apos;s activity at a glance
                    </p>
                  </div>
                  <button
                    className={`text-xs ${
                      isDark ? 'text-sky-400 hover:text-sky-300' : 'text-sky-600 hover:text-sky-500'
                    }`}
                  >
                    View agenda
                  </button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
                  <StatCard label="Scheduled" value="12" tone="slate" />
                  <StatCard label="Confirmed" value="9" tone="emerald" />
                  <StatCard label="Completed" value="6" tone="sky" />
                  <StatCard label="Emergency" value="1" tone="rose" />
                </div>

                {/* Fake line chart */}
                <div className="mt-1">
                  <p
                    className={`text-[11px] uppercase tracking-[0.18em] mb-2 ${
                      isDark ? 'text-slate-500' : 'text-slate-700'
                    }`}
                  >
                    Visits by Hour (Today)
                  </p>
                  <div
                    className={`h-28 rounded-xl border bg-slate-950 flex items-end gap-1 px-3 pb-3 ${
                      isDark ? 'border-slate-800' : 'border-slate-400'
                    }`}
                  >
                    {[
                      10, 25, 40, 35, 55, 50, 30, 20, 15, 10, 8, 5,
                    ].map((h, i) => (
                      <div
                        key={i}
                        className="flex-1 flex flex-col justify-end"
                      >
                        <div
                          className="w-full rounded-t-full bg-gradient-to-t from-sky-500 to-emerald-400"
                          style={{ height: `${h}%` }}
                        />
                      </div>
                    ))}
                  </div>
                  <div
                    className={`flex justify-between text-[10px] mt-1.5 px-1 ${
                      isDark ? 'text-slate-500' : 'text-slate-700'
                    }`}
                  >
                    <span>7:00</span>
                    <span>10:00</span>
                    <span>13:00</span>
                    <span>16:00</span>
                    <span>19:00</span>
                  </div>
                </div>
              </section>

              {/* Patients by specialty */}
              <section
                className={`rounded-2xl border p-4 md:p-5 flex flex-col ${mainCardClass}`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p
                      className={`text-xs font-semibold tracking-[0.18em] uppercase ${
                        isDark ? 'text-slate-500' : 'text-slate-700'
                      }`}
                    >
                      Patients by Specialty
                    </p>
                    <p
                      className={`text-xs ${
                        isDark ? 'text-slate-400' : 'text-slate-700'
                      }`}
                    >
                      Active cases (last 6 months)
                    </p>
                  </div>
                  <select
                    className={`rounded-lg text-xs px-2 py-1 ${
                      isDark
                        ? 'bg-slate-900 border border-slate-700 text-slate-100'
                        : 'bg-slate-50 border border-slate-300 text-slate-800'
                    }`}
                  >
                    <option>All clinics</option>
                    <option>Lake Nona</option>
                    <option>San José</option>
                  </select>
                </div>

                <div className="space-y-2 flex-1">
                  <BarRow
                    label="General"
                    value={72}
                    color="bg-sky-500"
                    dark={isDark}
                  />
                  <BarRow
                    label="Perio"
                    value={45}
                    color="bg-emerald-400"
                    dark={isDark}
                  />
                  <BarRow
                    label="Endo"
                    value={31}
                    color="bg-cyan-400"
                    dark={isDark}
                  />
                  <BarRow
                    label="Prosth"
                    value={28}
                    color="bg-violet-400"
                    dark={isDark}
                  />
                  <BarRow
                    label="Ortho"
                    value={22}
                    color="bg-amber-400"
                    dark={isDark}
                  />
                  <BarRow
                    label="Pedia"
                    value={18}
                    color="bg-rose-400"
                    dark={isDark}
                  />
                </div>

                <p
                  className={`mt-4 text-[11px] ${
                    isDark ? 'text-slate-500' : 'text-slate-700'
                  }`}
                >
                  Click a bar (soon) to open that specialty workspace.
                </p>
              </section>
            </div>

            {/* Second row: KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <MiniKpi
                label="Active Patients"
                value="248"
                sub="+18 this month"
                dark={isDark}
              />
              <MiniKpi
                label="Visits (30 days)"
                value="162"
                sub="On track"
                dark={isDark}
              />
              <MiniKpi
                label="Total Procedures"
                value="459"
                sub="Clinical"
                dark={isDark}
              />
              <MiniKpi
                label="Implants in progress"
                value="32"
                sub="Across 3 clinics"
                dark={isDark}
              />
            </div>

            {/* Third row: common procedures + timeline */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <section
                className={`rounded-2xl border p-4 md:p-5 ${mainCardClass}`}
              >
                <div className="flex items-center justify-between mb-3">
                  <h2
                    className={`text-sm font-semibold ${
                      isDark ? 'text-slate-100' : 'text-slate-900'
                    }`}
                  >
                    Most Common Procedures
                  </h2>
                  <button
                    className={`text-[11px] ${
                      isDark ? 'text-sky-400 hover:text-sky-300' : 'text-sky-600 hover:text-sky-500'
                    }`}
                  >
                    View CPT / code map
                  </button>
                </div>
                <div className="space-y-2 text-xs">
                  <ProcedureRow
                    name="Adult Prophylaxis &amp; Recall"
                    count="96"
                    code="D1110 + exam"
                    dark={isDark}
                  />
                  <ProcedureRow
                    name="Composite Restoration"
                    count="74"
                    code="D2332 / D2392"
                    dark={isDark}
                  />
                  <ProcedureRow
                    name="Root Canal – Molar"
                    count="31"
                    code="Endo Mx/Md"
                    dark={isDark}
                  />
                  <ProcedureRow
                    name="Implant placement"
                    count="22"
                    code="Surgical guide + fixture"
                    dark={isDark}
                  />
                  <ProcedureRow
                    name="Clear aligner cases"
                    count="12"
                    code="ADIE Ortho Engine"
                    dark={isDark}
                  />
                </div>
              </section>

              <section
                className={`lg:col-span-2 rounded-2xl border p-4 md:p-5 ${mainCardClass}`}
              >
                <div className="flex items-center justify-between mb-3">
                  <h2
                    className={`text-sm font-semibold ${
                      isDark ? 'text-slate-100' : 'text-slate-900'
                    }`}
                  >
                    Today&apos;s Chair-time Map
                  </h2>
                  <span
                    className={`text-[11px] ${
                      isDark ? 'text-slate-400' : 'text-slate-700'
                    }`}
                  >
                    Drag &amp; drop (futuro) para reorganizar agenda
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <TimelineRow
                    time="08:00"
                    patient="María López"
                    detail="Perio maintenance · Room 2"
                    badge="PERIO"
                    dark={isDark}
                  />
                  <TimelineRow
                    time="09:30"
                    patient="David Chen"
                    detail="Implant surgery · AOX planning"
                    badge="IMPLANT"
                    dark={isDark}
                  />
                  <TimelineRow
                    time="11:00"
                    patient="Ana Rodríguez"
                    detail="Ortho aligner check · Set 6/24"
                    badge="ORTHO"
                    dark={isDark}
                  />
                  <TimelineRow
                    time="14:00"
                    patient="Carlos Vega"
                    detail="Emergency – pain UR6"
                    badge="EMERGENCY"
                    dark={isDark}
                  />
                  <TimelineRow
                    time="16:00"
                    patient="Gina Park"
                    detail="Pedo recall &amp; sealants"
                    badge="PEDIA"
                    dark={isDark}
                  />
                </div>
              </section>
            </div>
          </main>

          {/* Right rail: assistant + news */}
          <aside
            className={`w-full lg:w-80 border-t lg:border-t-0 lg:border-l px-4 py-4 space-y-4 ${rightRailBgClass}`}
          >
            {/* ADIE assistant */}
            <section
              className={`rounded-2xl border bg-gradient-to-b p-4 space-y-3 ${assistantCardGradient}`}
            >
              <p
                className={`text-xs font-semibold tracking-[0.18em] uppercase ${
                  isDark ? 'text-slate-400' : 'text-slate-700'
                }`}
              >
                ADIE Assistant
              </p>
              <p
                className={`text-sm font-semibold ${
                  isDark ? 'text-slate-50' : 'text-slate-900'
                }`}
              >
                Smart layer for dental decisions
              </p>
              <p
                className={`text-xs ${
                  isDark ? 'text-slate-400' : 'text-slate-700'
                }`}
              >
                Pregúntale a ADIE por riesgos médicos, alertas de medicación,
                o resumen rápido del paciente antes de entrar al consultorio.
              </p>
              <button className="w-full rounded-xl bg-sky-500 py-2 text-xs font-semibold text-slate-950 hover:bg-sky-400 transition">
                Open Chair-side Chat
              </button>
              <p
                className={`text-[10px] ${
                  isDark ? 'text-slate-500' : 'text-slate-700'
                }`}
              >
                Próximo paso: conectar con tu base de datos de ADIE-Postgres.
              </p>
            </section>

            {/* Updates */}
            <section
              className={`rounded-2xl border p-4 space-y-3 text-xs ${rightRailCardClass}`}
            >
              <div className="flex items-center justify-between">
                <p
                  className={`text-[11px] font-semibold tracking-[0.18em] uppercase ${
                    isDark ? 'text-slate-400' : 'text-slate-700'
                  }`}
                >
                  ADIE Updates
                </p>
                <span className="rounded-full bg-emerald-500/15 text-emerald-300 px-2 py-0.5 text-[10px]">
                  Beta
                </span>
              </div>
              <ul
                className={`space-y-2 ${
                  isDark ? 'text-slate-300' : 'text-slate-800'
                }`}
              >
                <li>• Perio pockets chart v2 conectado a patient_tooth_chart.</li>
                <li>• Endo apex tracker listo para pruebas clínicas.</li>
                <li>• Módulo de implants vinculado con radiology &amp; CBCT.</li>
              </ul>
            </section>

            {/* Help & guides */}
            <section
              className={`rounded-2xl border p-4 space-y-3 text-xs ${rightRailCardClass}`}
            >
              <p
                className={`text-[11px] font-semibold tracking-[0.18em] uppercase ${
                  isDark ? 'text-slate-400' : 'text-slate-700'
                }`}
              >
                Help &amp; Guides
              </p>
              <div
                className={`space-y-2 ${
                  isDark ? 'text-slate-300' : 'text-slate-800'
                }`}
              >
                <p>• Cómo usar el Dashboard diario.</p>
                <p>• Flujo de check-in en tablet para nuevos pacientes.</p>
                <p>• Conectar ADIE con DBeaver / Postgres en producción.</p>
              </div>
            </section>
          </aside>
        </div>
      </div>
    </div>
  );
}

/* ---------- Small UI components ---------- */

type NavItemProps = {
  children: React.ReactNode;
  active?: boolean;
  dark: boolean;
};

function NavItem({ children, active, dark }: NavItemProps) {
  return (
    <button
      className={`w-full flex items-center rounded-xl px-3 py-2 text-xs justify-start ${
        active
          ? 'bg-sky-500/15 text-sky-300 font-semibold border border-sky-500/40'
          : dark
          ? 'text-slate-300 hover:bg-slate-800/80 hover:text-sky-200'
          : 'text-slate-800 hover:bg-slate-200 hover:text-sky-700'
      }`}
    >
      <span className="w-1 h-1 rounded-full bg-sky-400 mr-2 opacity-70" />
      {children}
    </button>
  );
}

type StatCardProps = {
  label: string;
  value: string;
  tone: 'slate' | 'emerald' | 'sky' | 'rose';
};

function StatCard({ label, value, tone }: StatCardProps) {
  const toneMap: Record<StatCardProps['tone'], string> = {
    slate: 'bg-slate-800 text-slate-100',
    emerald: 'bg-emerald-500/10 text-emerald-200 border-emerald-500/40',
    sky: 'bg-sky-500/10 text-sky-200 border-sky-500/40',
    rose: 'bg-rose-500/10 text-rose-200 border-rose-500/40',
  };

  return (
    <div
      className={`rounded-2xl border border-slate-800 px-3 py-3 ${toneMap[tone]}`}
    >
      <p className="text-[11px] text-slate-400 uppercase tracking-[0.18em] mb-1">
        {label}
      </p>
      <p className="text-xl font-semibold">{value}</p>
    </div>
  );
}

type BarRowProps = {
  label: string;
  value: number;
  color: string;
  dark: boolean;
};

function BarRow({ label, value, color, dark }: BarRowProps) {
  return (
    <div className="space-y-1">
      <div
        className={`flex justify-between text-[11px] ${
          dark ? 'text-slate-400' : 'text-slate-800'
        }`}
      >
        <span>{label}</span>
        <span>{value}</span>
      </div>
      <div
        className={`h-2 rounded-full overflow-hidden ${
          dark ? 'bg-slate-800' : 'bg-slate-200'
        }`}
      >
        <div
          className={`h-full ${color}`}
          style={{ width: `${Math.min(value, 100)}%` }}
        />
      </div>
    </div>
  );
}

type MiniKpiProps = {
  label: string;
  value: string;
  sub: string;
  dark: boolean;
};

function MiniKpi({ label, value, sub, dark }: MiniKpiProps) {
  return (
    <div
      className={`rounded-2xl border p-4 ${
        dark ? 'border-slate-800 bg-slate-900/70' : 'border-slate-300 bg-slate-50'
      }`}
    >
      <p
        className={`text-[11px] uppercase tracking-[0.18em] mb-1 ${
          dark ? 'text-slate-500' : 'text-slate-700'
        }`}
      >
        {label}
      </p>
      <p
        className={`text-xl font-semibold ${
          dark ? 'text-slate-50' : 'text-slate-900'
        }`}
      >
        {value}
      </p>
      <p
        className={`text-[11px] mt-1 ${
          dark ? 'text-slate-400' : 'text-slate-700'
        }`}
      >
        {sub}
      </p>
    </div>
  );
}

type ProcedureRowProps = {
  name: string;
  count: string;
  code: string;
  dark: boolean;
};

function ProcedureRow({ name, count, code, dark }: ProcedureRowProps) {
  return (
    <div className="flex items-center justify-between py-1.5 border-b border-slate-800/60 last:border-0">
      <div>
        <p
          className={`text-xs ${
            dark ? 'text-slate-100' : 'text-slate-900'
          }`}
        >
          {name}
        </p>
        <p
          className={`text-[11px] ${
            dark ? 'text-slate-500' : 'text-slate-700'
          }`}
        >
          {code}
        </p>
      </div>
      <span
        className={`rounded-full px-2 py-0.5 text-[11px] ${
          dark
            ? 'bg-slate-800 text-slate-200'
            : 'bg-slate-200 text-slate-900'
        }`}
      >
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
  dark: boolean;
};

function TimelineRow({ time, patient, detail, badge, dark }: TimelineRowProps) {
  return (
    <div className="flex gap-3 items-start">
      <div
        className={`w-12 text-[11px] mt-1 ${
          dark ? 'text-slate-500' : 'text-slate-700'
        }`}
      >
        {time}
      </div>
      <div
        className={`flex-1 rounded-xl border px-3 py-2.5 ${
          dark ? 'border-slate-800 bg-slate-950/70' : 'border-slate-300 bg-slate-50'
        }`}
      >
        <div className="flex justify-between items-center mb-1">
          <p
            className={`text-xs font-semibold ${
              dark ? 'text-slate-100' : 'text-slate-900'
            }`}
          >
            {patient}
          </p>
          <span className="text-[10px] rounded-full bg-slate-800 px-2 py-0.5 text-slate-300">
            {badge}
          </span>
        </div>
        <p
          className={`text-[11px] ${
            dark ? 'text-slate-400' : 'text-slate-700'
          }`}
        >
          {detail}
        </p>
      </div>
    </div>
  );
}
