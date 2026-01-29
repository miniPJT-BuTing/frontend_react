type Props = {
  content: string;
};

export function TeamIntroduction({ content }: Props) {
  return (
    <section className="px-5 py-6">
      <div className="w-full rounded-[16px] bg-[#FDF2F8] p-5">
        <p className="text-[14px] font-medium leading-relaxed text-[#333333] whitespace-pre-wrap">
          {content}
        </p>
      </div>
    </section>
  );
}
