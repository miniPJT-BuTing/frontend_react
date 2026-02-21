import React from 'react';
import { useSignupStore } from '@/features/signup/model';

export function CollegeSelect() {
  const { college, setProfile } = useSignupStore();

  return (
    <div className="flex flex-col gap-2">
      <label className="text-base font-bold">소속 단과대</label>
      <input
        type="text"
        value={college}
        onChange={(e) => {
          const value = e.target.value;
          const numeric = Number(value);
          setProfile({
            college: value,
            collegeId: Number.isFinite(numeric) && numeric > 0 ? numeric : null,
          });
        }}
        placeholder="ex) 공과대"
        className="h-14 w-full rounded-full border border-black px-4 text-base outline-none focus:bg-gray-50"
      />
    </div>
  );
}
