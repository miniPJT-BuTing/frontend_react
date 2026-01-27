'use client';

export type AgeRange = [number, number];

const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));

export default function AgeRangeSection({
  label,
  value,
  valueLabel,
  min,
  max,
  onChange,
}: {
  label: string;
  value: AgeRange;
  valueLabel: string;
  min: number;
  max: number;
  onChange: (v: AgeRange) => void;
}) {
  const [from, to] = value;

  const setFrom = (v: number) => {
    const nextFrom = clamp(v, min, max);
    onChange([Math.min(nextFrom, to), to]);
  };

  const setTo = (v: number) => {
    const nextTo = clamp(v, min, max);
    onChange([from, Math.max(nextTo, from)]);
  };

  return (
    <section className="mt-10">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-sm text-[#64748B]">{label}</span>
        <span className="rounded-full bg-[#FBCFE8] px-3 py-1 text-xs text-[#5863D6]">
          {valueLabel}
        </span>
      </div>

      {/* simple dual range (2 inputs) */}
      <div className="flex items-center gap-3">
        <input
          type="range"
          min={min}
          max={max}
          value={from}
          onChange={(e) => setFrom(Number(e.target.value))}
          className="w-full"
        />
        <input
          type="range"
          min={min}
          max={max}
          value={to}
          onChange={(e) => setTo(Number(e.target.value))}
          className="w-full"
        />
      </div>
    </section>
  );
}
