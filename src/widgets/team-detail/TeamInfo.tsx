type Props = {
  title: string;
  description: string;
  tags: string[];
};

export function TeamInfo({ title, description, tags }: Props) {
  return (
    <section className="relative overflow-hidden rounded-[22px] border border-black bg-white p-6 shadow-[4px_4px_0_0_rgba(0,0,0,1)]">
      <div className="mb-4">
        <h2 className="text-[22px] font-black leading-snug text-black break-keep">{title}</h2>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full border border-black bg-[#FFE1EE] px-3 py-1.5 text-[13px] font-bold text-black"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="rounded-2xl bg-[#F9F9F9] p-4 text-[15px] font-medium leading-relaxed text-[#4B5563]">
        {description}
      </div>
    </section>
  );
}
