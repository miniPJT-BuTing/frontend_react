import { apiInstance } from '@/shared/api/apiInstance';
import type { ApiResponse } from '@/shared/api/api.types';
import type { MyProfileResponse, UpdateMyProfileRequest } from './member.types';

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

export const getMyProfile = async (): Promise<MyProfileResponse> => {
  const response = await apiInstance.get<ApiResponse<unknown>>('/v1/members/me');
  const obj = toObjectRecord(response.data.result);

  return {
    memberId: pickFirstNumber(obj, ['memberId', 'id']) ?? 0,
    nickname: pickFirstString(obj, ['nickname', 'name']) ?? '',
    universityName: pickFirstString(obj, ['universityName', 'school', 'university']),
    collegeId: pickFirstNumber(obj, ['collegeId']),
    collegeName: pickFirstString(obj, ['collegeName', 'department', 'major']),
    age: pickFirstNumber(obj, ['age']),
    mbtiCode: pickFirstString(obj, ['mbtiCode', 'mbti'])?.toUpperCase(),
    personalityTypes: toPersonalityTypes(obj),
    bio: pickFirstString(obj, ['bio', 'description', 'introduction']),
    faceShape: pickFirstString(obj, ['faceShape', 'animalType']),
  };
};

const normalizeUpdatePayload = (payload: UpdateMyProfileRequest) => {
  const nickname = payload.nickname.trim();
  const mbti = payload.mbti.trim().toUpperCase();
  const bio = payload.bio?.trim() ?? '';

  return {
    nickname,
    mbti,
    mbtiCode: mbti,
    personalityTypes: payload.personalityTypes,
    ...(bio ? { bio } : {}),
  };
};

export const updateMyProfile = async (payload: UpdateMyProfileRequest): Promise<void> => {
  const body = normalizeUpdatePayload(payload);
  await apiInstance.patch<ApiResponse<null>>('/v1/members/me', body);
};
