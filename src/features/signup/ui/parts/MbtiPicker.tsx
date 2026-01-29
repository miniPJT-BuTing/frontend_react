import React from 'react';
import { useSignupStore } from '../../model/signup.store';
import { RetroButton } from '@/shared/ui/button/RetroButton';

// Pairs defined as Top/Bottom for each column
const MBTI_COLS = [
  ['E', 'I'],
  ['N', 'S'],
  ['F', 'T'],
  ['P', 'J'],
];

export default function MbtiPicker() {
  const { mbti, setPersonality } = useSignupStore();

  const handleSelect = (char: string, colIndex: number) => {
    const currentMbti = mbti || '____';
    const chars = currentMbti.split('');
    chars[colIndex] = char;
    setPersonality({ mbti: chars.join('') });
  };

  return (
    <div className="flex flex-col gap-4">
      <label className="text-base font-bold">MBTI</label>
      <div className="flex flex-row gap-3 justify-between">
        {MBTI_COLS.map((pair, index) => (
          // Inner col: Top/Bottom pair
          <div key={index} className="flex flex-col gap-3 flex-1">
            {pair.map((char) => (
              <RetroButton
                key={char}
                type="button"
                variant="neutral"
                // aspect-square makes it a square, w-full fills the column width
                className={`w-full aspect-square !rounded-xl text-xl font-bold flex items-center justify-center ${
                  mbti?.[index] === char ? '!bg-[#F7ABCF]' : ''
                }`}
                // isActive={mbti?.[index] === char}
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
