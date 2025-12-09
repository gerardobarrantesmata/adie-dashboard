"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";

type AppointmentStatus = "scheduled" | "checked_in" | "completed" | "cancelled";

type Appointment = {
  id: string;
  patientName: string;
  specialty: string;
  startTime: string; // ISO string
  endTime: string; // ISO string
  status: AppointmentStatus;
  notes?: string;
};

const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// 👉 Helpers de fechas
function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function endOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
}

function addDays(date: Date, days: number) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
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
  // HH:MM AM/PM
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
}

// 👉 Construye la grilla (6 filas x 7 columnas)
function buildCalendarDays(currentMonth: Date) {
  const start = startOfMonth(currentMonth);
  const end = endOfMonth(currentMonth);

  const startWeekDay = start.getDay(); // 0 (Sun) - 6 (Sat)
  const daysInMonth = end.getDate();

  // Primer día mostrado en la grilla (domingo antes o igual al primer día del mes)
  const gridStart = addDays(start, -startWeekDay);

  const totalCells = 6 * 7; // 6 semanas
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

// 👉 Unos datos de prueba para que veas la agenda viva
const mockAppointments: Appointment[] = [
  {
    id: "1",
    patientName: "Juan Pérez",
    specialty: "Endodontics",
    startTime: new Date().toISOString(),
    endTime: new Date(new Date().getTime() + 30 * 60 * 1000).toISOString(),
    status: "scheduled",
    notes: "Dolor intenso en 2.6",
  },
  {
    id: "2",
    patientName: "María López",
    specialty: "Prosthodontics",
    startTime: new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      new Date().getDate() + 1,
      10,
      0
    ).toISOString(),
    endTime: new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      new Date().getDate() + 1,
      11,
      0
    ).toISOString(),
    status: "scheduled",
    notes: "Prueba de prótesis fija",
  },
];

