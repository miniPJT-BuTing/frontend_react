import { authApi, publicApi } from '@/shared/api/apiInstance';
import type { ApiResponse } from '@/shared/api/api.types';
import type { AiAnalysisResult, AiGender } from './ai.types';

const toRecord = (value: unknown): Record<string, unknown> => {
  if (!value || typeof value !== 'object') return {};
  return value as Record<string, unknown>;
};

const toStringSafe = (value: unknown): string => {
  if (typeof value === 'string') return value;
  return '';
};

const toNullableNumber = (value: unknown): number | null => {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string') {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return null;
};

const normalizeAiAnalysisResult = (raw: unknown): AiAnalysisResult => {
  const result = toRecord(raw);
  const percentageValue = result.percentage;
  const percentage =
    typeof percentageValue === 'number' && Number.isFinite(percentageValue)
      ? percentageValue
      : undefined;

  return {
    faceShapeId: toNullableNumber(result.faceShapeId),
    name: toStringSafe(result.name),
    nickname: toStringSafe(result.nickname),
    description: toStringSafe(result.description),
    image: toStringSafe(result.image),
    ...(percentage !== undefined ? { percentage } : {}),
  };
};

const createImageFormData = (file: File): FormData => {
  const formData = new FormData();
  formData.append('file', file);
  return formData;
};

export async function analyzeFaceApi(gender: AiGender, file: File): Promise<AiAnalysisResult> {
  const response = await publicApi.post<ApiResponse<unknown>>('/v1/ai', createImageFormData(file), {
    params: { gender },
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  return normalizeAiAnalysisResult(response.data.result);
}

export async function analyzeMyFaceApi(file: File): Promise<AiAnalysisResult> {
  const response = await authApi.post<ApiResponse<unknown>>('/v1/ai/me', createImageFormData(file), {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  return normalizeAiAnalysisResult(response.data.result);
}
