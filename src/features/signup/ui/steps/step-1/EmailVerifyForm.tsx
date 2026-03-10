import { useCallback, useEffect, useMemo, useState } from 'react';
import { AxiosError } from 'axios';
import { useSignupStore } from '@/features/signup/model';
import { BottomToast } from '@/shared/ui/BottomToast';
import { InputWithAction } from './InputWithAction';
import { sendEmailVerificationApi, verifyEmailCodeApi } from '@/features/auth/api/auth.api';
import { getMemberAvailabilityApi } from '@/features/signup/api/signup.api';

type ToastType = 'success' | 'error' | 'info';
type ToastState = { visible: boolean; message: string; type: ToastType };
const SIGNUP_VERIFICATION_TYPE = 'SIGN_UP';
const INVALID_UNIVERSITY_EMAIL_CODE = 4303;
const INVALID_UNIVERSITY_EMAIL_MESSAGE = '올바르지 않은 대학 이메일';

function formatSeconds(totalSeconds: number) {
  const safe = Math.max(0, totalSeconds);
  const minutes = String(Math.floor(safe / 60)).padStart(2, '0');
  const seconds = String(safe % 60).padStart(2, '0');
  return `${minutes}:${seconds}`;
}

function extractApiErrorMessage(error: unknown, fallback: string) {
  if (error instanceof AxiosError) {
    const apiMessage = (error.response?.data as { message?: string } | undefined)?.message;
    return apiMessage || error.message || fallback;
  }
  if (error instanceof Error) return error.message;
  return fallback;
}

function isInvalidUniversityEmailError(error: unknown) {
  if (error instanceof AxiosError) {
    const data = error.response?.data as { code?: number | string; message?: string } | undefined;
    const rawCode = data?.code;
    const numericCode = typeof rawCode === 'string' ? Number(rawCode) : rawCode;

    if (numericCode === INVALID_UNIVERSITY_EMAIL_CODE) return true;
    return typeof data?.message === 'string' && data.message.includes(INVALID_UNIVERSITY_EMAIL_MESSAGE);
  }

  if (error instanceof Error) {
    const withCode = error as Error & { code?: number | string };
    const numericCode = typeof withCode.code === 'string' ? Number(withCode.code) : withCode.code;
    if (numericCode === INVALID_UNIVERSITY_EMAIL_CODE) return true;
    return error.message.includes(INVALID_UNIVERSITY_EMAIL_MESSAGE);
  }

  return false;
}

