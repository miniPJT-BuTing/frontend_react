import SectionTitle from '@/widgets/profile/ui/SectionTitle';

type Props = {
  targetNickname: string;
  isSendingRequest: boolean;
  onNicknameChange: (nickname: string) => void;
  onSendRequest: () => void;
};

export default function FriendAddSection({
  targetNickname,
  isSendingRequest,
  onNicknameChange,
  onSendRequest,
}: Props) {
  return (
    <section>
      <SectionTitle title="친구 추가" />
      <div className="rounded-[18px] border border-black bg-white p-4">
        <p className="text-[13px] font-semibold text-gray-500">닉네임으로 친구 요청을 보낼 수 있어요.</p>
        <div className="mt-3 flex gap-2">
          <input
            value={targetNickname}
            onChange={(event) => onNicknameChange(event.target.value)}
            placeholder="친구 닉네임 입력"
            className="h-11 flex-1 rounded-full border border-black px-4 text-[14px] outline-none"
            onKeyDown={(event) => {
              if (event.key === 'Enter') onSendRequest();
            }}
            disabled={isSendingRequest}
          />
          <button
            type="button"
            onClick={onSendRequest}
            disabled={isSendingRequest}
            className="rounded-full border border-black bg-[#FF9BC2] px-4 text-[13px] font-extrabold text-black disabled:opacity-60"
          >
            {isSendingRequest ? '요청중...' : '요청'}
          </button>
        </div>
      </div>
    </section>
  );
}

