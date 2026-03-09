import type { FriendRequestItem } from '@/features/friend/api/friend.types';
import SectionTitle from '@/widgets/profile/ui/SectionTitle';
import CountBadge from '@/widgets/profile/ui/CountBadge';

type Props = {
  requests: FriendRequestItem[];
  isLoading: boolean;
  isError: boolean;
  isMutating: boolean;
  onSelectMember: (memberId: number) => void;
  onAccept: (requestId: number) => void;
  onReject: (requestId: number) => void;
};

export default function FriendRequestsSection({
  requests,
  isLoading,
  isError,
  isMutating,
  onSelectMember,
  onAccept,
  onReject,
}: Props) {
  return (
    <section>
      <SectionTitle title="받은 요청" rightSlot={<CountBadge count={requests.length} />} />
      <div className="rounded-[18px] border border-black bg-white p-4">
        {isLoading && <p className="text-sm text-gray-500">친구 요청을 불러오는 중...</p>}
        {isError && <p className="text-sm text-red-500">친구 요청을 불러오지 못했어요.</p>}

        {!isLoading && !isError && requests.length === 0 && (
          <p className="text-sm text-gray-500">받은 친구 요청이 없습니다.</p>
        )}

        <div className="space-y-3">
          {requests.map((request) => (
            <div key={request.requestId} className="rounded-[14px] border border-black bg-[#FFF9FC] p-3">
              <div className="flex items-start justify-between gap-3">
                <button type="button" onClick={() => onSelectMember(request.memberId)} className="text-left">
                  <p className="text-[14px] font-extrabold text-black">{request.nickname}</p>
                  <p className="text-[12px] font-semibold text-gray-500">
                    {[request.universityName, request.collegeName].filter(Boolean).join(' ') || '학교 정보 없음'}
                  </p>
                </button>

                <div className="flex shrink-0 gap-2">
                  <button
                    type="button"
                    onClick={() => onAccept(request.requestId)}
                    disabled={isMutating}
                    className="rounded-full border border-black bg-[#D7F8FF] px-3 py-1 text-[12px] font-extrabold text-black disabled:opacity-60"
                  >
                    수락
                  </button>
                  <button
                    type="button"
                    onClick={() => onReject(request.requestId)}
                    disabled={isMutating}
                    className="rounded-full border border-black bg-[#FFE1EE] px-3 py-1 text-[12px] font-extrabold text-black disabled:opacity-60"
                  >
                    거절
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

