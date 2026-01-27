'use client';

import { ChevronLeft } from 'lucide-react';

export default function FilterHeader({ title, onBack }: { title: string; onBack: () => void }) {
  return (
    <header className="w-full px-6 py-4 flex flex-col">
      <div className="relative flex items-center justify-center">
        <button
          type="button"
          onClick={onBack}
          className="absolute left-0 flex h-10 w-10 items-center justify-center rounded-full border border-black bg-white"
          aria-label="뒤로가기"
        >
          <ChevronLeft className="h-6 w-6 text-black stroke-[3]" />
        </button>

        <h1 className="font-bold text-lg leading-none text-slate-900">{title}</h1>

        {/* title 중앙 정렬용 스페이서 */}
        <div className="absolute right-0 h-10 w-10" />
      </div>
    </header>
  );
}
