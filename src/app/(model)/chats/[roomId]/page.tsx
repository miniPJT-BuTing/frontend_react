'use client';

import { use, useEffect, useMemo, useState } from 'react';
import ChatRoomHeader from '@/widgets/chat-room/ChatRoomHeader';
import MessageList from '@/widgets/chat-room/MessageList';
import ChatInputBar from '@/widgets/chat-room/ChatInputBar';
import ChatNotice from '@/widgets/chat-room/ChatNotice';
import ChatSidePanel from '@/widgets/chat-room/ChatSidePanel';
import ChatPlusMenu from '@/widgets/chat-room/ChatPlusMenu';

import { getChatRoomDetail, getChatMessages, type ChatMessageResponse } from '@/features/chat/api/chat.api';

const MY_USER_ID = 1;

type UiMessageType = 'text' | 'image' | 'vote';
type UiMessage = {
  id: string;
  senderId: string;
  senderName: string;
  avatarColor?: string;
  content: string;
  type: UiMessageType;
  timestamp: string;
  isMe: boolean;
  voteId?: string;
};

const toUiMessageType = (type: string): UiMessageType => {
  const upper = type.toUpperCase();
  if (upper.includes('VOTE')) return 'vote';
  if (upper.includes('IMAGE')) return 'image';
  return 'text';
};

const formatTime = (isoString: string) => {
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) return isoString;
  return new Intl.DateTimeFormat('ko-KR', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(date);
};

const mapApiMessagesToUi = (messages: ChatMessageResponse[]): UiMessage[] =>
  messages.map((message) => ({
    id: String(message.seq),
    senderId: String(message.senderId),
    senderName: message.senderName,
    avatarColor: '#FFE1EE',
    content: message.content,
    type: toUiMessageType(message.type),
    timestamp: formatTime(message.createdAt),
    isMe: message.senderId === MY_USER_ID,
    voteId: message.voteId ? String(message.voteId) : undefined,
  }));

export default function ChatRoomPage({ params }: { params: Promise<{ roomId: string }> }) {
  const { roomId } = use(params);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [isPlusMenuOpen, setIsPlusMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [title, setTitle] = useState('채팅방');
  const [memberCount, setMemberCount] = useState(0);
  const [messages, setMessages] = useState<UiMessage[]>([]);

  useEffect(() => {
    const fetchChatData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [roomDetail, chatMessages] = await Promise.all([
          getChatRoomDetail(roomId),
          getChatMessages(roomId),
        ]);

        setTitle(roomDetail.title);
        setMemberCount(roomDetail.memberCount);
        setMessages(mapApiMessagesToUi(chatMessages));
      } catch (e) {
        console.error('Failed to fetch chat room data:', e);
        setError('채팅방 정보를 불러오지 못했어요.');
      } finally {
        setLoading(false);
      }
    };

    fetchChatData();
  }, [roomId]);

  const emptyMessage = useMemo(
    () =>
      !loading && !error && messages.length === 0 ? (
        <div className="p-6 text-center text-sm text-slate-500">아직 메시지가 없습니다.</div>
      ) : null,
    [loading, error, messages.length]
  );

  const handleMenuClick = () => {
    setIsPanelOpen(true);
  };

  const handleSend = (text: string) => {
    console.log('Send:', text);
    // TODO: Socket emit / 메시지 전송 API 연결
  };

  const handlePlusClick = () => {
    setIsPlusMenuOpen(true);
  };

  return (
    <div className="relative flex min-h-screen flex-col bg-[#F9F9F9]">
      <ChatRoomHeader title={title} count={memberCount} onMenuClick={handleMenuClick} />

      <ChatNotice content="📢 공지: 매너 있는 채팅 부탁드립니다! 비속어 사용 시 제재될 수 있습니다." />

      <div className="flex-1 overflow-y-auto">
        {loading && (
          <div className="p-6 text-center text-sm text-slate-500">채팅 내역을 불러오는 중...</div>
        )}

        {!loading && error && <div className="p-6 text-center text-sm text-red-500">{error}</div>}

        {!loading && !error && messages.length > 0 && <MessageList messages={messages} />}
        {emptyMessage}
      </div>

      <ChatInputBar onSend={handleSend} onPlusClick={handlePlusClick} />

      <ChatSidePanel isOpen={isPanelOpen} onClose={() => setIsPanelOpen(false)} />
      <ChatPlusMenu isOpen={isPlusMenuOpen} onClose={() => setIsPlusMenuOpen(false)} />
    </div>
  );
}
