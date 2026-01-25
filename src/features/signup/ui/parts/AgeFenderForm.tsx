import React from 'react';
import { useSignupStore } from '../../model/signup.store';
import { RetroButton } from '@/shared/ui/RetroButton';

export default function AgeFenderForm() {
  const { age, gender, setProfile } = useSignupStore();

  return (
    <div className="flex flex-col gap-4">
      {/* Age Section */}
      <div className="flex flex-col gap-2">
        <label className="text-lg font-bold">나이</label>
        <input
          type="number"
          value={age || ''}
          onChange={(e) => setProfile({ age: parseInt(e.target.value) || null })}
          placeholder="나이를 입력해주세요"
          className="h-14 w-full rounded-xl border-2 border-black px-4 text-lg outline-none focus:bg-gray-50"
        />
      </div>

      {/* Gender Section */}
      <div className="flex flex-col gap-2">
        <label className="text-lg font-bold">성별</label>
        <div className="flex gap-4">
          <RetroButton
            type="button"
            variant="neutral"
            className="h-14 flex-1 text-lg"
            // isActive={gender === 'male'}
            onClick={() => setProfile({ gender: 'male' })}
          >
            남성
          </RetroButton>
          <RetroButton
            type="button"
            variant="neutral"
            className="h-14 flex-1 text-lg"
            // isActive={gender === 'female'}
            onClick={() => setProfile({ gender: 'female' })}
          >
            여성
          </RetroButton>
        </div>
      </div>
    </div>
  );
}
