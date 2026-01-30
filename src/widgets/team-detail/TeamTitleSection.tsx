type Props = {
  title: string;
  createdAt: string; // e.g., "01.29"
};

export function TeamTitleSection({ title, createdAt }: Props) {
  return (
    <section className="px-5 pt-6 pb-4">
      <div className="flex flex-col items-start gap-2">
        <span className="text-[13px] font-medium text-gray-400">
          {createdAt}
        </span>
        <h2 className="text-[24px] font-black leading-tight text-black break-keep">
          {title}
        </h2>
      </div>
    </section>
  );
}
