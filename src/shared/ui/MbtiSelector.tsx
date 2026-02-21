'use client';

import { RetroButton } from '@/shared/ui/button/RetroButton';

interface MbtiSelectorProps {
  value?: string | null;
  onChange: (nextMbti: string) => void;
  label?: string;
}

const MBTI_COLS = [
  ['E', 'I'],
  ['N', 'S'],
  ['F', 'T'],
  ['P', 'J'],
] as const;

export function MbtiSelector({ value, onChange, label = 'MBTI' }: MbtiSelectorProps) {
  const handleSelect = (char: string, colIndex: number) => {
    const currentMbti = value && value.length === 4 ? value : '____';
    const chars = currentMbti.split('');
    chars[colIndex] = char;
    onChange(chars.join(''));
  };

  return (
    <div className="flex flex-col gap-4">
      <label className="text-base font-bold">{label}</label>
      <div className="flex flex-row justify-between gap-3">
        {MBTI_COLS.map((pair, index) => (
          <div key={index} className="flex flex-1 flex-col gap-3">
            {pair.map((char) => (
              <RetroButton
                key={char}
                type="button"
                variant="neutral"
                className={`w-full aspect-square !rounded-xl text-xl font-bold flex items-center justify-center ${
                  value?.[index] === char ? '!bg-[var(--color-primary)]' : ''
                }`}
                isActive={value?.[index] === char}
                onClick={() => handleSelect(char, index)}
              >
                {char}
              </RetroButton>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
