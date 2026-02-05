'use client';

import { useRouter } from 'next/navigation';
import { ChevronLeft, Menu } from 'lucide-react';

type Props = {
  title: string;
  count: number;
  onMenuClick: () => void;
};

export default function ChatRoomHeader({ title, count, onMenuClick }: Props) {
  const router = useRouter();

  return (
    <header className="sticky top-0 z-50 flex h-14 w-full items-center justify-between border-b border-gray-100 bg-white px-4">
      <button
        type="button"
        onClick={() => router.back()}
        className="flex h-10 w-10 items-center justify-center rounded-full active:bg-gray-100"
      >
        <ChevronLeft className="h-7 w-7 text-black" />
      </button>

      <div className="flex items-center gap-1">
        <h1 className="text-lg font-bold text-black">{title}</h1>
        <span className="text-sm font-medium text-gray-500">{count}</span>
      </div>

      <button
        type="button"
        onClick={onMenuClick}
        className="flex h-10 w-10 items-center justify-center rounded-full active:bg-gray-100"
      >
        <Menu className="h-6 w-6 text-black" />
      </button>
    </header>
  );
}