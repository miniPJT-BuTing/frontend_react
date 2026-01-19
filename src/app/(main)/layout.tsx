import type { ReactNode } from 'react';
import MainHeader from '@/widgets/header/MainHeader';
import BottomNav from '@/widgets/bottom-nav/BottomNav';

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <div
      className="
    flex min-h-screen flex-col items-center
    text-slate-900
    bg-gradient-to-b
    from-[#EAF4FF]
    via-[#D7F8FF]
    to-[#79A5E2]
  "
    >
      <MainHeader />

      <main className="mx-auto w-full max-w-[480px] px-5 pb-24 pt-4">{children}</main>

      <BottomNav />
    </div>
  );
}
