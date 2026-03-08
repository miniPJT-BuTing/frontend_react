'use client';

import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';

type Props = {
  placeholder: string;
  href?: string;
};

export default function SearchBarLink({ placeholder, href = '/matching/filter' }: Props) {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => router.push(href as Parameters<typeof router.push>[0])}
      aria-label="필터 검색 페이지로 이동"
      className="
        w-full
        flex items-center gap-2
        rounded-full
        border border-black
        bg-white
        px-4 py-3
        cursor-pointer select-none
        transition-all
        active:translate-y-[1px]
      "
      >
      <Search size={18} strokeWidth={2} className="text-gray-700" />

      <span className="text-[14px] text-gray-500">{placeholder}</span>
    </button>
  );
}
