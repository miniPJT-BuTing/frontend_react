'use client';

import Image from 'next/image';
import type { Route } from 'next';
import { usePathname, useRouter } from 'next/navigation';

import HomeIcon from '@/assets/icons/home-nav.png';
import MatchingIcon from '@/assets/icons/matching-nav.png';
import ChatIcon from '@/assets/icons/chat-nav.png';
import ProfileIcon from '@/assets/icons/profile-nav.png';

const NAV_ITEMS = [
  { label: '홈', href: '/home', icon: HomeIcon },
  { label: '매칭', href: '/matching', icon: MatchingIcon },
  { label: '채팅', href: '/chats', icon: ChatIcon },
  { label: '프로필', href: '/profile', icon: ProfileIcon },
] as const satisfies ReadonlyArray<{
  label: string;
  href: Route;
  icon: typeof HomeIcon;
}>;

export default function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();

  if (pathname.startsWith('/teams/new')) return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50">
      <div className="relative mx-auto w-full max-w-[480px]">
        <div className="flex h-[72px] items-center justify-around rounded-t-[22px] bg-white px-3 shadow-[0_-4px_10px_rgba(0,0,0,0.08)]">
          {NAV_ITEMS.map(({ label, href, icon }) => {
            const isActive = pathname === href || pathname.startsWith(`${href}/`);

            return (
              <button
                key={href}
                type="button"
                onClick={() => router.push(href)}
                className="flex flex-col items-center justify-center gap-1.5 px-2"
              >
                <Image
                  src={icon}
                  alt={label}
                  width={30}
                  height={30}
                  priority={isActive}
                  className={[
                    'pixelated transition-transform duration-150',
                    isActive ? 'opacity-100 scale-[1.06]' : 'icon-inactive scale-100',
                  ].join(' ')}
                />
                <span
                  className={[
                    "font-['DNFBit'] text-[12px] leading-none",
                    isActive ? 'text-black' : 'text-[#94A3B8]',
                  ].join(' ')}
                >
                  {label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
