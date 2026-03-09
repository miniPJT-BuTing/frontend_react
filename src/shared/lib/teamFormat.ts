import { resolveTeamMoodKey, TEAM_MOOD_KEY_TO_LABEL } from '@/shared/lib/personalityKeyword';

export const formatTeamSizeLabel = (teamSize?: string, fallback?: string): string | undefined => {
  if (teamSize === 'TWO_ON_TWO') return '2:2';
  if (teamSize === 'THREE_ON_THREE') return '3:3';
  if (teamSize === 'FOUR_ON_FOUR') return '4:4';
  if (teamSize === 'FIVE_ON_FIVE') return '5:5';
  if (teamSize === 'SIX_ON_SIX') return '6:6';
  return fallback;
};

export const formatTeamSizeCount = (teamSize?: string, fallback = 2): number => {
  if (teamSize === 'TWO_ON_TWO') return 2;
  if (teamSize === 'THREE_ON_THREE') return 3;
  if (teamSize === 'FOUR_ON_FOUR') return 4;
  if (teamSize === 'FIVE_ON_FIVE') return 5;
  if (teamSize === 'SIX_ON_SIX') return 6;
  return fallback;
};

export const formatTeamMoodLabel = (mood?: string): string | undefined => {
  if (!mood) return undefined;
  const moodKey = resolveTeamMoodKey(mood);
  return moodKey ? TEAM_MOOD_KEY_TO_LABEL[moodKey] : mood;
};

export const formatEntryYearRange = (min?: number, max?: number): string | undefined => {
  if (typeof min !== 'number' || typeof max !== 'number') return undefined;
  return `${min}~${max}학번`;
};

export const formatAgeRange = (min?: number, max?: number): string | undefined => {
  if (typeof min !== 'number' || typeof max !== 'number') return undefined;
  return `${min}~${max}세`;
};

export const formatRequestStatusLabel = (status?: string, fallback = '상태미상'): string => {
  const normalized = status?.toUpperCase();
  if (normalized === 'PENDING') return '대기중';
  if (normalized === 'ACCEPTED') return '수락됨';
  if (normalized === 'REJECTED') return '거절됨';
  if (normalized === 'EXPIRED') return '만료됨';
  return status || fallback;
};

