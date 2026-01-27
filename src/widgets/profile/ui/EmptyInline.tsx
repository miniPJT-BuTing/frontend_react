import Link from 'next/link';
import type { Route } from 'next';

type Props = {
  title: string;
  desc: string;
  actionLabel: string;
  href: string;
};

export default function EmptyInline({ title, desc, actionLabel, href }: Props) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div>
        <p className="text-[14px] font-extrabold text-black">{title}</p>
        <p className="text-[12px] font-semibold text-gray-500">{desc}</p>
      </div>

      <Link
        href={href as Route}
        className="shrink-0 rounded-full border border-black bg-primary px-4 py-2 text-[12px] font-extrabold text-black active:translate-y-[1px]"
      >
        {actionLabel}
      </Link>
    </div>
  );
}
