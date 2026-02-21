'use client';

import { RetroButton } from '@/shared/ui/button/RetroButton';

type Props = {
  onRequest: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  isOwnTeam?: boolean;
};

export function TeamActionFooter({ onRequest, onEdit, onDelete, isOwnTeam = false }: Props) {
  return (
    <div className="fixed bottom-6 left-0 right-0 px-6 max-w-[480px] mx-auto z-10">
      <div className="mx-auto max-w-[440px] flex flex-col gap-3">
        {isOwnTeam ? (
          <>
            <RetroButton onClick={onEdit} variant="yellow" className="h-14 w-full text-lg">
              팀 정보 수정하기
            </RetroButton>
            <button type="button" onClick={onDelete} className="text-xs font-medium text-gray-400">
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
