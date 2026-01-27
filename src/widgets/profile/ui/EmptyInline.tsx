import Link from 'next/link';

export default function EmptyInline({
  title,
  desc,
  cta,
}: {
  title: string;
  desc: string;
  cta: { label: string; href: string };
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div>
        <p className="text-[14px] font-extrabold text-black">{title}</p>
        <p className="text-[12px] font-semibold text-gray-500">{desc}</p>
      </div>

      <Link
        href={cta.href}
        className="shrink-0 rounded-full border border-black bg-primary px-4 py-2 text-[12px] font-extrabold text-black active:translate-y-[1px]"
      >
        {cta.label}
      </Link>
    </div>
  );
}
