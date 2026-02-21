export type HttpStatus = {
  error: boolean;
  is5xxServerError: boolean;
  is4xxClientError: boolean;
  is1xxInformational: boolean;
  is2xxSuccessful: boolean;
  is3xxRedirection: boolean;
};

export type EmailVerificationType = 'SIGN_UP';
export type OAuthProviderName = 'kakao' | (string & {});

export interface SendEmailVerificationRequest {
  email: string;
  verificationType: EmailVerificationType;
}

export interface SendEmailVerificationResult {
  verificationType: string;
  serverTime: string;
  expiredAt: string;
  expiredInSeconds: number;
  resendAvailableAt: string;
  resendRemainingSeconds: number;
  maxVerifyAttempts: number;
}

export interface VerifyEmailCodeRequest {
  email: string;
  verificationType: EmailVerificationType;
  code: string;
}

export interface VerifyEmailCodeResult {
  verificationType: string;
  verified: boolean;
  universityDomainId: number | null;
  universityName: string | null;
  domain: string | null;
}
