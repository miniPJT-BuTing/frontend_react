'use client';

import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';

export function TeamDetailHeader() {
  const router = useRouter();
  const handleBack = () => router.back();

  return (
    <header className="mb-8 flex items-center justify-between px-6 pt-4">
      <button
        type="button"
        onClick={handleBack}
        aria-label="뒤로가기"
        className="h-10 w-10 rounded-full border border-black bg-white flex items-center justify-center active:translate-y-[1px]"
      >
        <ChevronLeft className="h-6 w-6 stroke-[3] text-black" />
      </button>
      <div className="rounded-full border border-black bg-gradient-to-b from-white to-[var(--color-primary)] px-4 py-2 text-sm font-bold uppercase active:translate-y-[1px]">
        team detail
      </div>
    </header>
  );
}
