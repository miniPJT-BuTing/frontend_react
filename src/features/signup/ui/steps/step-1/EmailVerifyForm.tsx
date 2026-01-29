import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSignupStore } from '@/features/signup/model';
import { BottomToast } from '@/shared/ui/BottomToast';
import { InputWithAction } from '@/features/signup/ui/steps/step-1';

type ToastType = 'success' | 'error' | 'info';
type ToastState = { visible: boolean; message: string; type: ToastType };

export function EmailVerifyForm() {
  const email = useSignupStore((s) => s.email);
  const setProfile = useSignupStore((s) => s.setProfile);

  const [authCode, setAuthCode] = useState('');
  const [isEmailSent, setIsEmailSent] = useState(false);

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

  const handleSendEmail = useCallback(() => {
    if (!email) {
      showToast('이메일을 입력해주세요.', 'error');
      return;
    }
    if (!emailRegex.test(email)) {
      showToast('이메일 형식이 올바르지 않습니다.', 'error');
      return;
    }

    console.log('Sending email to:', email);
    setIsEmailSent(true);
    showToast('인증번호가 전송되었습니다!', 'success');
  }, [email, emailRegex, showToast]);

  const handleVerifyCode = useCallback(() => {
    if (!authCode) {
      showToast('인증번호를 입력해주세요.', 'error');
      return;
    }

    // Mock Verification
    if (authCode === '1234') {
      showToast('인증이 완료되었습니다.', 'success');
    } else {
      showToast('인증번호가 올바르지 않습니다.', 'error');
    }
  }, [authCode, showToast]);

  return (
    <div className="flex flex-col gap-6">
      <InputWithAction
        label="이메일"
        placeholder="이메일 입력"
        value={email}
        buttonText={isEmailSent ? '재전송' : '전송'}
        onChange={(v) => setProfile({ email: v })}
        onAction={handleSendEmail}
      />

      {isEmailSent && (
        <div className="animate-fade-in-up">
          <InputWithAction
            label="인증번호"
            placeholder="인증번호 6자리"
            value={authCode}
            buttonText="확인"
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
