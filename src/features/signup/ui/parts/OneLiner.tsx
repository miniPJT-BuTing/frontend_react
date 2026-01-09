import React from 'react';
import { useSignupStore } from '../../model/signup.store';

export default function OneLiner() {
  const { oneLiner, setPersonality } = useSignupStore();

  return (
    <div className="flex flex-col gap-2">
      <label className="text-lg font-bold">한줄 소개</label>
      <textarea
        value={oneLiner}
        onChange={(e) => setPersonality({ oneLiner: e.target.value })}
        placeholder="나를 표현하는 한마디를 적어주세요!"
        className="h-40 w-full resize-none rounded-xl border-2 border-black p-4 text-lg outline-none focus:bg-gray-50 transition-colors"
      />
    </div>
  );
}
