'use client';

const MAX_LENGTH = 50;
const PLACEHOLDER = '나를 표현하는 한마디를 적어주세요! (최대 50자)';

interface OneLinerFieldProps {
  value: string;
  onChange: (nextValue: string) => void;
  label?: string;
}

export function OneLinerField({ value, onChange, label = '한줄 소개' }: OneLinerFieldProps) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <label className="text-base font-bold">{label}</label>

        <span className="rounded-full border border-black bg-[var(--color-yellow)] px-3 py-1 text-xs font-extrabold">
          {value.length}/{MAX_LENGTH}
        </span>
      </div>

      <textarea
        value={value}
        maxLength={MAX_LENGTH}
        onChange={(e) => onChange(e.target.value)}
        placeholder={PLACEHOLDER}
        className="h-40 w-full resize-none rounded-xl border border-black p-4 text-base outline-none transition-colors focus:bg-gray-50 placeholder:text-sm placeholder:text-slate-400"
      />
    </div>
  );
}