export default function CalendarPage() {
  const [currentMonth, setCurrentMonth] = useState<Date>(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  // Para el formulario rápido
  const [newPatientName, setNewPatientName] = useState("");
  const [newSpecialty, setNewSpecialty] = useState("General Dentistry");
  const [newStartHour, setNewStartHour] = useState("09:00");
  const [newDurationMinutes, setNewDurationMinutes] = useState(30);

  // Cargar citas (por ahora mock, luego: fetch a /api/appointments)
  useEffect(() => {
    setAppointments(mockAppointments);
  }, []);

  const calendarDays = useMemo(
    () => buildCalendarDays(currentMonth),
    [currentMonth]
  );

  const monthLabel = useMemo(() => {
    return currentMonth.toLocaleString("en-US", {
      month: "long",
      year: "numeric",
    });
  }, [currentMonth]);

  // Citas agrupadas por día (YYYY-MM-DD)
  const appointmentsByDay = useMemo(() => {
    const map: Record<string, Appointment[]> = {};

    for (const appt of appointments) {
      const dateKey = formatISODate(new Date(appt.startTime));
      if (!map[dateKey]) map[dateKey] = [];
      map[dateKey].push(appt);
    }

    return map;
  }, [appointments]);

  const selectedDateKey = formatISODate(selectedDate);
  const selectedDayAppointments = appointmentsByDay[selectedDateKey] || [];

  function goToPrevMonth() {
    setCurrentMonth(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1)
    );
  }

  function goToNextMonth() {
    setCurrentMonth(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1)
    );
  }

  function goToToday() {
    const now = new Date();
    const first = new Date(now.getFullYear(), now.getMonth(), 1);
    setCurrentMonth(first);
    setSelectedDate(now);
  }

  function handleCreateAppointment(e: React.FormEvent) {
    e.preventDefault();

    if (!newPatientName.trim()) return;

    const [hour, minute] = newStartHour.split(":").map(Number);
    const start = new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth(),
      selectedDate.getDate(),
      hour,
      minute
    );
    const end = new Date(start.getTime() + newDurationMinutes * 60 * 1000);

    const newAppt: Appointment = {
      id: Math.random().toString(36).slice(2),
      patientName: newPatientName.trim(),
      specialty: newSpecialty,
      startTime: start.toISOString(),
      endTime: end.toISOString(),
      status: "scheduled",
      notes: "",
    };

    setAppointments((prev) => [...prev, newAppt]);
    setNewPatientName("");
    setNewNotes("");
  }

  const [newNotes, setNewNotes] = useState("");

  return (
    <div className="min-h-screen bg-slate-950/95 text-slate-100">
      {/* Top bar / breadcrumbs */}
      <header className="border-b border-slate-800 bg-slate-900/60 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <div>
            <h1 className="text-sm font-semibold tracking-[0.16em] text-amber-300/90 uppercase">
              ADIE • Calendar
            </h1>
            <p className="mt-1 text-xs text-slate-400">
              Agenda clínica centralizada para todas las especialidades.
            </p>
          </div>
          <nav className="flex gap-2 text-xs">
            <Link
              href="/dashboard"
              className="rounded-lg border border-slate-700/70 px-3 py-1 hover:border-amber-400 hover:text-amber-300"
            >
              Dashboard
            </Link>
            <Link
              href="/patients"
              className="rounded-lg border border-slate-700/70 px-3 py-1 hover:border-amber-400 hover:text-amber-300"
            >
              Patients
            </Link>
            <Link
              href="/specialties"
              className="rounded-lg border border-slate-700/70 px-3 py-1 hover:border-amber-400 hover:text-amber-300"
            >
              Specialties
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-4 lg:flex-row">
        {/* Columna izquierda: Calendario mensual */}
        <section className="flex-1 rounded-2xl border border-slate-800 bg-slate-900/70 p-4 shadow-[0_18px_60px_rgba(15,23,42,0.85)]">
          {/* Header del mes */}
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-semibold text-slate-100">
                {monthLabel}
              </h2>
              <p className="text-[11px] text-slate-400">
                Vista global de todas las citas. Click en un día para ver
                detalles.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={goToPrevMonth}
                className="rounded-lg border border-slate-700 px-2 py-1 text-xs hover:border-amber-400"
              >
                ◀
              </button>
              <button
                onClick={goToToday}
                className="rounded-lg border border-slate-700 px-3 py-1 text-xs font-medium text-amber-300 hover:border-amber-400"
              >
                Today
              </button>
              <button
                onClick={goToNextMonth}
                className="rounded-lg border border-slate-700 px-2 py-1 text-xs hover:border-amber-400"
              >
                ▶
              </button>
            </div>
          </div>

          {/* Nombres de días */}
          <div className="mb-1 grid grid-cols-7 text-center text-[11px] font-medium text-slate-400">
            {dayNames.map((d) => (
              <div key={d} className="py-1">
                {d}
              </div>
            ))}
          </div>

          {/* Grilla de días */}
          <div className="grid grid-cols-7 gap-px rounded-xl border border-slate-800 bg-slate-900/60">
            {calendarDays.map(({ date, isCurrentMonth }) => {
              const key = formatISODate(date);
              const dayAppointments = appointmentsByDay[key] || [];
              const isToday = isSameDay(date, new Date());
              const isSelected = isSameDay(date, selectedDate);

              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setSelectedDate(date)}
                  className={[
                    "relative flex h-20 flex-col items-start justify-start p-1.5 text-left text-[11px] transition",
                    !isCurrentMonth
                      ? "bg-slate-900/40 text-slate-600"
                      : "bg-slate-900/80 text-slate-100",
                    isSelected
                      ? "ring-1 ring-amber-400/80 z-10"
                      : "hover:bg-slate-800/80",
                  ].join(" ")}
                >
                  <div className="flex w-full items-center justify-between">
                    <span
                      className={[
                        "inline-flex h-5 w-5 items-center justify-center rounded-full border text-[10px]",
                        isToday
                          ? "border-amber-400 text-amber-300"
                          : "border-transparent",
                      ].join(" ")}
                    >
                      {date.getDate()}
                    </span>
                    {dayAppointments.length > 0 && (
                      <span className="rounded-full bg-emerald-500/20 px-1.5 text-[10px] text-emerald-300">
                        {dayAppointments.length}
                      </span>
                    )}
                  </div>

                  {/* Mini chips de citas */}
                  <div className="mt-1 flex flex-col gap-0.5">
                    {dayAppointments.slice(0, 3).map((appt) => (
                      <div
                        key={appt.id}
                        className="truncate rounded-md bg-slate-800/80 px-1 py-0.5 text-[10px]"
                      >
                        {formatTimeLabel(new Date(appt.startTime))} •{" "}
                        {appt.patientName}
                      </div>
                    ))}
                    {dayAppointments.length > 3 && (
                      <div className="text-[10px] text-slate-400">
                        +{dayAppointments.length - 3} more
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* Columna derecha: Detalle del día seleccionado + nuevo evento */}
        <section className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900/70 p-4 shadow-[0_18px_60px_rgba(15,23,42,0.85)]">
          <header className="mb-3">
            <h3 className="text-xs font-semibold tracking-[0.16em] text-amber-300/90 uppercase">
              Day overview
            </h3>
            <p className="mt-1 text-xs text-slate-300">
              {selectedDate.toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          </header>

          {/* Lista de citas del día */}
          <div className="mb-4 max-h-56 space-y-2 overflow-y-auto rounded-xl border border-slate-800 bg-slate-950/60 p-2">
            {selectedDayAppointments.length === 0 && (
              <p className="text-[11px] text-slate-500">
                No hay citas para este día todavía.
              </p>
            )}

            {selectedDayAppointments
              .slice()
              .sort(
                (a, b) =>
                  new Date(a.startTime).getTime() -
                  new Date(b.startTime).getTime()
              )
              .map((appt) => (
                <div
                  key={appt.id}
                  className="rounded-lg border border-slate-800 bg-slate-900/80 p-2 text-[11px]"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="font-semibold text-slate-100">
                      {appt.patientName}
                    </div>
                    <span
                      className={[
                        "rounded-full px-2 py-0.5 text-[10px]",
                        appt.status === "scheduled" &&
                          "bg-sky-500/15 text-sky-300",
                        appt.status === "checked_in" &&
                          "bg-amber-500/15 text-amber-300",
                        appt.status === "completed" &&
                          "bg-emerald-500/15 text-emerald-300",
                        appt.status === "cancelled" &&
                          "bg-rose-500/15 text-rose-300",
                      ].join(" ")}
                    >
                      {appt.status}
                    </span>
                  </div>
                  <div className="mt-0.5 text-[10px] text-slate-400">
                    {formatTimeLabel(new Date(appt.startTime))} –{" "}
                    {formatTimeLabel(new Date(appt.endTime))} •{" "}
                    {appt.specialty}
                  </div>
                  {appt.notes && (
                    <p className="mt-1 text-[10px] text-slate-300">
                      {appt.notes}
                    </p>
                  )}
                </div>
              ))}
          </div>

          {/* Formulario rápido: crear cita en memoria */}
          <div className="mt-2">
            <h4 className="mb-2 text-[11px] font-semibold text-slate-200">
              Quick create appointment
            </h4>
            <form
              onSubmit={handleCreateAppointment}
              className="space-y-2 text-[11px]"
            >
              <div>
                <label className="mb-0.5 block text-slate-300">
                  Patient name
                </label>
                <input
                  value={newPatientName}
                  onChange={(e) => setNewPatientName(e.target.value)}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950/70 px-2 py-1 text-[11px] text-slate-100 outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-500/60"
                  placeholder="Type patient name..."
                />
              </div>

              <div>
                <label className="mb-0.5 block text-slate-300">
                  Specialty
                </label>
                <select
                  value={newSpecialty}
                  onChange={(e) => setNewSpecialty(e.target.value)}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950/70 px-2 py-1 text-[11px] text-slate-100 outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-500/60"
                >
                  <option>General Dentistry</option>
                  <option>Endodontics</option>
                  <option>Prosthodontics</option>
                  <option>Orthodontics</option>
                  <option>Implants</option>
                  <option>Radiology</option>
                  <option>Periodontics</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="mb-0.5 block text-slate-300">
                    Start time
                  </label>
                  <input
                    type="time"
                    value={newStartHour}
                    onChange={(e) => setNewStartHour(e.target.value)}
                    className="w-full rounded-lg border border-slate-700 bg-slate-950/70 px-2 py-1 text-[11px] text-slate-100 outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-500/60"
                  />
                </div>
                <div>
                  <label className="mb-0.5 block text-slate-300">
                    Duration (minutes)
                  </label>
                  <input
                    type="number"
                    min={10}
                    max={480}
                    step={5}
                    value={newDurationMinutes}
                    onChange={(e) =>
                      setNewDurationMinutes(Number(e.target.value) || 30)
                    }
                    className="w-full rounded-lg border border-slate-700 bg-slate-950/70 px-2 py-1 text-[11px] text-slate-100 outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-500/60"
                  />
                </div>
              </div>

              <div>
                <label className="mb-0.5 block text-slate-300">
                  Notes (optional)
                </label>
                <textarea
                  rows={2}
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950/70 px-2 py-1 text-[11px] text-slate-100 outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-500/60"
                  placeholder="Short clinical note..."
                />
              </div>

              <button
                type="submit"
                className="mt-1 w-full rounded-lg border border-amber-500/70 bg-amber-500/10 px-3 py-1.5 text-[11px] font-semibold text-amber-300 hover:bg-amber-500/20"
              >
                Add appointment to this day
              </button>
            </form>
          </div>
        </section>
      </main>
    </div>
  );
}
