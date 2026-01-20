"use client";

import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type LatAmCountry =
  | "Argentina"
  | "Belice"
  | "Bolivia"
  | "Brasil"
  | "Chile"
  | "Colombia"
  | "Costa Rica"
  | "Cuba"
  | "Ecuador"
  | "El Salvador"
  | "Guatemala"
  | "Guyana"
  | "Haití"
  | "Honduras"
  | "México"
  | "Nicaragua"
  | "Panamá"
  | "Paraguay"
  | "Perú"
  | "Puerto Rico"
  | "República Dominicana"
  | "Surinam"
  | "Uruguay"
  | "Venezuela";

const LATAM_COUNTRIES: LatAmCountry[] = [
  "Argentina",
  "Belice",
  "Bolivia",
  "Brasil",
  "Chile",
  "Colombia",
  "Costa Rica",
  "Cuba",
  "Ecuador",
  "El Salvador",
  "Guatemala",
  "Guyana",
  "Haití",
  "Honduras",
  "México",
  "Nicaragua",
  "Panamá",
  "Paraguay",
  "Perú",
  "Puerto Rico",
  "República Dominicana",
  "Surinam",
  "Uruguay",
  "Venezuela",
];

// Lista “starter” (ciudades más comunes). Luego la podemos ampliar con dataset real.
const CITIES_BY_COUNTRY: Record<LatAmCountry, string[]> = {
  Argentina: ["Buenos Aires", "Córdoba", "Rosario", "Mendoza", "La Plata"],
  Belice: ["Belize City", "Belmopán", "San Ignacio", "Orange Walk", "Corozal"],
  Bolivia: ["Santa Cruz", "La Paz", "Cochabamba", "Sucre", "Oruro"],
  Brasil: ["São Paulo", "Rio de Janeiro", "Brasília", "Salvador", "Belo Horizonte"],
  Chile: ["Santiago", "Valparaíso", "Concepción", "Antofagasta", "La Serena"],
  Colombia: ["Bogotá", "Medellín", "Cali", "Barranquilla", "Cartagena"],
  "Costa Rica": ["San José", "Alajuela", "Cartago", "Heredia", "Puntarenas"],
  Cuba: ["La Habana", "Santiago de Cuba", "Camagüey", "Holguín", "Santa Clara"],
  Ecuador: ["Quito", "Guayaquil", "Cuenca", "Manta", "Ambato"],
  "El Salvador": ["San Salvador", "Santa Ana", "San Miguel", "Soyapango", "Santa Tecla"],
  Guatemala: ["Ciudad de Guatemala", "Quetzaltenango", "Escuintla", "Antigua Guatemala", "Huehuetenango"],
  Guyana: ["Georgetown", "Linden", "New Amsterdam", "Bartica", "Lethem"],
  Haití: ["Puerto Príncipe", "Cap-Haïtien", "Gonaïves", "Les Cayes", "Jacmel"],
  Honduras: ["Tegucigalpa", "San Pedro Sula", "La Ceiba", "Choloma", "Comayagua"],
  México: ["Ciudad de México", "Guadalajara", "Monterrey", "Puebla", "Tijuana"],
  Nicaragua: ["Managua", "León", "Granada", "Masaya", "Estelí"],
  Panamá: ["Ciudad de Panamá", "San Miguelito", "Colón", "David", "La Chorrera"],
  Paraguay: ["Asunción", "Ciudad del Este", "San Lorenzo", "Luque", "Encarnación"],
  Perú: ["Lima", "Arequipa", "Trujillo", "Cusco", "Chiclayo"],
  "Puerto Rico": ["San Juan", "Bayamón", "Carolina", "Ponce", "Caguas"],
  "República Dominicana": ["Santo Domingo", "Santiago", "La Romana", "San Pedro de Macorís", "San Cristóbal"],
  Surinam: ["Paramaribo", "Lelydorp", "Nieuw Nickerie", "Moengo", "Albina"],
  Uruguay: ["Montevideo", "Punta del Este", "Salto", "Paysandú", "Rivera"],
  Venezuela: ["Caracas", "Maracaibo", "Valencia", "Barquisimeto", "Maracay"],
};

const OTHER_CITY_VALUE = "__OTHER__";

