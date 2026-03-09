'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import type { Route } from 'next';
import { RotateCw } from 'lucide-react';

import {
  getChatRooms,
  normalizeChatRoomListUpdate,
  type ChatRoomResponse,
} from '@/features/chat/api/chat.api';
import { createChatRealtimeClient } from '@/features/chat/realtime/chatRealtime.client';

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

  const fetchChatRooms = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const rooms = await getChatRooms();
      setChatRooms(rooms);
    } catch {
      setError('채팅 목록을 불러오지 못했어요.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchChatRooms();
  }, [fetchChatRooms]);

  useEffect(() => {
    const realtime = createChatRealtimeClient({
      subscribeRoomList: true,
      onRoomListUpdate: (payload) => {
        const normalized = normalizeChatRoomListUpdate(payload);
        if (!normalized) return;

        setChatRooms((prev) => {
          const next = new Map(prev.map((room) => [room.roomId, room]));
          next.set(normalized.roomId, normalized);
          return Array.from(next.values()).sort((a, b) => {
            const aTime = new Date(a.lastSentAt).getTime();
            const bTime = new Date(b.lastSentAt).getTime();
            return bTime - aTime;
          });
        });
      },
    });

    realtime.connect();
    return () => {
      realtime.disconnect();
    };
  }, []);

  const items = useMemo(
    () =>
      chatRooms.map((chat) => ({
        id: chat.roomId,
        title: chat.title,
        lastMessage: chat.lastPreview || '최근 메시지가 없습니다.',
        time: formatChatTime(chat.lastSentAt),
        unreadCount: chat.unreadCount,
      })),
    [chatRooms]
  );

  return (
    <div className="flex min-h-full flex-col gap-8 py-4">
      {loading && (
        <div className="rounded-[18px] border border-black bg-white p-4 text-center text-sm text-slate-500">
          채팅 목록을 불러오는 중...
        </div>
      )}

      {!loading && error && (
        <div className="flex flex-1 flex-col items-center justify-center gap-3 text-center">
          <p className="text-sm text-slate-500">{error}</p>
          <button
            type="button"
            onClick={fetchChatRooms}
            className="inline-flex items-center gap-2 rounded-full border border-black bg-white px-4 py-2 text-xs font-extrabold text-black active:translate-y-[1px]"
          >
            <RotateCw className="h-3.5 w-3.5" />
            다시 시도
          </button>
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
