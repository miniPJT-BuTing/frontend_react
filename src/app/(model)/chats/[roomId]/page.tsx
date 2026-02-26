'use client';

import { use, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import ChatRoomHeader from '@/widgets/chat-room/ChatRoomHeader';
import MessageList from '@/widgets/chat-room/MessageList';
import ChatInputBar from '@/widgets/chat-room/ChatInputBar';
import ChatNotice from '@/widgets/chat-room/ChatNotice';
import ChatSidePanel, { type ChatDrawerVote } from '@/widgets/chat-room/ChatSidePanel';
import ChatPlusMenu from '@/widgets/chat-room/ChatPlusMenu';
import {
  getChatMessages,
  getChatNotice,
  getChatRoomDetail,
  normalizeChatMessageFromSocket,
  type ChatMember,
  type ChatMessageResponse,
} from '@/features/chat/api/chat.api';
import { createChatRealtimeClient, type ChatRealtimeClient } from '@/features/chat/realtime/chatRealtime.client';
import { getMyProfile } from '@/features/member/api/member.api';

type UiMessageType = 'text' | 'image' | 'vote';

type UiMessage = {
  id: string;
  seq: number;
  senderId: number;
  senderName: string;
  avatarColor?: string;
  content: string;
  type: UiMessageType;
  timestamp: string;
  createdAt: string;
  isMe: boolean;
  voteId?: string;
  voteStatus?: string;
  unreadCount: number;
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

const formatNoticeSummary = (place: string, meetAt: string, description: string) => {
  const date = new Date(meetAt);
  const meetAtText = Number.isNaN(date.getTime())
    ? meetAt
    : new Intl.DateTimeFormat('ko-KR', {
        month: 'numeric',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      }).format(date);

  return `${place} · ${meetAtText} · ${description}`;
};

const toUiType = (type: string): UiMessageType => {
  const normalized = type.toUpperCase();
  if (normalized.includes('VOTE')) return 'vote';
  if (normalized.includes('IMAGE')) return 'image';
  return 'text';
};

const extractVoteId = (message: ChatMessageResponse): string | undefined => {
  const payload = message.payload;
  if (!payload) return undefined;
  const voteId = payload.voteId;
  return typeof voteId === 'string' ? voteId : undefined;
};

const resolveVoteStatus = (message: ChatMessageResponse): string | undefined => {
  const payload = message.payload;
  if (!payload) return undefined;
  const status = payload.status;
  return typeof status === 'string' ? status : undefined;
};

const resolveMessageContent = (message: ChatMessageResponse): string => {
  if (message.content.trim()) return message.content;

  const payload = message.payload;
  if (!payload) return '';

  const preferred = payload.text ?? payload.title ?? payload.content ?? payload.message;
  if (typeof preferred === 'string') return preferred;
  return '';
};

const mergeMessages = (prev: UiMessage[], incoming: UiMessage[]) => {
  const deduped = new Map<number, UiMessage>();
  for (const item of prev) {
    deduped.set(item.seq, item);
  }
  for (const item of incoming) {
    deduped.set(item.seq, item);
  }
  return Array.from(deduped.values()).sort((a, b) => a.seq - b.seq);
};

const getLatestSeq = (messages: UiMessage[]): number | null => {
  if (messages.length === 0) return null;
  return messages[messages.length - 1].seq;
};

export default function ChatRoomPage({ params }: { params: Promise<{ roomId: string }> }) {
  const { roomId } = use(params);

  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [isPlusMenuOpen, setIsPlusMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [title, setTitle] = useState('채팅방');
  const [memberCount, setMemberCount] = useState(0);
  const [members, setMembers] = useState<ChatMember[]>([]);
  const [myMemberId, setMyMemberId] = useState<number | null>(null);
  const [messages, setMessages] = useState<UiMessage[]>([]);
  const [nextCursor, setNextCursor] = useState<number | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [noticeText, setNoticeText] = useState('');

  const scrollRef = useRef<HTMLDivElement | null>(null);
  const messagesRef = useRef<UiMessage[]>([]);
  const membersRef = useRef<ChatMember[]>([]);
  const myMemberIdRef = useRef<number | null>(null);
  const lastReadSeqRef = useRef(0);
  const readerProgressRef = useRef<Map<number, number>>(new Map());
  const realtimeRef = useRef<ChatRealtimeClient | null>(null);

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  useEffect(() => {
    membersRef.current = members;
  }, [members]);

  useEffect(() => {
    myMemberIdRef.current = myMemberId;
  }, [myMemberId]);

  const mapMessageToUi = useCallback((message: ChatMessageResponse): UiMessage => {
    const fallbackName = `멤버 ${message.senderId}`;
    const senderName =
      membersRef.current.find((member) => member.memberId === message.senderId)?.nickname ?? fallbackName;
    const isMe = myMemberIdRef.current !== null && myMemberIdRef.current === message.senderId;

    return {
      id: message.messageId,
      seq: message.messageSeq,
      senderId: message.senderId,
      senderName,
      avatarColor: '#FFE1EE',
      content: resolveMessageContent(message),
      type: toUiType(message.type),
      timestamp: formatTime(message.createdAt),
      createdAt: message.createdAt,
      isMe,
      voteId: extractVoteId(message),
      voteStatus: resolveVoteStatus(message),
      unreadCount: message.unreadCount,
    };
  }, []);

  const isAtBottom = useCallback(() => {
    const container = scrollRef.current;
    if (!container) return false;
    const gap = container.scrollHeight - (container.scrollTop + container.clientHeight);
    return gap <= 48;
  }, []);

  const scrollToBottom = useCallback(() => {
    const container = scrollRef.current;
    if (!container) return;
    container.scrollTop = container.scrollHeight;
  }, []);

  const sendReadIfNeeded = useCallback(
    (seq: number) => {
      const currentMemberId = myMemberIdRef.current;
      if (!currentMemberId) return;
      if (document.visibilityState !== 'visible') return;
      if (!isAtBottom()) return;
      if (seq <= lastReadSeqRef.current) return;

      realtimeRef.current?.sendReadEvent(roomId, currentMemberId, seq);
      lastReadSeqRef.current = seq;
    },
    [isAtBottom, roomId]
  );

  const loadOlderMessages = useCallback(async () => {
    if (!hasMore || loadingMore || nextCursor === null) return;

    const container = scrollRef.current;
    const prevHeight = container?.scrollHeight ?? 0;
    const prevTop = container?.scrollTop ?? 0;

    setLoadingMore(true);
    try {
      const page = await getChatMessages(roomId, nextCursor);
      const uiMessages = page.messages.map(mapMessageToUi);

      setMessages((prev) => mergeMessages(prev, uiMessages));
      setNextCursor(page.nextCursor);
      setHasMore(page.hasMore);

      requestAnimationFrame(() => {
        const target = scrollRef.current;
        if (!target) return;
        target.scrollTop = target.scrollHeight - prevHeight + prevTop;
      });
    } catch {
      setError('이전 메시지를 불러오지 못했어요.');
    } finally {
      setLoadingMore(false);
    }
  }, [hasMore, loadingMore, mapMessageToUi, nextCursor, roomId]);

  useEffect(() => {
    const fetchChatData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [profile, roomDetail] = await Promise.all([getMyProfile(), getChatRoomDetail(roomId)]);

        setMyMemberId(profile.memberId);
        setTitle(roomDetail.roomInfo.title);
        setMemberCount(roomDetail.roomInfo.memberCount);
        setMembers(roomDetail.memberInfo);
        myMemberIdRef.current = profile.memberId;
        membersRef.current = roomDetail.memberInfo;

        const initialMessages = roomDetail.messages.messages.map(mapMessageToUi);
        setMessages(initialMessages);
        messagesRef.current = initialMessages;
        readerProgressRef.current = new Map();
        setNextCursor(roomDetail.messages.nextCursor);
        setHasMore(roomDetail.messages.hasMore);

        const initialLatestSeq = getLatestSeq(initialMessages);
        lastReadSeqRef.current = initialLatestSeq ?? 0;

        if (roomDetail.noticeInfo) {
          setNoticeText(
            formatNoticeSummary(
              roomDetail.noticeInfo.place,
              roomDetail.noticeInfo.meetAt,
              roomDetail.noticeInfo.description
            )
          );
        } else {
          try {
            const notice = await getChatNotice(roomId);
            setNoticeText(formatNoticeSummary(notice.place, notice.meetAt, notice.description));
          } catch {
            setNoticeText('');
          }
        }

        requestAnimationFrame(() => {
          scrollToBottom();
          const latestSeq = getLatestSeq(messagesRef.current);
          if (latestSeq !== null) {
            sendReadIfNeeded(latestSeq);
          }
        });
      } catch {
        setError('채팅방 정보를 불러오지 못했어요.');
      } finally {
        setLoading(false);
      }
    };

    fetchChatData();
  }, [mapMessageToUi, roomId, scrollToBottom, sendReadIfNeeded]);

  useEffect(() => {
    if (!myMemberId) return;

    const realtime = createChatRealtimeClient({
      roomId,
      subscribeRoomList: true,
      onConnected: () => {
        const latestSeq = getLatestSeq(messagesRef.current);
        if (latestSeq !== null) {
          sendReadIfNeeded(latestSeq);
        }
      },
      onMessage: (payload) => {
        const normalized = normalizeChatMessageFromSocket(payload);
        if (!normalized) return;

        const uiMessage = mapMessageToUi(normalized);
        setMessages((prev) => mergeMessages(prev, [uiMessage]));

        const latestSeq = normalized.messageSeq;
        if (isAtBottom()) {
          requestAnimationFrame(scrollToBottom);
        }
        sendReadIfNeeded(latestSeq);
      },
      onReadEvent: (event) => {
        if (event.readerId === myMemberIdRef.current) {
          lastReadSeqRef.current = Math.max(lastReadSeqRef.current, event.lastReadSeq);
          return;
        }

        const prevProgress = readerProgressRef.current.get(event.readerId) ?? 0;
        if (event.lastReadSeq <= prevProgress) return;

        readerProgressRef.current.set(event.readerId, event.lastReadSeq);

        setMessages((prev) =>
          prev.map((message) => {
            if (message.seq <= prevProgress || message.seq > event.lastReadSeq) return message;
            if (message.unreadCount <= 0) return message;
            return {
              ...message,
              unreadCount: message.unreadCount - 1,
            };
          })
        );
      },
      onError: () => {
        setError((prev) => prev ?? '실시간 채팅 연결이 불안정합니다. 새로고침 후 다시 시도해 주세요.');
      },
    });

    realtimeRef.current = realtime;
    realtime.connect();

    return () => {
      realtime.disconnect();
      if (realtimeRef.current === realtime) {
        realtimeRef.current = null;
      }
    };
  }, [isAtBottom, mapMessageToUi, myMemberId, roomId, scrollToBottom, sendReadIfNeeded]);

  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState !== 'visible') return;
      const latestSeq = getLatestSeq(messagesRef.current);
      if (latestSeq !== null) {
        sendReadIfNeeded(latestSeq);
      }
    };

    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, [sendReadIfNeeded]);

  const handleSend = (text: string) => {
    if (!myMemberId) {
      setError('사용자 정보를 아직 불러오지 못했습니다. 잠시 후 다시 시도해주세요.');
      return;
    }
    realtimeRef.current?.sendTextMessage(roomId, myMemberId, text);
  };

  const handleScroll = () => {
    const container = scrollRef.current;
    if (!container) return;

    if (container.scrollTop <= 40) {
      loadOlderMessages();
    }

    const latestSeq = getLatestSeq(messagesRef.current);
    if (latestSeq !== null) {
      sendReadIfNeeded(latestSeq);
    }
  };

  const drawerMembers = useMemo(
    () =>
      members.map((member) => ({
        memberId: member.memberId,
        nickname: member.nickname,
        isLeader: member.isLeader,
        isMe: myMemberId === member.memberId,
      })),
    [members, myMemberId]
  );

  const drawerVotes = useMemo<ChatDrawerVote[]>(() => {
    const byVoteId = new Map<string, ChatDrawerVote>();
    for (const message of messages) {
      if (message.type !== 'vote' || !message.voteId) continue;
      byVoteId.set(message.voteId, {
        voteId: message.voteId,
        title: message.content || '투표',
        status: message.voteStatus ?? 'OPEN',
      });
    }
    return Array.from(byVoteId.values()).reverse();
  }, [messages]);

  const emptyMessage = useMemo(
    () =>
      !loading && !error && messages.length === 0 ? (
        <div className="p-6 text-center text-sm text-slate-500">아직 메시지가 없습니다.</div>
      ) : null,
    [loading, error, messages.length]
  );

  return (
    <div className="relative flex min-h-screen flex-col bg-[#F9F9F9]">
      <ChatRoomHeader title={title} count={memberCount} onMenuClick={() => setIsPanelOpen(true)} />

      {noticeText && <ChatNotice content={`📢 공지: ${noticeText}`} />}

      <div ref={scrollRef} onScroll={handleScroll} className="flex-1 overflow-y-auto">
        {loading && <div className="p-6 text-center text-sm text-slate-500">채팅 내역을 불러오는 중...</div>}
        {!loading && error && <div className="p-6 text-center text-sm text-red-500">{error}</div>}

        {!loading && !error && (
          <>
            {loadingMore && (
              <div className="pt-3 text-center text-xs font-medium text-gray-400">이전 메시지를 불러오는 중...</div>
            )}
            {messages.length > 0 && <MessageList messages={messages} />}
            {emptyMessage}
          </>
        )}
      </div>

      <ChatInputBar onSend={handleSend} onPlusClick={() => setIsPlusMenuOpen(true)} />

      <ChatSidePanel
        isOpen={isPanelOpen}
        onClose={() => setIsPanelOpen(false)}
        members={drawerMembers}
        votes={drawerVotes}
      />
      <ChatPlusMenu isOpen={isPlusMenuOpen} onClose={() => setIsPlusMenuOpen(false)} />
    </div>
  );
}
