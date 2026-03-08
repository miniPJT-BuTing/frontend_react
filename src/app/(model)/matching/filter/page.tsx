'use client';

import { useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ChevronDown } from 'lucide-react';

import FilterHeader from '@/features/matching/ui/FilterHeader';
import {
  buildMatchingFiltersSearchParams,
  parseMatchingFilters,
  type MatchingRange,
} from '@/features/matching/lib/matchingFilters';
import {
  TEAM_MOOD_KEYWORDS,
  TEAM_MOOD_LABEL_TO_KEY,
  TEAM_MOOD_KEY_TO_LABEL,
  type TeamMoodKey,
} from '@/shared/lib/personalityKeyword';
import KeywordGrid from '@/shared/ui/KeywordGrid';
import AgeRangeSection from '@/shared/ui/AgeRangeSection';
import BottomCta from '@/features/matching/ui/BottomCta';

type Active = 'studentId' | 'age' | null;
const DEFAULT_ENTRY_YEAR_RANGE: MatchingRange = [20, 24];
const DEFAULT_AGE_RANGE: MatchingRange = [20, 25];

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
  const searchParams = useSearchParams();
  const initialFilters = useMemo(() => parseMatchingFilters(searchParams), [searchParams]);
  const moodLabels = useMemo(() => TEAM_MOOD_KEYWORDS.map((item) => item.label), []);

  const [selectedMoodKeys, setSelectedMoodKeys] = useState<TeamMoodKey[]>(initialFilters.moodKeys);
  const [studentIdRange, setStudentIdRange] = useState<MatchingRange>(
    initialFilters.entryYearRange ?? DEFAULT_ENTRY_YEAR_RANGE
  );
  const [ageRange, setAgeRange] = useState<MatchingRange>(initialFilters.ageRange ?? DEFAULT_AGE_RANGE);
  const [active, setActive] = useState<Active>(null);
  const selectedMoodLabels = useMemo(
    () => selectedMoodKeys.map((key) => TEAM_MOOD_KEY_TO_LABEL[key]).filter(Boolean),
    [selectedMoodKeys]
  );

  const studentIdLabel = useMemo(
    () => `${studentIdRange[0]}학번 ~ ${studentIdRange[1]}학번`,
    [studentIdRange]
  );

  const ageLabel = useMemo(() => `${ageRange[0]}세 ~ ${ageRange[1]}세`, [ageRange]);

  const toggle = (key: Exclude<Active, null>) => {
    setActive((prev) => (prev === key ? null : key));
  };

  return (
    <>
      <FilterHeader onBack={() => router.back()} />

      <div className="container relative mx-auto flex min-h-[calc(100vh-140px)] max-w-[480px] flex-col p-6">
        <KeywordGrid
          keywords={moodLabels}
          selected={selectedMoodLabels}
          onToggle={(label) => {
            const moodKey = TEAM_MOOD_LABEL_TO_KEY[label];
            if (!moodKey) return;

            setSelectedMoodKeys((prev) =>
              prev.includes(moodKey) ? prev.filter((value) => value !== moodKey) : [...prev, moodKey]
            );
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
            min={18}
            max={26}
            onChange={setStudentIdRange}
            open={active === 'studentId'}
          />

          <button
            type="button"
            onClick={() => toggle('age')}
            className="flex w-full items-center justify-between"
          >
            <span className="text-sm font-extrabold text-black">선호 연령</span>

            <span className="flex items-center gap-2">
              <span className="rounded-full border border-black bg-[#FEFED0] px-3 py-1 text-xs font-extrabold text-black">
                {ageLabel}
              </span>

              <Chevron open={active === 'age'} />
            </span>
          </button>

          <AgeRangeSection
            label="선호 연령"
            value={ageRange}
            valueLabel={ageLabel}
            min={20}
            max={30}
            onChange={setAgeRange}
            open={active === 'age'}
          />
        </section>

        <BottomCta
          text="검색하기"
          onClick={() => {
            const params = buildMatchingFiltersSearchParams({
              moodKeys: selectedMoodKeys,
              entryYearRange: studentIdRange,
              ageRange,
            });
            const query = params.toString();
            router.push(query ? `/matching?${query}` : '/matching');
          }}
        />
      </div>
    </>
  );
}
