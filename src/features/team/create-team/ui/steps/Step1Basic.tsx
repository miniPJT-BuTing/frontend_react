'use client';

import React from 'react';
import Image from 'next/image';
import { useCreateTeamStore } from '@/features/team/create-team/model/createTeam.store';
import HeartIcon from '@/assets/icons/heart.png';
import IntroIcon from '@/assets/icons/matching-intro.png';

const TITLE_MAX = 40;
const INTRO_MAX = 200;

export default function Step1Basic() {
  const { title, introduction, setBasicInfo } = useCreateTeamStore();

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <Image src={HeartIcon} alt="heart" width={34} height={34} priority />
          <label className="text-base font-bold">방 제목</label>
        </div>

        <div className="relative">
          <textarea
            value={title}
            maxLength={TITLE_MAX}
            onChange={(e) => setBasicInfo({ title: e.target.value })}
            placeholder="방 제목을 입력해주세요"
            rows={2}
            className="
              h-24 w-full rounded-xl border border-black
              px-4 py-4
              text-base leading-relaxed
              outline-none resize-none
              bg-white focus:bg-gray-50
              placeholder:text-sm placeholder:text-slate-400
            "
          />

          <div className="pointer-events-none absolute bottom-5 right-4 text-xs font-medium text-slate-400">
            {title.length}/{TITLE_MAX}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <Image src={IntroIcon} alt="intro" width={34} height={34} priority />
          <label className="text-base font-bold">방 소개글</label>
        </div>

        <div className="relative">
          <textarea
            value={introduction}
            maxLength={INTRO_MAX}
            onChange={(e) => setBasicInfo({ introduction: e.target.value })}
            placeholder="어떤 팀인지 소개해 보세요!"
            className="
              h-[19rem] w-full rounded-xl border border-black
              p-4
              text-base leading-relaxed
              outline-none resize-none
              bg-white focus:bg-gray-50
              placeholder:text-sm placeholder:text-slate-400
            "
          />

          <div className="pointer-events-none absolute bottom-5 right-4 text-xs font-medium text-slate-400">
            {introduction.length}/{INTRO_MAX}
          </div>
        </div>
      </div>
    </div>
  );
}
