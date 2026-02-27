import { publicApi } from '@/shared/api/apiInstance';
import type { ApiResponse } from '@/shared/api/api.types';
import type {
  CollegeItem,
  CompleteSignupRequest,
  MemberAvailabilityItem,
  MemberAvailabilityParams,
} from './signup.types';

export type {
  AvailabilityType,
  CollegeItem,
  CompleteSignupRequest,
  MemberAvailabilityItem,
  MemberAvailabilityParams,
  SignupGender,
} from './signup.types';

export async function completeSignupApi(payload: CompleteSignupRequest): Promise<void> {
  await publicApi.post<ApiResponse<null>>('/v1/members', payload);
}

export async function getCollegesApi(): Promise<CollegeItem[]> {
  const response = await publicApi.get<ApiResponse<CollegeItem[]>>('/v1/colleges');
  return response.data.result ?? [];
}

export async function getMemberAvailabilityApi(
  params: MemberAvailabilityParams
): Promise<MemberAvailabilityItem[]> {
  const hasEmail = Boolean(params.email?.trim());
  const hasNickname = Boolean(params.nickname?.trim());
  if (!hasEmail && !hasNickname) {
    throw new Error('email 또는 nickname 중 하나는 필수입니다.');
  }

  const response = await publicApi.get<ApiResponse<MemberAvailabilityItem[]>>(
    '/v1/members/availability',
    {
      params: {
        ...(hasEmail ? { email: params.email!.trim() } : {}),
        ...(hasNickname ? { nickname: params.nickname!.trim() } : {}),
      },
    }
  );

  return response.data.result ?? [];
}
