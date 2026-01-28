type Props = {
  status: 'matched' | 'waiting';
  title: string;
  meta: string[];
  members: number;
  primaryAction: { label: string; href: string };
};

export default function MeetingCard({ status, title, meta, members, primaryAction }: Props) {
  return (
    <div className="relative rounded-[22px] border border-black bg-white p-4">
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-[16px] font-extrabold text-black leading-tight">{title}</h3>

        <div className="shrink-0 inline-flex items-center rounded-full border border-black bg-[#FF9BC2] px-3 py-[2px] text-[12px] font-bold text-black">
          {status}
        </div>
      </div>

      <p className="mt-1 text-[12px] font-semibold text-gray-500">{meta.join(' | ')}</p>

      <div className="mt-3 flex gap-2">
        {Array.from({ length: members }).map((_, i) => (
          <div key={i} className="size-10 rounded-full bg-[#FFE1EE]" />
        ))}
      </div>

      <a
        href={primaryAction.href}
        className="mt-4 block w-full rounded-full bg-primary border border-black py-3 text-center text-[14px] font-extrabold text-black active:translate-y-[1px]"
      >
        {primaryAction.label}
      </a>
    </div>
  );
}
