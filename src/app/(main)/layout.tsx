import type { ReactNode } from 'react';
import MainHeader from '@/widgets/header/MainHeader';
import BottomNav from '@/widgets/bottom-nav/BottomNav';
import RequireAccessToken from '@/shared/auth/RequireAccessToken';

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <RequireAccessToken>
      <div
        className="
          flex h-[100dvh] flex-col items-center overflow-hidden
          bg-gradient-to-b
          from-[var(--color-skyblue)] from-0%
          to-[var(--color-skyPrimary)] to-90%
        "
      >
        <MainHeader />

        <main
          className="
            mx-auto w-full max-w-[480px] flex-1 overflow-y-auto scrollbar-hide
            px-5 pt-4
            pb-[calc(72px+env(safe-area-inset-bottom)+16px)]
          "
        >
          {children}
        </main>

        <BottomNav />
      </div>
    </RequireAccessToken>
  );
}
