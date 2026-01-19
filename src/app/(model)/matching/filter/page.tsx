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

export default function MatchingFilterPage() {
  const router = useRouter();

  const [selected, setSelected] = useState<string[]>([]);
  const [ageRange, setAgeRange] = useState<AgeRange>([1997, 2002]);

  const ageLabel = useMemo(() => `${ageRange[0]}년생 ~ ${ageRange[1]}년생`, [ageRange]);

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-[480px] flex-col">
      <FilterHeader title="검색" onBack={() => router.back()} />

      <main className="w-full px-5 pb-28">
        <KeywordGrid
          keywords={KEYWORDS}
          selected={selected}
          onToggle={(k) =>
            setSelected((prev) => (prev.includes(k) ? prev.filter((v) => v !== k) : [...prev, k]))
          }
        />

        <AgeRangeSection
          label="학번 | 연령"
          value={ageRange}
          valueLabel={ageLabel}
          min={1990}
          max={2010}
          onChange={setAgeRange}
        />
      </main>

      <BottomCta
        text="검색하기"
        onClick={() => {
          console.log('filters:', { selected, ageRange });
          router.push('/matching');
        }}
      />
    </div>
  );
}
