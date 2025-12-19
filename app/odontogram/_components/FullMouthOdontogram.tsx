"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import ToothSvg from "./ToothSvg";

// --- Tooth ordering (FDI) ---
const UPPER: number[] = [18, 17, 16, 15, 14, 13, 12, 11, 21, 22, 23, 24, 25, 26, 27, 28];
const LOWER: number[] = [48, 47, 46, 45, 44, 43, 42, 41, 31, 32, 33, 34, 35, 36, 37, 38];

type Pose = { x: number; y: number; rot: number; s: number };
type PoseMap = Record<number, Pose>;

const LS_KEY = "adie.odontogram.poses.v1";

function clamp(n: number, a: number, b: number) {
  return Math.max(a, Math.min(b, n));
}
function round2(n: number) {
  return Math.round(n * 100) / 100;
}

/**
 * Build stable default poses using a parabola arc (Dentrix-like).
 * + Bigger default scale so teeth are visible.
 */
function buildDefaultPoses(): PoseMap {
  const poses: PoseMap = {};

  const cx = 50;
  const spanX = 78;
  const xLeft = cx - spanX / 2;
  const xRight = cx + spanX / 2;

  // Move arches a bit apart and give them breathing room
  const upperTopY = 28;
  const upperDepth = 14;

  const lowerBottomY = 78;
  const lowerDepth = 18;

  function upperY(t: number) {
    const u = t - 0.5;
    const factor = 1 - 4 * u * u;
    return upperTopY + upperDepth * factor;
  }

  function lowerY(t: number) {
    const u = t - 0.5;
    const factor = 1 - 4 * u * u;
    return lowerBottomY - lowerDepth * factor;
  }

  function rotationFromSlope(dy_dt: number, dx_dt: number) {
    const slope = dy_dt / dx_dt;
    const ang = (Math.atan(slope) * 180) / Math.PI;
    return clamp(ang, -18, 18);
  }

  // ✅ Bigger scale defaults
  const SCALE_NORMAL = 1.25; // was ~0.92
  const SCALE_MOLAR = 1.35;  // was ~1.0

  UPPER.forEach((tooth, i) => {
    const t = UPPER.length === 1 ? 0.5 : i / (UPPER.length - 1);
    const x = xLeft + (xRight - xLeft) * t;
    const y = upperY(t);

    const u = t - 0.5;
    const dy_dt = upperDepth * (-8 * u);
    const dx_dt = xRight - xLeft;

    const rot = rotationFromSlope(dy_dt, dx_dt);

    const isMolar = [18, 17, 16, 26, 27, 28].includes(tooth);
    const s = isMolar ? SCALE_MOLAR : SCALE_NORMAL;

    poses[tooth] = { x: round2(x), y: round2(y), rot: round2(rot), s: round2(s) };
  });

  LOWER.forEach((tooth, i) => {
    const t = LOWER.length === 1 ? 0.5 : i / (LOWER.length - 1);
    const x = xLeft + (xRight - xLeft) * t;
    const y = lowerY(t);

    const u = t - 0.5;
    const dy_dt = lowerDepth * (8 * u);
    const dx_dt = xRight - xLeft;

    const rot = rotationFromSlope(dy_dt, dx_dt);

    const isMolar = [48, 47, 46, 36, 37, 38].includes(tooth);
    const s = isMolar ? SCALE_MOLAR : SCALE_NORMAL;

    poses[tooth] = { x: round2(x), y: round2(y), rot: round2(rot), s: round2(s) };
  });

  return poses;
}

function readPoses(): PoseMap | null {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as PoseMap;
  } catch {
    return null;
  }
}

function writePoses(poses: PoseMap) {
  localStorage.setItem(LS_KEY, JSON.stringify(poses));
}

