import Image from 'next/image';

export function SearchBar({ placeholder }: { placeholder: string }) {
  return (
    <div className="flex items-center gap-2 rounded-full border-2 border-[#5863D6] bg-white px-4 py-3 shadow-[0_6px_0_rgba(88,99,214,0.15)]">
      <div className="size-5 opacity-70">
        {/* 아이콘은 프로젝트 방식에 맞게 교체 (png/svg) */}
        <Image src="/icons/search.svg" alt="" width={20} height={20} />
      </div>
      <input
        className="w-full bg-transparent text-[14px] outline-none placeholder:text-[#9AA3B2]"
        placeholder={placeholder}
      />
    </div>
  );
}
