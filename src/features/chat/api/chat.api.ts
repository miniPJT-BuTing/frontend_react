import { apiInstance } from '@/shared/api/apiInstance';
import type { ApiResponse } from '@/shared/api/api.types';
import type {
  ChatMember,
  ChatMessageResponse,
  ChatMessagesResponse,
  ChatNotice,
  ChatRoomDetailResponse,
  ChatRoomResponse,
  CreateVotePayload,
  VoteInfoResponse,
  VoteOptionResponse,
} from './chat.types';

export type {
  ChatMember,
  ChatMessageResponse,
  ChatMessagesResponse,
  ChatNotice,
  ChatRoomDetailResponse,
  ChatRoomResponse,
  CreateVotePayload,
  VoteInfoResponse,
  VoteOptionResponse,
} from './chat.types';

type UnknownRecord = Record<string, unknown>;

const extractArrayFromUnknown = (raw: unknown): unknown[] => {
  if (Array.isArray(raw)) return raw;
  if (raw && typeof raw === 'object') {
    const obj = raw as UnknownRecord;
    const candidates = ['content', 'items', 'list', 'data', 'result'];
    for (const key of candidates) {
      if (Array.isArray(obj[key])) return obj[key] as unknown[];
    }
  }
  return [];
};

const asRecord = (raw: unknown): UnknownRecord | null =>
  raw && typeof raw === 'object' ? (raw as UnknownRecord) : null;

const toNumber = (value: unknown): number | undefined => {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value !== 'string' || !value.trim()) return undefined;
  const n = Number(value);
  if (!Number.isFinite(n)) return undefined;
  return n;
};

const toStringSafe = (value: unknown): string | undefined => {
  if (typeof value === 'string') return value;
  if (typeof value === 'number' && Number.isFinite(value)) return String(value);
  return undefined;
};

const normalizeDateTime = (value: unknown): string => {
  const parsed = toStringSafe(value);
  if (parsed) return parsed;
  return new Date().toISOString();
};

const normalizeChatRooms = (raw: unknown): ChatRoomResponse[] => {
  const list = extractArrayFromUnknown(raw);
  const normalized: ChatRoomResponse[] = [];

  for (const item of list) {
    const obj = asRecord(item);
    if (!obj) continue;

    const roomId = toStringSafe(obj.roomId ?? obj.chatRoomId ?? obj.id);
    const title = toStringSafe(obj.title ?? obj.roomName ?? obj.teamName ?? obj.name);
    if (!roomId || !title) continue;

    const lastMessage = asRecord(obj.lastMessage);

    normalized.push({
      roomId,
      title,
      memberCount: toNumber(obj.memberCount ?? obj.participantCount) ?? 0,
      unreadCount: toNumber(obj.unreadCount) ?? 0,
      createdAt: normalizeDateTime(obj.createdAt),
      lastPreview: toStringSafe(lastMessage?.preview ?? obj.lastPreview ?? obj.lastMessage ?? obj.message) ?? '',
      lastSentAt: normalizeDateTime(lastMessage?.sentAt ?? obj.lastSentAt ?? obj.updatedAt ?? obj.createdAt),
      lastSeq: toNumber(lastMessage?.seq ?? obj.lastSeq ?? obj.lastMessageSeq) ?? null,
    });
  }

  return normalized;
};

const normalizeChatMembers = (raw: unknown): ChatMember[] => {
  const list = extractArrayFromUnknown(raw);
  const normalized: ChatMember[] = [];

  for (const item of list) {
    const obj = asRecord(item);
    if (!obj) continue;

    const memberId = toNumber(obj.memberId ?? obj.id ?? obj.userId);
    const nickname = toStringSafe(obj.nickname ?? obj.name);

    if (memberId === undefined || !nickname) continue;

    const profileImage = toStringSafe(obj.profileImage ?? obj.image);

    normalized.push({
      memberId,
      nickname,
      ...(profileImage ? { profileImage } : {}),
      ...(typeof obj.isLeader === 'boolean' ? { isLeader: obj.isLeader } : {}),
    });
  }

  return normalized;
};

