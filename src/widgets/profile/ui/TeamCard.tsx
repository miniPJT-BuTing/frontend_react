import Link from 'next/link';

export default function TeamCard({
  title,
  meta,
  members,
  primaryAction,
  secondaryAction,
}: {
  title: string;
  meta: string[];
  members: number;
  primaryAction: { label: string; href: string };
  secondaryAction?: { label: string; href: string };
}) {
  return (
    <div className="rounded-[22px] border border-black bg-white p-4">
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-[16px] font-extrabold text-black leading-tight">{title}</h3>
        <div className="shrink-0 inline-flex items-center rounded-full border border-black bg-[#D7F8FF] px-3 py-[2px] text-[12px] font-bold text-black">
          active
        </div>
      </div>

      <p className="mt-1 text-[12px] font-semibold text-gray-500">{meta.join(' | ')}</p>

      <div className="mt-3 flex gap-2">
        {Array.from({ length: members }).map((_, i) => (
          <div key={i} className="size-10 rounded-full border border-black bg-[#FFE1EE]" />
        ))}
      </div>

      <div className="mt-4 grid grid-cols-1 gap-2">
        <Link
          href={primaryAction.href}
          className="block w-full rounded-full bg-primary border border-black py-3 text-center text-[14px] font-extrabold text-black active:translate-y-[1px]"
        >
          {primaryAction.label}
        </Link>

        {secondaryAction && (
          <Link
            href={secondaryAction.href}
            className="block w-full rounded-full bg-white border border-black py-3 text-center text-[14px] font-extrabold text-black active:translate-y-[1px]"
          >
            {secondaryAction.label}
          </Link>
        )}
      </div>
    </div>
  );
}
