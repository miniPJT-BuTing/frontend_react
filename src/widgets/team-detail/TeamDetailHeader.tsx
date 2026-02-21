'use client';

import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';

export function TeamDetailHeader() {
  const router = useRouter();

  return (
    <header className="w-full shrink-0 px-6 pb-3 pt-4">
      <div className="relative flex h-10 items-center justify-center">
        <button
          type="button"
          onClick={() => router.back()}
          className="absolute left-0 flex h-10 w-10 items-center justify-center rounded-full border border-black bg-white transition-all active:scale-95"
          aria-label="뒤로가기"
        >
          <ChevronLeft className="h-6 w-6 text-black stroke-[3]" />
        </button>

        <h1 className="text-lg font-bold text-black">팀 프로필</h1>
      </div>
    </header>
  );
}
