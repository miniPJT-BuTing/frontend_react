import Link from 'next/link';
import type { Route } from 'next';

export default function MenuItem({
  title,
  desc,
  href,
  onClick,
  tone = 'normal',
}: {
  title: string;
  desc: string;
  href?: string;
  onClick?: () => void;
  tone?: 'normal' | 'warn' | 'danger';
}) {
  const color =
    tone === 'danger' ? 'text-[#E11D48]' : tone === 'warn' ? 'text-[#B45309]' : 'text-black';

  const content = (
    <div className="flex items-center justify-between gap-3 rounded-[18px] px-4 py-3 active:translate-y-[1px]">
      <div>
        <p className={`text-[14px] font-extrabold ${color}`}>{title}</p>
        <p className="mt-[2px] text-[12px] font-semibold text-gray-500">{desc}</p>
      </div>
      <span className="text-[14px] font-black text-black">›</span>
    </div>
  );

  if (href) {
    return (
      <Link href={href as Route} className="block">
        {content}
      </Link>
    );
  }

  return (
    <button type="button" onClick={onClick} className="w-full text-left">
      {content}
    </button>
  );
}
