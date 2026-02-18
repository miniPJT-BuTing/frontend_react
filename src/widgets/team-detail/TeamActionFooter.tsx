'use client';

type Props = {
  onRequest: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  isOwnTeam?: boolean;
};

export function TeamActionFooter({ onRequest, onEdit, onDelete, isOwnTeam = false }: Props) {
  return (
    <div className="w-full shrink-0 bg-white border-t border-gray-100 px-5 pb-8 pt-4">
      <div className="mx-auto max-w-[440px] flex flex-col gap-3">
        {isOwnTeam ? (
          <>
            <button
              type="button"
              onClick={onEdit}
              className="w-full rounded-full border border-black bg-white py-4 text-[16px] font-bold text-black shadow-sm active:bg-gray-50 active:scale-[0.99] transition-transform"
            >
              팀 정보 수정하기
            </button>
            <button
              type="button"
              onClick={onDelete}
              className="text-[13px] font-medium text-gray-400 underline underline-offset-4 active:text-red-500"
            >
              팀 삭제하기
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={onRequest}
            className="w-full rounded-full bg-[#F7ABCF] py-4 text-[16px] font-bold text-white shadow-sm active:bg-[#F596C2] active:scale-[0.99] transition-transform"
          >
            매칭 요청하기
          </button>
        )}
      </div>
    </div>
  );
}
