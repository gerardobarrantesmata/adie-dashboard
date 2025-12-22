"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { RightRail } from "@/app/_components/RightRail";

type AppointmentStatus = "scheduled" | "checked_in" | "completed" | "cancelled";
type CalendarView = "day" | "week" | "month";

type Provider = {
  id: string;
  name: string;
  specialty: string;
  color: string; // tailwind bg- class
  initials: string;
};

type Appointment = {
  id: string;
  patientName: string;
  providerId: string;
  specialty: string;
  startTime: string; // ISO
  endTime: string; // ISO
  status: AppointmentStatus;
  room?: string;
  notes?: string;
};

/* ---------- Helpers de fechas ---------- */

function startOfDay(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function addDays(date: Date, days: number) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function startOfWeek(date: Date) {
  // Domingo como inicio de semana (USA)
  const d = startOfDay(date);
  const day = d.getDay(); // 0-6
  return addDays(d, -day);
}

function getWeekDays(date: Date) {
  const start = startOfWeek(date);
  return Array.from({ length: 7 }, (_, i) => addDays(start, i));
}

function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function endOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
}

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function isSameMonth(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();
}

function formatISODate(date: Date) {
  return date.toISOString().split("T")[0];
}

function formatTimeLabel(date: Date) {
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
}

function buildMonthGrid(currentMonth: Date) {
  const start = startOfMonth(currentMonth);
  const startWeekDay = start.getDay();
  const gridStart = addDays(start, -startWeekDay);

  const totalCells = 6 * 7;
  const days: { date: Date; isCurrentMonth: boolean }[] = [];

  for (let i = 0; i < totalCells; i++) {
    const d = addDays(gridStart, i);
    days.push({
      date: d,
      isCurrentMonth: isSameMonth(d, currentMonth),
    });
  }

  return days;
}

/* ---------- MOCK DATA (multi-doctor) ---------- */

const PROVIDERS: Provider[] = [
  {
    id: "p1",
    name: "Dr. Ana Perio",
    specialty: "Periodontics",
    color: "bg-emerald-400",
    initials: "AP",
  },
  {
    id: "p2",
    name: "Dr. David Endo",
    specialty: "Endodontics",
    color: "bg-cyan-400",
    initials: "DE",
  },
  {
    id: "p3",
    name: "Dr. María Prosth",
    specialty: "Prosthodontics",
    color: "bg-violet-400",
    initials: "MP",
  },
  {
    id: "p4",
    name: "Dr. Luis Ortho",
    specialty: "Orthodontics",
    color: "bg-amber-400",
    initials: "LO",
  },
  {
    id: "p5",
    name: "Dr. Carla General",
    specialty: "General Dentistry",
    color: "bg-sky-400",
    initials: "CG",
  },
];

const MOCK_APPOINTMENTS: Appointment[] = (() => {
  const now = new Date();
  const baseDay = startOfDay(now);

  function mk(
    offsetDays: number,
    hour: number,
    durationMin: number,
    providerId: string,
    patientName: string,
    specialty: string,
    status: AppointmentStatus,
    room: string,
    notes?: string
  ): Appointment {
    const start = addDays(baseDay, offsetDays);
    start.setHours(hour, 0, 0, 0);
    const end = new Date(start.getTime() + durationMin * 60 * 1000);

    return {
      id: Math.random().toString(36).slice(2),
      patientName,
      providerId,
      specialty,
      startTime: start.toISOString(),
      endTime: end.toISOString(),
      status,
      room,
      notes,
    };
  }

  return [
    mk(
      0,
      8,
      60,
      "p1",
      "Juan Pérez",
      "Periodontics",
      "scheduled",
      "Room 2",
      "Deep scaling UL."
    ),
    mk(0, 9, 90, "p2", "María López", "Endodontics", "scheduled", "Room 3", "RCT 2.6"),
    mk(
      0,
      11,
      45,
      "p5",
      "Carlos Vega",
      "General Dentistry",
      "checked_in",
      "Room 1",
      "Emergency pain."
    ),
    mk(1, 10, 60, "p3", "Ana Rodríguez", "Prosthodontics", "scheduled", "Room 4", "Crown delivery."),
    mk(1, 14, 30, "p4", "David Chen", "Orthodontics", "scheduled", "Room 5", "Aligner check 6/24."),
    mk(-1, 15, 60, "p1", "Laura Park", "Periodontics", "completed", "Room 2", "Post-op control."),
    mk(3, 9, 120, "p3", "Gina Park", "Prosthodontics", "scheduled", "Room 4", "Implant prosth planning."),
    mk(3, 16, 45, "p5", "Pablo Ruiz", "General Dentistry", "scheduled", "Room 1", "Composite restorations."),
  ];
})();

