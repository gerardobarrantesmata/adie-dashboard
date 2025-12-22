import type { ReactNode } from "react";
import { AppShell } from "@/app/_components/AppShell";

export default function OperationsHubLayout({ children }: { children: ReactNode }) {
  return (
    <AppShell
      title="Operations Hub"
      subtitle="Clinic admin & flow control"
      showRightRail
    >
      {children}
    </AppShell>
  );
}
