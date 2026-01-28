'use client';

import React from 'react';
import Image from 'next/image';
import { useCreateTeamStore } from '@/features/team/create-team/model/createTeam.store';
import HeartIcon from '@/assets/icons/heart.png';
import IntroIcon from '@/assets/icons/matching-Intro.png';

export default function Step1Basic() {
  const { title, introduction, setBasicInfo } = useCreateTeamStore();

  return (
    <div className="flex flex-col gap-12">
      {/* Title Input */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-1">
          <Image src={HeartIcon} alt="heart" width={34} height={34} priority />
          <label className="text-base font-bold">방 제목</label>
        </div>
        <input
          type="text"
          value={title}
          onChange={(e) => setBasicInfo({ title: e.target.value })}
          placeholder="방 제목을 입력해주세요"
          className="h-28 w-full rounded-3xl border border-black px-4 text-base outline-none bg-white focus:bg-gray-50"
        />
      </div>

      {/* Introduction Input */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-1">
          <Image src={IntroIcon} alt="intro" width={34} height={34} priority />
          <label className="text-base font-bold">방 소개글</label>
        </div>
        <textarea
          value={introduction}
          onChange={(e) => setBasicInfo({ introduction: e.target.value })}
          placeholder="어떤 팀인지 소개해 보세요!"
          className="h-64 w-full rounded-3xl border border-black p-4 text-base outline-none resize-none bg-white focus:bg-gray-50"
        />
      </div>
    </div>
  );
}
