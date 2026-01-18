'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Bell } from 'lucide-react';
import LogoTitle from '@/assets/logos/buting-logo-title.png';
import ProfileIcon from '@/assets/icons/profile.png';

export default function MainHeader() {
  return (
    <header className="relative z-20 flex h-[60px] items-center justify-between px-5 pt-2">
      <Link href="/home" className="w-[100px]">
        <Image
          src={LogoTitle}
          alt="BUTING"
          width={100}
          height={40}
          className="object-contain"
          priority
        />
      </Link>
      <div className="flex items-center gap-4">
        <Link href="/notifications" className="relative text-gray-700 transition-colors hover:text-black">
          <Bell size={24} />
          {/* Notification Badge */}
          <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-[#F7ABCF] ring-2 ring-white" />
        </Link>
        <Link
          href="/profile"
          className="overflow-hidden rounded-full border border-gray-200 bg-white"
        >
          <Image
            src={ProfileIcon}
            alt="Profile"
            width={32}
            height={32}
            className="object-cover"
          />
        </Link>
      </div>
    </header>
  );
}
