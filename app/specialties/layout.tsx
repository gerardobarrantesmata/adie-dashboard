import type { ReactNode } from "react";
import { AppShell } from "@/app/_components/AppShell";

type SpecialtiesLayoutProps = {
  children: ReactNode;
};

export default function SpecialtiesLayout({ children }: SpecialtiesLayoutProps) {
  return (
    <AppShell title="Specialties" subtitle="Clinical modules • Layers 2–3" showRightRail>
      {children}
    </AppShell>
  );
}
