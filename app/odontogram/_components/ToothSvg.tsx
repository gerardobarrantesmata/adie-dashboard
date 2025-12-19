"use client";

import React, { useMemo, useState } from "react";

type Props = {
  toothNumber: number;
  showBase: boolean;
  showPerio: boolean;
  showCaries: boolean;
  showEndo: boolean;
  className?: string;
};

type LayerKey = "base" | "perio" | "caries" | "endo";

function layerSrc(toothNumber: number, layer: LayerKey) {
  // Ajusta aquí si tu naming cambia en el futuro
  if (layer === "base") return `/odontogram/fdi/tooth_${toothNumber}.svg`;
  return `/odontogram/fdi/tooth_${toothNumber}_${layer}.svg`;
}

export default function ToothSvg({
  toothNumber,
  showBase,
  showPerio,
  showCaries,
  showEndo,
  className,
}: Props) {
  const [ok, setOk] = useState<Record<LayerKey, boolean>>({
    base: true,
    perio: true,
    caries: true,
    endo: true,
  });

  const layers = useMemo(
    () =>
      [
        { key: "base" as const, visible: showBase && ok.base },
        { key: "perio" as const, visible: showPerio && ok.perio },
        { key: "caries" as const, visible: showCaries && ok.caries },
        { key: "endo" as const, visible: showEndo && ok.endo },
      ].filter((l) => l.visible),
    [showBase, showPerio, showCaries, showEndo, ok]
  );

  return (
    <div className={`relative ${className ?? ""}`} style={{ width: 64, height: 64 }}>
      {layers.length === 0 ? (
        <div className="flex h-full w-full items-center justify-center rounded-xl border border-slate-800 bg-slate-950/40 text-[10px] text-slate-500">
          hidden
        </div>
      ) : (
        layers.map(({ key }) => (
          <img
            key={key}
            src={layerSrc(toothNumber, key)}
            alt={`tooth ${toothNumber} ${key}`}
            draggable={false}
            className="absolute inset-0 h-full w-full select-none object-contain"
            onError={() => setOk((p) => ({ ...p, [key]: false }))}
          />
        ))
      )}
    </div>
  );
}
