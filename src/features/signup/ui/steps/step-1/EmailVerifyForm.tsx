import { useCallback, useEffect, useMemo, useState } from 'react';
import { AxiosError } from 'axios';
import { useSignupStore } from '@/features/signup/model';
import { BottomToast } from '@/shared/ui/BottomToast';
import { InputWithAction } from '@/features/signup/ui/steps/step-1';
import { sendEmailVerificationApi, verifyEmailCodeApi } from '@/features/auth/api/auth.api';
import { getMemberAvailabilityApi } from '@/features/signup/api/signup.api';

type ToastType = 'success' | 'error' | 'info';
type ToastState = { visible: boolean; message: string; type: ToastType };
const SIGNUP_VERIFICATION_TYPE = 'SIGN_UP';

function extractApiErrorMessage(error: unknown, fallback: string) {
  if (error instanceof AxiosError) {
    const apiMessage = (error.response?.data as { message?: string } | undefined)?.message;
    return apiMessage || error.message || fallback;
  }
  if (error instanceof Error) return error.message;
  return fallback;
}

export function EmailVerifyForm() {
  const email = useSignupStore((s) => s.email);
  const setProfile = useSignupStore((s) => s.setProfile);

  const [authCode, setAuthCode] = useState('');
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

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
      showToast(
        result.resendRemainingSeconds > 0
          ? `${result.resendRemainingSeconds}초 후 재전송할 수 있어요.`
          : '인증번호가 전송되었습니다!',
        'success'
      );
    } catch (error) {
      showToast(extractApiErrorMessage(error, '인증번호 전송에 실패했습니다.'), 'error');
    } finally {
      setIsSending(false);
    }
  }, [email, emailRegex, showToast]);

  const handleVerifyCode = useCallback(async () => {
    if (!authCode) {
      showToast('인증번호를 입력해주세요.', 'error');
      return;
    }
    if (!email) {
      showToast('이메일을 먼저 입력해주세요.', 'error');
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
          universityDomainId: result.universityDomainId,
        });
        showToast(`${result.universityName} 인증이 완료되었습니다.`, 'success');
      } else {
        setProfile({ universityDomainId: result.universityDomainId });
        showToast('이메일 인증이 완료되었습니다.', 'success');
      }
    } catch (error) {
      showToast(extractApiErrorMessage(error, '인증번호 검증에 실패했습니다.'), 'error');
    } finally {
      setIsVerifying(false);
    }
  }, [authCode, email, setProfile, showToast]);

  return (
    <div className="flex flex-col gap-6">
      <InputWithAction
        label="이메일"
        placeholder="이메일 입력"
        value={email}
        buttonText={isSending ? '전송중...' : isEmailSent ? '재전송' : '전송'}
        disabled={isSending}
        onChange={(v) => setProfile({ email: v })}
        onAction={handleSendEmail}
      />

      {isEmailSent && (
        <div className="animate-fade-in-up">
          <InputWithAction
            label="인증번호"
            placeholder="인증번호 6자리"
            value={authCode}
            buttonText={isVerifying ? '확인중...' : '확인'}
            disabled={isVerifying}
            onChange={setAuthCode}
            onAction={handleVerifyCode}
          />
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
