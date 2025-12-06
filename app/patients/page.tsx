"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

type Theme = "dark" | "light";

type Patient = {
  patient_id: number;
  first_name: string;
  last_name: string;
  date_of_birth: string | null;
  phone_mobile: string | null;
  email: string | null;
  country?: string | null;
  city?: string | null;
  preferred_language?: string | null;
};

type Tab = "new" | "existing";

const months = [
  { value: "1", label: "Jan" },
  { value: "2", label: "Feb" },
  { value: "3", label: "Mar" },
  { value: "4", label: "Apr" },
  { value: "5", label: "May" },
  { value: "6", label: "Jun" },
  { value: "7", label: "Jul" },
  { value: "8", label: "Aug" },
  { value: "9", label: "Sep" },
  { value: "10", label: "Oct" },
  { value: "11", label: "Nov" },
  { value: "12", label: "Dec" },
];

const years: string[] = [];
const currentYear = new Date().getFullYear();
for (let y = currentYear; y >= 1920; y--) {
  years.push(String(y));
}

function buildDob(year: string, month: string, day: string): string | null {
  if (!year || !month || !day) return null;

  const y = parseInt(year, 10);
  const m = parseInt(month, 10);
  const d = parseInt(day, 10);

  if (
    !Number.isFinite(y) ||
    !Number.isFinite(m) ||
    !Number.isFinite(d) ||
    y < 1900 ||
    m < 1 ||
    m > 12 ||
    d < 1 ||
    d > 31
  ) {
    return null;
  }

  const mm = m.toString().padStart(2, "0");
  const dd = d.toString().padStart(2, "0");
  return `${y}-${mm}-${dd}`; // formato ISO para Postgres
}

