'use client';

import { Vote } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

type MessageType = 'text' | 'image' | 'vote';

type Message = {
  id: string;
  senderId: string;
  senderName: string;
  avatarColor?: string;
  content: string; // For vote, this is the JSON string or Title
  type: MessageType;
  timestamp: string; // e.g. "오후 2:30"
  isMe: boolean;
  voteId?: string; // Optional for vote messages
};

type Props = {
  message: Message;
};

export default function MessageBubble({ message }: Props) {
  const { senderName, avatarColor, content, timestamp, isMe, type, voteId } = message;
  const params = useParams();
  const roomId = params.roomId as string;

  const renderContent = () => {
    if (type === 'vote') {
      return (
        <div className="w-[240px] rounded-xl bg-white border border-gray-200 overflow-hidden shadow-sm">
          <div className="bg-[#FFF0F5] px-4 py-3 flex items-center gap-2 border-b border-[#FFE1EE]">
            <Vote size={18} className="text-[#FF9BC2]" />
            <span className="text-[13px] font-bold text-gray-700">투표</span>
          </div>
          <div className="p-4">
            <h3 className="text-[15px] font-bold text-black mb-3 leading-snug">{content}</h3>
            <Link 
              href={`/chats/${roomId}/vote/${voteId || 'v1'}`}
              className="block w-full rounded-lg border border-gray-200 bg-white py-2 text-center text-[13px] font-bold text-gray-700 hover:bg-gray-50 active:bg-gray-100"
            >
              투표하러 가기
            </Link>
          </div>
        </div>
      );
    }

    // Default Text Message
    return (
      <div className={`rounded-2xl px-4 py-2.5 text-[15px] font-medium shadow-sm ${isMe ? 'rounded-tr-none bg-[#FF9BC2] text-black' : 'rounded-tl-none bg-white border border-gray-100 text-black'}`}>
        {content}
      </div>
    );
  };

  if (isMe) {
    return (
      <div className="flex w-full justify-end gap-2">
        <div className="flex flex-col items-end gap-1 max-w-[70%]">
          {renderContent()}
          <span className="text-[11px] text-gray-400">{timestamp}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-full justify-start gap-2">
      <div
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-gray-200 text-lg"
        style={{ backgroundColor: avatarColor || '#FFE1EE' }}
      >
        🐣
      </div>
      <div className="flex flex-col items-start gap-1 max-w-[70%]">
        <span className="ml-1 text-[12px] font-semibold text-gray-600">
          {senderName}
        </span>
        {renderContent()}
        <span className="ml-1 text-[11px] text-gray-400">{timestamp}</span>
      </div>
    </div>
  );
}