function slugifyClinicCode(input: string) {
  return input
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // quita acentos
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

export default function SignupPage() {
  const router = useRouter();

  const [clinicName, setClinicName] = useState("");
  const [clinicCode, setClinicCode] = useState("");

  const [country, setCountry] = useState<LatAmCountry | "">("");
  const [citySelect, setCitySelect] = useState<string>("");
  const [cityOther, setCityOther] = useState("");

  const [ownerFullName, setOwnerFullName] = useState("");
  const [ownerEmail, setOwnerEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cityOptions = useMemo(() => {
    if (!country) return [];
    const base = CITIES_BY_COUNTRY[country] ?? [];
    // Agregamos “Otra ciudad…” al final
    return [...base, OTHER_CITY_VALUE];
  }, [country]);

  const resolvedCity = useMemo(() => {
    if (!country) return "";
    if (citySelect === OTHER_CITY_VALUE) return cityOther.trim();
    return (citySelect || "").trim();
  }, [country, citySelect, cityOther]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const cleanEmail = ownerEmail.trim().toLowerCase();
    const cleanClinicName = clinicName.trim();
    const cleanClinicCode = clinicCode.trim() ? slugifyClinicCode(clinicCode) : slugifyClinicCode(cleanClinicName);

    if (!cleanClinicName) return setError("Falta Clinic Name.");
    if (!cleanClinicCode) return setError("Falta Clinic Code.");
    if (!country) return setError("Selecciona un país.");
    if (!resolvedCity) return setError("Selecciona o escribe la ciudad.");
    if (!ownerFullName.trim()) return setError("Falta Owner Full Name.");
    if (!cleanEmail) return setError("Falta Owner Email.");
    if (!password) return setError("Falta Password.");

    setLoading(true);

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clinicName: cleanClinicName,
          clinicCode: cleanClinicCode,
          country,
          city: resolvedCity,
          ownerFullName: ownerFullName.trim(),
          ownerEmail: cleanEmail,
          password,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(data?.error ?? "Signup falló.");
        setLoading(false);
        return;
      }

      // Lo normal: después de signup, ya existe sesión o te manda a login.
      // Si tu endpoint devuelve next, lo respetamos.
      const next = data?.next || "/login";
      router.push(next);
      router.refresh();
    } catch {
      setError("Error de red. Revisa tu conexión.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6">
      <div className="w-full max-w-2xl rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-[0_18px_60px_rgba(15,23,42,0.75)]">
        <h1 className="text-lg font-semibold tracking-wide">ADIE — Create Workspace</h1>
        <p className="mt-1 text-xs text-slate-400">
          Crea tu clínica, sede principal y usuario <b>Owner</b> en un solo paso.
        </p>

        <form className="mt-5 space-y-4" onSubmit={onSubmit}>
          {/* Clinic fields */}
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <div>
              <label className="text-xs text-slate-300">Clinic Name</label>
              <input
                value={clinicName}
                onChange={(e) => {
                  const v = e.target.value;
                  setClinicName(v);
                  // Si clinicCode está vacío, lo prellenamos con slug del nombre (opcional)
                  if (!clinicCode.trim()) setClinicCode(slugifyClinicCode(v));
                }}
                className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950/70 px-3 py-2 text-sm outline-none focus:border-amber-400"
                placeholder="ej: Ortho Club Dental"
                autoComplete="organization"
                required
              />
            </div>

            <div>
              <label className="text-xs text-slate-300">Clinic Code</label>
              <input
                value={clinicCode}
                onChange={(e) => setClinicCode(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950/70 px-3 py-2 text-sm outline-none focus:border-amber-400"
                placeholder="ej: ortho-club"
                autoComplete="off"
                required
              />
              <p className="mt-1 text-[11px] text-slate-500">
                Único global. Usa letras/números y guiones. (ej: <b>ortho-club</b>)
              </p>
            </div>
          </div>

          {/* Country/City */}
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <div>
              <label className="text-xs text-slate-300">Country (LatAm)</label>
              <select
                value={country}
                onChange={(e) => {
                  const v = e.target.value as LatAmCountry | "";
                  setCountry(v);
                  setCitySelect("");
                  setCityOther("");
                }}
                className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950/70 px-3 py-2 text-sm outline-none focus:border-amber-400"
                required
              >
                <option value="" disabled>
                  Selecciona un país…
                </option>
                {LATAM_COUNTRIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs text-slate-300">City</label>
              <select
                value={citySelect}
                onChange={(e) => setCitySelect(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950/70 px-3 py-2 text-sm outline-none focus:border-amber-400 disabled:opacity-60"
                disabled={!country}
                required
              >
                <option value="" disabled>
                  {country ? "Selecciona una ciudad…" : "Selecciona país primero…"}
                </option>

                {country &&
                  cityOptions.map((city) =>
                    city === OTHER_CITY_VALUE ? (
                      <option key={city} value={city}>
                        Otra ciudad…
                      </option>
                    ) : (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    )
                  )}
              </select>

              {citySelect === OTHER_CITY_VALUE && (
                <input
                  value={cityOther}
                  onChange={(e) => setCityOther(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950/70 px-3 py-2 text-sm outline-none focus:border-amber-400"
                  placeholder="Escribe tu ciudad"
                  autoComplete="address-level2"
                  required
                />
              )}
            </div>
          </div>

          {/* Owner */}
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <div>
              <label className="text-xs text-slate-300">Owner Full Name</label>
              <input
                value={ownerFullName}
                onChange={(e) => setOwnerFullName(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950/70 px-3 py-2 text-sm outline-none focus:border-amber-400"
                placeholder="ej: Dr. Gerardo Barrantes"
                autoComplete="name"
                required
              />
            </div>

            <div>
              <label className="text-xs text-slate-300">Owner Email</label>
              <input
                value={ownerEmail}
                onChange={(e) => setOwnerEmail(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950/70 px-3 py-2 text-sm outline-none focus:border-amber-400"
                placeholder="ej: owner@clinic.com"
                autoComplete="email"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-slate-300">Password</label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950/70 px-3 py-2 text-sm outline-none focus:border-amber-400"
              type="password"
              autoComplete="new-password"
              required
            />
            <p className="mt-1 text-[11px] text-slate-500">
              Recomendado: 10+ caracteres, mayúsculas, minúsculas y número.
            </p>
          </div>

          {error && (
            <div className="rounded-xl border border-red-900/50 bg-red-950/40 p-3 text-xs text-red-200">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-amber-500 px-4 py-2 text-sm font-semibold text-slate-950 disabled:opacity-60"
          >
            {loading ? "Creando..." : "Create Workspace"}
          </button>
        </form>
      </div>
    </main>
  );
}
