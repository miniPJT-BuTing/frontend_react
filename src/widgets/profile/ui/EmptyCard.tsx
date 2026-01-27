import Link from 'next/link';
import type { Route } from 'next';

type Props = {
  title: string;
  desc: string;
  actionLabel: string;
  href: string;
};

export default function EmptyCard({ title, desc, actionLabel, href }: Props) {
  return (
    <div className="rounded-[22px] border border-black bg-white p-4">
      <p className="text-[14px] font-extrabold text-black">{title}</p>
      <p className="mt-1 text-[12px] font-semibold text-gray-500">{desc}</p>

      <Link
        href={href as Route}
        className="mt-4 block w-full rounded-full bg-primary border border-black py-3 text-center text-[14px] font-extrabold text-black active:translate-y-[1px]"
      >
        {actionLabel}
      </Link>
    </div>
  );
}
