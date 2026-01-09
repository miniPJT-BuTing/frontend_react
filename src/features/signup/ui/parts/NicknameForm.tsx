import React from 'react';
import { useSignupStore } from '../../model/signup.store';

export default function NicknameForm() {
  const { nickname, setProfile } = useSignupStore();

  return (
    <div className="flex flex-col gap-2">
      <label className="text-base font-bold">닉네임</label>
      <input
        type="text"
        value={nickname}
        onChange={(e) => setProfile({ nickname: e.target.value })}
        placeholder="닉네임을 입력해주세요"
        className="h-14 w-full rounded-full border border-black px-4 text-base outline-none focus:bg-gray-50"
      />
    </div>
  );
}
