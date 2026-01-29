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
  const selectedCount = selected.length;

  return (
    <section className="mt-5">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-sm font-extrabold text-black">키워드</span>

        <span className="rounded-full border border-black bg-[#FEFED0] px-3 py-1 text-xs font-extrabold text-black">
          {selectedCount > 0 ? `${selectedCount}개 선택` : '선택해주세요'}
        </span>
      </div>

      <div className="grid grid-cols-4 gap-3">
        {keywords.map((k) => {
          const active = selected.includes(k);

          return (
            <button
              key={k}
              type="button"
              onClick={() => onToggle(k)}
              className={[
                'h-10 rounded-full border-2 border-black px-3',
                'inline-flex items-center justify-center',
                'text-sm font-extrabold leading-none',
                'transition-transform transition-colors',
                'active:translate-y-[1px]',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/60',
                active
                  ? 'bg-[#F7ABCF] text-black shadow-[0_2px_0_0_rgba(0,0,0,1)]'
                  : 'bg-white text-black hover:bg-slate-50',
              ].join(' ')}
            >
              <span className="tracking-wide">{k}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
