// 1. 회원 성격 키워드 (Personality Type) - 20개
export type PersonalityKeywordKey =
  | 'AFFECTION'
  | 'CALMNESS'
  | 'CASUALNESS'
  | 'CAUTION'
  | 'CONSIDERATION'
  | 'COOLNESS'
  | 'EMOTIONALITY'
  | 'ENTHUSIASM'
  | 'HONESTY'
  | 'HUMOR'
  | 'LEADERSHIP'
  | 'LIVELINESS'
  | 'LOGIC'
  | 'OPTIMISM'
  | 'POSITIVITY'
  | 'REALISM'
  | 'RESPONSIBILITY'
  | 'SENSE'
  | 'SERIOUSNESS'
  | 'SOCIABILITY';

export type PersonalityKeyword = {
  key: PersonalityKeywordKey;
  label: string;
};

export const PERSONALITY_KEYWORDS = [
  { key: 'LIVELINESS', label: '활발한' },
  { key: 'CALMNESS', label: '조용한' },
  { key: 'ENTHUSIASM', label: '열정적' },
  { key: 'COOLNESS', label: '시크한' },
  { key: 'HONESTY', label: '솔직한' },
  { key: 'HUMOR', label: '유머러스' },
  { key: 'SOCIABILITY', label: '사교적' },
  { key: 'SENSE', label: '센스있는' },
  { key: 'AFFECTION', label: '다정다감' },
  { key: 'CASUALNESS', label: '털털한' },
  { key: 'CAUTION', label: '신중한' },
  { key: 'CONSIDERATION', label: '배려심' },
  { key: 'EMOTIONALITY', label: '감성적' },
  { key: 'LOGIC', label: '이성적' },
  { key: 'OPTIMISM', label: '낙천적' },
  { key: 'POSITIVITY', label: '긍정적' },
  { key: 'REALISM', label: '현실적' },
  { key: 'RESPONSIBILITY', label: '책임감' },
  { key: 'SERIOUSNESS', label: '진지한' },
  { key: 'LEADERSHIP', label: '리더십' },
] as const satisfies readonly PersonalityKeyword[];


// 2. 팀 선호 분위기 키워드 (Preferred Mood) - 8개
export type TeamMoodKey =
  | 'ROMANTIC_TENSION'
  | 'FRIENDSHIP_TENSION'
  | 'FLIRTY_TENSION'
  | 'CALM_TENSION'
  | 'HIGH_TENSION'
  | 'DRINKING_TENSION'
  | 'EMOTIONAL_TENSION'
  | 'ANY_MOOD';

export type TeamMoodKeyword = {
  key: TeamMoodKey;
  label: string;
};

export const TEAM_MOOD_KEYWORDS = [
  { key: 'ROMANTIC_TENSION', label: '연애 텐션' },
  { key: 'FRIENDSHIP_TENSION', label: '친구 텐션' },
  { key: 'FLIRTY_TENSION', label: '썸 텐션' },
  { key: 'CALM_TENSION', label: '차분 텐션' },
  { key: 'HIGH_TENSION', label: '하이 텐션' },
  { key: 'DRINKING_TENSION', label: '술 텐션' },
  { key: 'EMOTIONAL_TENSION', label: '감성 텐션' },
  { key: 'ANY_MOOD', label: '상관 없음' },
] as const satisfies readonly TeamMoodKeyword[];

export const TEAM_MOOD_LABEL_TO_KEY = Object.fromEntries(
  TEAM_MOOD_KEYWORDS.map((k) => [k.label, k.key])
) as Record<string, TeamMoodKey>;

export const TEAM_MOOD_KEY_TO_LABEL = Object.fromEntries(
  TEAM_MOOD_KEYWORDS.map((k) => [k.key, k.label])
) as Record<TeamMoodKey, string>;

const TEAM_MOOD_ALIAS_TO_KEY: Record<string, TeamMoodKey> = {
  romantictension: 'ROMANTIC_TENSION',
  friendshiptension: 'FRIENDSHIP_TENSION',
  flirtytension: 'FLIRTY_TENSION',
  calmtension: 'CALM_TENSION',
  hightension: 'HIGH_TENSION',
  drinkingtension: 'DRINKING_TENSION',
  emotionaltension: 'EMOTIONAL_TENSION',
  anymood: 'ANY_MOOD',
  연애텐션: 'ROMANTIC_TENSION',
  친구텐션: 'FRIENDSHIP_TENSION',
  썸텐션: 'FLIRTY_TENSION',
  차분텐션: 'CALM_TENSION',
  하이텐션: 'HIGH_TENSION',
  술텐션: 'DRINKING_TENSION',
  감성텐션: 'EMOTIONAL_TENSION',
  상관없음: 'ANY_MOOD',
};

const normalizeMoodAlias = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '')
    .replace(/[-_]/g, '');

export const resolveTeamMoodKey = (value: string | null | undefined): TeamMoodKey | null => {
  if (!value) return null;
  const raw = value.trim();
  if (!raw) return null;

  if ((TEAM_MOOD_KEY_TO_LABEL as Record<string, string>)[raw]) {
    return raw as TeamMoodKey;
  }

  const byLabel = TEAM_MOOD_LABEL_TO_KEY[raw];
  if (byLabel) return byLabel;

  return TEAM_MOOD_ALIAS_TO_KEY[normalizeMoodAlias(raw)] ?? null;
};


// 라벨 유니온/배열 (KeywordGrid에 바로 넣을 용도) - Personality 기준
export type PersonalityKeywordLabel = (typeof PERSONALITY_KEYWORDS)[number]['label'];
export const PERSONALITY_LABELS = PERSONALITY_KEYWORDS.map(
  (k) => k.label
) as readonly PersonalityKeywordLabel[];

// 변환 맵
export const PERSONALITY_LABEL_TO_KEY = Object.fromEntries(
  PERSONALITY_KEYWORDS.map((k) => [k.label, k.key])
) as Record<PersonalityKeywordLabel, PersonalityKeywordKey>;

export const PERSONALITY_KEY_TO_LABEL = Object.fromEntries(
  PERSONALITY_KEYWORDS.map((k) => [k.key, k.label])
) as Record<PersonalityKeywordKey, PersonalityKeywordLabel>;
