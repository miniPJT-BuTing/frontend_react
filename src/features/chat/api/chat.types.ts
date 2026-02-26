export interface ChatRoomResponse {
  roomId: string;
  title: string;
  memberCount: number;
  unreadCount: number;
  createdAt: string;
  lastPreview: string;
  lastSentAt: string;
  lastSeq: number | null;
}

export interface ChatMember {
  memberId: number;
  nickname: string;
  profileImage?: string;
  isLeader?: boolean;
}

export interface ChatNotice {
  roomId: string;
  place: string;
  meetAt: string;
  description: string;
  updatedAt: string;
  updatedBy: string;
  updatedById: number;
}

export interface ChatNoticeSummary {
  place: string;
  meetAt: string;
  description: string;
}

export interface ChatMessageResponse {
  messageId: string;
  roomId: string;
  messageSeq: number;
  type: string;
  senderId: number;
  content: string;
  payload?: Record<string, unknown>;
  createdAt: string;
  messageStatus: string;
  unreadCount: number;
}

export interface ChatMessagesResponse {
  roomId: string;
  messages: ChatMessageResponse[];
  nextCursor: number | null;
  hasMore: boolean;
}

export interface ChatRoomSummary {
  roomId: string;
  title: string;
  memberCount: number;
  createdAt: string;
  lastMessageSeq: number | null;
}

export interface ChatRoomDetailResponse {
  roomInfo: ChatRoomSummary;
  noticeInfo: ChatNoticeSummary | null;
  memberInfo: ChatMember[];
  messages: ChatMessagesResponse;
}

export interface CreateVotePayload {
  title: string;
  description: string;
  options: Array<{ text: string; order: number }>;
  isMultiple: boolean;
  isAnonymous: boolean;
  deadLine: string;
}

export interface VoteInfoResponse {
  voteId: string;
  title: string;
  description: string;
  multiple: boolean;
  anonymous: boolean;
  status: string;
  options: VoteOptionResponse[];
  mySelections: number[];
  nickname: string;
  creator: number;
}

export interface VoteOptionResponse {
  optionId: string;
  text: string;
  order: number;
  count: number;
  voters?: Array<{
    memberId: number;
    nickname: string;
  }>;
}
