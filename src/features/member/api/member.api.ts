import { apiInstance } from '@/shared/api/apiInstance';
import type { ApiResponse } from '@/shared/api/api.types';
import type {
  MyProfileResponse,
  PersonalityKeywordItem,
  UpdateMyProfileRequest,
} from './member.types';

const toObjectRecord = (value: unknown): Record<string, unknown> => {
  if (!value || typeof value !== 'object') return {};
  return value as Record<string, unknown>;
};

const toNumber = (value: unknown): number | undefined => {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value !== 'string' || !value.trim()) return undefined;
  const converted = Number(value);
  return Number.isFinite(converted) ? converted : undefined;
};

const toStringSafe = (value: unknown): string | undefined => {
  if (typeof value === 'string') return value;
  return undefined;
};

const toStringArray = (value: unknown): string[] => {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => toStringSafe(item)?.trim())
    .filter((item): item is string => Boolean(item));
};

const toPersonalityKeywordArray = (value: unknown): PersonalityKeywordItem[] => {
  if (!Array.isArray(value)) return [];

  return value
    .map((item) => {
      if (!item || typeof item !== 'object') return null;
      const obj = item as Record<string, unknown>;
      const code = toStringSafe(obj.code)?.trim();
      const description = toStringSafe(obj.description)?.trim();
      if (!code || !description) return null;
      return { code, description };
    })
    .filter((item): item is PersonalityKeywordItem => item !== null);
};

const toPersonalityTypes = (obj: Record<string, unknown>): string[] => {
  const personalityTypes = toStringArray(obj.personalityTypes);
  if (personalityTypes.length > 0) return personalityTypes;

  const rawPersonalities = obj.personalities;
  if (!Array.isArray(rawPersonalities)) return [];

  return rawPersonalities
    .map((item) => {
      if (typeof item === 'string') return item.trim();
      if (!item || typeof item !== 'object') return '';

      const personality = item as Record<string, unknown>;
      const code = toStringSafe(personality.code)?.trim();
      const description = toStringSafe(personality.description)?.trim();
      return code || description || '';
    })
    .filter((item): item is string => Boolean(item));
};

const pickFirstString = (obj: Record<string, unknown>, keys: string[]): string | undefined => {
  for (const key of keys) {
    const value = toStringSafe(obj[key])?.trim();
    if (value) return value;
  }
  return undefined;
};

const pickFirstNumber = (obj: Record<string, unknown>, keys: string[]): number | undefined => {
  for (const key of keys) {
    const value = toNumber(obj[key]);
    if (value !== undefined) return value;
  }
  return undefined;
};

const normalizeProfileResponse = (raw: unknown): MyProfileResponse => {
  const obj = toObjectRecord(raw);
  return {
    memberId: pickFirstNumber(obj, ['memberId', 'id']) ?? 0,
    nickname: pickFirstString(obj, ['nickname', 'name']) ?? '',
    universityName: pickFirstString(obj, ['universityName', 'school', 'university']),
    collegeId: pickFirstNumber(obj, ['collegeId']),
    collegeName: pickFirstString(obj, ['collegeName', 'department', 'major']),
    age: pickFirstNumber(obj, ['age']),
    gender: pickFirstString(obj, ['gender']),
    entryYear: pickFirstNumber(obj, ['entryYear']),
    mbtiCode: pickFirstString(obj, ['mbtiCode', 'mbti'])?.toUpperCase(),
    mbtiDescription: pickFirstString(obj, ['mbtiDescription']),
    personalityTypes: toPersonalityTypes(obj),
    bio: pickFirstString(obj, ['bio', 'description', 'introduction']),
    faceShape: pickFirstString(obj, ['faceShape', 'animalType']),
  };
};

export const getMyProfile = async (): Promise<MyProfileResponse> => {
  const response = await apiInstance.get<ApiResponse<unknown>>('/v1/members/me');
  return normalizeProfileResponse(response.data.result);
};

export const getMemberProfileById = async (memberId: number): Promise<MyProfileResponse> => {
  const response = await apiInstance.get<ApiResponse<unknown>>(`/v1/members/profile/${memberId}`);
  return normalizeProfileResponse(response.data.result);
};

export const getPersonalityKeywordsApi = async (): Promise<PersonalityKeywordItem[]> => {
  const response = await apiInstance.get<ApiResponse<unknown>>('/v1/members/personality-keywords');
  return toPersonalityKeywordArray(response.data.result);
};

const normalizeUpdatePayload = (payload: UpdateMyProfileRequest) => {
  const nickname = payload.nickname.trim();
  const mbti = payload.mbti.trim().toUpperCase();
  const bio = payload.bio?.trim() ?? '';

  return {
    nickname,
    mbtiCode: mbti,
    personalityTypes: payload.personalityTypes,
    ...(bio ? { bio } : {}),
  };
};

export const updateMyProfile = async (payload: UpdateMyProfileRequest): Promise<void> => {
  const body = normalizeUpdatePayload(payload);
  await apiInstance.patch<ApiResponse<null>>('/v1/members/me', body);
};

export const deleteMyAccountApi = async (): Promise<void> => {
  await apiInstance.delete<ApiResponse<null>>('/v1/members/me');
};
