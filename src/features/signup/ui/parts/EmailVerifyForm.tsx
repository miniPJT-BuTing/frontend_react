import React, { useState } from 'react';
import { useSignupStore } from '../../model/signup.store';
import { RetroButton } from '@/shared/ui/RetroButton';
import { BottomToast } from '@/shared/ui/BottomToast';

export default function EmailVerifyForm() {
  const { email, setProfile } = useSignupStore();
  const [authCode, setAuthCode] = useState('');
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [toast, setToast] = useState<{
    visible: boolean;
    message: string;
    type: 'success' | 'error' | 'info';
  }>({
    visible: false,
    message: '',
    type: 'info',
  });

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToast({ visible: true, message, type });
  };

  const handleSendEmail = () => {
    if (!email) {
      showToast('이메일을 입력해주세요.', 'error');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showToast('이메일 형식이 올바르지 않습니다.', 'error');
      return;
    }

    // Mock API call
    console.log('Sending email to:', email);
    setIsEmailSent(true);
    showToast('인증번호가 전송되었습니다!', 'success');
  };

  const handleVerifyCode = () => {
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
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Email Field */}
      <div className="flex flex-col gap-2">
        <label className="text-base font-bold">이메일 인증</label>
        <div className="relative">
          <input
            type="email"
            value={email}
            onChange={(e) => setProfile({ email: e.target.value })}
            placeholder="이메일 입력"
            className="h-14 w-full rounded-full border border-black px-4 pr-24 text-base outline-none focus:bg-gray-50 transition-colors"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <RetroButton
              type="button"
              variant="neutral"
              className="h-9 px-4 text-sm !bg-[#F7ABCF] whitespace-nowrap"
              onClick={handleSendEmail}
            >
              {isEmailSent ? '재전송' : '전송'}
            </RetroButton>
          </div>
        </div>
      </div>

      {isEmailSent && (
        <div className="flex flex-col gap-2 animate-fade-in-up">
          <label className="text-base font-bold">인증번호</label>
          <div className="relative">
            <input
              type="text"
              value={authCode}
              onChange={(e) => setAuthCode(e.target.value)}
              placeholder="인증번호 6자리"
              className="h-14 w-full rounded-full border border-black px-4 pr-24 text-base outline-none focus:bg-gray-50 transition-colors"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <RetroButton
                type="button"
                variant="neutral"
                className="h-9 px-4 text-sm !bg-[#F7ABCF] whitespace-nowrap"
                onClick={handleVerifyCode}
              >
                확인
              </RetroButton>
            </div>
          </div>
        </div>
      )}

      <BottomToast
        message={toast.message}
        isVisible={toast.visible}
        type={toast.type}
        onClose={() => setToast((prev) => ({ ...prev, visible: false }))}
      />
    </div>
  );
}
