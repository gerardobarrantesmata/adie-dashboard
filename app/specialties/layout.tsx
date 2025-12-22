// app/specialties/layout.tsx
import type { ReactNode } from "react";
import { AppShell } from "../_components/Appshell";

type SpecialtiesLayoutProps = {
  children: ReactNode;
};

export default function SpecialtiesLayout({ children }: SpecialtiesLayoutProps) {
  return (
    <AppShell title="Specialties" subtitle="Clinical modules • Layers 2–3" showRightRail>
      <div className="w-full max-w-6xl mx-auto">{children}</div>
    </AppShell>
  );
}
