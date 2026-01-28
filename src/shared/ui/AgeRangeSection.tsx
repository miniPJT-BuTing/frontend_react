'use client';

import type React from 'react';

export type AgeRange = [number, number];

const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));

export default function AgeRangeSection({
  label,
  value,
  valueLabel,
  min,
  max,
  onChange,
  open = true,
}: {
  label: string;
  value: AgeRange;
  valueLabel: string;
  min: number;
  max: number;
  onChange: (v: AgeRange) => void;
  open?: boolean;
}) {
  const [from, to] = value;

  const setFrom = (raw: number) => {
    const nextFrom = clamp(raw, min, to);
    onChange([nextFrom, to]);
  };

  const setTo = (raw: number) => {
    const nextTo = clamp(raw, from, max);
    onChange([from, nextTo]);
  };

  const total = Math.max(1, max - min);
  const leftPct = ((from - min) / total) * 100;
  const rightPct = ((to - min) / total) * 100;

  const fromOnTop = from > max - 1;

  return (
    <section className="mt-5">
      {open && (
        <div className="rounded-xl border border-black bg-white p-4">
          <div className="relative h-9 w-full">
            <div className="absolute left-0 right-0 top-1/2 h-2 -translate-y-1/2 rounded-full border border-black bg-white" />

            <div
              className="absolute top-1/2 h-2 -translate-y-1/2 rounded-full border border-black bg-[#F7ABCF]"
              style={{
                left: `${leftPct}%`,
                width: `${Math.max(0, rightPct - leftPct)}%`,
              }}
            />

            <input
              type="range"
              min={min}
              max={max}
              value={from}
              onChange={(e) => setFrom(Number(e.target.value))}
              aria-label={`${label} 최소값`}
              className="range-clean absolute left-0 top-0 h-9 w-full"
              style={{ zIndex: fromOnTop ? 6 : 4 } as React.CSSProperties}
            />

            <input
              type="range"
              min={min}
              max={max}
              value={to}
              onChange={(e) => setTo(Number(e.target.value))}
              aria-label={`${label} 최대값`}
              className="range-clean absolute left-0 top-0 h-9 w-full"
              style={{ zIndex: fromOnTop ? 5 : 6 } as React.CSSProperties}
            />
          </div>

          <div className="mt-4 flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-600">{min}</span>

            <span className="rounded-full border border-black bg-[#F7ABCF] px-3 py-1 text-xs font-extrabold text-black">
              {from} ~ {to}
            </span>

            <span className="text-xs font-semibold text-slate-600">{max}</span>
          </div>
        </div>
      )}
    </section>
  );
}
