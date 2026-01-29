import Image from 'next/image';

import chatIcon from '@/assets/icons/chat.png';
import { ShadowButton } from '@/shared/ui/shadow-button/ShadowButton';

type Props = {
  onKakaoSignup?: () => void;
  onLogin?: () => void;
};

export default function SplashButtons({ onKakaoSignup, onLogin }: Props) {
  return (
    <div className="mx-auto flex w-full max-w-[360px] flex-col gap-4">
      <ShadowButton
        onClick={onKakaoSignup}
        variant="kakao"
        leftIcon={
          <Image src={chatIcon} alt="Chat Icon" width={40} height={40} priority draggable={false} />
        }
        label="카카오로 회원가입 하기"
      />

      <ShadowButton onClick={onLogin} variant="primary" label="로그인 하기" />
    </div>
  );
}
