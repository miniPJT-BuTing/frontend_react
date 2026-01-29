export type PersonalityKeywordKey =
  | 'LIVELINESS'
  | 'CALMNESS'
  | 'ENTHUSIASM'
  | 'COOLNESS'
  | 'HONESTY'
  | 'HUMOR'
  | 'SOCIABILITY'
  | 'SENSE'
  | 'AFFECTION'
  | 'CASUALNESS'
  | 'OPTIMISM'
  | 'EMOTIONALITY'
  | 'LOGIC'
  | 'POSITIVITY'
  | 'REALISM'
  | 'CONSIDERATION'
  | 'SERIOUSNESS'
  | 'RESPONSIBILITY'
  | 'CAUTION'
  | 'LEADERSHIP';

export type PersonalityKeyword = {
  key: PersonalityKeywordKey;
  label: string;
};

export const PERSONALITY_KEYWORDS = [
  { key: 'LIVELINESS', label: '활발함' },
  { key: 'CALMNESS', label: '차분함' },
  { key: 'ENTHUSIASM', label: '열정적' },
  { key: 'COOLNESS', label: '쿨함' },

  { key: 'HONESTY', label: '솔직함' },
  { key: 'HUMOR', label: '유머러스' },
  { key: 'SOCIABILITY', label: '사교적' },
  { key: 'SENSE', label: '센스있음' },
  { key: 'AFFECTION', label: '다정함' },
  { key: 'CASUALNESS', label: '털털함' },

  { key: 'OPTIMISM', label: '낙천적' },
  { key: 'EMOTIONALITY', label: '감성적' },
  { key: 'LOGIC', label: '논리적' },
  { key: 'POSITIVITY', label: '긍정적' },
  { key: 'REALISM', label: '현실적' },

  { key: 'CONSIDERATION', label: '배려심' },
  { key: 'SERIOUSNESS', label: '진중함' },
  { key: 'RESPONSIBILITY', label: '책임감' },
  { key: 'CAUTION', label: '신중함' },
  { key: 'LEADERSHIP', label: '리더십' },
] as const satisfies readonly PersonalityKeyword[];

// 라벨 유니온/배열 (KeywordGrid에 바로 넣을 용도)
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
