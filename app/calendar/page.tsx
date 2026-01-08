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

type Patient = {
  id: string;
  fullName: string;
  dob?: string; // ISO date YYYY-MM-DD (optional)
  phone?: string;
  flags?: string[];
};

type Appointment = {
  id: string;
  patientId: string;
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

function pad2(n: number) {
  return n.toString().padStart(2, "0");
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

/* ---------- Routing helpers (expediente) ---------- */
function patientChartHref(patientId: string) {
  return `/patients/${patientId}`;
}

/* ---------- UI helpers ---------- */

function slugId(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}${Date.now().toString(36).slice(4)}`;
}

function initialsFromName(name: string) {
  const parts = name
    .trim()
    .replace(/\s+/g, " ")
    .split(" ")
    .filter(Boolean);

  const letters = parts
    .filter((w) => !["dr.", "dr", "dra.", "dra"].includes(w.toLowerCase()))
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "");

  return (letters.join("") || "DR").slice(0, 2);
}

const COLOR_OPTIONS: { label: string; value: string }[] = [
  { label: "Emerald", value: "bg-emerald-400" },
  { label: "Cyan", value: "bg-cyan-400" },
  { label: "Violet", value: "bg-violet-400" },
  { label: "Amber", value: "bg-amber-400" },
  { label: "Sky", value: "bg-sky-400" },
  { label: "Rose", value: "bg-rose-400" },
  { label: "Lime", value: "bg-lime-400" },
];

const SPECIALTY_PRESETS = [
  "General Dentistry",
  "Endodontics",
  "Periodontics",
  "Orthodontics",
  "Prosthodontics",
  "Oral Surgery",
  "Pediatric Dentistry",
  "Radiology",
];

/* ---------- MOCK DATA (multi-doctor) ---------- */

const INITIAL_PROVIDERS: Provider[] = [
  { id: "p1", name: "Dr. Ana Perio", specialty: "Periodontics", color: "bg-emerald-400", initials: "AP" },
  { id: "p2", name: "Dr. David Endo", specialty: "Endodontics", color: "bg-cyan-400", initials: "DE" },
  { id: "p3", name: "Dr. María Prosth", specialty: "Prosthodontics", color: "bg-violet-400", initials: "MP" },
  { id: "p4", name: "Dr. Luis Ortho", specialty: "Orthodontics", color: "bg-amber-400", initials: "LO" },
  { id: "p5", name: "Dr. Carla General", specialty: "General Dentistry", color: "bg-sky-400", initials: "CG" },
];

const MOCK_PATIENTS: Patient[] = [
  { id: "pt_juan_perez", fullName: "Juan Pérez", flags: ["Allergy: Penicillin"] },
  { id: "pt_maria_lopez", fullName: "María López" },
  { id: "pt_carlos_vega", fullName: "Carlos Vega", flags: ["High BP"] },
  { id: "pt_ana_rodriguez", fullName: "Ana Rodríguez" },
  { id: "pt_david_chen", fullName: "David Chen" },
  { id: "pt_laura_park", fullName: "Laura Park" },
  { id: "pt_gina_park", fullName: "Gina Park" },
  { id: "pt_pablo_ruiz", fullName: "Pablo Ruiz" },
];

const MOCK_APPOINTMENTS: Appointment[] = (() => {
  const now = new Date();
  const baseDay = startOfDay(now);

  function mk(
    offsetDays: number,
    hour: number,
    minute: number,
    durationMin: number,
    providerId: string,
    patientId: string,
    patientName: string,
    specialty: string,
    status: AppointmentStatus,
    room: string,
    notes?: string
  ): Appointment {
    const start = addDays(baseDay, offsetDays);
    start.setHours(hour, minute, 0, 0);
    const end = new Date(start.getTime() + durationMin * 60 * 1000);

    return {
      id: Math.random().toString(36).slice(2),
      patientId,
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
    mk(0, 8, 0, 60, "p1", "pt_juan_perez", "Juan Pérez", "Periodontics", "scheduled", "Room 2", "Deep scaling UL."),
    mk(0, 9, 0, 90, "p2", "pt_maria_lopez", "María López", "Endodontics", "scheduled", "Room 3", "RCT 2.6"),
    mk(0, 11, 0, 45, "p5", "pt_carlos_vega", "Carlos Vega", "General Dentistry", "checked_in", "Room 1", "Emergency pain."),
    mk(1, 10, 0, 60, "p3", "pt_ana_rodriguez", "Ana Rodríguez", "Prosthodontics", "scheduled", "Room 4", "Crown delivery."),
    mk(1, 14, 0, 30, "p4", "pt_david_chen", "David Chen", "Orthodontics", "scheduled", "Room 5", "Aligner check 6/24."),
    mk(-1, 15, 0, 60, "p1", "pt_laura_park", "Laura Park", "Periodontics", "completed", "Room 2", "Post-op control."),
    mk(3, 9, 0, 120, "p3", "pt_gina_park", "Gina Park", "Prosthodontics", "scheduled", "Room 4", "Implant prosth planning."),
    mk(3, 16, 0, 45, "p5", "pt_pablo_ruiz", "Pablo Ruiz", "General Dentistry", "scheduled", "Room 1", "Composite restorations."),
  ];
})();

/* ---------- Componente principal ---------- */

type CreateSeed = {
  date: Date;
  time?: string; // "HH:MM"
};

export default function CalendarPage() {
  const [view, setView] = useState<CalendarView>("week");
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  // ✅ providers ahora es editable en UI
  const [providers, setProviders] = useState<Provider[]>(INITIAL_PROVIDERS);
  const [selectedProviderIds, setSelectedProviderIds] = useState<string[]>(() => INITIAL_PROVIDERS.map((p) => p.id));

  // ✅ appointments es mutable para poder "crear" citas en UI.
  const [appointments, setAppointments] = useState<Appointment[]>(MOCK_APPOINTMENTS);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<string | null>(null);

  // ✅ UI: modal de creación de cita
  const [createOpen, setCreateOpen] = useState(false);
  const [createSeed, setCreateSeed] = useState<CreateSeed>({ date: new Date(), time: "09:00" });

  // ✅ UI: modal para providers
  const [providersOpen, setProvidersOpen] = useState(false);

  // ✅ “Paciente seleccionado” dentro del modal (con búsqueda)
  const [patientQuery, setPatientQuery] = useState("");
  const [newPatientId, setNewPatientId] = useState<string>(MOCK_PATIENTS[0]?.id ?? "");
  const [newProviderId, setNewProviderId] = useState(() => providers[0]?.id ?? "");
  const [newDateISO, setNewDateISO] = useState<string>(formatISODate(new Date()));
  const [newStartTime, setNewStartTime] = useState("09:00");
  const [newDurationMinutes, setNewDurationMinutes] = useState(60);
  const [newNotes, setNewNotes] = useState("");
  const [newRoom, setNewRoom] = useState("TBD");

  // ✅ Provider form (add)
  const [provName, setProvName] = useState("");
  const [provSpecialty, setProvSpecialty] = useState<string>(SPECIALTY_PRESETS[0]);
  const [provColor, setProvColor] = useState<string>(COLOR_OPTIONS[0].value);
  const [provInitials, setProvInitials] = useState<string>("");

  const selectedAppointment = useMemo(
    () => appointments.find((a) => a.id === selectedAppointmentId) ?? null,
    [appointments, selectedAppointmentId]
  );

  const providersById = useMemo(() => {
    const map: Record<string, Provider> = {};
    for (const p of providers) map[p.id] = p;
    return map;
  }, [providers]);

  const patientsById = useMemo(() => {
    const map: Record<string, Patient> = {};
    for (const p of MOCK_PATIENTS) map[p.id] = p;
    return map;
  }, []);

  const filteredPatients = useMemo(() => {
    const q = patientQuery.trim().toLowerCase();
    if (!q) return MOCK_PATIENTS.slice(0, 8);
    return MOCK_PATIENTS.filter((p) => p.fullName.toLowerCase().includes(q)).slice(0, 8);
  }, [patientQuery]);

  const legendItems = useMemo(() => {
    // Un item por specialty (toma el primer color que encuentre)
    const map = new Map<string, string>();
    for (const p of providers) {
      if (!map.has(p.specialty)) map.set(p.specialty, p.color);
    }
    return Array.from(map.entries()).map(([specialty, color]) => ({ specialty, color }));
  }, [providers]);

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

  // 7AM - 7PM
  const dayHours = useMemo(() => Array.from({ length: 13 }, (_, i) => 7 + i), []);

  function openCreate(seed: CreateSeed) {
    const seedDate = seed.date ?? new Date();
    const seedTime = seed.time ?? "09:00";

    setCreateSeed({ date: seedDate, time: seedTime });
    setSelectedDate(seedDate);

    setNewDateISO(formatISODate(seedDate));
    setNewStartTime(seedTime);
    setNewDurationMinutes(60);
    setNewNotes("");
    setNewRoom("TBD");

    // Si el provider actual no existe (por cambios), usar el primero
    const providerStillExists = providers.some((p) => p.id === newProviderId);
    const safeProviderId = providerStillExists ? newProviderId : providers[0]?.id ?? "";

    if (safeProviderId) setNewProviderId(safeProviderId);
    if (!newPatientId && MOCK_PATIENTS[0]?.id) setNewPatientId(MOCK_PATIENTS[0].id);

    setCreateOpen(true);
  }

  function handleCreateAppointment(e: React.FormEvent) {
    e.preventDefault();
    if (!newPatientId || !newProviderId || !newDateISO || !newStartTime) return;

    const [h, m] = newStartTime.split(":").map((n) => Number(n));
    const [yy, mm, dd] = newDateISO.split("-").map((n) => Number(n));

    const start = new Date(yy, mm - 1, dd, h, m, 0, 0);
    const end = new Date(start.getTime() + (Number(newDurationMinutes) || 60) * 60 * 1000);

    const provider = providersById[newProviderId];
    const patient = patientsById[newPatientId];

    const appt: Appointment = {
      id: Math.random().toString(36).slice(2),
      patientId: newPatientId,
      patientName: patient?.fullName ?? "Unknown patient",
      providerId: newProviderId,
      specialty: provider?.specialty ?? "General Dentistry",
      startTime: start.toISOString(),
      endTime: end.toISOString(),
      status: "scheduled",
      room: newRoom?.trim() || "TBD",
      notes: newNotes.trim() || undefined,
    };

    setAppointments((prev) => {
      const next = [appt, ...prev];
      next.sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
      return next;
    });

    setSelectedAppointmentId(appt.id);
    setSelectedDate(startOfDay(start));
    setView("day");
    setCreateOpen(false);
  }

  function openProvidersModal() {
    setProvName("");
    setProvSpecialty(SPECIALTY_PRESETS[0]);
    setProvColor(COLOR_OPTIONS[0].value);
    setProvInitials("");
    setProvidersOpen(true);
  }

  function handleAddProvider(e: React.FormEvent) {
    e.preventDefault();
    const name = provName.trim();
    const specialty = provSpecialty.trim();
    if (!name || !specialty) return;

    const newP: Provider = {
      id: slugId("prov"),
      name,
      specialty,
      color: provColor,
      initials: (provInitials.trim() || initialsFromName(name)).toUpperCase().slice(0, 2),
    };

    setProviders((prev) => {
      const next = [...prev, newP];
      return next;
    });

    // ✅ automáticamente seleccionado y disponible para citas
    setSelectedProviderIds((prev) => (prev.includes(newP.id) ? prev : [...prev, newP.id]));
    setNewProviderId(newP.id);

    setProvidersOpen(false);
  }

  function handleDeleteProvider(id: string) {
    const hasAppts = appointments.some((a) => a.providerId === id);
    const ok = window.confirm(
      hasAppts
        ? "This provider has appointments. Delete anyway? (Appointments will remain but may not display if provider is removed.)"
        : "Delete this provider?"
    );
    if (!ok) return;

    setProviders((prev) => prev.filter((p) => p.id !== id));
    setSelectedProviderIds((prev) => prev.filter((pid) => pid !== id));

    // si el provider seleccionado para “create appointment” fue borrado, moverlo al primero
    if (newProviderId === id) {
      const nextId = providers.filter((p) => p.id !== id)[0]?.id ?? "";
      if (nextId) setNewProviderId(nextId);
    }
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
            <button
              onClick={() =>
                openCreate({
                  date: selectedDate,
                  time: `${pad2(Math.max(7, Math.min(17, new Date().getHours())))}:00`,
                })
              }
              className="hidden sm:inline-flex items-center rounded-full border border-sky-500/70 bg-sky-500/10 px-3 py-1 text-[11px] font-semibold text-sky-300 hover:bg-sky-500/20"
              title="Create a new appointment"
            >
              + New appointment
            </button>

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
              aria-label="Previous"
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
              aria-label="Next"
            >
              ▶
            </button>
          </div>
        </header>

        {/* Contenido principal */}
        <div className="flex-1 flex flex-col lg:flex-row">
          {/* Filtros izquierda */}
          <section className="w-full lg:w-64 border-b lg:border-b-0 lg:border-r border-slate-800 bg-slate-950/80 px-4 py-4 space-y-4 text-xs">
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-semibold tracking-[0.18em] uppercase text-slate-500">Providers</p>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={openProvidersModal}
                  className="inline-flex items-center rounded-full border border-slate-700 bg-slate-950/60 px-2 py-1 text-[10px] font-semibold text-slate-200 hover:border-sky-400"
                  title="Manage providers"
                >
                  + Provider
                </button>

                <button
                  type="button"
                  onClick={() => openCreate({ date: selectedDate, time: "09:00" })}
                  className="inline-flex items-center rounded-full border border-sky-500/70 bg-sky-500/10 px-2 py-1 text-[10px] font-semibold text-sky-300 hover:bg-sky-500/20"
                  title="Add appointment"
                >
                  + Appt
                </button>
              </div>
            </div>

            <div className="space-y-2">
              {providers.map((p) => {
                const selected = selectedProviderIds.includes(p.id);
                return (
                  <div key={p.id} className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => toggleProvider(p.id)}
                      className={`flex-1 flex items-center justify-between rounded-xl border px-3 py-1.5 text-[11px] ${
                        selected
                          ? "border-sky-500 bg-sky-500/10 text-sky-200"
                          : "border-slate-700 bg-slate-900/80 text-slate-300 hover:border-sky-500/60"
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span
                          className={`h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-semibold ${p.color}`}
                        >
                          {p.initials}
                        </span>
                        <span>
                          <span className="block">{p.name}</span>
                          <span className="block text-[10px] text-slate-400">{p.specialty}</span>
                        </span>
                      </span>
                      <span className={`h-2 w-2 rounded-full ${selected ? "bg-emerald-400" : "bg-slate-600"}`} />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeleteProvider(p.id)}
                      className="shrink-0 rounded-xl border border-slate-800 bg-slate-950/60 px-2 py-1.5 text-[11px] text-slate-400 hover:border-rose-400 hover:text-rose-300"
                      title="Delete provider"
                    >
                      🗑
                    </button>
                  </div>
                );
              })}
            </div>

            <div>
              <p className="text-[11px] font-semibold tracking-[0.18em] uppercase text-slate-500 mb-2">Legend</p>
              <div className="space-y-1 text-[11px] text-slate-400">
                {legendItems.map((it) => (
                  <p key={it.specialty}>
                    <span className={`inline-block h-2 w-2 rounded-full mr-1 ${it.color}`} />
                    {it.specialty}
                  </p>
                ))}
                {legendItems.length === 0 && <p className="text-slate-600">No providers.</p>}
              </div>
            </div>
          </section>

          {/* Vista central (calendar) */}
          <main className="flex-1 border-b lg:border-b-0 lg:border-r border-slate-800 bg-slate-950/80 px-3 md:px-4 py-4 overflow-auto">
            <header className="mb-3 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-100">{monthLabel}</p>
                <p className="text-[11px] text-slate-400">
                  {view === "day" && "Click empty slots to create an appointment. Click a patient to open chart."}
                  {view === "week" && "Click any day column to quick-add. Click a patient to open chart."}
                  {view === "month" && "Click a day to open it, or use + New appointment."}
                </p>
              </div>

              <button
                onClick={() => openCreate({ date: selectedDate, time: "09:00" })}
                className="sm:hidden inline-flex items-center rounded-full border border-sky-500/70 bg-sky-500/10 px-3 py-1 text-[11px] font-semibold text-sky-300 hover:bg-sky-500/20"
              >
                + New
              </button>
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
                onQuickAdd={(date) => openCreate({ date, time: "09:00" })}
              />
            )}

            {view === "day" && (
              <DayView
                date={selectedDate}
                appointments={visibleAppointments.filter((a) => isSameDay(new Date(a.startTime), selectedDate))}
                providersById={providersById}
                hours={dayHours}
                onSelectAppointment={(id) => setSelectedAppointmentId(id)}
                onQuickAdd={(date, time) => openCreate({ date, time })}
              />
            )}
          </main>

          {/* ✅ Right rail */}
          <RightRail dark>
            <section className="rounded-2xl border border-slate-800 bg-slate-950/80 p-3 space-y-2">
              <p className="text-[11px] font-semibold tracking-[0.18em] uppercase text-slate-400">Day overview</p>
              <p className="text-xs text-slate-200">
                {selectedDate.toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
              <p className="text-[11px] text-slate-400">
                {visibleAppointments.filter((a) => isSameDay(new Date(a.startTime), selectedDate)).length} appointment(s)
                for selected providers.
              </p>

              <button
                onClick={() => openCreate({ date: selectedDate, time: "09:00" })}
                className="w-full rounded-lg border border-sky-500/70 bg-sky-500/10 px-3 py-1.5 text-[11px] font-semibold text-sky-300 hover:bg-sky-500/20"
              >
                + Create appointment
              </button>
            </section>

            <section className="rounded-2xl border border-slate-800 bg-slate-950/80 p-3 space-y-2">
              <p className="text-[11px] font-semibold tracking-[0.18em] uppercase text-slate-400">
                Selected appointment
              </p>

              {!selectedAppointment && (
                <p className="text-[11px] text-slate-500">Click on an appointment card to see details here.</p>
              )}

              {selectedAppointment && (
                <div className="space-y-2 text-[11px] text-slate-200">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-semibold leading-tight">{selectedAppointment.patientName}</p>
                      <p className="text-slate-400">
                        {formatTimeLabel(new Date(selectedAppointment.startTime))} –{" "}
                        {formatTimeLabel(new Date(selectedAppointment.endTime))}
                      </p>
                    </div>

                    <span className="inline-flex mt-0.5 rounded-full border border-slate-700 px-2 py-0.5 text-[10px] uppercase">
                      {selectedAppointment.status}
                    </span>
                  </div>

                  <p className="text-slate-400">
                    {providersById[selectedAppointment.providerId]?.name ?? "Unknown provider"} ·{" "}
                    {selectedAppointment.specialty}
                  </p>

                  {selectedAppointment.room && <p className="text-slate-400">Room: {selectedAppointment.room}</p>}
                  {selectedAppointment.notes && <p className="text-slate-300">Notes: {selectedAppointment.notes}</p>}

                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <Link
                      href={patientChartHref(selectedAppointment.patientId)}
                      className="text-center rounded-lg border border-slate-700 bg-slate-900/70 px-2 py-1 text-[11px] text-slate-200 hover:border-sky-400"
                    >
                      Open chart
                    </Link>

                    <button
                      type="button"
                      onClick={() =>
                        openCreate({
                          date: startOfDay(new Date(selectedAppointment.startTime)),
                          time:
                            pad2(new Date(selectedAppointment.startTime).getHours()) +
                            ":" +
                            pad2(new Date(selectedAppointment.startTime).getMinutes()),
                        })
                      }
                      className="rounded-lg border border-slate-700 bg-slate-900/70 px-2 py-1 text-[11px] text-slate-200 hover:border-sky-400"
                    >
                      Duplicate
                    </button>
                  </div>
                </div>
              )}
            </section>

            <section className="rounded-2xl border border-slate-800 bg-slate-950/80 p-3 space-y-2">
              <p className="text-[11px] font-semibold tracking-[0.18em] uppercase text-slate-400">Quick actions</p>

              <div className="space-y-2">
                <button
                  onClick={() => openCreate({ date: selectedDate, time: "09:00" })}
                  className="w-full rounded-lg border border-sky-500/70 bg-sky-500/10 px-3 py-1.5 text-[11px] font-semibold text-sky-300 hover:bg-sky-500/20"
                >
                  + Add appointment
                </button>

                <button
                  onClick={openProvidersModal}
                  className="w-full rounded-lg border border-slate-700 bg-slate-900/70 px-3 py-1.5 text-[11px] text-slate-200 hover:border-sky-400"
                >
                  + Add provider
                </button>

                <Link
                  href="/patients"
                  className="block text-center rounded-lg border border-slate-700 bg-slate-900/70 px-3 py-1.5 text-[11px] text-slate-200 hover:border-sky-400"
                >
                  Go to patients
                </Link>

                <p className="text-[10px] text-slate-500">
                  Production: save providers in Postgres via <code className="text-slate-400">/api/providers</code>.
                </p>
              </div>
            </section>
          </RightRail>
        </div>
      </div>

      {/* ✅ Create Appointment Modal */}
      {createOpen && (
        <CreateAppointmentModal
          title="Create Appointment"
          seed={createSeed}
          patients={MOCK_PATIENTS}
          filteredPatients={filteredPatients}
          providers={providers}
          patientQuery={patientQuery}
          setPatientQuery={setPatientQuery}
          newPatientId={newPatientId}
          setNewPatientId={setNewPatientId}
          newProviderId={newProviderId}
          setNewProviderId={setNewProviderId}
          newDateISO={newDateISO}
          setNewDateISO={setNewDateISO}
          newStartTime={newStartTime}
          setNewStartTime={setNewStartTime}
          newDurationMinutes={newDurationMinutes}
          setNewDurationMinutes={setNewDurationMinutes}
          newRoom={newRoom}
          setNewRoom={setNewRoom}
          newNotes={newNotes}
          setNewNotes={setNewNotes}
          onClose={() => setCreateOpen(false)}
          onSubmit={handleCreateAppointment}
        />
      )}

      {/* ✅ Manage Providers Modal */}
      {providersOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-3"
          role="dialog"
          aria-modal="true"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setProvidersOpen(false);
          }}
        >
          <div className="w-full max-w-xl rounded-2xl border border-slate-800 bg-slate-950 shadow-[0_30px_120px_rgba(0,0,0,0.65)]">
            <div className="flex items-start justify-between gap-3 border-b border-slate-800 px-4 py-3">
              <div>
                <p className="text-xs font-semibold text-slate-100">Manage Providers</p>
                <p className="text-[11px] text-slate-400">Add providers and assign specialty + color.</p>
              </div>
              <button
                onClick={() => setProvidersOpen(false)}
                className="rounded-lg border border-slate-800 bg-slate-900/70 px-2 py-1 text-[11px] text-slate-200 hover:border-sky-400"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddProvider} className="px-4 py-4 space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] text-slate-300 mb-1">Provider name</label>
                  <input
                    value={provName}
                    onChange={(e) => {
                      const v = e.target.value;
                      setProvName(v);
                      if (!provInitials.trim()) setProvInitials(initialsFromName(v));
                    }}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950/80 px-3 py-2 text-[11px] outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-500/60"
                    placeholder="e.g., Dr. Sofía Rivera"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-slate-300 mb-1">Initials</label>
                  <input
                    value={provInitials}
                    onChange={(e) => setProvInitials(e.target.value.toUpperCase().slice(0, 2))}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950/80 px-3 py-2 text-[11px] outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-500/60"
                    placeholder="SR"
                    maxLength={2}
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-slate-300 mb-1">Specialty</label>
                  <input
                    list="specialty_presets"
                    value={provSpecialty}
                    onChange={(e) => setProvSpecialty(e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950/80 px-3 py-2 text-[11px] outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-500/60"
                    placeholder="Choose or type…"
                  />
                  <datalist id="specialty_presets">
                    {SPECIALTY_PRESETS.map((s) => (
                      <option key={s} value={s} />
                    ))}
                  </datalist>
                </div>

                <div>
                  <label className="block text-[11px] text-slate-300 mb-1">Color</label>
                  <select
                    value={provColor}
                    onChange={(e) => setProvColor(e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950/80 px-3 py-2 text-[11px] outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-500/60"
                  >
                    {COLOR_OPTIONS.map((c) => (
                      <option key={c.value} value={c.value}>
                        {c.label}
                      </option>
                    ))}
                  </select>

                  <div className="mt-2 flex items-center gap-2 text-[11px] text-slate-400">
                    <span className={`h-3 w-3 rounded-full ${provColor}`} />
                    Preview
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-800">
                <p className="text-[10px] text-slate-500">
                  Production: persist this in Postgres and load in calendar.
                </p>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setProvidersOpen(false)}
                    className="rounded-xl border border-slate-800 bg-slate-900/70 px-3 py-2 text-[11px] text-slate-200 hover:border-sky-400"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-xl border border-sky-500/70 bg-sky-500/10 px-3 py-2 text-[11px] font-semibold text-sky-300 hover:bg-sky-500/20"
                  >
                    Save Provider
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <p className="text-[11px] font-semibold tracking-[0.18em] uppercase text-slate-500 mb-2">
                  Current providers
                </p>

                <div className="space-y-2">
                  {providers.map((p) => (
                    <div
                      key={p.id}
                      className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950/60 px-3 py-2"
                    >
                      <div className="flex items-center gap-2">
                        <span className={`h-7 w-7 rounded-full flex items-center justify-center text-[10px] font-semibold ${p.color}`}>
                          {p.initials}
                        </span>
                        <div>
                          <p className="text-[11px] text-slate-100">{p.name}</p>
                          <p className="text-[10px] text-slate-400">{p.specialty}</p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleDeleteProvider(p.id)}
                        className="rounded-lg border border-slate-800 bg-slate-900/60 px-2 py-1 text-[11px] text-slate-300 hover:border-rose-400 hover:text-rose-300"
                      >
                        Delete
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------- Modal Create Appointment (igual que antes) ---------- */

type CreateAppointmentModalProps = {
  title: string;
  seed: CreateSeed;
  patients: Patient[];
  filteredPatients: Patient[];
  providers: Provider[];

  patientQuery: string;
  setPatientQuery: (v: string) => void;

  newPatientId: string;
  setNewPatientId: (v: string) => void;

  newProviderId: string;
  setNewProviderId: (v: string) => void;

  newDateISO: string;
  setNewDateISO: (v: string) => void;

  newStartTime: string;
  setNewStartTime: (v: string) => void;

  newDurationMinutes: number;
  setNewDurationMinutes: (v: number) => void;

  newRoom: string;
  setNewRoom: (v: string) => void;

  newNotes: string;
  setNewNotes: (v: string) => void;

  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
};

function CreateAppointmentModal(props: CreateAppointmentModalProps) {
  const {
    title,
    seed,
    patients,
    filteredPatients,
    providers,
    patientQuery,
    setPatientQuery,
    newPatientId,
    setNewPatientId,
    newProviderId,
    setNewProviderId,
    newDateISO,
    setNewDateISO,
    newStartTime,
    setNewStartTime,
    newDurationMinutes,
    setNewDurationMinutes,
    newRoom,
    setNewRoom,
    newNotes,
    setNewNotes,
    onClose,
    onSubmit,
  } = props;

  const selectedPatient = useMemo(
    () => patients.find((p) => p.id === newPatientId) ?? null,
    [patients, newPatientId]
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-3"
      role="dialog"
      aria-modal="true"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-xl rounded-2xl border border-slate-800 bg-slate-950 shadow-[0_30px_120px_rgba(0,0,0,0.65)]">
        <div className="flex items-start justify-between gap-3 border-b border-slate-800 px-4 py-3">
          <div>
            <p className="text-xs font-semibold text-slate-100">{title}</p>
            <p className="text-[11px] text-slate-400">
              {seed.date.toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
                year: "numeric",
              })}{" "}
              · {seed.time ?? "—"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg border border-slate-800 bg-slate-900/70 px-2 py-1 text-[11px] text-slate-200 hover:border-sky-400"
          >
            ✕
          </button>
        </div>

        <form onSubmit={onSubmit} className="px-4 py-4 space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Patient */}
            <div className="space-y-1">
              <label className="block text-[11px] text-slate-300">Find patient</label>
              <input
                value={patientQuery}
                onChange={(e) => setPatientQuery(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-950/80 px-3 py-2 text-[11px] outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-500/60"
                placeholder="Search by name…"
              />
              <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-1">
                {filteredPatients.length === 0 && (
                  <div className="px-2 py-2 text-[11px] text-slate-500">No matches.</div>
                )}
                {filteredPatients.map((p) => {
                  const active = p.id === newPatientId;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setNewPatientId(p.id)}
                      className={`w-full flex items-center justify-between rounded-lg px-2 py-1 text-[11px] ${
                        active ? "bg-sky-500/10 text-sky-200" : "text-slate-200 hover:bg-slate-900/70"
                      }`}
                    >
                      <span className="truncate">{p.fullName}</span>
                      {active && <span className="text-[10px] text-sky-300">Selected</span>}
                    </button>
                  );
                })}
              </div>

              <div className="flex items-center justify-between">
                <Link
                  href="/patients"
                  className="text-[10px] text-slate-400 hover:text-sky-300"
                  onClick={(e) => e.stopPropagation()}
                >
                  Open patients module
                </Link>
                {selectedPatient && (
                  <Link
                    href={patientChartHref(selectedPatient.id)}
                    className="text-[10px] text-slate-400 hover:text-sky-300"
                    onClick={(e) => e.stopPropagation()}
                  >
                    View chart
                  </Link>
                )}
              </div>
            </div>

            {/* Appointment details */}
            <div className="space-y-2">
              <div>
                <label className="block text-[11px] text-slate-300 mb-1">Provider</label>
                <select
                  value={newProviderId}
                  onChange={(e) => setNewProviderId(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950/80 px-3 py-2 text-[11px] outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-500/60"
                >
                  {providers.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} · {p.specialty}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] text-slate-300 mb-1">Date</label>
                  <input
                    type="date"
                    value={newDateISO}
                    onChange={(e) => setNewDateISO(e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950/80 px-3 py-2 text-[11px] outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-500/60"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-slate-300 mb-1">Start</label>
                  <input
                    type="time"
                    value={newStartTime}
                    onChange={(e) => setNewStartTime(e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950/80 px-3 py-2 text-[11px] outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-500/60"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] text-slate-300 mb-1">Duration (min)</label>
                  <input
                    type="number"
                    min={10}
                    max={480}
                    step={5}
                    value={newDurationMinutes}
                    onChange={(e) => setNewDurationMinutes(Number(e.target.value) || 60)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950/80 px-3 py-2 text-[11px] outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-500/60"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-slate-300 mb-1">Room</label>
                  <input
                    value={newRoom}
                    onChange={(e) => setNewRoom(e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950/80 px-3 py-2 text-[11px] outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-500/60"
                    placeholder="Room 1"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] text-slate-300 mb-1">Notes</label>
                <textarea
                  rows={3}
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950/80 px-3 py-2 text-[11px] outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-500/60"
                  placeholder="Short clinical note…"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-800">
            <div className="text-[10px] text-slate-500">Production: persist in Postgres + link to patient encounter.</div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl border border-slate-800 bg-slate-900/70 px-3 py-2 text-[11px] text-slate-200 hover:border-sky-400"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-xl border border-sky-500/70 bg-sky-500/10 px-3 py-2 text-[11px] font-semibold text-sky-300 hover:bg-sky-500/20"
              >
                Create appointment
              </button>
            </div>
          </div>
        </form>
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

function MonthView({ days, currentDate, appointments, providersById, selectedDate, onSelectDate }: MonthViewProps) {
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
              title="Open day"
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
                  return <span key={a.id} className={`h-2 w-2 rounded-full ${prov?.color ?? "bg-slate-500"}`} />;
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
  onQuickAdd: (date: Date) => void;
};

function WeekView({ days, appointments, providersById, onSelectAppointment, onQuickAdd }: WeekViewProps) {
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
              <button
                type="button"
                onClick={() => onQuickAdd(d)}
                className="text-left text-slate-200 hover:text-sky-200"
                title="Quick add on this day"
              >
                {d.toLocaleDateString("en-US", { weekday: "short", day: "numeric" })}
              </button>
              <span className="text-[10px] text-slate-500">{dayAppointments.length} appt.</span>
            </div>

            <div className="space-y-1.5 max-h-64 overflow-y-auto">
              {dayAppointments.length === 0 && (
                <button
                  type="button"
                  onClick={() => onQuickAdd(d)}
                  className="text-[10px] text-slate-600 rounded-xl border border-dashed border-slate-800/80 bg-slate-950/40 px-2 py-2 hover:border-sky-400/60"
                >
                  + Add appointment
                </button>
              )}

              {dayAppointments.map((a) => {
                const prov = providersById[a.providerId];
                return (
                  <button
                    key={a.id}
                    type="button"
                    onClick={() => onSelectAppointment(a.id)}
                    className="w-full rounded-xl border border-slate-800 bg-slate-900/80 px-2 py-1.5 text-left hover:border-sky-400 hover:bg-slate-900"
                    title="Select appointment"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] text-slate-400">{formatTimeLabel(new Date(a.startTime))}</span>
                      <span className={`h-2 w-8 rounded-full ${prov?.color ?? "bg-slate-500"}`} />
                    </div>

                    <div className="flex items-center justify-between gap-2">
                      <Link
                        href={patientChartHref(a.patientId)}
                        onClick={(e) => e.stopPropagation()}
                        className="text-[11px] text-slate-100 truncate hover:text-sky-200"
                        title="Open patient chart"
                      >
                        {a.patientName}
                      </Link>

                      <span className="text-[10px] text-slate-500">{a.room ?? ""}</span>
                    </div>

                    <p className="text-[10px] text-slate-400 truncate">
                      {(prov?.name ?? "Unknown provider")} · {a.specialty}
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
  onQuickAdd: (date: Date, time: string) => void;
};

function DayView({ date, appointments, providersById, hours, onSelectAppointment, onQuickAdd }: DayViewProps) {
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
        <p className="text-[10px] text-slate-500">Click empty slot to create · {appointments.length} appt.</p>
      </div>

      <div className="max-h-[420px] overflow-y-auto border-t border-slate-800 pt-2">
        {hours.map((h) => {
          const hourLabel = `${pad2(h)}:00`;
          const hourAppointments = byHour[h] || [];

          return (
            <div key={h} className="flex items-start gap-3 py-1.5">
              <button
                type="button"
                onClick={() => onQuickAdd(date, `${pad2(h)}:00`)}
                className="w-14 text-left text-[10px] text-slate-500 mt-1 hover:text-sky-300"
                title="Quick add at this time"
              >
                {hourLabel}
              </button>

              <div className="flex-1 space-y-1">
                {hourAppointments.length === 0 && (
                  <button
                    type="button"
                    onClick={() => onQuickAdd(date, `${pad2(h)}:00`)}
                    className="w-full h-7 rounded-lg border border-dashed border-slate-800/80 bg-slate-950/40 text-[10px] text-slate-500 hover:border-sky-400/60 hover:text-sky-300"
                  >
                    + Add appointment
                  </button>
                )}

                {hourAppointments.map((a) => {
                  const prov = providersById[a.providerId];
                  return (
                    <button
                      key={a.id}
                      type="button"
                      onClick={() => onSelectAppointment(a.id)}
                      className="w-full rounded-lg border border-slate-800 bg-slate-900/90 px-2 py-1 text-left hover:border-sky-400 hover:bg-slate-900"
                      title="Select appointment"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <Link
                          href={patientChartHref(a.patientId)}
                          onClick={(e) => e.stopPropagation()}
                          className="text-[11px] text-slate-100 truncate hover:text-sky-200"
                        >
                          {a.patientName}
                        </Link>
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
                        {(prov?.name ?? "Unknown provider")} · {a.specialty}
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
