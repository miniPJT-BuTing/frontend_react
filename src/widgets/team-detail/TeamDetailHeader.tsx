'use client';

import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';

export function TeamDetailHeader() {
  const router = useRouter();

  return (
    <header className="flex h-14 w-full shrink-0 items-center bg-white px-5 border-b border-gray-100 relative">
      <button
        type="button"
        onClick={() => router.back()}
        className="absolute left-5 flex h-10 w-10 items-center justify-center rounded-full border border-black bg-white transition-all active:scale-95"
        aria-label="뒤로가기"
      >
        <ChevronLeft className="w-6 h-6 text-black stroke-[3]" />
      </button>

      <h1 className="mx-auto text-[24px] font-bold text-black">팀 프로필</h1>
    </header>
  );
}
