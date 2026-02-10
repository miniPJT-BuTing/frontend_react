'use client';

import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';

export function EditProfileHeader() {
  const router = useRouter();

  return (
    <header className="sticky top-0 z-50 flex h-14 w-full items-center border-b border-gray-100 bg-white px-5">
      <button
        type="button"
        onClick={() => router.back()}
        className="absolute left-5 flex h-10 w-10 items-center justify-center rounded-full border border-black bg-white transition-all active:scale-95"
        aria-label="뒤로가기"
      >
        <ChevronLeft className="h-6 w-6 stroke-[3] text-black" />
      </button>

      <h1 className="mx-auto text-[18px] font-bold text-black">프로필 수정</h1>
    </header>
  );
}
