import Image from 'next/image';

import chatIcon from '@/assets/icons/chat.png';
import { ShadowButton } from '@/shared/ui/button';

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
      >
        카카오로 시작하기
      </ShadowButton>

      <ShadowButton onClick={onLogin} variant="primary">
        로그인 하기
      </ShadowButton>
    </div>
  );
}
