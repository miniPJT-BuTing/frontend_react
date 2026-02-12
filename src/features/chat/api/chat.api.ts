import { http } from '@/shared/api/http';

export interface ChatRoomResponse {
  chatRoomId: number;
  title: string;
  memberCount: number;
  unreadCount: number;
  lastMessage: string;
  lastMessageTime: string; // ISO 8601
  teamId?: number; // 연관된 팀 ID (Optional)
}

// 채팅방 목록 조회
export const getChatRooms = async (): Promise<ChatRoomResponse[]> => {
  const response = await http.get<BaseResponse<ChatRoomResponse[]>>('/v1/chat');
  return response.data.result;
};

// 공통 응답 타입 (팀 API와 중복되므로 추후 shared/types로 이동 권장)
interface BaseResponse<T> {
  isSuccess: boolean;
  code: string;
  message: string;
  result: T;
}
