type Props = {
  title: string;
  meta: string[];
  members: number;
  bookmarked: boolean;
  status: 'idle' | 'waiting';
  onClickProfile: () => void;
  onClickRequest: () => void;
};

export default function TeamPickCard({
  title,
  meta,
  members,
  bookmarked,
  status,
  onClickProfile,
  onClickRequest,
}: Props) {
  return (
    <div className="relative rounded-[22px] border-2 border-[#5863D6] bg-white p-4 shadow-[0_10px_0_rgba(88,99,214,0.12)]">
      {/* bookmark ribbon */}
      <div
        className={[
          'absolute top-0 right-6 h-14 w-10 rounded-b-md',
          bookmarked ? 'bg-[#8FD0FF]' : 'bg-[#D6DAFF]',
          'shadow-[0_6px_0_rgba(0,0,0,0.08)]',
        ].join(' ')}
      >
        <div className="absolute bottom-0 left-0 right-0 mx-auto h-0 w-0 border-l-[20px] border-r-[20px] border-t-[14px] border-l-transparent border-r-transparent border-t-white" />
      </div>

      <h3 className="text-[16px] font-extrabold text-[#2F3A8F]">{title}</h3>

      <p className="mt-2 text-[12px] font-semibold text-[#6B7280]">{meta.join(' | ')}</p>

      <div className="mt-3 flex gap-2">
        {Array.from({ length: members }).map((_, i) => (
          <div key={i} className="size-10 rounded-full bg-[#FFE1EE]" />
        ))}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <button
          onClick={onClickProfile}
          className="rounded-full border-2 border-[#5863D6] bg-white py-3 text-[13px] font-extrabold text-[#2F3A8F] shadow-[0_6px_0_rgba(88,99,214,0.12)] active:translate-y-[1px]"
        >
          팀 프로필 보기
        </button>

        {status === 'idle' ? (
          <button
            onClick={onClickRequest}
            className="rounded-full bg-[#FF9BC2] py-3 text-[13px] font-extrabold text-white shadow-[0_6px_0_rgba(255,155,194,0.35)] active:translate-y-[1px]"
          >
            매칭 요청하기
          </button>
        ) : (
          <button
            disabled
            className="rounded-full bg-[#E5E7EB] py-3 text-[13px] font-extrabold text-[#6B7280]"
          >
            매칭 대기중
          </button>
        )}
      </div>
    </div>
  );
}
