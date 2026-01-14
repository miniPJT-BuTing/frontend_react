import type { ReactNode } from 'react';
import MainHeader from '@/widgets/header/MainHeader';
import BottomNav from '@/widgets/bottom-nav/BottomNav';

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <div
      className="min-h-dvh"
      style={{
        background: `linear-gradient(180deg,
          #EAF4FF 0%,
          #D7F8FF 45%,
          #79A5E2 120%
        )`,
      }}
    >
      <MainHeader />

      <main className="mx-auto w-full max-w-[420px] px-5 pb-24 pt-4">{children}</main>

      <BottomNav />
    </div>
  );
}
