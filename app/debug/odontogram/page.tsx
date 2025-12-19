"use client";

import React, { useEffect, useMemo, useState } from "react";

type ToothId = "12"; // cambia a "11" o hazlo dinámico después

const TOOTH: ToothId = "12";
const SVG_URL = `/odontogram/fdi/tooth_${TOOTH}.svg`;

const LAYERS = [
  { key: "periodontal", id: `tooth_${TOOTH}_periodontal_layer`, label: "Periodontal" },
  { key: "caries", id: `tooth_${TOOTH}_caries_layer`, label: "Caries" },
  { key: "endo", id: `tooth_${TOOTH}_endo_layer`, label: "Endo" },
  { key: "base", id: `tooth_${TOOTH}_base_layer`, label: "Base/Anatomy" },
] as const;

export default function DebugOdontogramPage() {
  const [svgText, setSvgText] = useState<string>("");
  const [enabled, setEnabled] = useState<Record<string, boolean>>({
    periodontal: true,
    caries: true,
    endo: true,
    base: true,
  });

  const enabledMap = useMemo(() => enabled, [enabled]);

  useEffect(() => {
    (async () => {
      const res = await fetch(SVG_URL, { cache: "no-store" });
      const text = await res.text();
      setSvgText(text);
    })();
  }, []);

  // Cuando cambia el toggle, prendemos/apagamos los <g id="...">
  useEffect(() => {
    if (!svgText) return;

    // Espera a que el SVG esté montado
    const t = setTimeout(() => {
      for (const layer of LAYERS) {
        const isOn = enabledMap[layer.key];
        const el = document.getElementById(layer.id);
        if (el) el.style.display = isOn ? "block" : "none";
      }
    }, 0);

    return () => clearTimeout(t);
  }, [enabledMap, svgText]);

  return (
    <main style={{ padding: 20, display: "grid", gridTemplateColumns: "320px 1fr", gap: 20 }}>
      <aside style={{ border: "1px solid #ddd", borderRadius: 12, padding: 16 }}>
        <h2 style={{ margin: 0, marginBottom: 12 }}>Odontogram Debug (Tooth {TOOTH})</h2>

        <div style={{ display: "grid", gap: 10 }}>
          {LAYERS.map((l) => (
            <label key={l.key} style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <input
                type="checkbox"
                checked={enabled[l.key]}
                onChange={(e) => setEnabled((p) => ({ ...p, [l.key]: e.target.checked }))}
              />
              <span>{l.label}</span>
              <code style={{ marginLeft: "auto", fontSize: 12, opacity: 0.7 }}>{l.id}</code>
            </label>
          ))}
        </div>

        <hr style={{ margin: "16px 0" }} />

        <div style={{ fontSize: 13, opacity: 0.8, lineHeight: 1.4 }}>
          <div><b>SVG:</b> {SVG_URL}</div>
          <div><b>Tip:</b> si un toggle no hace nada, ese <code>id</code> no existe en el SVG.</div>
        </div>
      </aside>

      <section style={{ border: "1px solid #ddd", borderRadius: 12, padding: 16 }}>
        {!svgText ? (
          <p>Cargando SVG…</p>
        ) : (
          <div
            // Inline SVG (para poder manipular layers)
            dangerouslySetInnerHTML={{ __html: svgText }}
            style={{ width: "100%", overflow: "auto" }}
          />
        )}
      </section>
    </main>
  );
}
