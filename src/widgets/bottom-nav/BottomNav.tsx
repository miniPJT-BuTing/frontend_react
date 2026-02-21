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
    <nav className="fixed inset-x-0 bottom-0 z-50">
      <div className="bg-transparent pb-[env(safe-area-inset-bottom)]">
        <div
          className="
            h-[72px]
            w-full
            rounded-t-[26px]
            border-x border-t border-black
            bg-white
            flex items-center justify-around
          "
        >
          {NAV_ITEMS.map(({ label, href, icon }) => {
            const isActive = pathname === href || pathname.startsWith(`${href}/`);

            return (
              <button
                key={href}
                type="button"
                onClick={() => router.push(href)}
                className="flex flex-col items-center justify-center gap-1.5 px-4"
              >
                <Image
                  src={icon}
                  alt={label}
                  width={30}
                  height={30}
                  priority={isActive}
                  className={[
                    'pixelated transition-transform duration-150',
                    isActive ? 'opacity-100 scale-[1.06]' : 'opacity-55 scale-100',
                  ].join(' ')}
                />
                <span
                  className={[
                    'text-xs leading-none',
                    isActive ? 'text-black font-bold' : 'text-slate-400',
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
