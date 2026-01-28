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

  const setFrom = (v: number) => {
    const nextFrom = clamp(v, min, max);
    onChange([Math.min(nextFrom, to), to]);
  };

  const setTo = (v: number) => {
    const nextTo = clamp(v, min, max);
    onChange([from, Math.max(nextTo, from)]);
  };

  return (
    <section className="mt-5">
      {/* header */}
      <div className="mb-3 flex items-center justify-between">
        <span className="text-sm font-extrabold text-black">{label}</span>
        <span className="rounded-full border border-black bg-[#FEFED0] px-3 py-1 text-xs font-extrabold text-black">
          {valueLabel}
        </span>
      </div>

      {/* body */}
      {open && (
        <div className="rounded-[22px] border border-black bg-white p-4">
          <div className="space-y-4">
            {/* FROM */}
            <div className="flex items-center gap-3">
              <span className="w-14 text-xs font-extrabold text-black">{from}</span>
              <input
                type="range"
                min={min}
                max={max}
                value={from}
                onChange={(e) => setFrom(Number(e.target.value))}
                className="range-retro w-full"
                aria-label="최소"
              />
            </div>

            {/* TO */}
            <div className="flex items-center gap-3">
              <span className="w-14 text-xs font-extrabold text-black">{to}</span>
              <input
                type="range"
                min={min}
                max={max}
                value={to}
                onChange={(e) => setTo(Number(e.target.value))}
                className="range-retro w-full"
                aria-label="최대"
              />
            </div>
          </div>

          {/* footer */}
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
