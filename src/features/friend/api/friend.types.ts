export interface FriendListItem {
  memberId: number;
  nickname: string;
  universityName?: string;
  collegeName?: string;
  entryYear?: number;
  age?: number;
  gender?: string;
  mbti?: string;
  bio?: string;
  faceShapeName?: string;
  personalityTypes: string[];
  becameFriendsAt?: string;
}

export interface FriendRequestItem {
  requestId: number;
  memberId: number;
  nickname: string;
  universityName?: string;
  collegeName?: string;
  entryYear?: number;
  faceShapeName?: string;
  requestedAt?: string;
  status?: string;
}

export interface FriendPageResult<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  numberOfElements: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

export interface FriendPageParams {
  page?: number;
  size?: number;
}
