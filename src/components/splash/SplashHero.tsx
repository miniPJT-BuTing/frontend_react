'use client';

import Image from 'next/image';
import { Sparkles } from 'lucide-react';
import ButingLogo from '@/assets/logos/buting-logo.png';

type Props = {
  onLogoBurst: (x: number, y: number) => void;
};

export default function SplashHero({ onLogoBurst }: Props) {
  const handleLogoClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    onLogoBurst(rect.left + rect.width / 2, rect.top + rect.height / 2);
  };

  return (
    <header className="pt-12">
      <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/80 px-4 py-2 text-xs text-textSecondary shadow-sm backdrop-blur">
        <Sparkles className="h-4 w-4 text-primary" />
        오늘의 인연을 부팅 중
      </div>

      <div className="mt-20 flex flex-col items-center text-center">
        <button
          type="button"
          onClick={handleLogoClick}
          className="relative flex items-center justify-center active:scale-95 transition"
          aria-label="logo"
        >
          <Image
            src={ButingLogo}
            alt="BuTing logo"
            width={128}
            height={128}
            priority
            className="h-32 w-32 object-contain"
          />
        </button>

        <h1 className="mt-6 text-4xl font-dnf tracking-tight text-foreground">
          <span className="text-primary">B</span>u<span className="text-primary">T</span>ing
        </h1>

        <p className="mt-2 text-sm leading-relaxed text-textSecondary">
          대학생들을 위한 과팅 서비스
        </p>
      </div>
    </header>
  );
}
