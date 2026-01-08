// app/settings/page.tsx
import Link from "next/link";

export default function SettingsHome() {
  return (
    <div className="max-w-4xl space-y-4">
      <section className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
        <p className="text-xs font-semibold text-slate-100">Settings Overview</p>
        <p className="text-[11px] text-slate-400 mt-1">
          Manage your clinic configuration. Everything here is scoped to the clinic (tenant) of the logged-in user.
        </p>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Link
          href="/settings/providers"
          className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4 hover:border-sky-400"
        >
          <p className="text-[11px] font-semibold tracking-[0.18em] uppercase text-slate-400">Providers</p>
          <p className="text-sm font-semibold text-slate-100 mt-1">Doctors & Staff Providers</p>
          <p className="text-[11px] text-slate-400 mt-1">
            Add/remove providers and assign specialties (multi-specialty).
          </p>
        </Link>

        <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
          <p className="text-[11px] font-semibold tracking-[0.18em] uppercase text-slate-500">Next</p>
          <p className="text-sm font-semibold text-slate-200 mt-1">Clinic Locations (Sedes)</p>
          <p className="text-[11px] text-slate-500 mt-1">
            We will add a Locations model + UI next (multi-site per clinic).
          </p>
        </div>
      </section>
    </div>
  );
}
