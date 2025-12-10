"use client";

import React, { useState } from "react";
import Link from "next/link";

/* ---------- Catálogos ---------- */

const LATAM_COUNTRIES: string[] = [
  "Mexico",
  "Guatemala",
  "Belize",
  "Honduras",
  "El Salvador",
  "Nicaragua",
  "Costa Rica",
  "Panama",
  "Cuba",
  "Dominican Republic",
  "Puerto Rico",
  "Colombia",
  "Venezuela",
  "Ecuador",
  "Peru",
  "Bolivia",
  "Chile",
  "Argentina",
  "Uruguay",
  "Paraguay",
  "Brazil",
];

const COUNTRY_CITIES: Record<string, string[]> = {
  Mexico: ["Mexico City", "Guadalajara", "Monterrey", "Puebla", "Other"],
  Guatemala: ["Guatemala City", "Quetzaltenango", "Escuintla", "Other"],
  Belize: ["Belize City", "Belmopan", "Other"],
  Honduras: ["Tegucigalpa", "San Pedro Sula", "Other"],
  "El Salvador": ["San Salvador", "Santa Ana", "Other"],
  Nicaragua: ["Managua", "León", "Granada", "Other"],
  "Costa Rica": [
    "San José",
    "Heredia",
    "Alajuela",
    "Cartago",
    "Puntarenas",
    "Limón",
    "Guanacaste",
    "Other",
  ],
  Panama: ["Panama City", "David", "Other"],
  Cuba: ["La Habana", "Santiago de Cuba", "Other"],
  "Dominican Republic": ["Santo Domingo", "Santiago", "Other"],
  "Puerto Rico": ["San Juan", "Ponce", "Other"],
  Colombia: ["Bogotá", "Medellín", "Cali", "Barranquilla", "Other"],
  Venezuela: ["Caracas", "Maracaibo", "Valencia", "Other"],
  Ecuador: ["Quito", "Guayaquil", "Cuenca", "Other"],
  Peru: ["Lima", "Arequipa", "Cusco", "Other"],
  Bolivia: ["La Paz", "Santa Cruz", "Cochabamba", "Other"],
  Chile: ["Santiago", "Valparaíso", "Concepción", "Other"],
  Argentina: ["Buenos Aires", "Córdoba", "Rosario", "Mendoza", "Other"],
  Uruguay: ["Montevideo", "Punta del Este", "Other"],
  Paraguay: ["Asunción", "Ciudad del Este", "Other"],
  Brazil: ["São Paulo", "Rio de Janeiro", "Brasília", "Other"],
};

const PHONE_CODES = [
  { country: "Mexico", code: "+52" },
  { country: "Guatemala", code: "+502" },
  { country: "Belize", code: "+501" },
  { country: "Honduras", code: "+504" },
  { country: "El Salvador", code: "+503" },
  { country: "Nicaragua", code: "+505" },
  { country: "Costa Rica", code: "+506" },
  { country: "Panama", code: "+507" },
  { country: "Cuba", code: "+53" },
  { country: "Dominican Republic", code: "+1 809" },
  { country: "Puerto Rico", code: "+1 787" },
  { country: "Colombia", code: "+57" },
  { country: "Venezuela", code: "+58" },
  { country: "Ecuador", code: "+593" },
  { country: "Peru", code: "+51" },
  { country: "Bolivia", code: "+591" },
  { country: "Chile", code: "+56" },
  { country: "Argentina", code: "+54" },
  { country: "Uruguay", code: "+598" },
  { country: "Paraguay", code: "+595" },
  { country: "Brazil", code: "+55" },
];

const GENDER_IDENTITY_OPTIONS = [
  "Cisgender woman",
  "Cisgender man",
  "Trans woman",
  "Trans man",
  "Non-binary",
  "Other / self-described",
  "Prefer not to say",
];

const CHRONIC_CONDITION_OPTIONS = [
  "Diabetes",
  "Hypertension",
  "Heart disease",
  "Arrhythmia",
  "Asthma",
  "COPD",
  "Kidney disease",
  "Liver disease / hepatitis",
  "Bleeding disorder",
  "Thyroid disease",
  "Autoimmune disease",
  "Cancer / chemotherapy",
  "Epilepsy / seizures",
  "Psychiatric condition",
  "HIV / immunosuppression",
  "Osteoporosis",
];

const ALLERGY_OPTIONS = [
  "Penicillin",
  "Cephalosporins",
  "Sulfa drugs",
  "NSAIDs / Ibuprofen",
  "Aspirin",
  "Opioids (Codeine, etc.)",
  "Local anesthetics (Lidocaine)",
  "Latex",
  "Chlorhexidine",
  "Nickel / metals",
  "Acrylics / resins",
  "Iodine / contrast media",
  "Shellfish",
  "Peanuts",
  "Tree nuts",
  "Eggs",
  "Milk proteins",
  "Gluten / wheat",
  "Pollen",
  "Insect stings",
];

const EMERGENCY_RELATION_OPTIONS = [
  "Spouse / partner",
  "Mother",
  "Father",
  "Daughter",
  "Son",
  "Sibling",
  "Friend",
  "Caregiver",
  "Other",
];

const HEIGHT_OPTIONS = Array.from({ length: 71 }, (_, i) => 130 + i); // 130–200 cm
const WEIGHT_OPTIONS = Array.from({ length: 121 }, (_, i) => 40 + i); // 40–160 kg

const MONTH_OPTIONS = [
  { value: "01", label: "January" },
  { value: "02", label: "February" },
  { value: "03", label: "March" },
  { value: "04", label: "April" },
  { value: "05", label: "May" },
  { value: "06", label: "June" },
  { value: "07", label: "July" },
  { value: "08", label: "August" },
  { value: "09", label: "September" },
  { value: "10", label: "October" },
  { value: "11", label: "November" },
  { value: "12", label: "December" },
];

const DAY_OPTIONS = Array.from({ length: 31 }, (_, i) => i + 1);
const YEAR_OPTIONS = Array.from(
  { length: 100 },
  (_, i) => new Date().getFullYear() - i
);

const DENTAL_REASON_OPTIONS = [
  "Routine check-up & cleaning",
  "Pain / emergency",
  "Caries evaluation",
  "Implant consultation",
  "Orthodontic consultation",
  "Prosthodontic / dentures",
  "Periodontal evaluation (bleeding gums)",
  "Aesthetic consultation / whitening",
  "Surgery / extractions",
  "Second opinion",
];

