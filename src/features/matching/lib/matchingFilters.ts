import { resolveTeamMoodKey, type TeamMoodKey } from '@/shared/lib/personalityKeyword';

export type MatchingRange = [number, number];

export interface MatchingFilters {
  moodKeys: TeamMoodKey[];
  entryYearRange?: MatchingRange;
  ageRange?: MatchingRange;
}

const toNumber = (value: string | null): number | null => {
  if (typeof value !== 'string' || !value.trim()) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

const normalizeRange = (min: number | null, max: number | null): MatchingRange | undefined => {
  if (min === null || max === null) return undefined;
  return min <= max ? [min, max] : [max, min];
};

const parseMoodKeys = (raw: string | null): TeamMoodKey[] => {
  if (!raw) return [];
  const unique = new Set<TeamMoodKey>();

  for (const chunk of raw.split(',')) {
    const key = resolveTeamMoodKey(chunk);
    if (key) unique.add(key);
  }

  return [...unique];
};

type SearchParamsLike = Pick<URLSearchParams, 'get'>;

export const parseMatchingFilters = (searchParams: SearchParamsLike): MatchingFilters => {
  const entryYearRange = normalizeRange(
    toNumber(searchParams.get('entryYearMin')),
    toNumber(searchParams.get('entryYearMax'))
  );
  const ageRange = normalizeRange(toNumber(searchParams.get('ageMin')), toNumber(searchParams.get('ageMax')));

  return {
    moodKeys: parseMoodKeys(searchParams.get('moods')),
    ...(entryYearRange ? { entryYearRange } : {}),
    ...(ageRange ? { ageRange } : {}),
  };
};

export const buildMatchingFiltersSearchParams = (filters: MatchingFilters): URLSearchParams => {
  const params = new URLSearchParams();

  if (filters.moodKeys.length > 0) {
    params.set('moods', filters.moodKeys.join(','));
  }

  if (filters.entryYearRange) {
    params.set('entryYearMin', String(filters.entryYearRange[0]));
    params.set('entryYearMax', String(filters.entryYearRange[1]));
  }

  if (filters.ageRange) {
    params.set('ageMin', String(filters.ageRange[0]));
    params.set('ageMax', String(filters.ageRange[1]));
  }

  return params;
};