export default function FullMouthOdontogram() {
  const [mounted, setMounted] = useState(false);

  // Layer toggles
  const [showBase, setShowBase] = useState(true);
  const [showPerio, setShowPerio] = useState(true);
  const [showCaries, setShowCaries] = useState(true);
  const [showEndo, setShowEndo] = useState(true);

  const [selectedTooth, setSelectedTooth] = useState<number>(23);

  // demo state
  const [cariesOn, setCariesOn] = useState(false);
  const [endoOn, setEndoOn] = useState(false);
  const [perioOn, setPerioOn] = useState(false);
  const [notes, setNotes] = useState("");

  const [editLayout, setEditLayout] = useState(false);
  const [poses, setPoses] = useState<PoseMap | null>(null);
  const [updatedAt, setUpdatedAt] = useState<string>("");

  const dragRef = useRef<{ tooth: number; dx: number; dy: number } | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setMounted(true);
    const saved = readPoses();
    setPoses(saved ?? buildDefaultPoses());
    setUpdatedAt(new Date().toLocaleString());
  }, []);

  useEffect(() => {
    if (!mounted) return;
    setUpdatedAt(new Date().toLocaleString());
  }, [mounted, cariesOn, endoOn, perioOn, notes, selectedTooth]);

  useEffect(() => {
    if (!editLayout) return;
    if (!poses) return;
    writePoses(poses);
  }, [poses, editLayout]);

  const counts = useMemo(() => {
    return {
      caries: cariesOn ? 1 : 0,
      endo: endoOn ? 1 : 0,
      perio: perioOn ? 1 : 0,
    };
  }, [cariesOn, endoOn, perioOn]);

  function onToothMouseDown(e: React.MouseEvent, tooth: number) {
    if (!editLayout) return;
    if (!poses) return;

    const stage = stageRef.current;
    if (!stage) return;

    const rect = stage.getBoundingClientRect();
    const p = poses[tooth];
    const px = (p.x / 100) * rect.width;
    const py = (p.y / 100) * rect.height;

    dragRef.current = {
      tooth,
      dx: e.clientX - (rect.left + px),
      dy: e.clientY - (rect.top + py),
    };
  }

  function onStageMouseMove(e: React.MouseEvent) {
    const d = dragRef.current;
    if (!d || !editLayout) return;
    if (!poses) return;

    const stage = stageRef.current;
    if (!stage) return;

    const rect = stage.getBoundingClientRect();
    const xPx = e.clientX - rect.left - d.dx;
    const yPx = e.clientY - rect.top - d.dy;

    const x = clamp((xPx / rect.width) * 100, 2, 98);
    const y = clamp((yPx / rect.height) * 100, 2, 98);

    setPoses((prev) => {
      if (!prev) return prev;
      return { ...prev, [d.tooth]: { ...prev[d.tooth], x: round2(x), y: round2(y) } };
    });
  }

  function onStageMouseUp() {
    dragRef.current = null;
  }

  async function copyLayoutJson() {
    if (!poses) return;
    const txt = JSON.stringify(poses, null, 2);
    await navigator.clipboard.writeText(txt);
    alert("Layout copied to clipboard ✅");
  }

  function hardResetLayout() {
    try {
      localStorage.removeItem(LS_KEY);
    } catch {}
    const d = buildDefaultPoses();
    setEditLayout(false);
    setPoses(d);
    writePoses(d);
    setSelectedTooth(23);
    setUpdatedAt(new Date().toLocaleString());
    alert("Hard reset aplicado ✅ (layout limpio)");
  }

  if (!mounted || !poses) {
    return (
      <div className="mt-6 rounded-3xl border border-slate-800 bg-slate-950/40 p-6 text-sm text-slate-400">
        Loading Dental Chart…
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="mt-6 grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-6">
        {/* LEFT: STAGE */}
        <section className="relative z-0 rounded-3xl border border-slate-800 bg-slate-950/40 p-4 shadow-[0_30px_120px_rgba(0,0,0,0.55)]">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setShowBase((v) => !v)}
                className={`px-3 py-1.5 rounded-full text-[11px] border ${
                  showBase
                    ? "border-sky-400/40 bg-sky-500/10 text-sky-200"
                    : "border-slate-700 bg-slate-900/60 text-slate-300"
                }`}
              >
                Base/Anatomy
              </button>

              <button
                type="button"
                onClick={() => setShowPerio((v) => !v)}
                className={`px-3 py-1.5 rounded-full text-[11px] border ${
                  showPerio
                    ? "border-sky-400/40 bg-sky-500/10 text-sky-200"
                    : "border-slate-700 bg-slate-900/60 text-slate-300"
                }`}
              >
                Periodontal
              </button>

              <button
                type="button"
                onClick={() => setShowCaries((v) => !v)}
                className={`px-3 py-1.5 rounded-full text-[11px] border ${
                  showCaries
                    ? "border-sky-400/40 bg-sky-500/10 text-sky-200"
                    : "border-slate-700 bg-slate-900/60 text-slate-300"
                }`}
              >
                Caries
              </button>

              <button
                type="button"
                onClick={() => setShowEndo((v) => !v)}
                className={`px-3 py-1.5 rounded-full text-[11px] border ${
                  showEndo
                    ? "border-sky-400/40 bg-sky-500/10 text-sky-200"
                    : "border-slate-700 bg-slate-900/60 text-slate-300"
                }`}
              >
                Endo
              </button>

              <button
                type="button"
                onClick={() => setEditLayout((v) => !v)}
                className={`px-3 py-1.5 rounded-full text-[11px] border ${
                  editLayout
                    ? "border-amber-400/50 bg-amber-500/10 text-amber-200"
                    : "border-slate-700 bg-slate-900/60 text-slate-300 hover:border-sky-500/40"
                }`}
              >
                {editLayout ? "Editing layout" : "Edit layout"}
              </button>

              {editLayout && (
                <>
                  <button
                    type="button"
                    onClick={copyLayoutJson}
                    className="px-3 py-1.5 rounded-full text-[11px] border border-slate-700 bg-slate-900/60 text-slate-300 hover:border-sky-500/40"
                  >
                    Copy layout JSON
                  </button>
                  <button
                    type="button"
                    onClick={hardResetLayout}
                    className="px-3 py-1.5 rounded-full text-[11px] border border-amber-400/40 bg-amber-500/10 text-amber-200 hover:border-amber-300/60"
                  >
                    Hard reset
                  </button>
                </>
              )}
            </div>

            <div className="flex items-center gap-2 text-[11px] text-slate-300">
              <span className="rounded-full border border-slate-700 bg-slate-900/60 px-2 py-1">
                Caries: {counts.caries}
              </span>
              <span className="rounded-full border border-slate-700 bg-slate-900/60 px-2 py-1">
                Endo: {counts.endo}
              </span>
              <span className="rounded-full border border-slate-700 bg-slate-900/60 px-2 py-1">
                Perio: {counts.perio}
              </span>
            </div>
          </div>

          <div
            ref={stageRef}
            onMouseMove={onStageMouseMove}
            onMouseUp={onStageMouseUp}
            onMouseLeave={onStageMouseUp}
            className="mt-4 relative w-full h-[520px] rounded-3xl border border-slate-800 bg-gradient-to-b from-slate-950 via-slate-950 to-slate-950 overflow-hidden"
          >
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute -top-40 left-1/2 h-[520px] w-[760px] -translate-x-1/2 rounded-full bg-sky-500/5 blur-3xl" />
              <div className="absolute -bottom-40 left-1/2 h-[560px] w-[820px] -translate-x-1/2 rounded-full bg-emerald-500/5 blur-3xl" />
            </div>

            {[...UPPER, ...LOWER].map((tooth) => {
              const pose = poses[tooth] ?? { x: 50, y: 50, rot: 0, s: 1.25 };
              const isSelected = selectedTooth === tooth;
              const isUpper = UPPER.includes(tooth);

              return (
                <div
                  key={tooth}
                  className={`absolute select-none ${editLayout ? "cursor-move" : "cursor-pointer"}`}
                  style={{
                    left: `${pose.x}%`,
                    top: `${pose.y}%`,
                    transform: `translate(-50%, -50%) rotate(${pose.rot}deg) scale(${pose.s})`,
                    transformOrigin: "center center",
                  }}
                  onMouseDown={(e) => onToothMouseDown(e, tooth)}
                  onClick={() => setSelectedTooth(tooth)}
                  title={`Tooth ${tooth}`}
                >
                  <div
                    className={`rounded-2xl border ${
                      isSelected
                        ? "border-sky-400/60 shadow-[0_0_0_4px_rgba(56,189,248,0.12)]"
                        : "border-slate-800"
                    } bg-slate-950/35 p-2`}
                  >
                    {/* ✅ Flip ONLY the SVG for uppers, NOT the label */}
                    <div style={{ transform: isUpper ? "scaleY(-1)" : "none", transformOrigin: "center" }}>
                      <ToothSvg
                        toothNumber={tooth}
                        showBase={showBase}
                        showPerio={showPerio}
                        showCaries={showCaries}
                        showEndo={showEndo}
                      />
                    </div>

                    <div className="mt-1 text-center text-[10px] text-slate-500">{tooth}</div>
                  </div>
                </div>
              );
            })}

            {editLayout && (
              <div className="absolute bottom-3 left-3 rounded-2xl border border-amber-400/30 bg-amber-500/10 px-3 py-2 text-[11px] text-amber-200">
                Drag teeth to match Dentrix arc. Copy JSON when done.
              </div>
            )}
          </div>
        </section>

        {/* RIGHT: PANEL */}
        <aside className="relative z-10 rounded-3xl border border-slate-800 bg-slate-950/40 p-4">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-[11px] tracking-[0.28em] uppercase text-slate-400">Clinical Panel</div>
              <div className="mt-1 text-lg font-semibold text-slate-50">Tooth {selectedTooth}</div>
              <div className="text-xs text-slate-400">Marca condiciones y guarda (demo local).</div>
            </div>

            <button
              type="button"
              onClick={() => {
                setCariesOn(false);
                setEndoOn(false);
                setPerioOn(false);
                setNotes("");
              }}
              className="rounded-2xl border border-slate-700 bg-slate-900/60 px-3 py-2 text-[11px] text-slate-200 hover:border-sky-500/40 hover:bg-slate-900/80"
            >
              Clear tooth
            </button>
          </div>

          <div className="mt-4 space-y-2">
            <label className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-950/50 px-3 py-2 text-xs text-slate-200">
              <span>Caries</span>
              <input type="checkbox" checked={cariesOn} onChange={(e) => setCariesOn(e.target.checked)} />
            </label>
            <label className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-950/50 px-3 py-2 text-xs text-slate-200">
              <span>Endo</span>
              <input type="checkbox" checked={endoOn} onChange={(e) => setEndoOn(e.target.checked)} />
            </label>
            <label className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-950/50 px-3 py-2 text-xs text-slate-200">
              <span>Periodontal</span>
              <input type="checkbox" checked={perioOn} onChange={(e) => setPerioOn(e.target.checked)} />
            </label>
          </div>

          <div className="mt-4">
            <div className="text-[11px] tracking-[0.28em] uppercase text-slate-400">Notes</div>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ej: Lesión MO, plan: resina; Endo planned; Perio reevaluation..."
              className="mt-2 h-36 w-full resize-none rounded-2xl border border-slate-800 bg-slate-950/50 px-3 py-2 text-xs text-slate-100 outline-none focus:border-sky-500/50"
            />
            <div className="mt-2 text-[10px] text-slate-500">Updated: {updatedAt}</div>
          </div>

          <button
            type="button"
            onClick={hardResetLayout}
            className="mt-4 w-full rounded-2xl border border-amber-400/40 bg-amber-500/10 px-3 py-2 text-[11px] text-amber-200 hover:border-amber-300/60"
          >
            Hard reset layout (clear saved)
          </button>
        </aside>
      </div>
    </div>
  );
}
