'use client';

import { use, useState } from 'react';
import ChatRoomHeader from '@/widgets/chat-room/ChatRoomHeader';
import MessageList from '@/widgets/chat-room/MessageList';
import ChatInputBar from '@/widgets/chat-room/ChatInputBar';
import ChatNotice from '@/widgets/chat-room/ChatNotice';
import ChatSidePanel from '@/widgets/chat-room/ChatSidePanel';
import ChatPlusMenu from '@/widgets/chat-room/ChatPlusMenu';

// Mock Data
const mockMessages = [
  {
    id: '1',
    senderId: 'm2',
    senderName: '디자인요정',
    avatarColor: '#E1F5FF',
    content: '안녕하세요! 다들 모이셨나요? 😊',
    type: 'text' as const,
    timestamp: '오후 2:30',
    isMe: false,
  },
  {
    id: '2',
    senderId: 'me',
    senderName: '나',
    content: '네 안녕하세요! 반갑습니다 ㅎㅎ',
    type: 'text' as const,
    timestamp: '오후 2:31',
    isMe: true,
  },
  {
    id: '3',
    senderId: 'm3',
    senderName: '과제지옥',
    avatarColor: '#FFE1EE',
    content: '반가워요! 저희 언제 만날까요?',
    type: 'text' as const,
    timestamp: '오후 2:32',
    isMe: false,
  },
  {
    id: '4',
    senderId: 'me',
    senderName: '나',
    content: '이번 주 금요일 저녁 어떠신가요?',
    type: 'text' as const,
    timestamp: '오후 2:33',
    isMe: true,
  },
];

export default function ChatRoomPage({ params }: { params: Promise<{ roomId: string }> }) {
  const { roomId } = use(params);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [isPlusMenuOpen, setIsPlusMenuOpen] = useState(false);

  const handleMenuClick = () => {
    setIsPanelOpen(true);
  };

  const handleSend = (text: string) => {
    console.log('Send:', text);
    // TODO: Socket emit
  };

  const handlePlusClick = () => {
    setIsPlusMenuOpen(true);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F9F9F9] relative">
      {/* Header */}
      <ChatRoomHeader 
        title="동아대 디자인과" 
        count={8} 
        onMenuClick={handleMenuClick} 
      />

      {/* Notice (Optional) */}
      <ChatNotice content="📢 공지: 매너 있는 채팅 부탁드립니다! 비속어 사용 시 제재될 수 있습니다." />

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto">
        <MessageList messages={mockMessages} />
      </div>

      {/* Input Area */}
      <ChatInputBar onSend={handleSend} onPlusClick={handlePlusClick} />

      {/* Side Panel (Drawer) */}
      <ChatSidePanel isOpen={isPanelOpen} onClose={() => setIsPanelOpen(false)} />

      {/* Plus Menu (Bottom Sheet) */}
      <ChatPlusMenu isOpen={isPlusMenuOpen} onClose={() => setIsPlusMenuOpen(false)} />
    </div>
  );
}
