type ChatItem = {
  id: number;
  title: string;
  lastMessage: string;
  time: string;
  unreadCount: number;
};

const MOCK_CHATS: ChatItem[] = [
  {
    id: 1,
    title: '프론트엔드 스터디 팀',
    lastMessage: '내일 회의 7시에 가능해?',
    time: '오후 2:31',
    unreadCount: 2,
  },
  {
    id: 2,
    title: '디자인 협업팀',
    lastMessage: '피그마 수정본 올렸어요!',
    time: '오전 11:10',
    unreadCount: 0,
  },
  {
    id: 3,
    title: 'AI 프로젝트 팀',
    lastMessage: '모델 성능 다시 측정해볼게요',
    time: '어제',
    unreadCount: 5,
  },
];

export default function ChatsPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-3">
        {MOCK_CHATS.map((chat) => (
          <button
            key={chat.id}
            className="flex w-full items-center gap-3 rounded-[18px] border border-black bg-white p-3 text-left active:scale-[0.99]"
          >
            <div className="relative shrink-0">
              <div className="size-12 rounded-full bg-[#FFE1EE]" />
              {chat.unreadCount > 0 && (
                <div className="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full bg-[#FF5A5A] text-[11px] font-bold text-white">
                  {chat.unreadCount}
                </div>
              )}
            </div>

            <div className="flex min-w-0 flex-1 flex-col">
              <div className="flex items-center justify-between gap-2">
                <p className="truncate text-[14px] font-extrabold text-black">{chat.title}</p>
                <span className="shrink-0 text-[11px] text-gray-500">{chat.time}</span>
              </div>

              <p className="mt-1 truncate text-[12px] text-gray-600">{chat.lastMessage}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
