import { useState } from 'react';
import { AxiosError } from 'axios';
import { useSignupStore } from '@/features/signup/model';
import { RetroButton } from '@/shared/ui/button/RetroButton';
import { getMemberAvailabilityApi } from '@/features/signup/api/signup.api';

export function NicknameForm() {
  const { nickname, setProfile } = useSignupStore();
  const [checking, setChecking] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [statusTone, setStatusTone] = useState<'default' | 'success' | 'error'>('default');

  const nicknameRegex = /^[가-힣a-zA-Z0-9]{2,10}$/;

  const handleCheckNickname = async () => {
    const trimmedNickname = nickname.trim();
    if (!trimmedNickname) {
      setStatusTone('error');
      setStatusMessage('닉네임을 입력해주세요.');
      return;
    }

    if (!nicknameRegex.test(trimmedNickname)) {
      setStatusTone('error');
      setStatusMessage('닉네임은 2~10자 한글/영문/숫자만 가능해요.');
      return;
    }

    try {
      setChecking(true);
      const result = await getMemberAvailabilityApi({ nickname: trimmedNickname });
      const nicknameResult = result.find((item) => item.type === 'NICKNAME');

      if (!nicknameResult || !nicknameResult.isAvailable) {
        setStatusTone('error');
        setStatusMessage('이미 사용 중인 닉네임입니다.');
        return;
      }

      setStatusTone('success');
      setStatusMessage('사용 가능한 닉네임입니다.');
    } catch (error) {
      if (error instanceof AxiosError) {
        const message = (error.response?.data as { message?: string } | undefined)?.message;
        setStatusTone('error');
        setStatusMessage(message || '닉네임 확인에 실패했습니다.');
      } else {
        setStatusTone('error');
        setStatusMessage('닉네임 확인에 실패했습니다.');
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
            setStatusMessage('');
            setStatusTone('default');
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

      {statusMessage ? (
        <p
          className={`text-xs ${
            statusTone === 'success'
              ? 'text-emerald-600'
              : statusTone === 'error'
                ? 'text-red-500'
                : 'text-gray-500'
          }`}
        >
          {statusMessage}
        </p>
      ) : null}
    </div>
  );
}
