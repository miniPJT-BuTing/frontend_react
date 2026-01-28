import type { ReactNode } from 'react';
import MainHeader from '@/widgets/header/MainHeader';
import BottomNav from '@/widgets/bottom-nav/BottomNav';

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <div
      className="
    flex min-h-screen flex-col items-center
    text-slate-900
  "
    >
      <MainHeader />

      <main
        className="
          mx-auto w-full max-w-[480px] flex-1 overflow-y-auto
          px-5 pt-4
          pb-[calc(72px+env(safe-area-inset-bottom)+16px)]
        "
      >
        {children}
      </main>

      <BottomNav />
    </div>
  );
}
