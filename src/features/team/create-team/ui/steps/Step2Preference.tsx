'use client';

import React, { useEffect, useMemo, useState, useCallback } from 'react';
import Image from 'next/image';

import { useCreateTeamStore } from '../../model/createTeam.store';
import { PERSONALITY_LABELS } from '@/shared/lib/personalityKeyword';

import KeywordGrid from '@/shared/ui/KeywordGrid';
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

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col">
        <div className="flex items-center gap-2">
          <Image src={moodIcon} alt="mood" width={34} height={34} />
          <label className="text-base font-bold">선호 분위기</label>
        </div>

        <KeywordGrid
          keywords={PERSONALITY_LABELS}
          selected={atmosphere}
          onToggle={(k) => {
            setPreferences({
              atmosphere: atmosphere.includes(k)
                ? atmosphere.filter((v) => v !== k)
                : [...atmosphere, k],
            });
          }}
        />
      </div>

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