const normalizeChatMessage = (raw: unknown): ChatMessageResponse | null => {
  const obj = asRecord(raw);
  if (!obj) return null;

  const messageSeq = toNumber(obj.messageSeq ?? obj.seq ?? obj.sequence);
  const senderId = toNumber(obj.senderId ?? obj.memberId ?? obj.userId);
  const roomId = toStringSafe(obj.roomId ?? obj.chatRoomId);

  if (messageSeq === undefined || senderId === undefined || !roomId) return null;

  const payload = asRecord(obj.payload) ?? undefined;
  const contentFromPayload =
    toStringSafe(payload?.text ?? payload?.title ?? payload?.content ?? payload?.message) ?? '';

  const messageId = toStringSafe(obj.messageId ?? obj.id) ?? String(messageSeq);

  return {
    messageId,
    roomId,
    messageSeq,
    type: toStringSafe(obj.type ?? obj.messageType) ?? 'TEXT',
    senderId,
    content: toStringSafe(obj.content ?? obj.message) ?? contentFromPayload,
    ...(payload ? { payload } : {}),
    createdAt: normalizeDateTime(obj.createdAt ?? obj.sentAt ?? obj.timestamp),
    messageStatus: toStringSafe(obj.messageStatus ?? obj.status) ?? 'NORMAL',
    unreadCount: toNumber(obj.unreadCount) ?? 0,
  };
};

const normalizeChatMessages = (raw: unknown): ChatMessageResponse[] => {
  const list = extractArrayFromUnknown(raw);
  const normalized: ChatMessageResponse[] = [];

  for (const item of list) {
    const normalizedMessage = normalizeChatMessage(item);
    if (!normalizedMessage) continue;
    normalized.push(normalizedMessage);
  }

  return normalized.sort((a, b) => a.messageSeq - b.messageSeq);
};

const normalizeChatMessagesPage = (raw: unknown, fallbackRoomId: string): ChatMessagesResponse => {
  const obj = asRecord(raw);

  if (!obj) {
    return {
      roomId: fallbackRoomId,
      messages: [],
      nextCursor: null,
      hasMore: false,
    };
  }

  return {
    roomId: toStringSafe(obj.roomId) ?? fallbackRoomId,
    messages: normalizeChatMessages(obj.messages ?? []),
    nextCursor: toNumber(obj.nextCursor) ?? null,
    hasMore: obj.hasMore === true,
  };
};

const normalizeChatRoomDetail = (raw: unknown, roomId: string): ChatRoomDetailResponse => {
  const obj = asRecord(raw) ?? {};
  const roomInfo = asRecord(obj.roomInfo) ?? {};
  const noticeInfoRaw = asRecord(obj.noticeInfo);

  return {
    roomInfo: {
      roomId: toStringSafe(roomInfo.roomId ?? roomInfo.chatRoomId ?? roomId) ?? roomId,
      title: toStringSafe(roomInfo.title) ?? `채팅방 ${roomId}`,
      memberCount: toNumber(roomInfo.memberCount) ?? 0,
      createdAt: normalizeDateTime(roomInfo.createdAt),
      lastMessageSeq: toNumber(roomInfo.lastMessageSeq) ?? null,
    },
    noticeInfo: noticeInfoRaw
      ? {
          place: toStringSafe(noticeInfoRaw.place) ?? '',
          meetAt: normalizeDateTime(noticeInfoRaw.meetAt),
          description: toStringSafe(noticeInfoRaw.description ?? noticeInfoRaw.text) ?? '',
        }
      : null,
    memberInfo: normalizeChatMembers(obj.memberInfo ?? obj.members ?? []),
    messages: normalizeChatMessagesPage(obj.messages, roomId),
  };
};

const normalizeNotice = (raw: unknown): ChatNotice => {
  const obj = asRecord(raw) ?? {};
  return {
    roomId: toStringSafe(obj.roomId) ?? '',
    place: toStringSafe(obj.place) ?? '',
    meetAt: normalizeDateTime(obj.meetAt),
    description: toStringSafe(obj.description ?? obj.text) ?? '',
    updatedAt: normalizeDateTime(obj.updatedAt),
    updatedBy: toStringSafe(obj.updatedBy) ?? '',
    updatedById: toNumber(obj.updatedById) ?? 0,
  };
};

