'use client';

import { RetroButton } from '@/shared/ui/button/RetroButton';

type Props = {
  value: string; // e.g., 'ENFP'
  onChange: (val: string) => void;
};

const MBTI_COLS = [
  ['E', 'I'],
  ['N', 'S'],
  ['F', 'T'],
  ['P', 'J'],
];

export function EditMbti({ value, onChange }: Props) {
  const handleSelect = (char: string, colIndex: number) => {
    // value가 '____' 형태일 수도 있고 ''일 수도 있음
    const current = (value && value.length === 4) ? value : '____';
    const chars = current.split('');
    chars[colIndex] = char;
    onChange(chars.join(''));
  };

  return (
    <div className="flex flex-col gap-4">
      <label className="text-base font-bold text-black">MBTI</label>
      <div className="flex flex-row gap-3 justify-between">
        {MBTI_COLS.map((pair, index) => (
          <div key={index} className="flex flex-col gap-3 flex-1">
            {pair.map((char) => {
              const isActive = value?.[index] === char;
              return (
                <RetroButton
                  key={char}
                  type="button"
                  variant="neutral"
                  className={`w-full aspect-square !rounded-xl text-xl font-bold flex items-center justify-center ${
                    isActive ? '!bg-[#FF9BC2] border-black' : ''
                  }`}
                  isActive={isActive}
                  onClick={() => handleSelect(char, index)}
                >
                  {char}
                </RetroButton>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
