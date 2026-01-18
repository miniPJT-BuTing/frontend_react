'use client';

import Link from 'next/link';

import Image, { StaticImageData } from 'next/image';

import { usePathname } from 'next/navigation';

import type { Route } from 'next';

// Import icons statically to avoid path issues

import HomeIcon from '@/assets/icons/home.png';

import MatchingIcon from '@/assets/icons/matching.png';

import ChatIcon from '@/assets/icons/chat.png';

import ProfileIcon from '@/assets/icons/profile.png';

interface NavItem {
  label: string;

  href: Route;

  icon: StaticImageData;
}

const NAV_ITEMS: NavItem[] = [
  { label: '홈', href: '/home', icon: HomeIcon },

  { label: '매칭', href: '/matching', icon: MatchingIcon },

  { label: '채팅', href: '/chats', icon: ChatIcon },

  { label: '프로필', href: '/profile', icon: ProfileIcon },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-1/2 z-50 w-full max-w-[480px] -translate-x-1/2 bg-surface rounded-t-[20px] shadow-[0_-4px_20px_rgba(0,0,0,0.05)] pb-[env(safe-area-inset-bottom)]">
      <ul className="flex h-[70px] items-center justify-around px-4">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname.startsWith(item.href);

          return (
            <li key={item.href} className="flex-1">
              <Link
                href={item.href}
                className="flex h-full w-full flex-col items-center justify-center gap-1"
              >
                <div
                  className={`relative transition-all duration-200 ${
                    isActive ? 'scale-110' : 'opacity-50'
                  }`}
                >
                  <Image
                    src={item.icon}
                    alt={item.label}
                    width={28}
                    height={28}
                    className="object-contain"
                  />
                </div>

                <span
                  className={`text-[11px] font-medium leading-none transition-colors duration-200 ${
                    isActive ? 'text-[#F7ABCF]' : 'text-gray-400'
                  }`}
                >
                  {item.label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
