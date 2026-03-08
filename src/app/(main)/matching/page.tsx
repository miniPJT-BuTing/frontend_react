'use client';

import { useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { X } from 'lucide-react';
import SearchBarLink from '@/shared/ui/SearchBar';
import TodayPickSection from '@/widgets/home/TodayPickSection';
import { buildMatchingFiltersSearchParams, parseMatchingFilters } from '@/features/matching/lib/matchingFilters';
import { TEAM_MOOD_KEY_TO_LABEL, type TeamMoodKey } from '@/shared/lib/personalityKeyword';

export default function MatchingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const filters = useMemo(() => parseMatchingFilters(searchParams), [searchParams]);
  const filterHref = useMemo(() => {
    const query = searchParams.toString();
    return query ? `/matching/filter?${query}` : '/matching/filter';
  }, [searchParams]);

  const chips = useMemo(() => {
    const items: Array<{ key: string; label: string; type: 'mood' | 'entryYear' | 'age'; moodKey?: TeamMoodKey }> =
      [];

    for (const moodKey of filters.moodKeys) {
      const label = TEAM_MOOD_KEY_TO_LABEL[moodKey];
      if (!label) continue;
      items.push({
        key: `mood-${moodKey}`,
        label,
        type: 'mood',
        moodKey,
      });
    }

    if (filters.entryYearRange) {
      items.push({
        key: 'entryYear',
        label: `${filters.entryYearRange[0]}~${filters.entryYearRange[1]}학번`,
        type: 'entryYear',
      });
    }

    if (filters.ageRange) {
      items.push({
        key: 'age',
        label: `${filters.ageRange[0]}~${filters.ageRange[1]}세`,
        type: 'age',
      });
    }

    return items;
  }, [filters.ageRange, filters.entryYearRange, filters.moodKeys]);

  const updateFilters = (next: typeof filters) => {
    const params = buildMatchingFiltersSearchParams(next);
    const query = params.toString();
    router.replace(query ? `/matching?${query}` : '/matching');
  };

  const removeChip = (chip: (typeof chips)[number]) => {
    if (chip.type === 'mood' && chip.moodKey) {
      updateFilters({
        ...filters,
        moodKeys: filters.moodKeys.filter((mood) => mood !== chip.moodKey),
      });
      return;
    }

    if (chip.type === 'entryYear') {
      updateFilters({
        ...filters,
        entryYearRange: undefined,
      });
      return;
    }

    if (chip.type === 'age') {
      updateFilters({
        ...filters,
        ageRange: undefined,
      });
    }
  };

  return (
    <div className="space-y-5">
      <SearchBarLink placeholder="키워드로 미팅 상대 찾기" href={filterHref} />

      {chips.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {chips.map((chip) => (
            <button
              key={chip.key}
              type="button"
              onClick={() => removeChip(chip)}
              className="inline-flex items-center gap-1.5 rounded-full border border-black bg-[#FEFED0] px-3 py-1 text-xs font-extrabold text-black"
            >
              <span>{chip.label}</span>
              <X size={12} />
            </button>
          ))}
        </div>
      )}

      <TodayPickSection filters={filters} />
    </div>
  );
}
