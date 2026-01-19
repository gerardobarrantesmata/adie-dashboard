import React, { Suspense } from "react";
import OperationsHubClient from "./OperationsHubClient";

export default function Page() {
  return (
    <Suspense fallback={<div className="p-4 text-sm text-slate-400">Loading...</div>}>
      <OperationsHubClient />
    </Suspense>
  );
}
