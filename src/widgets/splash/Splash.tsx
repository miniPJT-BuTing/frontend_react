'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Image from 'next/image';
import SplashButtons from '@/widgets/splash/ui/SplashButtons';
import { getOAuthAuthorizationUrl } from '@/features/auth/api/auth.api';
import { tokenStore } from '@/shared/auth/tokenStore';

import splashBg from '@/assets/images/splash-background.png';
import logo from '@/assets/logos/buting-logo.png';
import logoTitle from '@/assets/logos/buting-logo-title.png';

export default function Splash() {
  const router = useRouter();

  useEffect(() => {
    if (!tokenStore.get()) return;
    router.replace('/home');
  }, [router]);

  const handleKakaoSignup = () => {
    window.location.href = getOAuthAuthorizationUrl('kakao');
  };

  const handleLogin = () => {
    router.push('/home?skipAuth=1');
  };

  return (
    <div className="relative h-screen w-full overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url(${splashBg.src})`,
          backgroundRepeat: 'repeat',
          backgroundSize: 'auto 122%',
        }}
      />

      <div className="relative flex h-full flex-col">
        <div className="flex flex-1 flex-col items-center justify-center gap-3">
          <Image src={logo} alt="BuTing logo" width={150} height={150} priority draggable={false} />
          <Image
            src={logoTitle}
            alt="BuTing title"
            width={250}
            height={100}
            priority
            draggable={false}
            style={{ width: 250, height: 'auto' }}
          />
        </div>

        <div className="px-6 pb-10">
          <SplashButtons onKakaoSignup={handleKakaoSignup} onLogin={handleLogin} />
        </div>
      </div>
    </div>
  );
}
