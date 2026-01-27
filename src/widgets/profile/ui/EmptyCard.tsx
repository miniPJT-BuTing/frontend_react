import Link from 'next/link';

export default function EmptyCard({
  title,
  desc,
  cta,
}: {
  title: string;
  desc: string;
  cta: { label: string; href: string };
}) {
  return (
    <div className="rounded-[22px] border border-black bg-white p-4">
      <p className="text-[14px] font-extrabold text-black">{title}</p>
      <p className="mt-1 text-[12px] font-semibold text-gray-500">{desc}</p>

      <Link
        href={cta.href}
        className="mt-4 block w-full rounded-full bg-primary border border-black py-3 text-center text-[14px] font-extrabold text-black active:translate-y-[1px]"
      >
        {cta.label}
      </Link>
    </div>
  );
}
