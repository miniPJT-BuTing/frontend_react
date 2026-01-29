import React from 'react';
import { useSignupStore } from '../../model/signup.store';
import { RetroButton } from '@/shared/ui/button/RetroButton';

const ANIMALS = ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮'];

export default function AnimalPicker() {
  const { animal, setAvatar } = useSignupStore();

  return (
    <div className="flex flex-col gap-4">
      <label className="text-lg font-bold">나를 닮은 동물</label>
      <div className="grid grid-cols-4 gap-3">
        {ANIMALS.map((a) => (
          <RetroButton
            key={a}
            type="button"
            variant="neutral"
            className="aspect-square text-2xl"
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
