"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";

type AdItem = {
  src: string;
  alt?: string;
  href?: string; // opcional si luego quieres que al click abra algo
};

type Props = {
  title?: string;
  intervalMs?: number; // default 5000
  className?: string;
};

export default function AdieAdCarousel({
  title = "Sponsored",
  intervalMs = 5000,
  className,
}: Props) {
  const [ads, setAds] = useState<AdItem[]>([]);
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef<number | null>(null);

  // Fallback por si el endpoint falla (NO tienes que tocarlo si todo está bien)
  const fallback = useMemo<AdItem[]>(
    () => [
      { src: "/ads/adie-dental.png", alt: "ADIE Dental" },
      { src: "/ads/orthoclub.png", alt: "OrthoClub" },
    ],
    []
  );

  async function loadAds() {
    try {
      const res = await fetch("/api/ads", { cache: "no-store" });
      const data = await res.json();
      const list: string[] = Array.isArray(data?.ads) ? data.ads : [];
      const items = list.map((src) => ({ src, alt: src.split("/").pop() || "Ad" }));
      setAds(items.length ? items : fallback);
      setIdx(0);
    } catch {
      setAds(fallback);
      setIdx(0);
    }
  }

  useEffect(() => {
    loadAds();
    // recarga por si agregas archivos mientras dev está corriendo
    const id = window.setInterval(loadAds, 30_000);
    return () => window.clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const total = ads.length;

  function go(next: number) {
    if (total <= 0) return;
    const normalized = ((next % total) + total) % total;
    setIdx(normalized);
  }

  useEffect(() => {
    if (total <= 1) return;
    if (paused) return;

    timerRef.current = window.setInterval(() => {
      setIdx((prev) => (prev + 1) % total);
    }, intervalMs);

    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
      timerRef.current = null;
    };
  }, [total, paused, intervalMs]);

  const current = total ? ads[idx] : null;

  return (
    <section
      className={`rounded-2xl border border-slate-800 bg-gradient-to-b from-slate-900 to-slate-950 p-3 ${className ?? ""}`}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="mb-2 flex items-center justify-between">
        <p className="text-[11px] font-semibold tracking-[0.18em] uppercase text-slate-400">
          {title}
        </p>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => go(idx - 1)}
            className="rounded-full border border-slate-700 bg-slate-950/60 px-2 py-1 text-[11px] text-slate-200 hover:border-sky-500/60 hover:text-sky-300 transition"
            aria-label="Previous ad"
            disabled={total <= 1}
          >
            ‹
          </button>
          <button
            type="button"
            onClick={() => go(idx + 1)}
            className="rounded-full border border-slate-700 bg-slate-950/60 px-2 py-1 text-[11px] text-slate-200 hover:border-sky-500/60 hover:text-sky-300 transition"
            aria-label="Next ad"
            disabled={total <= 1}
          >
            ›
          </button>
        </div>
      </div>

      <div className="relative overflow-hidden rounded-xl border border-slate-800 bg-slate-950/40">
        <div className="aspect-[16/9] w-full">
          {current ? (
            // Usamos <img> para evitar restricciones de next/image con tamaños dinámicos
            <img
              key={current.src}
              src={current.src}
              alt={current.alt ?? "Ad"}
              className="h-full w-full object-cover"
              draggable={false}
              onError={() => {
                // si un archivo falla, lo quitamos para no romper el carrusel
                setAds((prev) => prev.filter((a) => a.src !== current.src));
                setIdx(0);
              }}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-xs text-slate-400">
              No ads found in /public/ads
            </div>
          )}
        </div>
      </div>

      {/* Dots */}
      <div className="mt-2 flex items-center justify-between gap-3">
        <div className="flex gap-1.5">
          {Array.from({ length: total }).map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => go(i)}
              className={`h-1.5 w-1.5 rounded-full transition ${
                i === idx ? "bg-sky-400" : "bg-slate-600 hover:bg-slate-400"
              }`}
              aria-label={`Go to ad ${i + 1}`}
            />
          ))}
        </div>

        <span className="text-[10px] text-slate-500">
          {total ? `${idx + 1}/${total}` : "0/0"}
        </span>
      </div>
    </section>
  );
}
