import React from 'react';
import { useSignupStore } from '@/features/signup/model';
import { RetroButton } from '@/shared/ui/button/RetroButton';

const ANIMALS = ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮'];

type Props = {
  onBackToAnalyze?: () => void;
};

export function AnimalPicker({ onBackToAnalyze }: Props) {
  const { animal, setAvatar } = useSignupStore();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <label className="text-base font-bold">나를 닮은 동물</label>

        {onBackToAnalyze ? (
          <button
            type="button"
            onClick={onBackToAnalyze}
            className="
              rounded-full border-2 border-black
              bg-[var(--color-yellow)] px-3 py-1
              text-xs font-extrabold text-black
              active:translate-y-[1px]
            "
          >
            다시 얼굴 분석하기
          </button>
        ) : null}
      </div>

      <div className="grid grid-cols-4 gap-3">
        {ANIMALS.map((a) => (
          <RetroButton
            key={a}
            type="button"
            variant="neutral"
            className="aspect-square text-3xl"
            isActive={animal === a}
            onClick={() => setAvatar({ animal: a })}
          >
            {a}
          </RetroButton>
        ))}
      </div>
    </div>
  );
}
