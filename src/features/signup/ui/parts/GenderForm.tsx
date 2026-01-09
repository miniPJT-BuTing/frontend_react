import React from 'react';
import { useSignupStore } from '../../model/signup.store';
import { RetroButton } from '@/shared/ui/RetroButton';

export default function GenderForm() {
  const { gender, setProfile } = useSignupStore();

  return (
    <div className="flex flex-col gap-2">
      <label className="text-lg font-bold">성별</label>
      <div className="flex flex-col gap-4">
        <RetroButton
          type="button"
          variant="neutral"
          className={`h-14 w-full text-lg ${gender === 'male' ? '!bg-[#F7ABCF]' : ''}`}
          isActive={gender === 'male'}
          onClick={() => setProfile({ gender: 'male' })}
        >
          남성
        </RetroButton>
        <RetroButton
          type="button"
          variant="neutral"
          className={`h-14 w-full text-lg ${gender === 'female' ? '!bg-[#F7ABCF]' : ''}`}
          isActive={gender === 'female'}
          onClick={() => setProfile({ gender: 'female' })}
        >
          여성
        </RetroButton>
      </div>
    </div>
  );
}