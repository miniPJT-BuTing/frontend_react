export interface ChatRoomResponse {
  chatRoomId: number;
  title: string;
  memberCount: number;
  unreadCount: number;
  lastMessage: string;
  lastMessageTime: string;
  teamId?: number;
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
