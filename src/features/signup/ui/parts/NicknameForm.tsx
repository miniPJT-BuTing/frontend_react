import React from 'react';
import { useSignupStore } from '../../model/signup.store';

export default function NicknameForm() {
  const { nickname, setProfile } = useSignupStore();

  return (
    <div className="flex flex-col gap-2">
      <label className="text-lg font-bold">닉네임</label>
      <input
        type="text"
        value={nickname}
        onChange={(e) => setProfile({ nickname: e.target.value })}
        placeholder="닉네임을 입력해주세요"
        className="h-14 w-full rounded-xl border-2 border-black px-4 text-lg outline-none focus:bg-gray-50"
      />
    </div>
  );
}