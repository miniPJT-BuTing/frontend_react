'use client';

type MessageType = 'text' | 'image';

type Message = {
  id: string;
  senderId: string;
  senderName: string;
  avatarColor?: string;
  content: string;
  type: MessageType;
  timestamp: string; // e.g. "오후 2:30"
  isMe: boolean;
};

type Props = {
  message: Message;
};

export default function MessageBubble({ message }: Props) {
  const { senderName, avatarColor, content, timestamp, isMe } = message;

  if (isMe) {
    return (
      <div className="flex w-full justify-end gap-2">
        <div className="flex flex-col items-end gap-1 max-w-[70%]">
          <div className="rounded-2xl rounded-tr-none bg-[#FF9BC2] px-4 py-2.5 text-[15px] font-medium text-black shadow-sm">
            {content}
          </div>
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
        <div className="rounded-2xl rounded-tl-none bg-white border border-gray-100 px-4 py-2.5 text-[15px] font-medium text-black shadow-sm">
          {content}
        </div>
        <span className="ml-1 text-[11px] text-gray-400">{timestamp}</span>
      </div>
    </div>
  );
}