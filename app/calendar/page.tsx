"use client";

import React, { useEffect, useState } from "react";

type Appointment = {
  id: string;
  doctor_id: string;
  patient_id: string;
  title: string;
  description: string | null;
  status: string;
  start_time: string; // ISO
  end_time: string;   // ISO
  location: string | null;
};

type DoctorOption = {
  id: string;
  name: string;
};

const MOCK_DOCTORS: DoctorOption[] = [
  { id: "doctor-1", name: "Dr. Barrantes" },
  { id: "doctor-2", name: "Dr. Example" },
];

export default function CalendarPage() {
  const [date, setDate] = useState(() => {
    const today = new Date();
    return today.toISOString().slice(0, 10); // YYYY-MM-DD
  });

  const [selectedDoctor, setSelectedDoctor] = useState<string>("doctor-1");
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadAppointments() {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          date,
          doctorId: selectedDoctor,
        });

        const res = await fetch(`/api/appointments?${params.toString()}`);
        const data = await res.json();
        setAppointments(data.appointments ?? []);
      } catch (err) {
        console.error(err);
        setAppointments([]);
      } finally {
        setLoading(false);
      }
    }

    loadAppointments();
  }, [date, selectedDoctor]);

  return (
    <div className="h-screen w-full bg-slate-950 text-slate-100">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-slate-800 px-6 py-3">
        <div>
          <h1 className="text-sm font-semibold tracking-[0.18em] uppercase text-sky-300">
            ADIE Clinic Calendar
          </h1>
          <p className="text-[11px] text-slate-400">
            Agenda central por doctor – todas las citas viven primero en ADIE.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Date picker */}
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="rounded-lg border border-slate-700 bg-slate-900/70 px-2 py-1 text-xs text-slate-100"
          />

          {/* Doctor selector */}
          <select
            value={selectedDoctor}
            onChange={(e) => setSelectedDoctor(e.target.value)}
            className="rounded-lg border border-slate-700 bg-slate-900/70 px-2 py-1 text-xs text-slate-100"
          >
            {MOCK_DOCTORS.map((doc) => (
              <option key={doc.id} value={doc.id}>
                {doc.name}
              </option>
            ))}
          </select>
        </div>
      </header>

      {/* Body */}
      <main className="h-[calc(100%-44px)] overflow-auto p-6">
        {loading ? (
          <p className="text-xs text-slate-400">Loading appointments…</p>
        ) : appointments.length === 0 ? (
          <p className="text-xs text-slate-400">
            No appointments for this date/doctor.
          </p>
        ) : (
          <table className="w-full text-[11px] border border-slate-800 rounded-xl overflow-hidden">
            <thead className="bg-slate-900/80 border-b border-slate-800">
              <tr>
                <th className="px-3 py-2 text-left text-slate-400">Time</th>
                <th className="px-3 py-2 text-left text-slate-400">Patient</th>
                <th className="px-3 py-2 text-left text-slate-400">Title</th>
                <th className="px-3 py-2 text-left text-slate-400">Status</th>
                <th className="px-3 py-2 text-left text-slate-400">Location</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((appt) => (
                <tr
                  key={appt.id}
                  className="border-b border-slate-800/70 hover:bg-slate-900/60"
                >
                  <td className="px-3 py-2 text-slate-100">
                    {formatTime(appt.start_time)} – {formatTime(appt.end_time)}
                  </td>
                  <td className="px-3 py-2 text-slate-200">{appt.patient_id}</td>
                  <td className="px-3 py-2 text-slate-200">{appt.title}</td>
                  <td className="px-3 py-2">
                    <span className="inline-flex rounded-full px-2 py-0.5 text-[10px] bg-slate-800 text-slate-200">
                      {appt.status}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-slate-300">
                    {appt.location ?? "--"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </main>
    </div>
  );
}

function formatTime(iso: string) {
  const d = new Date(iso);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}
