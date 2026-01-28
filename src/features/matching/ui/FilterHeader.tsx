'use client';

import { ChevronLeft } from 'lucide-react';

export default function FilterHeader({ onBack }: { onBack: () => void }) {
  return (
    <header className="relative w-full px-6 py-4">
      <div className="flex items-center">
        <button
          type="button"
          onClick={onBack}
          className="
            w-10 h-10
            flex items-center justify-center
            rounded-full
            border border-black
            bg-white
            transition-all
          "
          aria-label="뒤로가기"
        >
          <ChevronLeft className="w-6 h-6 text-black stroke-[3]" />
        </button>
      </div>
    </header>
  );
}