export default function PatientsPage() {
  const [theme, setTheme] = useState<Theme>("dark");
  const dark = theme === "dark";

  const [tab, setTab] = useState<Tab>("new");

  const [patients, setPatients] = useState<Patient[]>([]);
  const [loadingList, setLoadingList] = useState(false);
  const [errorList, setErrorList] = useState<string | null>(null);

  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);

  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const [vipFlag, setVipFlag] = useState(false);
  const [financialHold, setFinancialHold] = useState(false);

  const [selectedAllergies, setSelectedAllergies] = useState<string[]>([]);
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
  const [selectedDentalFlags, setSelectedDentalFlags] = useState<string[]>([]);

  const [form, setForm] = useState<any>({
    firstName: "",
    lastName: "",
    dobDay: "",
    dobMonth: "",
    dobYear: "",
    clinicId: "1",

    country: "",
    city: "",
    whatsappCode: "+506 Costa Rica",
    mobilePhone: "",
    secondaryPhone: "",
    email: "",

    preferredLanguage: "",
    gender: "",
    idType: "National ID or passport",
    idNumber: "",

    occupation: "",
    employer: "",
    referralSource: "",

    payerPlan: "",
    memberId: "",

    emergencyName: "",
    emergencyRelation: "",
    emergencyPhone: "",
  });

  const toggleTheme = () =>
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));

  const handleChange = (field: string, value: any) => {
    setForm((prev: any) => ({
      ...prev,
      [field]: value,
    }));
  };

  const toggleTag = (
    value: string,
    selected: string[],
    setSelected: (v: string[]) => void
  ) => {
    if (selected.includes(value)) {
      setSelected(selected.filter((x) => x !== value));
    } else {
      setSelected([...selected, value]);
    }
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoFile(file);
    const url = URL.createObjectURL(file);
    setPhotoPreview(url);
  };

  const loadPatients = async () => {
    try {
      setLoadingList(true);
      setErrorList(null);
      const res = await fetch("/api/patients", { cache: "no-store" });
      const data = await res.json();

      if (!res.ok || !data.ok) {
        throw new Error(data.error || "Error loading patients");
      }

      setPatients(data.patients || []);
    } catch (err: any) {
      console.error(err);
      setErrorList(err.message || "Error loading patients");
    } finally {
      setLoadingList(false);
    }
  };

  useEffect(() => {
    loadPatients();
  }, []);

  const handleSavePatient = async () => {
    setSaveError(null);
    setSaveSuccess(null);

    const dob = buildDob(form.dobYear, form.dobMonth, form.dobDay);

    if (!form.firstName || !form.lastName) {
      setSaveError("First name and last name are required.");
      return;
    }

    if (!dob) {
      setSaveError("Please select a valid date of birth.");
      return;
    }

    if (!form.mobilePhone) {
      setSaveError("Please add a mobile / WhatsApp number.");
      return;
    }

    if (!form.email) {
      setSaveError("Please add an email.");
      return;
    }

    const payload = {
      first_name: form.firstName,
      last_name: form.lastName,
      date_of_birth: dob,
      phone_mobile: `${form.whatsappCode} ${form.mobilePhone}`.trim(),
      email: form.email,
      clinic_id: parseInt(form.clinicId || "1", 10) || 1,

      country: form.country || null,
      city: form.city || null,
      preferred_language: form.preferredLanguage || null,

      // Estos se quedan listos para futuro (no usados aún en DB):
      meta: {
        vip: vipFlag,
        financial_hold: financialHold,
        allergies: selectedAllergies,
        conditions: selectedConditions,
        dental_flags: selectedDentalFlags,
      },
    };

    try {
      setSaving(true);
      const res = await fetch("/api/patients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (!res.ok || !data.ok) {
        throw new Error(data.error || "Error saving patient");
      }

      setSaveSuccess(
        "Patient saved and linked to General Dentistry. Clinical layers will sync later."
      );
      setForm((prev: any) => ({
        ...prev,
        firstName: "",
        lastName: "",
        dobDay: "",
        dobMonth: "",
        dobYear: "",
        mobilePhone: "",
        secondaryPhone: "",
        email: "",
      }));
      setVipFlag(false);
      setFinancialHold(false);
      setSelectedAllergies([]);
      setSelectedConditions([]);
      setSelectedDentalFlags([]);
      setPhotoFile(null);
      setPhotoPreview(null);

      await loadPatients();
    } catch (err: any) {
      console.error(err);
      setSaveError(err.message || "Error saving patient");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className={`min-h-screen px-4 md:px-10 py-6 ${
        dark ? "bg-slate-950 text-slate-50" : "bg-slate-100 text-slate-900"
      }`}
    >
      {/* HEADER */}
      <header className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-sky-500 flex items-center justify-center text-xs font-bold text-slate-950">
            PT
          </div>
          <div>
            <h1 className="text-lg md:text-2xl font-semibold">Patients</h1>
            <p className="text-xs text-slate-400">
              Global patient registry for ADIE. Demographics, geography and
              clinical profile for epidemiology &amp; BI.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <button
            onClick={toggleTheme}
            className={`rounded-full border px-3 py-1 flex items-center gap-2 ${
              dark
                ? "border-slate-700 text-slate-300"
                : "border-slate-300 text-slate-800"
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
            Theme: {dark ? "Dark" : "Light"}
          </button>

          <Link
            href="/"
            className="rounded-full border border-slate-700 px-3 py-1 hover:border-sky-400"
          >
            ← Dashboard
          </Link>
          <Link
            href="/specialties"
            className="rounded-full border border-slate-700 px-3 py-1 hover:border-sky-400"
          >
            Specialties →
          </Link>
        </div>
      </header>

      {/* TABS */}
      <div className="flex justify-end mb-4 gap-2 text-xs">
        <button
          onClick={() => setTab("existing")}
          className={`px-4 py-1.5 rounded-full border ${
            tab === "existing"
              ? "bg-slate-900 text-slate-100 border-sky-500 shadow-[0_0_16px_rgba(56,189,248,0.5)]"
              : "border-slate-700 text-slate-400 hover:border-sky-500"
          }`}
        >
          Existing patients
        </button>
        <button
          onClick={() => setTab("new")}
          className={`px-4 py-1.5 rounded-full border ${
            tab === "new"
              ? "bg-emerald-500 text-slate-950 border-emerald-300 shadow-[0_0_18px_rgba(16,185,129,0.6)]"
              : "border-slate-700 text-slate-400 hover:border-emerald-400"
          }`}
        >
          New patient
        </button>
      </div>

      {/* MENSAJES */}
      {saveError && tab === "new" && (
        <div className="mb-4 rounded-xl border border-rose-500/60 bg-rose-500/10 px-4 py-2 text-xs text-rose-200">
          <strong>Database error:</strong> {saveError}
        </div>
      )}
      {saveSuccess && tab === "new" && (
        <div className="mb-4 rounded-xl border border-emerald-500/60 bg-emerald-500/10 px-4 py-2 text-xs text-emerald-200">
          {saveSuccess}
        </div>
      )}

      {/* CONTENIDO POR TAB */}
      {tab === "new" ? (
        <section className="rounded-2xl border border-slate-800 bg-slate-900/70 px-5 py-6 max-w-6xl mx-auto">
          <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500 mb-1">
            New patient
          </p>
          <p className="text-xs text-slate-400 mb-6">
            Create a global profile with demographics, contact data, geography
            and medical flags. The profile will connect later with specialties,
            schedule and billing.
          </p>

          {/* FOTO Y RISK FLAGS */}
          <div className="flex flex-col items-center mb-6">
            <div className="h-32 w-32 rounded-full border border-slate-700 bg-slate-950/70 flex items-center justify-center overflow-hidden mb-3 shadow-[0_0_32px_rgba(15,23,42,0.9)]">
              {photoPreview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={photoPreview}
                  alt="Patient photo"
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="text-[11px] text-slate-500 text-center px-4">
                  Patient photo
                </span>
              )}
            </div>
            <label className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-950/80 px-3 py-1 text-xs text-slate-200 cursor-pointer hover:border-sky-400">
              <span className="text-[11px]">📁 Upload</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handlePhotoChange}
              />
            </label>
            <p className="text-[10px] text-slate-500 mt-2">
              JPG/PNG. This version stores it locally; later we&apos;ll sync
              with ADIE storage.
            </p>

            <div className="mt-5 flex items-center gap-3 text-[11px]">
              <span className="uppercase tracking-[0.18em] text-slate-500">
                Risk flags
              </span>
              <button
                type="button"
                onClick={() => setVipFlag((v) => !v)}
                className={`px-3 py-1 rounded-full border text-[11px] flex items-center gap-1 ${
                  vipFlag
                    ? "border-amber-400 bg-amber-500/15 text-amber-200"
                    : "border-slate-700 bg-slate-900 text-slate-300"
                }`}
              >
                ⭐ VIP
              </button>
              <button
                type="button"
                onClick={() => setFinancialHold((v) => !v)}
                className={`px-3 py-1 rounded-full border text-[11px] flex items-center gap-1 ${
                  financialHold
                    ? "border-rose-400 bg-rose-500/15 text-rose-200"
                    : "border-slate-700 bg-slate-900 text-slate-300"
                }`}
              >
                💳 Financial hold
              </button>
            </div>
          </div>

          {/* DATOS BÁSICOS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-[11px] uppercase tracking-[0.18em] text-slate-500 mb-1">
                First name *
              </label>
              <input
                className="w-full rounded-xl border border-slate-700 bg-slate-950/70 px-3 py-2 text-sm"
                placeholder="Juan"
                value={form.firstName}
                onChange={(e) => handleChange("firstName", e.target.value)}
              />
            </div>
            <div>
              <label className="block text-[11px] uppercase tracking-[0.18em] text-slate-500 mb-1">
                Last name *
              </label>
              <input
                className="w-full rounded-xl border border-slate-700 bg-slate-950/70 px-3 py-2 text-sm"
                placeholder="Pérez"
                value={form.lastName}
                onChange={(e) => handleChange("lastName", e.target.value)}
              />
            </div>
          </div>

          {/* DOB + GÉNERO + ID */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-[11px] uppercase tracking-[0.18em] text-slate-500 mb-1">
                Date of birth *
              </label>
              <div className="flex gap-2">
                <select
                  className="w-28 rounded-xl border border-slate-700 bg-slate-950/70 px-3 py-2 text-sm"
                  value={form.dobMonth}
                  onChange={(e) => handleChange("dobMonth", e.target.value)}
                >
                  <option value="">Month</option>
                  {months.map((m) => (
                    <option key={m.value} value={m.value}>
                      {m.label}
                    </option>
                  ))}
                </select>
                <select
                  className="w-20 rounded-xl border border-slate-700 bg-slate-950/70 px-3 py-2 text-sm"
                  value={form.dobDay}
                  onChange={(e) => handleChange("dobDay", e.target.value)}
                >
                  <option value="">Day</option>
                  {Array.from({ length: 31 }).map((_, i) => {
                    const d = i + 1;
                    return (
                      <option key={d} value={String(d)}>
                        {d}
                      </option>
                    );
                  })}
                </select>
                <select
                  className="w-28 rounded-xl border border-slate-700 bg-slate-950/70 px-3 py-2 text-sm"
                  value={form.dobYear}
                  onChange={(e) => handleChange("dobYear", e.target.value)}
                >
                  <option value="">Year</option>
                  {years.map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-[0.18em] text-slate-500 mb-1">
                Gender
              </label>
              <select
                className="w-full rounded-xl border border-slate-700 bg-slate-950/70 px-3 py-2 text-sm"
                value={form.gender}
                onChange={(e) => handleChange("gender", e.target.value)}
              >
                <option value="">Select…</option>
                <option value="female">Female</option>
                <option value="male">Male</option>
                <option value="nonbinary">Non-binary</option>
                <option value="other">Other / prefer not</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-[0.18em] text-slate-500 mb-1">
                ID / Passport
              </label>
              <div className="flex gap-2">
                <select
                  className="w-40 rounded-xl border border-slate-700 bg-slate-950/70 px-3 py-2 text-xs"
                  value={form.idType}
                  onChange={(e) => handleChange("idType", e.target.value)}
                >
                  <option>National ID or passport</option>
                  <option>Local ID</option>
                  <option>Insurance card</option>
                </select>
                <input
                  className="flex-1 rounded-xl border border-slate-700 bg-slate-950/70 px-3 py-2 text-sm"
                  placeholder="ID number"
                  value={form.idNumber}
                  onChange={(e) => handleChange("idNumber", e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* CONTACT & COMMUNICATION + GEO */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">
            <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4 space-y-3">
              <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                Contact & communication
              </p>

              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-1">
                  <label className="block text-[10px] uppercase tracking-[0.16em] text-slate-500 mb-1">
                    WhatsApp code
                  </label>
                  <select
                    className="w-full rounded-xl border border-slate-700 bg-slate-950/70 px-2 py-2 text-xs"
                    value={form.whatsappCode}
                    onChange={(e) =>
                      handleChange("whatsappCode", e.target.value)
                    }
                  >
                    <option value="+506 Costa Rica">+506 Costa Rica</option>
                    <option value="+1 USA / Canada">+1 USA / Canada</option>
                    <option value="+52 Mexico">+52 Mexico</option>
                    <option value="+34 Spain">+34 Spain</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="block text-[10px] uppercase tracking-[0.16em] text-slate-500 mb-1">
                    Mobile / WhatsApp *
                  </label>
                  <input
                    className="w-full rounded-xl border border-slate-700 bg-slate-950/70 px-3 py-2 text-sm"
                    placeholder="8888-0000"
                    value={form.mobilePhone}
                    onChange={(e) =>
                      handleChange("mobilePhone", e.target.value)
                    }
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-[0.16em] text-slate-500 mb-1">
                  Secondary phone
                </label>
                <input
                  className="w-full rounded-xl border border-slate-700 bg-slate-950/70 px-3 py-2 text-sm"
                  value={form.secondaryPhone}
                  onChange={(e) =>
                    handleChange("secondaryPhone", e.target.value)
                  }
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-[0.16em] text-slate-500 mb-1">
                  Email *
                </label>
                <input
                  className="w-full rounded-xl border border-slate-700 bg-slate-950/70 px-3 py-2 text-sm"
                  placeholder="juan.perez@example.com"
                  value={form.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-[0.16em] text-slate-500 mb-1">
                  Communication preferences
                </label>
                <div className="flex flex-wrap gap-2 text-[11px] text-slate-300">
                  <span className="px-2 py-1 rounded-full border border-slate-700">
                    ✅ Email
                  </span>
                  <span className="px-2 py-1 rounded-full border border-slate-700">
                    ✅ SMS / WhatsApp
                  </span>
                  <span className="px-2 py-1 rounded-full border border-slate-700">
                    ✅ Phone call
                  </span>
                  <span className="px-2 py-1 rounded-full border border-slate-700">
                    ✅ Allows campaigns
                  </span>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4 space-y-3">
              <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                Geography & address
              </p>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] uppercase tracking-[0.16em] text-slate-500 mb-1">
                    Country
                  </label>
                  <input
                    className="w-full rounded-xl border border-slate-700 bg-slate-950/70 px-3 py-2 text-sm"
                    placeholder="Costa Rica"
                    value={form.country}
                    onChange={(e) => handleChange("country", e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-[0.16em] text-slate-500 mb-1">
                    City / Region
                  </label>
                  <input
                    className="w-full rounded-xl border border-slate-700 bg-slate-950/70 px-3 py-2 text-sm"
                    placeholder="San José"
                    value={form.city}
                    onChange={(e) => handleChange("city", e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] uppercase tracking-[0.16em] text-slate-500 mb-1">
                    Address line 1
                  </label>
                  <input
                    className="w-full rounded-xl border border-slate-700 bg-slate-950/70 px-3 py-2 text-sm"
                    placeholder="Street / reference"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-[0.16em] text-slate-500 mb-1">
                    Address line 2
                  </label>
                  <input
                    className="w-full rounded-xl border border-slate-700 bg-slate-950/70 px-3 py-2 text-sm"
                    placeholder="Building / floor"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] uppercase tracking-[0.16em] text-slate-500 mb-1">
                    Postal code
                  </label>
                  <input className="w-full rounded-xl border border-slate-700 bg-slate-950/70 px-3 py-2 text-sm" />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-[0.16em] text-slate-500 mb-1">
                    Preferred language
                  </label>
                  <select
                    className="w-full rounded-xl border border-slate-700 bg-slate-950/70 px-3 py-2 text-sm"
                    value={form.preferredLanguage}
                    onChange={(e) =>
                      handleChange("preferredLanguage", e.target.value)
                    }
                  >
                    <option value="">Select language…</option>
                    <option value="es">Spanish</option>
                    <option value="en">English</option>
                    <option value="pt">Portuguese</option>
                    <option value="fr">French</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* SOCIAL + INSURANCE + EMERGENCY */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-6">
            <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4 space-y-3">
              <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                Social profile
              </p>
              <div>
                <label className="block text-[10px] uppercase tracking-[0.16em] text-slate-500 mb-1">
                  Occupation
                </label>
                <input
                  className="w-full rounded-xl border border-slate-700 bg-slate-950/70 px-3 py-2 text-sm"
                  placeholder="Student, engineer, etc."
                  value={form.occupation}
                  onChange={(e) =>
                    handleChange("occupation", e.target.value)
                  }
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-[0.16em] text-slate-500 mb-1">
                  Employer
                </label>
                <input
                  className="w-full rounded-xl border border-slate-700 bg-slate-950/70 px-3 py-2 text-sm"
                  value={form.employer}
                  onChange={(e) => handleChange("employer", e.target.value)}
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-[0.16em] text-slate-500 mb-1">
                  Referral source
                </label>
                <input
                  className="w-full rounded-xl border border-slate-700 bg-slate-950/70 px-3 py-2 text-sm"
                  placeholder="Family, Google, ADIE network…"
                  value={form.referralSource}
                  onChange={(e) =>
                    handleChange("referralSource", e.target.value)
                  }
                />
              </div>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4 space-y-3">
              <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                Insurance / payer
              </p>
              <div>
                <label className="block text-[10px] uppercase tracking-[0.16em] text-slate-500 mb-1">
                  Payer / plan
                </label>
                <input
                  className="w-full rounded-xl border border-slate-700 bg-slate-950/70 px-3 py-2 text-sm"
                  placeholder="Private, Delta Dental, etc."
                  value={form.payerPlan}
                  onChange={(e) => handleChange("payerPlan", e.target.value)}
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-[0.16em] text-slate-500 mb-1">
                  Member / policy ID
                </label>
                <input
                  className="w-full rounded-xl border border-slate-700 bg-slate-950/70 px-3 py-2 text-sm"
                  value={form.memberId}
                  onChange={(e) => handleChange("memberId", e.target.value)}
                />
              </div>
              <p className="text-[10px] text-slate-500">
                Financial module will later pull eligibility &amp; remaining
                benefits per visit.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4 space-y-3">
              <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                Emergency contact
              </p>
              <div>
                <label className="block text-[10px] uppercase tracking-[0.16em] text-slate-500 mb-1">
                  Name
                </label>
                <input
                  className="w-full rounded-xl border border-slate-700 bg-slate-950/70 px-3 py-2 text-sm"
                  value={form.emergencyName}
                  onChange={(e) =>
                    handleChange("emergencyName", e.target.value)
                  }
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-[0.16em] text-slate-500 mb-1">
                  Relationship
                </label>
                <input
                  className="w-full rounded-xl border border-slate-700 bg-slate-950/70 px-3 py-2 text-sm"
                  value={form.emergencyRelation}
                  onChange={(e) =>
                    handleChange("emergencyRelation", e.target.value)
                  }
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-[0.16em] text-slate-500 mb-1">
                  Phone
                </label>
                <input
                  className="w-full rounded-xl border border-slate-700 bg-slate-950/70 px-3 py-2 text-sm"
                  value={form.emergencyPhone}
                  onChange={(e) =>
                    handleChange("emergencyPhone", e.target.value)
                  }
                />
              </div>
            </div>
          </div>

          {/* ALLERGIES + MEDICAL + DENTAL FLAGS */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-6">
            <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4 space-y-3">
              <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                Allergies
              </p>
              <p className="text-[10px] text-slate-500 mb-1">
                Tap tags to select. Custom entries will be learned by the
                system for future visits.
              </p>
              <div className="flex flex-wrap gap-2 text-[11px]">
                {["Penicillin", "Latex", "NSAIDs", "Local anesthetics", "Metals / alloys"].map(
                  (a) => {
                    const active = selectedAllergies.includes(a);
                    return (
                      <button
                        key={a}
                        type="button"
                        onClick={() =>
                          toggleTag(a, selectedAllergies, setSelectedAllergies)
                        }
                        className={`px-3 py-1 rounded-full border ${
                          active
                            ? "border-rose-400 bg-rose-500/20 text-rose-100"
                            : "border-slate-700 bg-slate-900 text-slate-200"
                        }`}
                      >
                        {a}
                      </button>
                    );
                  }
                )}
              </div>
              <div className="flex gap-2 mt-2">
                <input
                  className="flex-1 rounded-xl border border-slate-700 bg-slate-950/70 px-3 py-2 text-xs"
                  placeholder="Add custom allergy…"
                />
                <button
                  type="button"
                  className="px-3 py-1 rounded-xl border border-slate-700 text-[11px]"
                >
                  Add
                </button>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4 space-y-3">
              <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                Medical conditions
              </p>
              <p className="text-[10px] text-slate-500 mb-1">
                System will build a structured library across all clinics.
              </p>
              <div className="flex flex-wrap gap-2 text-[11px]">
                {[
                  "Hypertension",
                  "Diabetes",
                  "Cardiovascular disease",
                  "Coagulation disorder",
                  "Pregnancy",
                ].map((c) => {
                  const active = selectedConditions.includes(c);
                  return (
                    <button
                      key={c}
                      type="button"
                      onClick={() =>
                        toggleTag(c, selectedConditions, setSelectedConditions)
                      }
                      className={`px-3 py-1 rounded-full border ${
                        active
                          ? "border-amber-400 bg-amber-500/20 text-amber-100"
                          : "border-slate-700 bg-slate-900 text-slate-200"
                      }`}
                    >
                      {c}
                    </button>
                  );
                })}
              </div>
              <div className="flex gap-2 mt-2">
                <input
                  className="flex-1 rounded-xl border border-slate-700 bg-slate-950/70 px-3 py-2 text-xs"
                  placeholder="Add medical condition…"
                />
                <button
                  type="button"
                  className="px-3 py-1 rounded-xl border border-slate-700 text-[11px]"
                >
                  Add
                </button>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4 space-y-3">
              <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                Dental history
              </p>
              <p className="text-[10px] text-slate-500 mb-1">
                Flags that will connect later with the global dental chart and
                specialty modules.
              </p>
              <div className="flex flex-wrap gap-2 text-[11px]">
                {[
                  "Perio maintenance",
                  "Previous implants",
                  "Endo last 6 months",
                  "Full-mouth rehab",
                  "Clear aligner ortho",
                ].map((d) => {
                  const active = selectedDentalFlags.includes(d);
                  return (
                    <button
                      key={d}
                      type="button"
                      onClick={() =>
                        toggleTag(d, selectedDentalFlags, setSelectedDentalFlags)
                      }
                      className={`px-3 py-1 rounded-full border ${
                        active
                          ? "border-sky-400 bg-sky-500/20 text-sky-100"
                          : "border-slate-700 bg-slate-900 text-slate-200"
                      }`}
                    >
                      {d}
                    </button>
                  );
                })}
              </div>
              <div className="flex gap-2 mt-2">
                <input
                  className="flex-1 rounded-xl border border-slate-700 bg-slate-950/70 px-3 py-2 text-xs"
                  placeholder="Add dental flag…"
                />
                <button
                  type="button"
                  className="px-3 py-1 rounded-xl border border-slate-700 text-[11px]"
                >
                  Add
                </button>
              </div>
            </div>
          </div>

          {/* SAVE BUTTON */}
          <div className="flex justify-end">
            <button
              onClick={handleSavePatient}
              disabled={saving}
              className="rounded-full bg-emerald-500 px-6 py-2 text-sm font-semibold text-slate-950 hover:bg-emerald-400 disabled:opacity-60"
            >
              {saving ? "Saving…" : "Save patient"}
            </button>
          </div>
        </section>
      ) : (
        /* EXISTING PATIENTS */
        <section className="rounded-2xl border border-slate-800 bg-slate-900/70 px-5 py-5 max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                Epidemiology view
              </p>
              <p className="text-xs text-slate-400">
                Global registry by clinic, geography and language.
              </p>
            </div>
            <p className="text-[11px] text-slate-500">
              {patients.length} patients
            </p>
          </div>

          {errorList && (
            <div className="mb-3 rounded-xl border border-rose-500/60 bg-rose-500/10 px-4 py-2 text-xs text-rose-200">
              {errorList}
            </div>
          )}

          <div className="overflow-x-auto rounded-xl border border-slate-800">
            <table className="min-w-full text-xs">
              <thead className="bg-slate-900/80 text-slate-400">
                <tr>
                  <th className="px-4 py-2 text-left">Name</th>
                  <th className="px-4 py-2 text-left">DOB</th>
                  <th className="px-4 py-2 text-left">Country / City</th>
                  <th className="px-4 py-2 text-left">Phone</th>
                  <th className="px-4 py-2 text-left">Email</th>
                  <th className="px-4 py-2 text-left">Language</th>
                </tr>
              </thead>
              <tbody>
                {loadingList ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-4 py-4 text-center text-slate-400"
                    >
                      Loading...
                    </td>
                  </tr>
                ) : patients.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-4 py-4 text-center text-slate-400"
                    >
                      No patients found.
                    </td>
                  </tr>
                ) : (
                  patients.map((p) => (
                    <tr
                      key={p.patient_id}
                      className="border-t border-slate-800/70 hover:bg-slate-900/70"
                    >
                      <td className="px-4 py-2">
                        {p.first_name} {p.last_name}
                      </td>
                      <td className="px-4 py-2">
                        {p.date_of_birth
                          ? new Date(p.date_of_birth).toLocaleDateString()
                          : "—"}
                      </td>
                      <td className="px-4 py-2">
                        {p.country || "—"}{" "}
                        {p.city ? `· ${p.city}` : ""}
                      </td>
                      <td className="px-4 py-2">
                        {p.phone_mobile || "—"}
                      </td>
                      <td className="px-4 py-2">{p.email || "—"}</td>
                      <td className="px-4 py-2">
                        {p.preferred_language || "—"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
}
