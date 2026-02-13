'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import type { Route } from 'next';

import { getChatRooms, type ChatRoomResponse } from '@/features/chat/api/chat.api';

const formatChatTime = (isoString: string) => {
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) return isoString;
  return new Intl.DateTimeFormat('ko-KR', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(date);
};

export default function ChatsPage() {
  const [chatRooms, setChatRooms] = useState<ChatRoomResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchChatRooms = async () => {
      try {
        setLoading(true);
        setError(null);
        const rooms = await getChatRooms();
        setChatRooms(rooms);
      } catch (e) {
        console.error('Failed to fetch chat rooms:', e);
        setError('채팅 목록을 불러오지 못했어요.');
      } finally {
        setLoading(false);
      }
    };

    fetchChatRooms();
  }, []);

  const items = useMemo(
    () =>
      chatRooms.map((chat) => ({
        id: chat.chatRoomId,
        title: chat.title,
        lastMessage: chat.lastMessage || '최근 메시지가 없습니다.',
        time: formatChatTime(chat.lastMessageTime),
        unreadCount: chat.unreadCount,
      })),
    [chatRooms]
  );

  return (
    <div className="space-y-8 py-4">
      {loading && (
        <div className="rounded-[18px] border border-black bg-white p-4 text-center text-sm text-slate-500">
          채팅 목록을 불러오는 중...
        </div>
      )}

      {!loading && error && (
        <div className="rounded-[18px] border border-black bg-white p-4 text-center text-sm text-red-500">
          {error}
        </div>
      )}

      {!loading && !error && items.length === 0 && (
        <div className="rounded-[18px] border border-black bg-white p-4 text-center text-sm text-slate-500">
          참여 중인 채팅방이 없습니다.
        </div>
      )}

      {!loading && !error && items.length > 0 && (
        <div className="flex flex-col gap-3">
          {items.map((chat) => (
            <Link
              key={chat.id}
              href={`/chats/${chat.id}` as Route}
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
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
