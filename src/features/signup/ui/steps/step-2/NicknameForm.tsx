import { useCallback, useEffect, useState } from 'react';
import { AxiosError } from 'axios';
import { useSignupStore } from '@/features/signup/model';
import { RetroButton } from '@/shared/ui/button/RetroButton';
import { BottomToast } from '@/shared/ui/BottomToast';
import { getMemberAvailabilityApi } from '@/features/signup/api/signup.api';

export function NicknameForm() {
  const { nickname, setProfile } = useSignupStore();
  const [checking, setChecking] = useState(false);
  const [toast, setToast] = useState<{
    visible: boolean;
    message: string;
    type: 'success' | 'error' | 'info';
  }>({
    visible: false,
    message: '',
    type: 'info',
  });

  const nicknameRegex = /^[가-힣a-zA-Z0-9]{2,10}$/;
  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToast({ visible: true, message, type });
  }, []);

  const handleToastClose = useCallback(() => {
    setToast((prev) => ({ ...prev, visible: false }));
  }, []);

  useEffect(() => {
    if (!toast.visible) return;
    const timer = window.setTimeout(() => {
      setToast((prev) => ({ ...prev, visible: false }));
    }, 2200);

    return () => window.clearTimeout(timer);
  }, [toast.visible]);

  const handleCheckNickname = async () => {
    const trimmedNickname = nickname.trim();
    if (!trimmedNickname) {
      showToast('닉네임을 입력해주세요.', 'error');
      return;
    }

    if (!nicknameRegex.test(trimmedNickname)) {
      showToast('닉네임은 2~10자 한글/영문/숫자만 가능해요.', 'error');
      return;
    }

    try {
      setChecking(true);
      const result = await getMemberAvailabilityApi({ nickname: trimmedNickname });
      const nicknameResult = result.find((item) => item.type === 'NICKNAME');

      if (!nicknameResult || !nicknameResult.isAvailable) {
        showToast('이미 사용 중인 닉네임입니다.', 'error');
        return;
      }

      showToast('사용 가능한 닉네임입니다.', 'success');
    } catch (error) {
      if (error instanceof AxiosError) {
        const message = (error.response?.data as { message?: string } | undefined)?.message;
        showToast(message || '닉네임 확인에 실패했습니다.', 'error');
      } else {
        showToast('닉네임 확인에 실패했습니다.', 'error');
      }
    } finally {
      setChecking(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <label className="text-base font-bold">닉네임</label>
      <div className="relative">
        <input
          type="text"
          value={nickname}
          onChange={(e) => {
            setProfile({ nickname: e.target.value });
          }}
          placeholder="닉네임을 입력해주세요"
          className="h-14 w-full rounded-full border border-black px-4 pr-24 text-base outline-none focus:bg-gray-50"
        />

        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          <RetroButton
            type="button"
            variant="primary"
            onClick={handleCheckNickname}
            className="h-9 whitespace-nowrap px-4 text-sm"
            disabled={checking}
          >
            {checking ? '확인중...' : '중복확인'}
          </RetroButton>
        </div>
      </div>
      <BottomToast
        message={toast.message}
        isVisible={toast.visible}
        type={toast.type}
        onClose={handleToastClose}
      />
    </div>
  );
}
