export default function CountBadge({ count }: { count: number }) {
  return (
    <span className="inline-flex items-center rounded-full border border-black bg-[#FF9BC2] px-3 py-[2px] text-[12px] font-extrabold text-black">
      {count}
    </span>
  );
}
