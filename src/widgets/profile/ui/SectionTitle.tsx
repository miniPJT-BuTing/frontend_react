export default function SectionTitle({
  title,
  rightSlot,
}: {
  title: string;
  rightSlot?: React.ReactNode;
}) {
  return (
    <div className="mb-3 flex items-center justify-center gap-3">
      <h2
        className="
          font-['DNFBit']
          text-lg
          tracking-wide
          text-black
          drop-shadow-[0_2px_0_rgba(255,255,255,0.8)]
        "
      >
        {title}
      </h2>
      {rightSlot}
    </div>
  );
}
