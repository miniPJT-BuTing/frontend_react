'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronDown } from 'lucide-react';

import FilterHeader from '@/features/matching/ui/FilterHeader';
import KeywordGrid from '@/shared/ui/KeywordGrid';
import AgeRangeSection from '@/shared/ui/AgeRangeSection';
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
type Active = 'studentId' | 'age' | null;

function Chevron({ open }: { open: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={[
        'ml-2 inline-flex h-5 w-5 items-center justify-center',
        'rounded-full border border-black bg-white',
        'transition-transform duration-200',
        open ? 'rotate-180' : 'rotate-0',
      ].join(' ')}
    >
      <ChevronDown className="h-3 w-3" />
    </span>
  );
}

export default function MatchingFilterPage() {
  const router = useRouter();

  const [selected, setSelected] = useState<string[]>([]);
  const [studentIdRange, setStudentIdRange] = useState<AgeRange>([20, 24]);
  const [ageRange, setAgeRange] = useState<AgeRange>([1997, 2002]);
  const [active, setActive] = useState<Active>(null);

  const studentIdLabel = useMemo(
    () => `${studentIdRange[0]}학번 ~ ${studentIdRange[1]}학번`,
    [studentIdRange]
  );

  const ageLabel = useMemo(() => `${ageRange[0]}년생 ~ ${ageRange[1]}년생`, [ageRange]);

  const toggle = (key: Exclude<Active, null>) => {
    setActive((prev) => (prev === key ? null : key));
  };

  return (
    <>
      <FilterHeader onBack={() => router.back()} />

      <div className="container relative mx-auto flex min-h-[calc(100vh-140px)] max-w-[480px] flex-col p-6">
        <KeywordGrid
          keywords={KEYWORDS}
          selected={selected}
          onToggle={(k) => {
            setSelected((prev) => (prev.includes(k) ? prev.filter((v) => v !== k) : [...prev, k]));
          }}
        />

        <section className="mt-10 space-y-5">
          <button
            type="button"
            onClick={() => toggle('studentId')}
            className="flex w-full items-center justify-between"
          >
            <span className="text-sm font-extrabold text-black">선호 학번</span>

            <span className="flex items-center gap-2">
              <span className="rounded-full border border-black bg-[#FEFED0] px-3 py-1 text-xs font-extrabold text-black">
                {studentIdLabel}
              </span>

              <Chevron open={active === 'studentId'} />
            </span>
          </button>

          <AgeRangeSection
            label="선호 학번"
            value={studentIdRange}
            valueLabel={studentIdLabel}
            min={14}
            max={26}
            onChange={setStudentIdRange}
            open={active === 'studentId'}
          />

          <button
            type="button"
            onClick={() => toggle('age')}
            className="flex w-full items-center justify-between"
          >
            <span className="text-sm font-extrabold text-black">선호 연령(년생)</span>

            <span className="flex items-center gap-2">
              <span className="rounded-full border border-black bg-[#FEFED0] px-3 py-1 text-xs font-extrabold text-black">
                {ageLabel}
              </span>

              <Chevron open={active === 'age'} />
            </span>
          </button>

          <AgeRangeSection
            label="선호 연령(년생)"
            value={ageRange}
            valueLabel={ageLabel}
            min={1990}
            max={2009}
            onChange={setAgeRange}
            open={active === 'age'}
          />
        </section>

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
