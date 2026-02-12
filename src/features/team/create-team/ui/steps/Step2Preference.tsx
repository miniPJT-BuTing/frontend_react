'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';

import { useCreateTeamStore } from '../../model/createTeam.store';
import { TEAM_MOOD_KEYWORDS } from '@/shared/lib/personalityKeyword';

import AgeRangeSection from '@/shared/ui/AgeRangeSection';

import moodIcon from '@/assets/icons/mood.png';
import schoolIcon from '@/assets/icons/school.png';
import calendarIcon from '@/assets/icons/calendar.png';

type Range = [number, number];

export default function Step2Preference() {
  const { atmosphere, minStudentId, maxStudentId, minAge, maxAge, setPreferences } =
    useCreateTeamStore();

  const [studentIdRange, setStudentIdRange] = useState<Range>([
    minStudentId ?? 20,
    maxStudentId ?? 24,
  ]);
  const [ageRange, setAgeRange] = useState<Range>([minAge ?? 20, maxAge ?? 25]);

  useEffect(() => {
    setStudentIdRange([minStudentId ?? 20, maxStudentId ?? 24]);
  }, [minStudentId, maxStudentId]);

  useEffect(() => {
    setAgeRange([minAge ?? 20, maxAge ?? 25]);
  }, [minAge, maxAge]);

  const studentIdLabel = useMemo(
    () => `${studentIdRange[0]}학번 ~ ${studentIdRange[1]}학번`,
    [studentIdRange]
  );

  const ageLabel = useMemo(() => `${ageRange[0]}세 ~ ${ageRange[1]}세`, [ageRange]);

  const toggleAtmosphere = (key: string) => {
    // 단일 선택: 클릭 시 해당 키 값 하나만 배열에 저장 (이미 선택된 것 클릭 시 해제할지, 유지할지는 UX 결정 -> 보통 유지 or 교체)
    // 여기서는 다른거 누르면 교체, 같은거 누르면 해제(토글) 방식으로 구현
    if (atmosphere.includes(key)) {
      setPreferences({ atmosphere: [] }); // 해제
    } else {
      setPreferences({ atmosphere: [key] }); // 교체
    }
  };

  return (
    <div className="flex flex-col gap-8">
      {/* 선호 분위기 */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <Image src={moodIcon} alt="mood" width={34} height={34} />
          <label className="text-base font-bold">선호 분위기</label>
        </div>

        <div className="flex flex-wrap gap-2">
          {TEAM_MOOD_KEYWORDS.map((mood) => {
            const isSelected = atmosphere.includes(mood.key);
            return (
              <button
                key={mood.key}
                type="button"
                onClick={() => toggleAtmosphere(mood.key)}
                className={`rounded-full border-2 px-4 py-2 text-sm font-bold transition-all ${
                  isSelected
                    ? 'border-black bg-[#FF9BC2] text-black'
                    : 'border-gray-200 bg-white text-gray-400 hover:border-gray-300'
                }`}
              >
                {mood.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 선호 학번 */}
      <div className="flex flex-col">
        <div className="flex items-center gap-2">
          <Image src={schoolIcon} alt="school" width={34} height={34} />
          <label className="text-base font-bold">선호 학번</label>
        </div>

        <AgeRangeSection
          label="선호 학번"
          value={studentIdRange}
          valueLabel={studentIdLabel}
          min={18}
          max={26}
          open={true}
          onChange={(next) => {
            setStudentIdRange(next);
            setPreferences({ minStudentId: next[0], maxStudentId: next[1] });
          }}
        />
      </div>

      {/* 선호 나이 */}
      <div className="flex flex-col">
        <div className="flex items-center gap-2">
          <Image src={calendarIcon} alt="calendar" width={34} height={34} />
          <label className="text-base font-bold">선호 나이</label>
        </div>

        <AgeRangeSection
          label="선호 나이"
          value={ageRange}
          valueLabel={ageLabel}
          min={20}
          max={30}
          open={true}
          onChange={(next) => {
            setAgeRange(next);
            setPreferences({ minAge: next[0], maxAge: next[1] });
          }}
        />
      </div>
    </div>
  );
}