const normalizeVoteOptions = (raw: unknown): VoteOptionResponse[] => {
  const list = extractArrayFromUnknown(raw);
  const options: VoteOptionResponse[] = [];
  for (const item of list) {
    const obj = asRecord(item);
    if (!obj) continue;
    const optionId = toStringSafe(obj.optionId ?? obj.id);
    const text = toStringSafe(obj.text ?? obj.label);
    const order = toNumber(obj.order);
    if (!optionId || !text || order === undefined) continue;

    const voters = extractArrayFromUnknown(obj.voters)
      .map((voter) => {
        const voterObj = asRecord(voter);
        if (!voterObj) return null;
        const memberId = toNumber(voterObj.memberId ?? voterObj.id);
        const nickname = toStringSafe(voterObj.nickname ?? voterObj.name);
        if (memberId === undefined || !nickname) return null;
        return { memberId, nickname };
      })
      .filter((voter): voter is { memberId: number; nickname: string } => voter !== null);

    options.push({
      optionId,
      text,
      order,
      count: toNumber(obj.count) ?? 0,
      ...(voters.length > 0 ? { voters } : {}),
    });
  }
  return options;
};

const normalizeVote = (raw: unknown): VoteInfoResponse => {
  const obj = asRecord(raw) ?? {};
  const mySelections = extractArrayFromUnknown(obj.mySelections)
    .map((value) => toNumber(value))
    .filter((value): value is number => value !== undefined);

  return {
    voteId: toStringSafe(obj.voteId ?? obj.id) ?? '',
    title: toStringSafe(obj.title) ?? '',
    description: toStringSafe(obj.description) ?? '',
    multiple: obj.multiple === true,
    anonymous: obj.anonymous === true,
    status: toStringSafe(obj.status) ?? 'OPEN',
    options: normalizeVoteOptions(obj.options),
    mySelections,
    nickname: toStringSafe(obj.nickname) ?? '',
    creator: toNumber(obj.creator) ?? 0,
  };
};

export const normalizeChatMessageFromSocket = (raw: unknown): ChatMessageResponse | null =>
  normalizeChatMessage(raw);

export const normalizeChatRoomListUpdate = (raw: unknown): ChatRoomResponse | null => {
  const normalized = normalizeChatRooms([raw]);
  return normalized.length > 0 ? normalized[0] : null;
};

export const getChatRooms = async (): Promise<ChatRoomResponse[]> => {
  const response = await apiInstance.get<ApiResponse<unknown>>('/v1/chat');
  return normalizeChatRooms(response.data.result);
};

export const getChatRoomDetail = async (roomId: string): Promise<ChatRoomDetailResponse> => {
  const response = await apiInstance.get<ApiResponse<unknown>>(`/v1/chat/${roomId}`);
  return normalizeChatRoomDetail(response.data.result, roomId);
};

export const getChatMessages = async (
  roomId: string,
  beforeSeq?: number
): Promise<ChatMessagesResponse> => {
  const response = await apiInstance.get<ApiResponse<unknown>>(`/v1/chat/${roomId}/messages`, {
    params: {
      beforeSeq,
    },
  });
  return normalizeChatMessagesPage(response.data.result, roomId);
};

export const getChatNotice = async (roomId: string): Promise<ChatNotice> => {
  const response = await apiInstance.get<ApiResponse<unknown>>(`/v1/chat/${roomId}/notice`);
  return normalizeNotice(response.data.result);
};

export const upsertChatNotice = async (
  roomId: string,
  payload: { place: string; meetAt: string; description: string }
): Promise<ChatNotice> => {
  const response = await apiInstance.put<ApiResponse<unknown>>(`/v1/chat/${roomId}/notice`, payload);
  return normalizeNotice(response.data.result);
};

export const createChatVote = async (roomId: string, payload: CreateVotePayload): Promise<VoteInfoResponse> => {
  const response = await apiInstance.post<ApiResponse<unknown>>(`/v1/chat/${roomId}/vote`, payload);
  return normalizeVote(response.data.result);
};

export const getChatVote = async (roomId: string, voteId: string): Promise<VoteInfoResponse> => {
  const response = await apiInstance.get<ApiResponse<unknown>>(`/v1/chat/${roomId}/vote/${voteId}`);
  return normalizeVote(response.data.result);
};

export const submitChatVote = async (
  roomId: string,
  voteId: string,
  options: number[]
): Promise<VoteInfoResponse> => {
  const response = await apiInstance.put<ApiResponse<unknown>>(`/v1/chat/${roomId}/vote/${voteId}`, {
    options,
  });
  return normalizeVote(response.data.result);
};

export const deleteChatVote = async (roomId: string, voteId: string): Promise<void> => {
  await apiInstance.delete<ApiResponse<null>>(`/v1/chat/${roomId}/vote/${voteId}`);
};

export const deleteChatNotice = async (roomId: string): Promise<void> => {
  await apiInstance.delete<ApiResponse<null>>(`/v1/chat/${roomId}/notice`);
};