export function EmailVerifyForm() {
  const email = useSignupStore((s) => s.email);
  const setProfile = useSignupStore((s) => s.setProfile);

  const [authCode, setAuthCode] = useState('');
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [resendRemainingSeconds, setResendRemainingSeconds] = useState(0);
  const [codeRemainingSeconds, setCodeRemainingSeconds] = useState(0);

  const [toast, setToast] = useState<ToastState>({
    visible: false,
    message: '',
    type: 'info',
  });

  const showToast = useCallback((message: string, type: ToastType = 'info') => {
    setToast({ visible: true, message, type });
  }, []);

  const handleToastClose = useCallback(() => {
    setToast((prev) => ({ ...prev, visible: false }));
  }, []);

  useEffect(() => {
    if (!toast.visible) return;
    const t = window.setTimeout(() => {
      setToast((prev) => ({ ...prev, visible: false }));
    }, 2200);
    return () => window.clearTimeout(t);
  }, [toast.visible]);

  useEffect(() => {
    if (resendRemainingSeconds <= 0 && codeRemainingSeconds <= 0) return;

    const timer = window.setInterval(() => {
      setResendRemainingSeconds((prev) => (prev > 0 ? prev - 1 : 0));
      setCodeRemainingSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [resendRemainingSeconds, codeRemainingSeconds]);

  const emailRegex = useMemo(() => /^[^\s@]+@[^\s@]+\.[^\s@]+$/, []);

  const handleSendEmail = useCallback(async () => {
    if (!email) {
      showToast('이메일을 입력해주세요.', 'error');
      return;
    }
    if (!emailRegex.test(email)) {
      showToast('이메일 형식이 올바르지 않습니다.', 'error');
      return;
    }

    try {
      setIsSending(true);
      const availability = await getMemberAvailabilityApi({ email: email.trim() });
      const emailAvailability = availability.find((item) => item.type === 'EMAIL');
      if (emailAvailability && !emailAvailability.isAvailable) {
        showToast('이미 사용 중인 이메일입니다.', 'error');
        return;
      }

      const result = await sendEmailVerificationApi({
        email: email.trim(),
        verificationType: SIGNUP_VERIFICATION_TYPE,
      });
      setIsEmailSent(true);
      setResendRemainingSeconds(result.resendRemainingSeconds);
      setCodeRemainingSeconds(result.expiredInSeconds);
      showToast(
        result.resendRemainingSeconds > 0
          ? `${result.resendRemainingSeconds}초 후 재전송할 수 있어요.`
          : '인증번호가 전송되었습니다!',
        'success'
      );
    } catch (error) {
      const invalidUniversityEmail = isInvalidUniversityEmailError(error);
      if (invalidUniversityEmail) {
        setIsEmailSent(false);
        setAuthCode('');
        setProfile({
          universityName: '',
          universityDomain: '',
          universityDomainId: null,
        });
      }
      showToast(extractApiErrorMessage(error, '인증번호 전송에 실패했습니다.'), 'error');
    } finally {
      setIsSending(false);
    }
  }, [email, emailRegex, setProfile, showToast]);

  const handleEmailChange = useCallback(
    (value: string) => {
      setProfile({
        email: value,
        universityName: '',
        universityDomain: '',
        universityDomainId: null,
      });
      setIsEmailSent(false);
      setAuthCode('');
      setResendRemainingSeconds(0);
      setCodeRemainingSeconds(0);
    },
    [setProfile]
  );

  const handleVerifyCode = useCallback(async () => {
    if (!authCode) {
      showToast('인증번호를 입력해주세요.', 'error');
      return;
    }
    if (!email) {
      showToast('이메일을 먼저 입력해주세요.', 'error');
      return;
    }
    if (codeRemainingSeconds <= 0) {
      showToast('인증번호가 만료되었습니다. 다시 전송해주세요.', 'error');
      return;
    }

    try {
      setIsVerifying(true);
      const result = await verifyEmailCodeApi({
        email: email.trim(),
        verificationType: SIGNUP_VERIFICATION_TYPE,
        code: authCode.trim(),
      });

      if (!result.verified) {
        showToast('인증번호가 올바르지 않습니다.', 'error');
        return;
      }

      if (result.universityName) {
        setProfile({
          universityName: result.universityName,
          universityDomain: result.domain ?? '',
          universityDomainId: result.universityDomainId,
        });
        showToast(`${result.universityName} 인증이 완료되었습니다.`, 'success');
      } else {
        setProfile({
          universityName: '',
          universityDomain: result.domain ?? '',
          universityDomainId: result.universityDomainId,
        });
        showToast('이메일 인증이 완료되었습니다.', 'success');
      }
      setCodeRemainingSeconds(0);
    } catch (error) {
      showToast(extractApiErrorMessage(error, '인증번호 검증에 실패했습니다.'), 'error');
    } finally {
      setIsVerifying(false);
    }
  }, [authCode, codeRemainingSeconds, email, setProfile, showToast]);

  const isSendDisabled = isSending || resendRemainingSeconds > 0;
  const sendButtonText = isSending
    ? '전송중...'
    : isEmailSent
      ? resendRemainingSeconds > 0
        ? `재전송 ${formatSeconds(resendRemainingSeconds)}`
        : '재전송'
      : '전송';

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <InputWithAction
          label="이메일"
          placeholder="이메일 입력"
          value={email}
          type="email"
          autoComplete="email"
          buttonText={sendButtonText}
          disabled={isSending}
          buttonDisabled={isSendDisabled}
          onChange={handleEmailChange}
          onAction={handleSendEmail}
        />
      </div>

      {isEmailSent && (
        <div className="animate-fade-in-up flex flex-col gap-2">
          <InputWithAction
            label="인증번호"
            placeholder="인증번호 6자리"
            value={authCode}
            autoComplete="one-time-code"
            buttonText={isVerifying ? '확인중...' : '확인'}
            disabled={isVerifying}
            buttonDisabled={isVerifying || codeRemainingSeconds <= 0}
            onChange={setAuthCode}
            onAction={handleVerifyCode}
          />
          <p className="text-xs font-semibold text-slate-600 text-right mr-2">
            인증번호 만료까지 {formatSeconds(codeRemainingSeconds)}
          </p>
        </div>
      )}

      <BottomToast
        message={toast.message}
        isVisible={toast.visible}
        type={toast.type}
        onClose={handleToastClose}
      />
    </div>
  );
}
