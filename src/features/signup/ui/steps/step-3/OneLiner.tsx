import { useSignupStore } from '@/features/signup/model';

const MAX_LENGTH = 50;
const PLACEHOLDER = '나를 표현하는 한마디를 적어주세요! (최대 50자)';

export function OneLiner() {
  const { oneLiner, setPersonality } = useSignupStore();

  const length = oneLiner.length;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <label className="text-base font-bold">한줄 소개</label>

        <span
          className={[
            'rounded-full border-2 border-black px-3 py-1 text-xs font-extrabold bg-[var(--color-yellow)]',
          ].join(' ')}
        >
          {length}/{MAX_LENGTH}
        </span>
      </div>

      <textarea
        value={oneLiner}
        maxLength={MAX_LENGTH}
        onChange={(e) => setPersonality({ oneLiner: e.target.value })}
        placeholder={PLACEHOLDER}
        className="h-40 w-full resize-none rounded-xl border-2 border-black p-4 text-base outline-none transition-colors focus:bg-gray-50 placeholder:text-sm placeholder:text-slate-400"
      />
    </div>
  );
}