/* ---------- Componente principal ---------- */

export default function CalendarPage() {
  const [view, setView] = useState<CalendarView>("week");
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [appointments] = useState<Appointment[]>(MOCK_APPOINTMENTS);
  const [selectedProviderIds, setSelectedProviderIds] = useState<string[]>(
    PROVIDERS.map((p) => p.id)
  );
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<string | null>(null);

  // Quick create
  const [newPatientName, setNewPatientName] = useState("");
  const [newProviderId, setNewProviderId] = useState(PROVIDERS[0]?.id ?? "");
  const [newStartTime, setNewStartTime] = useState("09:00");
  const [newDurationMinutes, setNewDurationMinutes] = useState(60);
  const [newNotes, setNewNotes] = useState("");

  const selectedAppointment = useMemo(
    () => appointments.find((a) => a.id === selectedAppointmentId) ?? null,
    [appointments, selectedAppointmentId]
  );

  const providersById = useMemo(() => {
    const map: Record<string, Provider> = {};
    for (const p of PROVIDERS) map[p.id] = p;
    return map;
  }, []);

  function toggleProvider(id: string) {
    setSelectedProviderIds((prev) => (prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]));
  }

  function goToToday() {
    const now = new Date();
    setCurrentDate(now);
    setSelectedDate(now);
  }

  function shift(period: "prev" | "next") {
    setCurrentDate((prev) => {
      const delta = period === "prev" ? -1 : 1;
      if (view === "day") return addDays(prev, delta);
      if (view === "week") return addDays(prev, delta * 7);
      return new Date(prev.getFullYear(), prev.getMonth() + delta, 1);
    });
  }

  const visibleAppointments = useMemo(() => {
    const filtered = appointments.filter((a) => selectedProviderIds.includes(a.providerId));

    if (view === "day") {
      return filtered.filter((a) => isSameDay(new Date(a.startTime), selectedDate));
    }

    if (view === "week") {
      const weekDays = getWeekDays(currentDate).map((d) => formatISODate(d));
      return filtered.filter((a) => weekDays.includes(formatISODate(new Date(a.startTime))));
    }

    // month
    return filtered.filter((a) => isSameMonth(new Date(a.startTime), currentDate));
  }, [appointments, selectedProviderIds, view, selectedDate, currentDate]);

  const monthGrid = useMemo(() => buildMonthGrid(currentDate), [currentDate]);
  const weekDays = useMemo(() => getWeekDays(currentDate), [currentDate]);
  const dayHours = useMemo(() => Array.from({ length: 12 }, (_, i) => 7 + i), []);

  function handleCreateAppointment(e: React.FormEvent) {
    e.preventDefault();
    if (!newPatientName.trim() || !newProviderId) return;

    const [h, m] = newStartTime.split(":").map(Number);
    const start = new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth(),
      selectedDate.getDate(),
      h,
      m,
      0,
      0
    );
    const end = new Date(start.getTime() + newDurationMinutes * 60 * 1000);

    const provider = providersById[newProviderId];

    const appt: Appointment = {
      id: Math.random().toString(36).slice(2),
      patientName: newPatientName.trim(),
      providerId: newProviderId,
      specialty: provider?.specialty ?? "General Dentistry",
      startTime: start.toISOString(),
      endTime: end.toISOString(),
      status: "scheduled",
      room: "TBD",
      notes: newNotes.trim() || undefined,
    };

    alert(
      `Demo only – this will be saved to Postgres via /api/appointments.\n\n${appt.patientName} · ${provider?.name} · ${formatTimeLabel(
        start
      )}`
    );

    setNewPatientName("");
    setNewNotes("");
  }

  const monthLabel = useMemo(
    () =>
      currentDate.toLocaleString("en-US", {
        month: "long",
        year: "numeric",
      }),
    [currentDate]
  );

  const viewLabel = view === "day" ? "Day" : view === "week" ? "Week" : "Month";

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 flex">
      {/* Sidebar principal ADIE */}
      <aside className="hidden md:flex w-56 flex-col border-r border-slate-800 bg-slate-950/90">
        <div className="h-16 flex items-center px-5 border-b border-slate-800/60">
          <div className="h-9 w-9 rounded-xl bg-sky-500 flex items-center justify-center text-xs font-bold text-slate-950">
            AD
          </div>
          <div className="ml-3">
            <p className="text-[10px] uppercase tracking-[0.18em] text-slate-400">ADIE</p>
            <p className="text-sm font-semibold">Scheduling Engine</p>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 text-xs">
          <p className="px-3 text-[10px] font-semibold tracking-[0.18em] text-slate-500 uppercase mb-2">
            Navigation
          </p>
          <NavLink href="/dashboard" label="Dashboard" />
          <NavLink href="/patients" label="Patients" />
          <NavLink href="/specialties" label="Specialties" />
          <NavLink href="/calendar" label="Calendar" active />
        </nav>

        <div className="border-t border-slate-800/60 px-4 py-3 text-[11px] text-slate-400">
          <p className="font-semibold text-sm">Gerardo Barrantes</p>
          <p>Admin · ADIE Pilot</p>
        </div>
      </aside>

      {/* Layout central */}
      <div className="flex-1 flex flex-col">
        {/* Top bar */}
        <header className="h-16 border-b border-slate-800 bg-slate-950/70 backdrop-blur flex items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-block text-[10px] font-semibold tracking-[0.18em] uppercase text-slate-500">
              Calendar
            </span>
            <h1 className="text-base md:text-lg font-semibold">Multi-doctor Scheduling</h1>
            <span className="hidden md:inline-flex items-center rounded-full border border-slate-700 px-2 py-0.5 text-[10px] text-slate-400">
              {viewLabel} view · {visibleAppointments.length} appointments
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <div className="inline-flex rounded-full border border-slate-700 bg-slate-950/70">
              <button
                onClick={() => setView("day")}
                className={`px-3 py-1 rounded-full ${
                  view === "day" ? "bg-sky-500 text-slate-950" : "text-slate-300 hover:bg-slate-800"
                }`}
              >
                Day
              </button>
              <button
                onClick={() => setView("week")}
                className={`px-3 py-1 rounded-full ${
                  view === "week" ? "bg-sky-500 text-slate-950" : "text-slate-300 hover:bg-slate-800"
                }`}
              >
                Week
              </button>
              <button
                onClick={() => setView("month")}
                className={`px-3 py-1 rounded-full ${
                  view === "month" ? "bg-sky-500 text-slate-950" : "text-slate-300 hover:bg-slate-800"
                }`}
              >
                Month
              </button>
            </div>

            <button
              onClick={() => shift("prev")}
              className="rounded-full border border-slate-700 px-2 py-1 hover:border-sky-400"
            >
              ◀
            </button>
            <button
              onClick={goToToday}
              className="rounded-full border border-sky-500/80 bg-sky-500/10 px-3 py-1 text-[11px] font-semibold text-sky-300 hover:bg-sky-500/20"
            >
              Today
            </button>
            <button
              onClick={() => shift("next")}
              className="rounded-full border border-slate-700 px-2 py-1 hover:border-sky-400"
            >
              ▶
            </button>
          </div>
        </header>

        {/* Contenido principal */}
        <div className="flex-1 flex flex-col lg:flex-row">
          {/* Filtros izquierda */}
          <section className="w-full lg:w-64 border-b lg:border-b-0 lg:border-r border-slate-800 bg-slate-950/80 px-4 py-4 space-y-4 text-xs">
            <div>
              <p className="text-[11px] font-semibold tracking-[0.18em] uppercase text-slate-500 mb-2">
                Providers
              </p>
              <div className="space-y-2">
                {PROVIDERS.map((p) => {
                  const selected = selectedProviderIds.includes(p.id);
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => toggleProvider(p.id)}
                      className={`w-full flex items-center justify-between rounded-xl border px-3 py-1.5 text-[11px] ${
                        selected
                          ? "border-sky-500 bg-sky-500/10 text-sky-200"
                          : "border-slate-700 bg-slate-900/80 text-slate-300 hover:border-sky-500/60"
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span className={`h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-semibold ${p.color}`}>
                          {p.initials}
                        </span>
                        <span>
                          <span className="block">{p.name}</span>
                          <span className="block text-[10px] text-slate-400">{p.specialty}</span>
                        </span>
                      </span>
                      <span className={`h-2 w-2 rounded-full ${selected ? "bg-emerald-400" : "bg-slate-600"}`} />
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <p className="text-[11px] font-semibold tracking-[0.18em] uppercase text-slate-500 mb-2">
                Legend
              </p>
              <div className="space-y-1 text-[11px] text-slate-400">
                <p>
                  <span className="inline-block h-2 w-2 rounded-full bg-emerald-400 mr-1" />
                  Periodontics
                </p>
                <p>
                  <span className="inline-block h-2 w-2 rounded-full bg-cyan-400 mr-1" />
                  Endodontics
                </p>
                <p>
                  <span className="inline-block h-2 w-2 rounded-full bg-violet-400 mr-1" />
                  Prosthodontics
                </p>
                <p>
                  <span className="inline-block h-2 w-2 rounded-full bg-amber-400 mr-1" />
                  Orthodontics
                </p>
                <p>
                  <span className="inline-block h-2 w-2 rounded-full bg-sky-400 mr-1" />
                  General Dentistry
                </p>
              </div>
            </div>
          </section>

          {/* Vista central (calendar) */}
          <main className="flex-1 border-b lg:border-b-0 lg:border-r border-slate-800 bg-slate-950/80 px-3 md:px-4 py-4 overflow-auto">
            <header className="mb-3 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-100">{monthLabel}</p>
                <p className="text-[11px] text-slate-400">
                  {view === "day" && "High-resolution schedule for one day."}
                  {view === "week" && "Clinic view for the current week across providers."}
                  {view === "month" && "Monthly occupancy overview (multi-doctor)."}
                </p>
              </div>
            </header>

            {view === "month" && (
              <MonthView
                days={monthGrid}
                currentDate={currentDate}
                appointments={visibleAppointments}
                providersById={providersById}
                selectedDate={selectedDate}
                onSelectDate={(d) => {
                  setSelectedDate(d);
                  setView("day");
                }}
              />
            )}

            {view === "week" && (
              <WeekView
                days={weekDays}
                appointments={visibleAppointments}
                providersById={providersById}
                onSelectAppointment={(id) => setSelectedAppointmentId(id)}
              />
            )}

            {view === "day" && (
              <DayView
                date={selectedDate}
                appointments={visibleAppointments.filter((a) => isSameDay(new Date(a.startTime), selectedDate))}
                providersById={providersById}
                hours={dayHours}
                onSelectAppointment={(id) => setSelectedAppointmentId(id)}
              />
            )}
          </main>

          {/* ✅ Right rail global (Ads + Assistant) + Calendar cards */}
          <RightRail dark>
            <section className="rounded-2xl border border-slate-800 bg-slate-950/80 p-3 space-y-2">
              <p className="text-[11px] font-semibold tracking-[0.18em] uppercase text-slate-400">
                Day overview
              </p>
              <p className="text-xs text-slate-200">
                {selectedDate.toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
              <p className="text-[11px] text-slate-400">
                {
                  visibleAppointments.filter((a) => isSameDay(new Date(a.startTime), selectedDate)).length
                }{" "}
                appointment(s) for selected providers.
              </p>
            </section>

            <section className="rounded-2xl border border-slate-800 bg-slate-950/80 p-3 space-y-2">
              <p className="text-[11px] font-semibold tracking-[0.18em] uppercase text-slate-400">
                Selected appointment
              </p>

              {!selectedAppointment && (
                <p className="text-[11px] text-slate-500">
                  Click on an appointment card to see details here.
                </p>
              )}

              {selectedAppointment && (
                <div className="space-y-1 text-[11px] text-slate-200">
                  <p className="text-sm font-semibold">{selectedAppointment.patientName}</p>
                  <p className="text-slate-400">
                    {formatTimeLabel(new Date(selectedAppointment.startTime))} –{" "}
                    {formatTimeLabel(new Date(selectedAppointment.endTime))}
                  </p>
                  <p className="text-slate-400">
                    {providersById[selectedAppointment.providerId]?.name} · {selectedAppointment.specialty}
                  </p>
                  {selectedAppointment.room && <p className="text-slate-400">Room: {selectedAppointment.room}</p>}
                  {selectedAppointment.notes && <p className="text-slate-300">Notes: {selectedAppointment.notes}</p>}
                  <span className="inline-flex mt-1 rounded-full border border-slate-700 px-2 py-0.5 text-[10px] uppercase">
                    {selectedAppointment.status}
                  </span>
                </div>
              )}
            </section>

            <section className="rounded-2xl border border-slate-800 bg-slate-950/80 p-3 space-y-2">
              <p className="text-[11px] font-semibold tracking-[0.18em] uppercase text-slate-400">
                Quick create (demo)
              </p>
              <form onSubmit={handleCreateAppointment} className="space-y-2">
                <div>
                  <label className="block text-[11px] text-slate-300 mb-0.5">Patient</label>
                  <input
                    value={newPatientName}
                    onChange={(e) => setNewPatientName(e.target.value)}
                    className="w-full rounded-lg border border-slate-700 bg-slate-950/80 px-2 py-1 text-[11px] outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-500/60"
                    placeholder="Patient name"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-slate-300 mb-0.5">Provider</label>
                  <select
                    value={newProviderId}
                    onChange={(e) => setNewProviderId(e.target.value)}
                    className="w-full rounded-lg border border-slate-700 bg-slate-950/80 px-2 py-1 text-[11px] outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-500/60"
                  >
                    {PROVIDERS.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} · {p.specialty}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] text-slate-300 mb-0.5">Start</label>
                    <input
                      type="time"
                      value={newStartTime}
                      onChange={(e) => setNewStartTime(e.target.value)}
                      className="w-full rounded-lg border border-slate-700 bg-slate-950/80 px-2 py-1 text-[11px] outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-500/60"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-300 mb-0.5">Duration (min)</label>
                    <input
                      type="number"
                      min={10}
                      max={480}
                      step={5}
                      value={newDurationMinutes}
                      onChange={(e) => setNewDurationMinutes(Number(e.target.value) || 60)}
                      className="w-full rounded-lg border border-slate-700 bg-slate-950/80 px-2 py-1 text-[11px] outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-500/60"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] text-slate-300 mb-0.5">Notes</label>
                  <textarea
                    rows={2}
                    value={newNotes}
                    onChange={(e) => setNewNotes(e.target.value)}
                    className="w-full rounded-lg border border-slate-700 bg-slate-950/80 px-2 py-1 text-[11px] outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-500/60"
                    placeholder="Short clinical note"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full rounded-lg border border-sky-500/70 bg-sky-500/10 px-3 py-1.5 text-[11px] font-semibold text-sky-300 hover:bg-sky-500/20"
                >
                  (Demo) Add appointment
                </button>

                <p className="text-[10px] text-slate-500 mt-1">
                  In production, this will write to Postgres through /api/appointments.
                </p>
              </form>
            </section>
          </RightRail>
        </div>
      </div>
    </div>
  );
}

/* ---------- Subcomponentes de vista ---------- */

type MonthViewProps = {
  days: { date: Date; isCurrentMonth: boolean }[];
  currentDate: Date;
  appointments: Appointment[];
  providersById: Record<string, Provider>;
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
};

function MonthView({
  days,
  currentDate,
  appointments,
  providersById,
  selectedDate,
  onSelectDate,
}: MonthViewProps) {
  const byDay = useMemo(() => {
    const map: Record<string, Appointment[]> = {};
    for (const a of appointments) {
      const key = formatISODate(new Date(a.startTime));
      if (!map[key]) map[key] = [];
      map[key].push(a);
    }
    return map;
  }, [appointments]);

  const today = new Date();

  return (
    <div>
      <div className="mb-1 grid grid-cols-7 text-center text-[11px] font-medium text-slate-400">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
          <div key={d} className="py-1">
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-px rounded-xl border border-slate-800 bg-slate-900/60">
        {days.map(({ date, isCurrentMonth }) => {
          const key = formatISODate(date);
          const dayAppointments = byDay[key] || [];
          const isToday = isSameDay(date, today);
          const isSelected = isSameDay(date, selectedDate);

          return (
            <button
              key={key + currentDate.getMonth()}
              type="button"
              onClick={() => onSelectDate(date)}
              className={[
                "relative flex h-24 flex-col items-start justify-start p-1.5 text-left text-[11px] transition",
                !isCurrentMonth ? "bg-slate-900/40 text-slate-600" : "bg-slate-900/80 text-slate-100",
                isSelected ? "ring-1 ring-sky-400/80 z-10" : "hover:bg-slate-800",
              ].join(" ")}
            >
              <div className="flex w-full items-center justify-between">
                <span
                  className={[
                    "inline-flex h-5 w-5 items-center justify-center rounded-full border text-[10px]",
                    isToday ? "border-sky-400 text-sky-300" : "border-transparent",
                  ].join(" ")}
                >
                  {date.getDate()}
                </span>

                {dayAppointments.length > 0 && (
                  <span className="rounded-full bg-slate-800 px-1.5 text-[10px] text-slate-200">
                    {dayAppointments.length}
                  </span>
                )}
              </div>

              <div className="mt-1 flex flex-wrap gap-0.5">
                {dayAppointments.slice(0, 4).map((a) => {
                  const prov = providersById[a.providerId];
                  return (
                    <span
                      key={a.id}
                      className={`h-2 w-2 rounded-full ${prov?.color ?? "bg-slate-500"}`}
                    />
                  );
                })}
                {dayAppointments.length > 4 && (
                  <span className="text-[9px] text-slate-400">+{dayAppointments.length - 4}</span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

type WeekViewProps = {
  days: Date[];
  appointments: Appointment[];
  providersById: Record<string, Provider>;
  onSelectAppointment: (id: string) => void;
};

function WeekView({ days, appointments, providersById, onSelectAppointment }: WeekViewProps) {
  const byDay = useMemo(() => {
    const map: Record<string, Appointment[]> = {};
    for (const a of appointments) {
      const key = formatISODate(new Date(a.startTime));
      if (!map[key]) map[key] = [];
      map[key].push(a);
    }
    for (const key of Object.keys(map)) {
      map[key].sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
    }
    return map;
  }, [appointments]);

  return (
    <div className="grid grid-cols-7 gap-2">
      {days.map((d) => {
        const key = formatISODate(d);
        const dayAppointments = byDay[key] || [];
        return (
          <div
            key={key}
            className="rounded-2xl border border-slate-800 bg-slate-950/80 p-2 flex flex-col text-[11px]"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-slate-200">
                {d.toLocaleDateString("en-US", { weekday: "short", day: "numeric" })}
              </span>
              <span className="text-[10px] text-slate-500">{dayAppointments.length} appt.</span>
            </div>

            <div className="space-y-1.5 max-h-64 overflow-y-auto">
              {dayAppointments.length === 0 && <p className="text-[10px] text-slate-600">No appointments.</p>}

              {dayAppointments.map((a) => {
                const prov = providersById[a.providerId];
                return (
                  <button
                    key={a.id}
                    type="button"
                    onClick={() => onSelectAppointment(a.id)}
                    className="w-full rounded-xl border border-slate-800 bg-slate-900/80 px-2 py-1.5 text-left hover:border-sky-400 hover:bg-slate-900"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] text-slate-400">{formatTimeLabel(new Date(a.startTime))}</span>
                      <span className={`h-2 w-8 rounded-full ${prov?.color ?? "bg-slate-500"}`} />
                    </div>
                    <p className="text-[11px] text-slate-100 truncate">{a.patientName}</p>
                    <p className="text-[10px] text-slate-400 truncate">
                      {prov?.name} · {a.specialty}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

type DayViewProps = {
  date: Date;
  appointments: Appointment[];
  providersById: Record<string, Provider>;
  hours: number[];
  onSelectAppointment: (id: string) => void;
};

function DayView({ date, appointments, providersById, hours, onSelectAppointment }: DayViewProps) {
  const byHour = useMemo(() => {
    const map: Record<number, Appointment[]> = {};
    for (const a of appointments) {
      const d = new Date(a.startTime);
      const h = d.getHours();
      if (!map[h]) map[h] = [];
      map[h].push(a);
    }
    for (const h of Object.keys(map)) {
      map[Number(h)].sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
    }
    return map;
  }, [appointments]);

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-3 text-[11px]">
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs text-slate-200">
          {date.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
        </p>
        <p className="text-[10px] text-slate-500">High-resolution timeline · {appointments.length} appt.</p>
      </div>

      <div className="max-h-[420px] overflow-y-auto border-t border-slate-800 pt-2">
        {hours.map((h) => {
          const hourLabel = `${h.toString().padStart(2, "0")}:00`;
          const hourAppointments = byHour[h] || [];

          return (
            <div key={h} className="flex items-start gap-3 py-1.5">
              <div className="w-14 text-[10px] text-slate-500 mt-1">{hourLabel}</div>

              <div className="flex-1 space-y-1">
                {hourAppointments.length === 0 && (
                  <div className="h-6 rounded-lg border border-dashed border-slate-800/80 bg-slate-950/40" />
                )}

                {hourAppointments.map((a) => {
                  const prov = providersById[a.providerId];
                  return (
                    <button
                      key={a.id}
                      type="button"
                      onClick={() => onSelectAppointment(a.id)}
                      className="w-full rounded-lg border border-slate-800 bg-slate-900/90 px-2 py-1 text-left hover:border-sky-400 hover:bg-slate-900"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-[11px] text-slate-100 truncate">{a.patientName}</p>
                        <span
                          className={`h-5 w-5 rounded-full flex items-center justify-center text-[9px] font-semibold ${
                            prov?.color ?? "bg-slate-600"
                          }`}
                        >
                          {prov?.initials ?? "DR"}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400 truncate">
                        {formatTimeLabel(new Date(a.startTime))} – {formatTimeLabel(new Date(a.endTime))} ·{" "}
                        {prov?.name ?? ""} · {a.specialty}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ---------- NavLink simple para sidebar ---------- */

type NavLinkProps = {
  href: string;
  label: string;
  active?: boolean;
};

function NavLink({ href, label, active }: NavLinkProps) {
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
