import React from 'react';
import { useSignupStore } from '@/features/signup/model';
import { RetroButton } from '@/shared/ui/button/RetroButton';

export function GenderForm() {
  const { gender, setProfile } = useSignupStore();

  return (
    <div className="flex flex-col gap-2">
      <label className="text-base font-bold">성별</label>

      <div className="flex flex-col gap-4">
        <RetroButton
          type="button"
          variant="neutral"
          className={`h-14 w-full text-base ${
            gender === 'male' ? '!bg-[var(--color-skyblue)]' : ''
          }`}
          isActive={gender === 'male'}
          onClick={() => setProfile({ gender: 'male' })}
        >
          남성
        </RetroButton>

        <RetroButton
          type="button"
          variant="neutral"
          className={`h-14 w-full text-base ${
            gender === 'female' ? '!bg-[var(--color-primary)]' : ''
          }`}
          isActive={gender === 'female'}
          onClick={() => setProfile({ gender: 'female' })}
        >
          여성
        </RetroButton>
      </div>
    </div>
  );
}
