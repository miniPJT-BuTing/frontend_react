'use client';

import MessageBubble from './MessageBubble';

// 임시 타입 정의 (실제로는 API 타입 사용)
type Message = {
  id: string;
  senderId: string;
  senderName: string;
  avatarColor?: string;
  content: string;
  type: 'text' | 'image' | 'vote';
  timestamp: string;
  isMe: boolean;
  voteId?: string;
};

type Props = {
  messages: Message[];
};

export default function MessageList({ messages }: Props) {
  return (
    <div className="flex flex-col gap-4 p-4 pb-20">
      {/* 날짜 구분선 예시 */}
      <div className="flex justify-center py-2">
        <span className="rounded-full bg-gray-100 px-3 py-1 text-[11px] font-medium text-gray-500">
          2026년 2월 5일 목요일
        </span>
      </div>

      {messages.map((msg) => (
        <MessageBubble key={msg.id} message={msg} />
      ))}
    </div>
  );
}
