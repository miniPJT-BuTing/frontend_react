type Props = {
  title: string;
  meta: string[];
  members: number;
  status: 'idle' | 'waiting';
  onClickProfile: () => void;
  onClickRequest: () => void;
};

export default function TeamPickCard({
  title,
  meta,
  members,
  status,
  onClickProfile,
  onClickRequest,
}: Props) {
  const badgeLabel = status === 'waiting' ? 'waiting' : 'idle';

  return (
    <div className="relative rounded-[22px] border border-black bg-white p-4">
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-[16px] font-extrabold leading-tight text-black">{title}</h3>

        <div
          className={[
            'shrink-0 inline-flex items-center rounded-full border border-black px-3 py-[2px] text-[12px] font-bold text-black',
            status === 'waiting' ? 'bg-[#FF9BC2]' : 'bg-[#E5E7EB]',
          ].join(' ')}
        >
          {badgeLabel}
        </div>
      </div>

      <p className="mt-1 text-[12px] font-semibold text-gray-500">{meta.join(' | ')}</p>

      <div className="mt-3 flex gap-2">
        {Array.from({ length: members }).map((_, i) => (
          <div key={i} className="size-10 rounded-full bg-[#FFE1EE]" />
        ))}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={onClickProfile}
          className="w-full rounded-full border border-black bg-white py-3 text-[14px] font-extrabold text-black active:translate-y-[1px]"
        >
          팀 프로필 보기
        </button>

        {status === 'idle' ? (
          <button
            type="button"
            onClick={onClickRequest}
            className="w-full rounded-full border border-black bg-[#FF9BC2] py-3 text-[14px] font-extrabold text-black active:translate-y-[1px]"
          >
            매칭 요청하기
          </button>
        ) : (
          <button
            type="button"
            disabled
            className="w-full cursor-not-allowed rounded-full border border-black bg-[#E5E7EB] py-3 text-[14px] font-extrabold text-black opacity-70"
          >
            매칭 대기중
          </button>
        )}
      </div>
    </div>
  );
}
