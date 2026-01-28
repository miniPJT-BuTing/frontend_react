'use client';

import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';

import FilterHeader from '@/features/matching/ui/FilterHeader';
import KeywordGrid from '@/features/matching/ui/KeywordGrid';
import AgeRangeSection from '@/features/matching/ui/AgeRangeSection';
import BottomCta from '@/features/matching/ui/BottomCta';

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

export type AgeRange = [number, number];

type Active = 'studentId' | 'age';

export default function MatchingFilterPage() {
  const router = useRouter();

  const [selected, setSelected] = useState<string[]>([]);

  const [studentIdRange, setStudentIdRange] = useState<AgeRange>([20, 24]);
  const [ageRange, setAgeRange] = useState<AgeRange>([1997, 2002]);
  const [active, setActive] = useState<Active>('studentId');

  const studentIdLabel = useMemo(
    () => `${studentIdRange[0]}학번 ~ ${studentIdRange[1]}학번`,
    [studentIdRange]
  );

  const ageLabel = useMemo(() => `${ageRange[0]}년생 ~ ${ageRange[1]}년생`, [ageRange]);

  return (
    <>
      <FilterHeader onBack={() => router.back()} />

      <div className="container relative mx-auto flex min-h-[calc(100vh-140px)] max-w-[480px] flex-col p-6">
        <main className="w-full px-5 pb-28">
          <KeywordGrid
            keywords={KEYWORDS}
            selected={selected}
            onToggle={(k) =>
              setSelected((prev) => (prev.includes(k) ? prev.filter((v) => v !== k) : [...prev, k]))
            }
          />

          <div className="mt-5 flex gap-2">
            <button
              type="button"
              onClick={() => setActive('studentId')}
              className={`rounded-full border border-black px-4 py-2 text-xs font-extrabold ${
                active === 'studentId' ? 'bg-[#FEFED0]' : 'bg-white'
              }`}
            >
              학번
            </button>

            <button
              type="button"
              onClick={() => setActive('age')}
              className={`rounded-full border border-black px-4 py-2 text-xs font-extrabold ${
                active === 'age' ? 'bg-[#FEFED0]' : 'bg-white'
              }`}
            >
              연령
            </button>
          </div>

          <AgeRangeSection
            label="선호 학번"
            value={studentIdRange}
            valueLabel={studentIdLabel}
            min={14}
            max={26}
            onChange={setStudentIdRange}
            open={active === 'studentId'}
          />

          <AgeRangeSection
            label="선호 연령(년생)"
            value={ageRange}
            valueLabel={ageLabel}
            min={1990}
            max={2010}
            onChange={setAgeRange}
            open={active === 'age'}
          />
        </main>

        <BottomCta
          text="검색하기"
          onClick={() => {
            console.log('filters:', { selected, studentIdRange, ageRange });
            router.push('/matching');
          }}
        />
      </div>
    </>
  );
}
