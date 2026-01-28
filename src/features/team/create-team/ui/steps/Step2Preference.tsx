'use client';

import React from 'react';
import Image from 'next/image';
import { useCreateTeamStore } from '../../model/createTeam.store';
// import DualRangeSlider from '@/shared/ui/DualRangeSlider';
import bulbIcon from '@/assets/icons/mood.png';
import schoolIcon from '@/assets/icons/school.png';
import calendarIcon from '@/assets/icons/calendar.png';

const KEYWORDS = [
  '연상',
  '연하',
  '동갑',
  '신입생',
  '연애',
  '친목',
  '술',
  '취미',
  '논리적',
  '긍정적',
  '배려심',
  '진중함',
  '열정적',
  '다정함',
  '책임감',
  '털털함',
  '현실적',
  '쿨함',
  '신중함',
  '리더십',
] as const;

export default function Step2Preference() {
  const { atmosphere, minStudentId, maxStudentId, minAge, maxAge, setPreferences } =
    useCreateTeamStore();

  const toggleAtmosphere = (option: string) => {
    if (atmosphere.includes(option)) {
      setPreferences({ atmosphere: atmosphere.filter((a) => a !== option) });
    } else {
      setPreferences({ atmosphere: [...atmosphere, option] });
    }
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Atmosphere */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-1">
          <Image src={bulbIcon} alt="bulb" width={34} height={34} />
          <label className="text-base font-bold">선호 분위기</label>
        </div>
        <div className="grid grid-cols-4 gap-3">
          {KEYWORDS.map((k) => (
            <button
              key={k}
              type="button"
              onClick={() => toggleAtmosphere(k)}
              className={[
                'h-10 rounded-full border border-black px-3',
                'inline-flex items-center justify-center',
                'text-sm font-extrabold leading-none',
                'transition-transform transition-colors',
                'active:translate-y-[1px]',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/60',
                atmosphere.includes(k)
                  ? 'bg-[#FEFED0] text-black shadow-[0_2px_0_0_rgba(0,0,0,1)]'
                  : 'bg-white text-black hover:bg-slate-50',
              ].join(' ')}
            >
              <span className="tracking-wide">{k}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Student ID Range */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-1">
          <Image src={schoolIcon} alt="school" width={34} height={34} />
          <label className="text-base font-bold">선호 학번</label>
        </div>
        {/* <DualRangeSlider
          min={18}
          max={26}
          initialMin={minStudentId || 20}
          initialMax={maxStudentId || 24}
          unit="학번"
          onChange={([min, max]) => setPreferences({ minStudentId: min, maxStudentId: max })}
        /> */}
      </div>

      {/* Age Range */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-1">
          <Image src={calendarIcon} alt="calendar" width={34} height={34} />
          <label className="text-base font-bold">선호 나이</label>
        </div>
        {/* <DualRangeSlider
          min={20}
          max={30}
          initialMin={minAge || 20}
          initialMax={maxAge || 25}
          unit="세"
          onChange={([min, max]) => setPreferences({ minAge: min, maxAge: max })}
        /> */}
      </div>
    </div>
  );
}