const DENTAL_HISTORY_OPTIONS = [
  "Regular cleanings",
  "Fillings / restorations",
  "Root canal treatments",
  "Crowns / bridges",
  "Dental implants",
  "Orthodontic braces",
  "Clear aligners",
  "Periodontal therapy / surgery",
  "Extractions",
  "TMJ / occlusal splints",
];

const DENTAL_ANXIETY_OPTIONS = [
  "No anxiety",
  "Mild",
  "Moderate",
  "Severe / dental phobia",
];

/* ---------- Types ---------- */

type GenderAtBirth = "male" | "female" | "intersex" | "unknown";
type MaritalStatus = "single" | "married" | "divorced" | "widowed" | "other";
type InsuranceStatus = "none" | "private" | "government" | "other";
type TobaccoStatus = "never" | "former" | "current";
type AlcoholStatus = "none" | "social" | "regular" | "heavy";
type BloodType =
  | "A+"
  | "A-"
  | "B+"
  | "B-"
  | "AB+"
  | "AB-"
  | "O+"
  | "O-"
  | "unknown";
type AsaClass = "I" | "II" | "III" | "IV" | "V" | "E";

/* ---------- Accordion shell ---------- */

type SectionKey =
  | "identity"
  | "insurance"
  | "medical"
  | "dental"
  | "risk"
  | "consent";

type SectionState = Record<SectionKey, boolean>;

type SectionProps = {
  id: SectionKey;
  title: string;
  subtitle?: string;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
};

function AccordionSection({
  id,
  title,
  subtitle,
  open,
  onToggle,
  children,
}: SectionProps) {
  return (
    <section
      aria-labelledby={`${id}-header`}
      className="rounded-2xl border border-slate-800 bg-slate-900/70"
    >
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between px-4 md:px-5 py-3 text-left"
      >
        <div>
          <h2
            id={`${id}-header`}
            className="text-xs md:text-sm font-semibold text-slate-50"
          >
            {title}
          </h2>
          {subtitle && (
            <p className="mt-0.5 text-[11px] text-slate-400">{subtitle}</p>
          )}
        </div>
        <span className="ml-4 inline-flex h-6 w-6 items-center justify-center rounded-full border border-slate-700 text-[10px] text-slate-300">
          {open ? "−" : "+"}
        </span>
      </button>

      {open && (
        <div className="border-t border-slate-800 px-4 md:px-5 py-4 space-y-4 text-xs">
          {children}
        </div>
      )}
    </section>
  );
}

/* ---------- Main page ---------- */

