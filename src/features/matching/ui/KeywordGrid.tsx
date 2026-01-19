'use client';

export default function KeywordGrid({
  keywords,
  selected,
  onToggle,
}: {
  keywords: readonly string[];
  selected: string[];
  onToggle: (k: string) => void;
}) {
  return (
    <section className="mt-4">
      <div className="grid grid-cols-4 gap-3">
        {keywords.map((k) => {
          const active = selected.includes(k);

          return (
            <button
              key={k}
              type="button"
              onClick={() => onToggle(k)}
              className={[
                'rounded-full border px-3 py-2 text-[13px] leading-none transition',
                'active:translate-y-[1px]',
                active
                  ? 'border-[#5863D6] bg-[#FBCFE8] text-[#5863D6]'
                  : 'border-[#5863D6] bg-white/70 text-[#5863D6]',
              ].join(' ')}
            >
              <span className="font-['DNFBit']">{k}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
