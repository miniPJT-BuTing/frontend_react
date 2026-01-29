'use client';

type Props = {
  onClickRequest: () => void;
  isOwnTeam?: boolean;
};

export function TeamActionFooter({ onClickRequest, isOwnTeam = false }: Props) {
  if (isOwnTeam) return null;

  return (
    <div className="w-full shrink-0 bg-white border-t border-gray-100 px-5 pb-8 pt-4">
      <div className="mx-auto max-w-[440px]">
        {' '}
        {/* Max width constrained for better look on larger screens within the layout */}
        <button
          type="button"
          onClick={onClickRequest}
          className="w-full rounded-full border border-black bg-[#FF9BC2] py-3 text-[14px] font-extrabold text-black active:translate-y-[1px]"
        >
          매칭 요청하기
        </button>
      </div>
    </div>
  );
}
