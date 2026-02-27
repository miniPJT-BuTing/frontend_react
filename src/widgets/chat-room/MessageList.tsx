'use client';

import MessageBubble from './MessageBubble';

// 임시 타입 정의 (실제로는 API 타입 사용)
type Message = {
  id: string;
  senderId: number;
  senderName: string;
  avatarColor?: string;
  content: string;
  type: 'text' | 'image' | 'vote';
  timestamp: string;
  isMe: boolean;
  voteId?: string;
  unreadCount: number;
};

type Props = {
  messages: Message[];
};

export default function MessageList({ messages }: Props) {
  return (
    <div className="flex flex-col gap-4 p-4 pb-20">
      {messages.map((msg) => (
        <MessageBubble key={msg.id} message={msg} />
      ))}
    </div>
  );
}