export default function NewPatientPage() {
  const [sections, setSections] = useState<SectionState>({
    identity: true,
    insurance: true,
    medical: true,
    dental: true,
    risk: true,
    consent: true,
  });

  /* --- Identity & contacto --- */

  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const [firstName, setFirstName] = useState("");
  const [lastName1, setLastName1] = useState("");
  const [lastName2, setLastName2] = useState("");
  const [adieId, setAdieId] = useState("");

  const [dobYear, setDobYear] = useState("");
  const [dobMonth, setDobMonth] = useState("");
  const [dobDay, setDobDay] = useState("");

  const [genderAtBirth, setGenderAtBirth] =
    useState<GenderAtBirth>("unknown");
  const [genderIdentity, setGenderIdentity] = useState("");
  const [maritalStatus, setMaritalStatus] =
    useState<MaritalStatus>("single");
  const [country, setCountry] = useState("Costa Rica");
  const [city, setCity] = useState("San José");
  const [address, setAddress] = useState("");

  const [mobileCountryCode, setMobileCountryCode] = useState("+506");
  const [mobileNumber, setMobileNumber] = useState("");
  const [otherCountryCode, setOtherCountryCode] = useState("+506");
  const [otherNumber, setOtherNumber] = useState("");
  const [email, setEmail] = useState("");

  const [preferredLanguage, setPreferredLanguage] =
    useState("Spanish / English");
  const [preferredContact, setPreferredContact] = useState("SMS");

  const [emergencyName, setEmergencyName] = useState("");
  const [emergencyRelation, setEmergencyRelation] = useState("");
  const [emergencyCountryCode, setEmergencyCountryCode] =
    useState("+506");
  const [emergencyNumber, setEmergencyNumber] = useState("");

  /* --- Insurance --- */

  const [insuranceStatus, setInsuranceStatus] =
    useState<InsuranceStatus>("none");
  const [primaryInsurance, setPrimaryInsurance] = useState("");
  const [policyNumber, setPolicyNumber] = useState("");
  const [groupNumber, setGroupNumber] = useState("");
  const [subscriberName, setSubscriberName] = useState("");
  const [subscriberDob, setSubscriberDob] = useState("");
  const [secondaryInsurance, setSecondaryInsurance] = useState("");

  /* --- Medical --- */

  const [physicianName, setPhysicianName] = useState("");
  const [physicianPhone, setPhysicianPhone] = useState("");
  const [lastHospitalization, setLastHospitalization] = useState("");

  const [heightCm, setHeightCm] = useState("");
  const [weightKg, setWeightKg] = useState("");

  const [chronicConditions, setChronicConditions] = useState<string[]>(
    []
  );
  const [selectedChronic, setSelectedChronic] = useState(
    CHRONIC_CONDITION_OPTIONS[0]
  );
  const [otherConditions, setOtherConditions] = useState("");

  const [currentMedications, setCurrentMedications] = useState("");

  const [allergyList, setAllergyList] = useState<string[]>([]);
  const [selectedAllergy, setSelectedAllergy] = useState(
    ALLERGY_OPTIONS[0]
  );
  const [otherAllergies, setOtherAllergies] = useState("");
  const [allergyReactions, setAllergyReactions] = useState("");

  const [tobaccoStatus, setTobaccoStatus] =
    useState<TobaccoStatus>("never");
  const [alcoholStatus, setAlcoholStatus] =
    useState<AlcoholStatus>("social");
  const [pregnancyStatus, setPregnancyStatus] = useState("no");

  /* --- Dental --- */

  const [chiefComplaint, setChiefComplaint] = useState("");
  const [primaryDentalReason, setPrimaryDentalReason] = useState(
    DENTAL_REASON_OPTIONS[0]
  );
  const [painScale, setPainScale] = useState(0);
  const [lastDentalVisit, setLastDentalVisit] = useState("");
  const [previousDentist, setPreviousDentist] = useState("");
  const [hygieneHabits, setHygieneHabits] = useState("");

  const [dentalConcerns, setDentalConcerns] = useState("");
  const [dentalHistory, setDentalHistory] = useState<string[]>([]);
  const [selectedDentalHistory, setSelectedDentalHistory] = useState(
    DENTAL_HISTORY_OPTIONS[0]
  );
  const [dentalAnxiety, setDentalAnxiety] = useState(
    DENTAL_ANXIETY_OPTIONS[1]
  );

  /* --- Risk / hospital level --- */

  const [bloodType, setBloodType] = useState<BloodType>("unknown");
  const [asaClass, setAsaClass] = useState<AsaClass>("II");
  const [anticoagulants, setAnticoagulants] = useState("no");
  const [needProphylaxis, setNeedProphylaxis] = useState("no");
  const [anesthesiaComplications, setAnesthesiaComplications] =
    useState("");
  const [recentSurgeries, setRecentSurgeries] = useState("");

  /* --- Consents --- */

  const [hipaaAck, setHipaaAck] = useState(false);
  const [treatmentConsent, setTreatmentConsent] = useState(false);
  const [financialConsent, setFinancialConsent] = useState(false);
  const [photoConsent, setPhotoConsent] = useState(false);
  const [smsConsent, setSmsConsent] = useState(true);
  const [emailConsent, setEmailConsent] = useState(true);

  /* ---------- Helpers ---------- */

  function toggleSection(key: SectionKey) {
    setSections((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  function toggleCondition(condition: string) {
    setChronicConditions((prev) =>
      prev.includes(condition)
        ? prev.filter((c) => c !== condition)
        : [...prev, condition]
    );
  }

  function toggleDentalHistory(item: string) {
    setDentalHistory((prev) =>
      prev.includes(item)
        ? prev.filter((c) => c !== item)
        : [...prev, item]
    );
  }

  function addSelectedAllergy() {
    setAllergyList((prev) =>
      prev.includes(selectedAllergy)
        ? prev
        : [...prev, selectedAllergy]
    );
  }

  function handlePhotoChange(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = e.target.files?.[0];
    if (!file) {
      setPhotoPreview(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setPhotoPreview(url);
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const dobIso =
      dobYear && dobMonth && dobDay
        ? `${dobYear}-${dobMonth}-${dobDay.padStart(2, "0")}`
        : "Not set";

    const fullName = `${firstName} ${lastName1} ${lastName2}`.trim();

    const summary = `
New patient (demo only – not yet saved to DB)

Name: ${fullName}
ADIE ID: ${adieId}
DOB: ${dobIso}
Country/City: ${country} – ${city}
Mobile: ${mobileCountryCode} ${mobileNumber}
Chief complaint: ${chiefComplaint || primaryDentalReason}

Chronic conditions: ${
      chronicConditions.length
        ? chronicConditions.join(", ")
        : "None listed"
    }
Medications: ${currentMedications || "None listed"}
Allergies: ${
      allergyList.length
        ? allergyList.join(", ")
        : "None selected"
    }
Blood type / ASA: ${bloodType} / ASA ${asaClass}
`;

    alert(summary);
  }

  /* ---------- Render ---------- */

  const cityOptions = COUNTRY_CITIES[country] || ["Other"];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 flex flex-col">
      {/* Top bar */}
      <header className="h-16 border-b border-slate-800 bg-slate-950/70 backdrop-blur flex items-center justify-between px-4 md:px-8">
        <div className="flex items-center gap-3">
          <span className="hidden sm:inline-block text-[10px] font-semibold tracking-[0.18em] uppercase text-slate-500">
            Patients
          </span>
        </div>
        <div className="flex flex-col items-end gap-1 text-xs">
          <h1 className="text-base md:text-lg font-semibold">
            New patient intake · ADIE 5.0
          </h1>
          <p className="text-[10px] text-slate-400">
            Hospital-level intake · One ID (ADIE ID) for every module
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <Link
            href="/patients"
            className="rounded-full border border-slate-700 px-3 py-1 hover:border-sky-400"
          >
            Back to registry
          </Link>
        </div>
      </header>

      {/* Main layout */}
      <main className="flex-1 px-4 md:px-8 py-6 flex justify-center overflow-auto">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-5xl space-y-4 pb-10"
        >
          {/* Identity & contact */}
          <AccordionSection
            id="identity"
            title="Identity & contact"
            subtitle="Demographics, language, emergency contact"
            open={sections.identity}
            onToggle={() => toggleSection("identity")}
          >
            {/* Row 0: photo + names */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-center">
              <div className="flex items-center gap-3">
                <div className="h-16 w-16 rounded-full border border-slate-700 bg-slate-900/80 overflow-hidden flex items-center justify-center text-[10px] text-slate-500">
                  {photoPreview ? (
                    <img
                      src={photoPreview}
                      alt="Patient photo preview"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    "No photo"
                  )}
                </div>
                <div>
                  <label className="block text-[11px] text-slate-300 mb-1">
                    Patient photo
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="block text-[10px] text-slate-400 file:mr-2 file:rounded-md file:border-0 file:bg-sky-500/80 file:px-2 file:py-1 file:text-[10px] file:font-semibold file:text-slate-950 hover:file:bg-sky-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] text-slate-300 mb-1">
                  First name
                </label>
                <input
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950/80 px-3 py-2 text-[11px] outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-500/60"
                  placeholder="e.g. Juan"
                  required
                />
              </div>
              <div>
                <label className="block text-[11px] text-slate-300 mb-1">
                  First last name
                </label>
                <input
                  value={lastName1}
                  onChange={(e) => setLastName1(e.target.value)}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950/80 px-3 py-2 text-[11px] outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-500/60"
                  placeholder="e.g. Pérez"
                  required
                />
              </div>
              <div>
                <label className="block text-[11px] text-slate-300 mb-1">
                  Second last name
                </label>
                <input
                  value={lastName2}
                  onChange={(e) => setLastName2(e.target.value)}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950/80 px-3 py-2 text-[11px] outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-500/60"
                  placeholder="e.g. Guzmán"
                />
              </div>
            </div>

            {/* Row 1: ADIE ID + DOB */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3">
              <div>
                <label className="block text-[11px] text-slate-300 mb-1">
                  ADIE ID (Master EMR ID)
                </label>
                <input
                  value={adieId}
                  onChange={(e) => setAdieId(e.target.value)}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950/80 px-3 py-2 text-[11px] outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-500/60"
                  placeholder="ADIE-PT-0001 (or clinic ID)"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-[11px] text-slate-300 mb-1">
                  Date of birth
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <select
                    value={dobMonth}
                    onChange={(e) => setDobMonth(e.target.value)}
                    className="rounded-lg border border-slate-700 bg-slate-950/80 px-2 py-2 text-[11px] outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-500/60"
                    required
                  >
                    <option value="">Month</option>
                    {MONTH_OPTIONS.map((m) => (
                      <option key={m.value} value={m.value}>
                        {m.label}
                      </option>
                    ))}
                  </select>
                  <select
                    value={dobDay}
                    onChange={(e) => setDobDay(e.target.value)}
                    className="rounded-lg border border-slate-700 bg-slate-950/80 px-2 py-2 text-[11px] outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-500/60"
                    required
                  >
                    <option value="">Day</option>
                    {DAY_OPTIONS.map((d) => (
                      <option key={d} value={String(d)}>
                        {d}
                      </option>
                    ))}
                  </select>
                  <select
                    value={dobYear}
                    onChange={(e) => setDobYear(e.target.value)}
                    className="rounded-lg border border-slate-700 bg-slate-950/80 px-2 py-2 text-[11px] outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-500/60"
                    required
                  >
                    <option value="">Year</option>
                    {YEAR_OPTIONS.map((y) => (
                      <option key={y} value={String(y)}>
                        {y}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Row 2: gender / marital / language */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mt-3">
              <div>
                <label className="block text-[11px] text-slate-300 mb-1">
                  Sex at birth
                </label>
                <select
                  value={genderAtBirth}
                  onChange={(e) =>
                    setGenderAtBirth(e.target.value as GenderAtBirth)
                  }
                  className="w-full rounded-lg border border-slate-700 bg-slate-950/80 px-3 py-2 text-[11px] outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-500/60"
                >
                  <option value="unknown">
                    Prefer not to say / unknown
                  </option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="intersex">Intersex</option>
                </select>
              </div>
              <div>
                <label className="block text-[11px] text-slate-300 mb-1">
                  Gender identity
                </label>
                <select
                  value={genderIdentity}
                  onChange={(e) => setGenderIdentity(e.target.value)}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950/80 px-3 py-2 text-[11px] outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-500/60"
                >
                  <option value="">Select...</option>
                  {GENDER_IDENTITY_OPTIONS.map((g) => (
                    <option key={g} value={g}>
                      {g}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[11px] text-slate-300 mb-1">
                  Marital status
                </label>
                <select
                  value={maritalStatus}
                  onChange={(e) =>
                    setMaritalStatus(e.target.value as MaritalStatus)
                  }
                  className="w-full rounded-lg border border-slate-700 bg-slate-950/80 px-3 py-2 text-[11px] outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-500/60"
                >
                  <option value="single">Single</option>
                  <option value="married">Married</option>
                  <option value="divorced">Divorced</option>
                  <option value="widowed">Widowed</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-[11px] text-slate-300 mb-1">
                  Preferred language
                </label>
                <select
                  value={preferredLanguage}
                  onChange={(e) => setPreferredLanguage(e.target.value)}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950/80 px-3 py-2 text-[11px] outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-500/60"
                >
                  <option>Spanish</option>
                  <option>English</option>
                  <option>Spanish / English</option>
                  <option>Portuguese</option>
                  <option>Other</option>
                </select>
              </div>
            </div>

            {/* Row 3: address */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3">
              <div>
                <label className="block text-[11px] text-slate-300 mb-1">
                  Country (Latam)
                </label>
                <select
                  value={country}
                  onChange={(e) => {
                    const newCountry = e.target.value;
                    setCountry(newCountry);
                    const defaultCity =
                      COUNTRY_CITIES[newCountry]?.[0] || "";
                    setCity(defaultCity);
                  }}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950/80 px-3 py-2 text-[11px] outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-500/60"
                >
                  {LATAM_COUNTRIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[11px] text-slate-300 mb-1">
                  City
                </label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950/80 px-3 py-2 text-[11px] outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-500/60"
                >
                  {cityOptions.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[11px] text-slate-300 mb-1">
                  Full address
                </label>
                <input
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950/80 px-3 py-2 text-[11px] outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-500/60"
                  placeholder="Street, number, apt."
                />
              </div>
            </div>

            {/* Row 4: phones / email / preferred contact */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mt-3">
              <div>
                <label className="block text-[11px] text-slate-300 mb-1">
                  Mobile phone
                </label>
                <div className="flex gap-1">
                  <select
                    value={mobileCountryCode}
                    onChange={(e) =>
                      setMobileCountryCode(e.target.value)
                    }
                    className="w-24 rounded-lg border border-slate-700 bg-slate-950/80 px-2 py-2 text-[11px] outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-500/60"
                  >
                    {PHONE_CODES.map((p) => (
                      <option key={p.code} value={p.code}>
                        {p.code} {p.country}
                      </option>
                    ))}
                  </select>
                  <input
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                    className="flex-1 rounded-lg border border-slate-700 bg-slate-950/80 px-3 py-2 text-[11px] outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-500/60"
                    placeholder="8888-8888"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] text-slate-300 mb-1">
                  Other phone
                </label>
                <div className="flex gap-1">
                  <select
                    value={otherCountryCode}
                    onChange={(e) =>
                      setOtherCountryCode(e.target.value)
                    }
                    className="w-24 rounded-lg border border-slate-700 bg-slate-950/80 px-2 py-2 text-[11px] outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-500/60"
                  >
                    {PHONE_CODES.map((p) => (
                      <option key={p.code} value={p.code}>
                        {p.code} {p.country}
                      </option>
                    ))}
                  </select>
                  <input
                    value={otherNumber}
                    onChange={(e) => setOtherNumber(e.target.value)}
                    className="flex-1 rounded-lg border border-slate-700 bg-slate-950/80 px-3 py-2 text-[11px] outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-500/60"
                    placeholder="Home / work"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] text-slate-300 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950/80 px-3 py-2 text-[11px] outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-500/60"
                  placeholder="patient@example.com"
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-300 mb-1">
                  Preferred contact channel
                </label>
                <select
                  value={preferredContact}
                  onChange={(e) => setPreferredContact(e.target.value)}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950/80 px-3 py-2 text-[11px] outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-500/60"
                >
                  <option>SMS</option>
                  <option>WhatsApp</option>
                  <option>Phone call</option>
                  <option>Email</option>
                </select>
              </div>
            </div>

            {/* Emergency contact */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-3 border-t border-slate-800 mt-3">
              <div>
                <label className="block text-[11px] text-slate-300 mb-1">
                  Emergency contact name
                </label>
                <input
                  value={emergencyName}
                  onChange={(e) => setEmergencyName(e.target.value)}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950/80 px-3 py-2 text-[11px] outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-500/60"
                  placeholder="Person to contact in case of emergency"
                />
              </div>
              <div>
                <label className="block text-[11px] text-slate-300 mb-1">
                  Relationship
                </label>
                <select
                  value={emergencyRelation}
                  onChange={(e) =>
                    setEmergencyRelation(e.target.value)
                  }
                  className="w-full rounded-lg border border-slate-700 bg-slate-950/80 px-3 py-2 text-[11px] outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-500/60"
                >
                  <option value="">Select...</option>
                  {EMERGENCY_RELATION_OPTIONS.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[11px] text-slate-300 mb-1">
                  Emergency phone
                </label>
                <div className="flex gap-1">
                  <select
                    value={emergencyCountryCode}
                    onChange={(e) =>
                      setEmergencyCountryCode(e.target.value)
                    }
                    className="w-24 rounded-lg border border-slate-700 bg-slate-950/80 px-2 py-2 text-[11px] outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-500/60"
                  >
                    {PHONE_CODES.map((p) => (
                      <option key={p.code} value={p.code}>
                        {p.code} {p.country}
                      </option>
                    ))}
                  </select>
                  <input
                    value={emergencyNumber}
                    onChange={(e) =>
                      setEmergencyNumber(e.target.value)
                    }
                    className="flex-1 rounded-lg border border-slate-700 bg-slate-950/80 px-3 py-2 text-[11px] outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-500/60"
                    placeholder="+506 ..."
                  />
                </div>
              </div>
            </div>
          </AccordionSection>

          {/* Insurance & financial */}
          <AccordionSection
            id="insurance"
            title="Insurance & financial"
            subtitle="Coverage, subscriber and payer information"
            open={sections.insurance}
            onToggle={() => toggleSection("insurance")}
          >
            {/* Igual que antes, sin cambios grandes */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] text-slate-300 mb-1">
                  Insurance status
                </label>
                <select
                  value={insuranceStatus}
                  onChange={(e) =>
                    setInsuranceStatus(
                      e.target.value as InsuranceStatus
                    )
                  }
                  className="w-full rounded-lg border border-slate-700 bg-slate-950/80 px-3 py-2 text-[11px] outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-500/60"
                >
                  <option value="none">No insurance / self-pay</option>
                  <option value="private">Private insurance</option>
                  <option value="government">
                    Government program
                  </option>
                  <option value="other">Other / custom</option>
                </select>
              </div>
              <div>
                <label className="block text-[11px] text-slate-300 mb-1">
                  Primary insurance
                </label>
                <input
                  value={primaryInsurance}
                  onChange={(e) => setPrimaryInsurance(e.target.value)}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950/80 px-3 py-2 text-[11px] outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-500/60"
                  placeholder="Name of insurer"
                />
              </div>
              <div>
                <label className="block text-[11px] text-slate-300 mb-1">
                  Policy / member #
                </label>
                <input
                  value={policyNumber}
                  onChange={(e) => setPolicyNumber(e.target.value)}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950/80 px-3 py-2 text-[11px] outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-500/60"
                  placeholder="123456789"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] text-slate-300 mb-1">
                  Group #
                </label>
                <input
                  value={groupNumber}
                  onChange={(e) => setGroupNumber(e.target.value)}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950/80 px-3 py-2 text-[11px] outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-500/60"
                />
              </div>
              <div>
                <label className="block text-[11px] text-slate-300 mb-1">
                  Subscriber name
                </label>
                <input
                  value={subscriberName}
                  onChange={(e) => setSubscriberName(e.target.value)}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950/80 px-3 py-2 text-[11px] outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-500/60"
                  placeholder="If different from patient"
                />
              </div>
              <div>
                <label className="block text-[11px] text-slate-300 mb-1">
                  Subscriber DOB
                </label>
                <input
                  type="date"
                  value={subscriberDob}
                  onChange={(e) => setSubscriberDob(e.target.value)}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950/80 px-3 py-2 text-[11px] outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-500/60"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] text-slate-300 mb-1">
                  Secondary insurance (optional)
                </label>
                <input
                  value={secondaryInsurance}
                  onChange={(e) =>
                    setSecondaryInsurance(e.target.value)
                  }
                  className="w-full rounded-lg border border-slate-700 bg-slate-950/80 px-3 py-2 text-[11px] outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-500/60"
                />
              </div>
              <div>
                <p className="text-[10px] text-slate-500 mt-1">
                  In a later step, we&apos;ll connect this block to
                  ADIE&apos;s financial policies, eligibility checks and
                  payment plans.
                </p>
              </div>
            </div>
          </AccordionSection>

          {/* Medical history */}
          <AccordionSection
            id="medical"
            title="Medical history"
            subtitle="Conditions, medications, allergies and lifestyle"
            open={sections.medical}
            onToggle={() => toggleSection("medical")}
          >
            {/* Physician / vitals */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <div className="md:col-span-2">
                <label className="block text-[11px] text-slate-300 mb-1">
                  Primary care physician
                </label>
                <input
                  value={physicianName}
                  onChange={(e) => setPhysicianName(e.target.value)}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950/80 px-3 py-2 text-[11px] outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-500/60"
                  placeholder="Name of physician / clinic"
                />
              </div>
              <div>
                <label className="block text-[11px] text-slate-300 mb-1">
                  Physician phone
                </label>
                <input
                  value={physicianPhone}
                  onChange={(e) => setPhysicianPhone(e.target.value)}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950/80 px-3 py-2 text-[11px] outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-500/60"
                  placeholder="+1 ..."
                />
              </div>
              <div>
                <label className="block text-[11px] text-slate-300 mb-1">
                  Last hospitalization (year)
                </label>
                <input
                  value={lastHospitalization}
                  onChange={(e) =>
                    setLastHospitalization(e.target.value)
                  }
                  className="w-full rounded-lg border border-slate-700 bg-slate-950/80 px-3 py-2 text-[11px] outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-500/60"
                  placeholder="e.g. 2023 or N/A"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mt-3">
              <div>
                <label className="block text-[11px] text-slate-300 mb-1">
                  Height (cm)
                </label>
                <select
                  value={heightCm}
                  onChange={(e) => setHeightCm(e.target.value)}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950/80 px-3 py-2 text-[11px] outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-500/60"
                >
                  <option value="">Select...</option>
                  {HEIGHT_OPTIONS.map((h) => (
                    <option key={h} value={String(h)}>
                      {h} cm
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[11px] text-slate-300 mb-1">
                  Weight (kg)
                </label>
                <select
                  value={weightKg}
                  onChange={(e) => setWeightKg(e.target.value)}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950/80 px-3 py-2 text-[11px] outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-500/60"
                >
                  <option value="">Select...</option>
                  {WEIGHT_OPTIONS.map((w) => (
                    <option key={w} value={String(w)}>
                      {w} kg
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[11px] text-slate-300 mb-1">
                  Tobacco use
                </label>
                <select
                  value={tobaccoStatus}
                  onChange={(e) =>
                    setTobaccoStatus(e.target.value as TobaccoStatus)
                  }
                  className="w-full rounded-lg border border-slate-700 bg-slate-950/80 px-3 py-2 text-[11px] outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-500/60"
                >
                  <option value="never">Never</option>
                  <option value="former">Former</option>
                  <option value="current">Current</option>
                </select>
              </div>
              <div>
                <label className="block text-[11px] text-slate-300 mb-1">
                  Alcohol use
                </label>
                <select
                  value={alcoholStatus}
                  onChange={(e) =>
                    setAlcoholStatus(e.target.value as AlcoholStatus)
                  }
                  className="w-full rounded-lg border border-slate-700 bg-slate-950/80 px-3 py-2 text-[11px] outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-500/60"
                >
                  <option value="none">None</option>
                  <option value="social">Social</option>
                  <option value="regular">Regular</option>
                  <option value="heavy">Heavy</option>
                </select>
              </div>
            </div>

            {/* Chronic conditions dropdown + chips */}
            <div className="mt-4 space-y-2">
              <label className="block text-[11px] text-slate-300">
                Chronic medical conditions (select and add)
              </label>
              <div className="flex flex-wrap items-center gap-2">
                <select
                  value={selectedChronic}
                  onChange={(e) => setSelectedChronic(e.target.value)}
                  className="rounded-lg border border-slate-700 bg-slate-950/80 px-3 py-2 text-[11px] outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-500/60"
                >
                  {CHRONIC_CONDITION_OPTIONS.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => toggleCondition(selectedChronic)}
                  className="rounded-full bg-emerald-500 px-3 py-1 text-[11px] font-semibold text-slate-950 hover:bg-emerald-400"
                >
                  Add condition
                </button>
              </div>

              {chronicConditions.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {chronicConditions.map((cond) => (
                    <button
                      key={cond}
                      type="button"
                      onClick={() => toggleCondition(cond)}
                      className="rounded-full border border-emerald-400 bg-emerald-500/10 px-3 py-1 text-[11px] text-emerald-100"
                      title="Click to remove"
                    >
                      {cond}
                    </button>
                  ))}
                </div>
              )}

              <textarea
                value={otherConditions}
                onChange={(e) => setOtherConditions(e.target.value)}
                rows={3}
                className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950/80 px-3 py-2 text-[11px] outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-500/60"
                placeholder="Other systemic conditions, hospitalizations or details not listed above."
              />
            </div>

            {/* Medications & allergies */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
              <div>
                <label className="block text-[11px] text-slate-300 mb-1">
                  Current medications
                </label>
                <textarea
                  value={currentMedications}
                  onChange={(e) =>
                    setCurrentMedications(e.target.value)
                  }
                  rows={4}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950/80 px-3 py-2 text-[11px] outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-500/60"
                  placeholder="Drug name, dose and frequency. e.g. Metformin 500 mg BID, Lisinopril 10 mg daily."
                />
              </div>

              <div className="space-y-2">
                <label className="block text-[11px] text-slate-300 mb-1">
                  Allergies & adverse reactions
                </label>
                <div className="flex flex-wrap items-center gap-2">
                  <select
                    value={selectedAllergy}
                    onChange={(e) =>
                      setSelectedAllergy(e.target.value)
                    }
                    className="rounded-lg border border-slate-700 bg-slate-950/80 px-3 py-2 text-[11px] outline-none focus:border-rose-400 focus:ring-1 focus:ring-rose-500/60"
                  >
                    {ALLERGY_OPTIONS.map((a) => (
                      <option key={a} value={a}>
                        {a}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={addSelectedAllergy}
                    className="rounded-full bg-rose-500 px-3 py-1 text-[11px] font-semibold text-slate-950 hover:bg-rose-400"
                  >
                    Add allergy
                  </button>
                </div>

                {allergyList.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {allergyList.map((a) => (
                      <span
                        key={a}
                        className="rounded-full border border-rose-400 bg-rose-500/10 px-3 py-1 text-[11px] text-rose-100"
                      >
                        {a}
                      </span>
                    ))}
                  </div>
                )}

                <textarea
                  value={otherAllergies}
                  onChange={(e) =>
                    setOtherAllergies(e.target.value)
                  }
                  rows={2}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950/80 px-3 py-2 text-[11px] outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-500/60"
                  placeholder="Other allergies not listed above."
                />

                <textarea
                  value={allergyReactions}
                  onChange={(e) =>
                    setAllergyReactions(e.target.value)
                  }
                  rows={2}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950/80 px-3 py-2 text-[11px] outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-500/60"
                  placeholder="Describe type of reaction (rash, anaphylaxis, GI upset, etc.)."
                />
              </div>
            </div>

            {/* Pregnancy */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3">
              <div>
                <label className="block text-[11px] text-slate-300 mb-1">
                  Pregnancy / breastfeeding
                </label>
                <select
                  value={pregnancyStatus}
                  onChange={(e) =>
                    setPregnancyStatus(e.target.value)
                  }
                  className="w-full rounded-lg border border-slate-700 bg-slate-950/80 px-3 py-2 text-[11px] outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-500/60"
                >
                  <option value="no">No / not applicable</option>
                  <option value="pregnant">Pregnant</option>
                  <option value="breastfeeding">Breastfeeding</option>
                  <option value="unknown">Unknown</option>
                </select>
              </div>
            </div>
          </AccordionSection>

          {/* Dental history */}
          <AccordionSection
            id="dental"
            title="Dental history"
            subtitle="Chief complaint, previous treatments, hygiene habits"
            open={sections.dental}
            onToggle={() => toggleSection("dental")}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] text-slate-300 mb-1">
                  Primary reason for visit
                </label>
                <select
                  value={primaryDentalReason}
                  onChange={(e) =>
                    setPrimaryDentalReason(e.target.value)
                  }
                  className="w-full rounded-lg border border-slate-700 bg-slate-950/80 px-3 py-2 text-[11px] outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-500/60"
                >
                  {DENTAL_REASON_OPTIONS.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
                <textarea
                  value={chiefComplaint}
                  onChange={(e) => setChiefComplaint(e.target.value)}
                  rows={3}
                  className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950/80 px-3 py-2 text-[11px] outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-500/60"
                  placeholder="Free-text chief complaint if patient wants to describe in their own words."
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-300 mb-1">
                  Current dental concerns
                </label>
                <textarea
                  value={dentalConcerns}
                  onChange={(e) =>
                    setDentalConcerns(e.target.value)
                  }
                  rows={3}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950/80 px-3 py-2 text-[11px] outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-500/60"
                  placeholder="Sensitivity, bleeding gums, broken restorations, TMJ symptoms, etc."
                />

                <div className="mt-3">
                  <label className="block text-[11px] text-slate-300 mb-1">
                    Dental anxiety level
                  </label>
                  <select
                    value={dentalAnxiety}
                    onChange={(e) =>
                      setDentalAnxiety(e.target.value)
                    }
                    className="w-full rounded-lg border border-slate-700 bg-slate-950/80 px-3 py-2 text-[11px] outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-500/60"
                  >
                    {DENTAL_ANXIETY_OPTIONS.map((a) => (
                      <option key={a} value={a}>
                        {a}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mt-3">
              <div>
                <label className="block text-[11px] text-slate-300 mb-1">
                  Pain level (0–10)
                </label>
                <input
                  type="number"
                  min={0}
                  max={10}
                  value={painScale}
                  onChange={(e) =>
                    setPainScale(Number(e.target.value))
                  }
                  className="w-full rounded-lg border border-slate-700 bg-slate-950/80 px-3 py-2 text-[11px] outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-500/60"
                />
              </div>
              <div>
                <label className="block text-[11px] text-slate-300 mb-1">
                  Last dental visit
                </label>
                <input
                  type="date"
                  value={lastDentalVisit}
                  onChange={(e) =>
                    setLastDentalVisit(e.target.value)
                  }
                  className="w-full rounded-lg border border-slate-700 bg-slate-950/80 px-3 py-2 text-[11px] outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-500/60"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-[11px] text-slate-300 mb-1">
                  Previous dentist / clinic
                </label>
                <input
                  value={previousDentist}
                  onChange={(e) =>
                    setPreviousDentist(e.target.value)
                  }
                  className="w-full rounded-lg border border-slate-700 bg-slate-950/80 px-3 py-2 text-[11px] outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-500/60"
                  placeholder="Name of previous provider"
                />
              </div>
            </div>

            {/* Dental history dropdown + chips */}
            <div className="mt-4 space-y-2">
              <label className="block text-[11px] text-slate-300 mb-1">
                Previous dental treatments (select and add)
              </label>
              <div className="flex flex-wrap items-center gap-2">
                <select
                  value={selectedDentalHistory}
                  onChange={(e) =>
                    setSelectedDentalHistory(e.target.value)
                  }
                  className="rounded-lg border border-slate-700 bg-slate-950/80 px-3 py-2 text-[11px] outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-500/60"
                >
                  {DENTAL_HISTORY_OPTIONS.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() =>
                    toggleDentalHistory(selectedDentalHistory)
                  }
                  className="rounded-full bg-sky-500 px-3 py-1 text-[11px] font-semibold text-slate-950 hover:bg-sky-400"
                >
                  Add treatment
                </button>
              </div>

              {dentalHistory.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {dentalHistory.map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => toggleDentalHistory(item)}
                      className="rounded-full border border-sky-400 bg-sky-500/10 px-3 py-1 text-[11px] text-sky-100"
                      title="Click to remove"
                    >
                      {item}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
              <div>
                <label className="block text-[11px] text-slate-300 mb-1">
                  Oral hygiene habits
                </label>
                <textarea
                  value={hygieneHabits}
                  onChange={(e) =>
                    setHygieneHabits(e.target.value)
                  }
                  rows={3}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950/80 px-3 py-2 text-[11px] outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-500/60"
                  placeholder="Brushing frequency, flossing, mouthwash, auxiliary devices."
                />
              </div>
              <div>
                <p className="text-[10px] text-slate-500 mt-1">
                  In future ADIE versions this block will be linked to
                  odontogram, perio chart, endo, implants and ortho to
                  correlate chief complaint, risk and findings.
                </p>
              </div>
            </div>
          </AccordionSection>

          {/* Risk & hospital-level intake */}
          <AccordionSection
            id="risk"
            title="Risk & hospital-level intake"
            subtitle="Blood type, ASA, anticoagulants, prophylaxis"
            open={sections.risk}
            onToggle={() => toggleSection("risk")}
          >
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <div>
                <label className="block text-[11px] text-slate-300 mb-1">
                  Blood type
                </label>
                <select
                  value={bloodType}
                  onChange={(e) =>
                    setBloodType(e.target.value as BloodType)
                  }
                  className="w-full rounded-lg border border-slate-700 bg-slate-950/80 px-3 py-2 text-[11px] outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-500/60"
                >
                  <option value="unknown">Unknown</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>
              </div>
              <div>
                <label className="block text-[11px] text-slate-300 mb-1">
                  ASA classification
                </label>
                <select
                  value={asaClass}
                  onChange={(e) =>
                    setAsaClass(e.target.value as AsaClass)
                  }
                  className="w-full rounded-lg border border-slate-700 bg-slate-950/80 px-3 py-2 text-[11px] outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-500/60"
                >
                  <option value="I">ASA I</option>
                  <option value="II">ASA II</option>
                  <option value="III">ASA III</option>
                  <option value="IV">ASA IV</option>
                  <option value="V">ASA V</option>
                  <option value="E">E (emergency)</option>
                </select>
              </div>
              <div>
                <label className="block text-[11px] text-slate-300 mb-1">
                  On anticoagulants?
                </label>
                <select
                  value={anticoagulants}
                  onChange={(e) =>
                    setAnticoagulants(e.target.value)
                  }
                  className="w-full rounded-lg border border-slate-700 bg-slate-950/80 px-3 py-2 text-[11px] outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-500/60"
                >
                  <option value="no">No</option>
                  <option value="yes">Yes</option>
                  <option value="unknown">Unknown</option>
                </select>
              </div>
              <div>
                <label className="block text-[11px] text-slate-300 mb-1">
                  Antibiotic prophylaxis required?
                </label>
                <select
                  value={needProphylaxis}
                  onChange={(e) =>
                    setNeedProphylaxis(e.target.value)
                  }
                  className="w-full rounded-lg border border-slate-700 bg-slate-950/80 px-3 py-2 text-[11px] outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-500/60"
                >
                  <option value="no">No</option>
                  <option value="yes">Yes</option>
                  <option value="unknown">Unknown / to evaluate</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
              <div>
                <label className="block text-[11px] text-slate-300 mb-1">
                  History of complications with anesthesia or sedation
                </label>
                <textarea
                  value={anesthesiaComplications}
                  onChange={(e) =>
                    setAnesthesiaComplications(e.target.value)
                  }
                  rows={3}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950/80 px-3 py-2 text-[11px] outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-500/60"
                  placeholder="Syncope, malignant hyperthermia, allergic reactions, airway issues, etc."
                />
              </div>
              <div>
                <label className="block text-[11px] text-slate-300 mb-1">
                  Major surgeries / procedures (last 5 years)
                </label>
                <textarea
                  value={recentSurgeries}
                  onChange={(e) =>
                    setRecentSurgeries(e.target.value)
                  }
                  rows={3}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950/80 px-3 py-2 text-[11px] outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-500/60"
                  placeholder="Type of surgery, year, complications."
                />
              </div>
            </div>
          </AccordionSection>

          {/* Consents */}
          <AccordionSection
            id="consent"
            title="Consents & communication"
            subtitle="HIPAA, treatment, financial and media"
            open={sections.consent}
            onToggle={() => toggleSection("consent")}
          >
            <div className="space-y-2 text-[11px]">
              <label className="flex items-start gap-2">
                <input
                  type="checkbox"
                  checked={hipaaAck}
                  onChange={(e) => setHipaaAck(e.target.checked)}
                  className="mt-0.5"
                />
                <span>
                  I acknowledge that I have received and reviewed the{" "}
                  <strong>Notice of Privacy Practices (HIPAA)</strong> for
                  this clinic.
                </span>
              </label>
              <label className="flex items-start gap-2">
                <input
                  type="checkbox"
                  checked={treatmentConsent}
                  onChange={(e) =>
                    setTreatmentConsent(e.target.checked)
                  }
                  className="mt-0.5"
                />
                <span>
                  I consent to receive dental evaluation and treatment as
                  recommended by the providers of this clinic.
                </span>
              </label>
              <label className="flex items-start gap-2">
                <input
                  type="checkbox"
                  checked={financialConsent}
                  onChange={(e) =>
                    setFinancialConsent(e.target.checked)
                  }
                  className="mt-0.5"
                />
                <span>
                  I accept financial responsibility for services not
                  covered by my insurance and authorize direct assignment
                  of benefits to the provider.
                </span>
              </label>
              <label className="flex items-start gap-2">
                <input
                  type="checkbox"
                  checked={photoConsent}
                  onChange={(e) =>
                    setPhotoConsent(e.target.checked)
                  }
                  className="mt-0.5"
                />
                <span>
                  I consent to the use of intraoral and extraoral
                  photographs and radiographs for clinical documentation
                  and, if authorized, de-identified teaching / research.
                </span>
              </label>

              <div className="pt-2 border-t border-slate-800 mt-2 space-y-1">
                <label className="flex items-start gap-2">
                  <input
                    type="checkbox"
                    checked={smsConsent}
                    onChange={(e) =>
                      setSmsConsent(e.target.checked)
                    }
                    className="mt-0.5"
                  />
                  <span>
                    I agree to receive SMS / text reminders for
                    appointments and important clinical information.
                  </span>
                </label>
                <label className="flex items-start gap-2">
                  <input
                    type="checkbox"
                    checked={emailConsent}
                    onChange={(e) =>
                      setEmailConsent(e.target.checked)
                    }
                    className="mt-0.5"
                  />
                  <span>
                    I agree to receive secure email communication about
                    my care, statements and educational material.
                  </span>
                </label>
              </div>

              <p className="text-[10px] text-slate-500 mt-2">
                In ADIE production, these checkboxes will map to consent
                tables per patient with timestamp, user, and PDF / digital
                signature versioning.
              </p>
            </div>
          </AccordionSection>

          {/* Action buttons */}
          <div className="flex justify-between items-center pt-2">
            <p className="text-[10px] text-slate-500">
              This is a high-fidelity intake shell. Next step: connect it
              to ADIE&apos;s Postgres tables (<code>patients</code>,{" "}
              <code>medical_history</code>, <code>dental_history</code>,{" "}
              <code>consents</code>) and pre-fill for future updates.
            </p>
            <div className="flex gap-2 text-[11px]">
              <Link
                href="/patients"
                className="rounded-full border border-slate-700 px-4 py-1.5 hover:border-rose-400 hover:text-rose-300"
              >
                Cancel
              </Link>
              <button
                type="submit"
                className="rounded-full bg-emerald-500 px-4 py-1.5 font-semibold text-slate-950 hover:bg-emerald-400"
              >
                Save patient (demo)
              </button>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}
