import { apiInstance, publicApi } from '@/shared/api/apiInstance';
import type { ApiResponse } from '@/shared/api/api.types';
import type {
  OAuthProviderName,
  SendEmailVerificationRequest,
  SendEmailVerificationResult,
  VerifyEmailCodeRequest,
  VerifyEmailCodeResult,
} from './auth.types';

export type {
  EmailVerificationType,
  OAuthProviderName,
  SendEmailVerificationRequest,
  SendEmailVerificationResult,
  VerifyEmailCodeRequest,
  VerifyEmailCodeResult,
} from './auth.types';

function unwrapApiResult<T>(response: ApiResponse<T | null>, fallbackMessage: string): T {
  if (response.isSuccess && response.result !== null) {
    return response.result;
  }

  const error = new Error(response.message || fallbackMessage) as Error & {
    code?: number | string;
  };
  error.code = response.code;
  throw error;
}

export async function logoutApi(): Promise<void> {
  await apiInstance.post<ApiResponse<null>>('/v1/auth/logout');
}

export async function reissueApi(): Promise<{ accessToken?: string }> {
  const response = await publicApi.post<ApiResponse<null>>('/v1/auth/reissue');
  const authorization = response.headers.authorization;
  const accessToken =
    typeof authorization === 'string' && authorization.toLowerCase().startsWith('bearer ')
      ? authorization.slice(7).trim()
      : null;

  return accessToken ? { accessToken } : {};
}

export function getOAuthAuthorizationUrl(providerName: OAuthProviderName): string {
  const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL?.trim() || 'http://localhost:8080';
  return `${baseURL}/v1/oauth2/authorization/${providerName}`;
}

export async function sendEmailVerificationApi(
  payload: SendEmailVerificationRequest
): Promise<SendEmailVerificationResult> {
  const response = await publicApi.post<ApiResponse<SendEmailVerificationResult>>(
    '/v1/auth/email-verifications',
    payload
  );
  return unwrapApiResult(response.data, '인증번호 전송에 실패했습니다.');
}

export async function verifyEmailCodeApi(
  payload: VerifyEmailCodeRequest
): Promise<VerifyEmailCodeResult> {
  const response = await publicApi.put<ApiResponse<VerifyEmailCodeResult>>(
    '/v1/auth/email-verifications',
    payload
  );
  return unwrapApiResult(response.data, '인증번호 검증에 실패했습니다.');
}
