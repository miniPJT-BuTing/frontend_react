import Image from 'next/image';

import chatIcon from '@/assets/icons/chat.png';

type Props = {
  onKakaoSignup?: () => void;
  onLogin?: () => void;
};

export default function SplashButtons({ onKakaoSignup, onLogin }: Props) {
  return (
    <div className="mx-auto flex w-full max-w-[360px] flex-col gap-4">
      <button
        type="button"
        onClick={onKakaoSignup}
        className="flex h-14 w-full items-center justify-center gap-3 rounded-full border-2 border-black bg-[#F7E24B] font-extrabold shadow-[0_4px_0_0_rgba(0,0,0,1)] active:translate-y-[2px] active:shadow-[0_2px_0_0_rgba(0,0,0,1)]"
      >
        <Image src={chatIcon} alt="Chat Icon" width={40} height={40} priority draggable={false} />
        <span className="text-base">카카오로 회원가입 하기</span>
      </button>

      <button
        type="button"
        onClick={onLogin}
        className="h-14 w-full rounded-full border-2 border-black bg-[#F2B6CE] font-extrabold shadow-[0_4px_0_0_rgba(0,0,0,1)] active:translate-y-[2px] active:shadow-[0_2px_0_0_rgba(0,0,0,1)]"
      >
        로그인 하기
      </button>
    </div>
  );
}
