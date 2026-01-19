import Link from 'next/link';
import { Search } from 'lucide-react';

export function SearchBarLink({ placeholder }: { placeholder: string }) {
  return (
    <Link
      href="/matching/filter"
      className="
        flex items-center gap-2 rounded-full
        border-2 border-[#5863D6] bg-white px-4 py-3
        shadow-[0_6px_0_rgba(88,99,214,0.15)]
        cursor-pointer select-none
        transition-transform active:translate-y-[1px]
      "
      aria-label="필터 검색 페이지로 이동"
    >
      <Search size={20} strokeWidth={2} className="text-[#5863D6] opacity-80" />

      <span className="text-[14px] text-[#9AA3B2]">{placeholder}</span>
    </Link>
  );
}
