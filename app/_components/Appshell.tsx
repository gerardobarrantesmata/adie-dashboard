"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { RightRail } from "@/app/_components/RightRail";

type AppShellProps = {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  topActions?: React.ReactNode;
  showRightRail?: boolean;
  className?: string;
};

type NavItem = {
  href: string;
  label: string;
};

const NAV: NavItem[] = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/patients", label: "Patients" },
  { href: "/calendar", label: "Calendar" },
  { href: "/specialties", label: "Specialties" },
  { href: "/operations-hub", label: "Operations Hub" },
  { href: "/odontogram", label: "Odontogram" },
];

function isActivePath(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(href + "/");
}

export function AppShell({
  children,
  title,
  subtitle,
  topActions,
  showRightRail = true,
  className = "",
}: AppShellProps) {
  const pathname = usePathname();

  return (
    <div className={`min-h-dvh bg-slate-950 text-slate-100 ${className}`}>
      <div className="mx-auto w-full max-w-[1650px]">
        <div className="grid grid-cols-1 lg:grid-cols-[260px_minmax(0,1fr)_320px]">
          {/* LEFT: Sidebar */}
          <aside className="hidden lg:block border-r border-slate-800 bg-slate-950/70">
            <div className="sticky top-0 h-dvh overflow-auto px-4 py-5">
              <div className="mb-5">
                <div className="text-sm font-semibold tracking-wide">
                  ADIE EMR
                </div>
                <div className="text-[11px] text-slate-400">
                  Global shell (Sidebar + Topbar + RightRail)
                </div>
              </div>

              <nav className="space-y-1">
                {NAV.map((item) => {
                  const active = isActivePath(pathname, item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={[
                        "block rounded-xl px-3 py-2 text-xs",
                        "border border-transparent",
                        active
                          ? "bg-slate-900/70 border-slate-700 text-slate-50"
                          : "text-slate-300 hover:bg-slate-900/40 hover:text-slate-100",
                      ].join(" ")}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </nav>

              <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-900/40 p-4 text-xs text-slate-300">
                <div className="text-[11px] font-semibold tracking-[0.18em] uppercase text-slate-400">
                  Tip
                </div>
                <p className="mt-2">
                  Mantén todas las páginas dentro de layouts que usen AppShell
                  para garantizar consistencia.
                </p>
              </div>
            </div>
          </aside>

          {/* CENTER: Topbar + Main */}
          <div className="min-w-0">
            {/* TOPBAR */}
            <header className="sticky top-0 z-30 border-b border-slate-800 bg-slate-950/80 backdrop-blur">
              <div className="px-4 py-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <div className="text-sm font-semibold">
                        {title ?? "ADIE"}
                      </div>
                      <div className="hidden sm:block text-[11px] text-slate-500">
                        •
                      </div>
                      <div className="hidden sm:block text-[11px] text-slate-400 truncate">
                        {subtitle ?? pathname}
                      </div>
                    </div>

                    {/* Mobile quick nav */}
                    <div className="mt-2 flex gap-2 overflow-x-auto pb-1 lg:hidden">
                      {NAV.slice(0, 4).map((item) => {
                        const active = isActivePath(pathname, item.href);
                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            className={[
                              "shrink-0 rounded-full px-3 py-1 text-[11px]",
                              active
                                ? "bg-slate-900/80 text-slate-100 border border-slate-700"
                                : "bg-slate-900/40 text-slate-300 border border-slate-800",
                            ].join(" ")}
                          >
                            {item.label}
                          </Link>
                        );
                      })}
                    </div>
                  </div>

                  {topActions ? (
                    <div className="shrink-0">{topActions}</div>
                  ) : null}
                </div>
              </div>
            </header>

            {/* MAIN */}
            <main className="px-4 py-4">{children}</main>
          </div>

          {/* RIGHT: RightRail */}
          {showRightRail ? <RightRail /> : null}
        </div>
      </div>
    </div>
  );
}
