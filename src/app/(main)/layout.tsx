import { PropsWithChildren } from 'react';
import BottomNav from '@/widgets/bottom-nav/BottomNav';

export default function MainLayout({ children }: PropsWithChildren) {
  return (
    <>
      <main className="flex-1 pb-[calc(60px+env(safe-area-inset-bottom))]">{children}</main>
      <BottomNav />
    </>
  );
}
