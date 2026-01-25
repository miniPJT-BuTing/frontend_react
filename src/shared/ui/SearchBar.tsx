import Link from 'next/link';
import { Search } from 'lucide-react';

export function SearchBarLink({ placeholder }: { placeholder: string }) {
  return (
    <Link
      href="/matching/filter"
      aria-label="필터 검색 페이지로 이동"
      className="
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
    </Link>
  );
}
