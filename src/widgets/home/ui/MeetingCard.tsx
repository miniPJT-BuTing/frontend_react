type Props = {
  status: 'matched' | 'waiting';
  title: string;
  meta: string[];
  members: number;
  primaryAction: { label: string; href: string };
  ribbon?: { side: 'right' | 'left'; color: 'pink' | 'blue' };
};

export default function MeetingCard({
  status,
  title,
  meta,
  members,
  primaryAction,
  ribbon,
}: Props) {
  return (
    <div className="relative rounded-[22px] border-2 border-[#5863D6] bg-white p-4 shadow-[0_10px_0_rgba(88,99,214,0.12)]">
      {/* ribbon */}
      {ribbon && (
        <div
          className={[
            'absolute top-0 h-14 w-10 rounded-b-md',
            ribbon.side === 'right' ? 'right-6' : 'left-6',
            ribbon.color === 'pink' ? 'bg-[#FF9BC2]' : 'bg-[#8FD0FF]',
            'shadow-[0_6px_0_rgba(0,0,0,0.08)]',
          ].join(' ')}
        >
          <div className="absolute bottom-0 left-0 right-0 mx-auto h-0 w-0 border-l-[20px] border-r-[20px] border-t-[14px] border-l-transparent border-r-transparent border-t-white" />
        </div>
      )}

      {/* status chip */}
      <div className="inline-flex items-center rounded-full bg-[#FF9BC2] px-3 py-1 text-[12px] font-bold text-white">
        {status}
      </div>

      <h3 className="mt-3 text-[16px] font-extrabold text-[#2F3A8F]">{title}</h3>

      <p className="mt-2 text-[12px] font-semibold text-[#6B7280]">{meta.join(' | ')}</p>

      {/* members bubbles */}
      <div className="mt-3 flex gap-2">
        {Array.from({ length: members }).map((_, i) => (
          <div key={i} className="size-10 rounded-full bg-[#FFE1EE]" />
        ))}
      </div>

      <a
        href={primaryAction.href}
        className="mt-4 block w-full rounded-full bg-[#FF9BC2] py-3 text-center text-[14px] font-extrabold text-white shadow-[0_6px_0_rgba(255,155,194,0.35)] active:translate-y-[1px]"
      >
        {primaryAction.label}
      </a>
    </div>
  );
}
