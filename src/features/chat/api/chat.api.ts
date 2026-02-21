import { apiInstance } from '@/shared/api/apiInstance';

export interface ChatRoomResponse {
  chatRoomId: number;
  title: string;
  memberCount: number;
  unreadCount: number;
  lastMessage: string;
  lastMessageTime: string; // ISO 8601
  teamId?: number; // 연관된 팀 ID (Optional)
}

export interface ChatMember {
  memberId: number;
  nickname: string;
  image?: string;
}

export interface ChatRoomDetailResponse {
  chatRoomId: number;
  title: string;
  memberCount: number;
  members: ChatMember[];
}

export interface ChatMessageResponse {
  seq: number;
  senderId: number;
  senderName: string;
  type: string;
  content: string;
  createdAt: string;
  voteId?: number;
}

const extractArrayFromUnknown = (raw: unknown): unknown[] => {
  if (Array.isArray(raw)) return raw;
  if (raw && typeof raw === 'object') {
    const obj = raw as Record<string, unknown>;
    const candidates = ['content', 'items', 'list', 'data', 'result'];
    for (const key of candidates) {
      if (Array.isArray(obj[key])) return obj[key] as unknown[];
    }
  }
  return [];
};

const toNumber = (value: unknown): number | undefined => {
  const n = Number(value);
  return Number.isFinite(n) ? n : undefined;
};

const toStringSafe = (value: unknown): string | undefined => {
  if (typeof value === 'string') return value;
  return undefined;
};

const normalizeChatRooms = (raw: unknown): ChatRoomResponse[] => {
  const list = extractArrayFromUnknown(raw);
  const normalized: ChatRoomResponse[] = [];

  for (const item of list) {
    if (!item || typeof item !== 'object') continue;
    const obj = item as Record<string, unknown>;
    const chatRoomId = toNumber(obj.chatRoomId ?? obj.roomId ?? obj.id);
    const title = toStringSafe(obj.title ?? obj.roomName ?? obj.teamName);

    if (!chatRoomId || !title) continue;

    const teamId = toNumber(obj.teamId);

    normalized.push({
      chatRoomId,
      title,
      memberCount: toNumber(obj.memberCount ?? obj.participantCount) ?? 0,
      unreadCount: toNumber(obj.unreadCount) ?? 0,
      lastMessage: toStringSafe(obj.lastMessage ?? obj.recentMessage ?? obj.message) ?? '',
      lastMessageTime:
        toStringSafe(obj.lastMessageTime ?? obj.updatedAt ?? obj.createdAt) ?? new Date().toISOString(),
      ...(teamId !== undefined ? { teamId } : {}),
    });
  }

  return normalized;
};

const normalizeChatMembers = (raw: unknown): ChatMember[] => {
  const list = extractArrayFromUnknown(raw);
  const normalized: ChatMember[] = [];

  for (const item of list) {
    if (!item || typeof item !== 'object') continue;
    const obj = item as Record<string, unknown>;
    const memberId = toNumber(obj.memberId ?? obj.id ?? obj.userId);
    const nickname = toStringSafe(obj.nickname ?? obj.name ?? obj.senderName);

    if (!memberId || !nickname) continue;

    const image = toStringSafe(obj.image ?? obj.profileImage);

    normalized.push({
      memberId,
      nickname,
      ...(image ? { image } : {}),
    });
  }

  return normalized;
};

const normalizeChatRoomDetail = (raw: unknown, roomId: string | number): ChatRoomDetailResponse => {
  const obj = raw && typeof raw === 'object' ? (raw as Record<string, unknown>) : {};
  const fallbackRoomId = toNumber(roomId) ?? 0;
  const chatRoomId = toNumber(obj.chatRoomId ?? obj.roomId ?? obj.id ?? roomId) ?? fallbackRoomId;
  const title = toStringSafe(obj.title ?? obj.roomName ?? obj.teamName) ?? `채팅방 ${roomId}`;
  const members = normalizeChatMembers(obj.members ?? obj.participants ?? obj.memberInfos ?? []);
  const memberCount = toNumber(obj.memberCount ?? obj.participantCount) ?? members.length;

  return {
    chatRoomId,
    title,
    memberCount,
    members,
  };
};

const normalizeChatMessages = (raw: unknown): ChatMessageResponse[] => {
  const list = extractArrayFromUnknown(raw);
  const normalized: ChatMessageResponse[] = [];

  for (const item of list) {
    if (!item || typeof item !== 'object') continue;
    const obj = item as Record<string, unknown>;
    const payload =
      obj.payload && typeof obj.payload === 'object' ? (obj.payload as Record<string, unknown>) : undefined;

    const seq = toNumber(obj.seq ?? obj.sequence ?? obj.messageId ?? obj.id);
    const senderId = toNumber(obj.senderId ?? obj.memberId ?? obj.userId);
    const senderName = toStringSafe(obj.senderName ?? obj.nickname ?? obj.senderNickname);
    const type = toStringSafe(obj.type ?? obj.messageType ?? obj.messageKind);

    const contentFromPayload = toStringSafe(payload?.content ?? payload?.text ?? payload?.message ?? payload?.title);
    const content = toStringSafe(obj.content ?? obj.message) ?? contentFromPayload ?? '';
    const createdAt = toStringSafe(obj.createdAt ?? obj.sentAt ?? obj.timestamp) ?? new Date().toISOString();

    if (!seq || !senderId || !senderName || !type) continue;

    const voteId = toNumber(obj.voteId ?? payload?.voteId);

    normalized.push({
      seq,
      senderId,
      senderName,
      type,
      content,
      createdAt,
      ...(voteId !== undefined ? { voteId } : {}),
    });
  }

  return normalized.sort((a, b) => a.seq - b.seq);
};

// 채팅방 목록 조회
export const getChatRooms = async (): Promise<ChatRoomResponse[]> => {
  const response = await apiInstance.get<BaseResponse<unknown>>('/v1/chat');
  return normalizeChatRooms(response.data.result);
};

// 채팅방 상세 조회
export const getChatRoomDetail = async (roomId: string | number): Promise<ChatRoomDetailResponse> => {
  const response = await apiInstance.get<BaseResponse<unknown>>(`/v1/chat/${roomId}`);
  return normalizeChatRoomDetail(response.data.result, roomId);
};

// 채팅 메시지 이력 조회
export const getChatMessages = async (
  roomId: string | number,
  beforeSeq?: number
): Promise<ChatMessageResponse[]> => {
  const response = await apiInstance.get<BaseResponse<unknown>>(`/v1/chat/${roomId}/messages`, {
    params: {
      beforeSeq,
    },
  });
  return normalizeChatMessages(response.data.result);
};

// 공통 응답 타입 (팀 API와 중복되므로 추후 shared/types로 이동 권장)
interface BaseResponse<T> {
  isSuccess: boolean;
  code: string;
  message: string;
  result: T;
}
