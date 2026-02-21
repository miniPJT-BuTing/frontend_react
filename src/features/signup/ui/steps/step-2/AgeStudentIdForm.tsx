import React from 'react';
import { useSignupStore } from '@/features/signup/model';

export function AgeStudentIdForm() {
  const { age, studentId, nickname, setProfile } = useSignupStore();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <label className="text-base font-bold">나이</label>
        <input
          type="number"
          value={age || ''}
          onChange={(e) => setProfile({ age: parseInt(e.target.value) || null })}
          placeholder="나이 (예: 20)"
          className="h-14 w-full rounded-full border border-gray-600 px-4 text-base outline-none focus:bg-gray-50 transition-colors"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-lg font-bold">학번</label>
        <input
          type="text"
          value={studentId}
          onChange={(e) => setProfile({ studentId: e.target.value })}
          placeholder="학번 (예: 23학번)"
          className="h-14 w-full rounded-full border border-gray-600 px-4 text-base outline-none focus:bg-gray-50 transition-colors"
        />
      </div>
    </div>
  );
}
