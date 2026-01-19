'use client';

import Image from 'next/image';
import { Bell, Plus } from 'lucide-react';
import ButingLogoTitle from '@/assets/logos/buting-logo-title.png';

export default function MainHeader() {
  return (
    <header className="sticky top-0 z-50 w-full">
      <div className="mx-auto flex h-14 max-w-[480px] items-center px-5 pt-3">
        <div className="flex items-center">
          <Image src={ButingLogoTitle} alt="부팅" priority className="h-10 w-auto" />
        </div>

        <div className="ml-auto flex items-center gap-2">
          <button
            type="button"
            className="flex h-8 items-center justify-center rounded-full bg-[#FFE1EE] px-3 text-[13px] font-extrabold text-[#FF6FAE]"
          >
            팀
          </button>

          <button
            type="button"
            aria-label="팀 추가"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-[#FFE1EE] text-[#FF6FAE]"
          >
            <Plus size={18} strokeWidth={2.5} />
          </button>

          <button
            type="button"
            aria-label="알림"
            className="relative flex h-8 w-8 items-center justify-center"
          >
            <Bell size={22} className="text-[#0F172A]" />
            <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-[#FF6FAE]" />
          </button>
        </div>
      </div>
    </header>
  );
}
