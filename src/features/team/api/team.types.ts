export interface TeamDetailResponse {
  teamId: number;
  title: string;
  description: string;
  teamSize: string;
  gender: string;
  preferredMood: string;
  preferredAgeMin: number;
  preferredAgeMax: number;
  preferredEntryYearMin: number;
  preferredEntryYearMax: number;
  currentMemberCount: number;
  targetMemberCount: number;
  leaderInfo: {
    memberId: number;
    nickname: string;
    age: number;
    bio: string;
    universityName: string;
    collegeName: string;
    image?: string;
  };
  createdAt: string;
  updatedAt: string;
  members?: Array<{
    id: number;
    nickname: string;
    mbti: string;
    university: string;
    department: string;
    studentId: number;
    age: number;
    image: string;
    role: 'LEADER' | 'MEMBER';
  }>;
}

export interface MatchingPostListParams {
  gender?: string;
  teamSize?: string;
  preferredMood?: string;
  page?: number;
  size?: number;
  sort?: string;
}

export interface MatchingPostItem {
  teamId: number;
  title: string;
  leaderMemberId?: number;
  myRole?: string;
  isMine?: boolean;
  teamSize?: string;
  preferredMood?: string;
  preferredAgeMin?: number;
  preferredAgeMax?: number;
  preferredEntryYearMin?: number;
  preferredEntryYearMax?: number;
  currentMemberCount: number;
  targetMemberCount: number;
  createdAt?: string;
  universityName?: string;
  status?: string;
}

export interface MatchRequestSummaryItem {
  matchRequestId: number;
  status?: string;
  requestedAtAgo?: string;
  opponentTeamTitle?: string;
  opponentTeamSize?: string;
  opponentPreferredMood?: string;
  opponentPreferredEntryYearMin?: number;
  opponentPreferredEntryYearMax?: number;
}

export interface MatchRequestDetailResponse {
  matchRequestId: number;
  status?: string;
  requestedAt?: string;
  requestedAtAgo?: string;
  chatRoomId?: number;
  opponentTeamId?: number;
  opponentTeamTitle?: string;
  opponentTeamSize?: string;
  opponentPreferredMood?: string;
  opponentPreferredEntryYearMin?: number;
  opponentPreferredEntryYearMax?: number;
  opponentPreferredAgeMin?: number;
  opponentPreferredAgeMax?: number;
}

export interface MatchRequestListParams {
  type: 'sent' | 'received';
  status?: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'EXPIRED';
}

export interface TeamInvitationSummaryItem {
  invitationId: number;
  status?: string;
  createdAt?: string;
  teamId?: number;
  teamTitle?: string;
  teamSize?: string;
  preferredMood?: string;
  preferredAgeMin?: number;
  preferredAgeMax?: number;
  preferredEntryYearMin?: number;
  preferredEntryYearMax?: number;
  currentMemberCount?: number;
  targetMemberCount?: number;
}

export interface MyTeamSummaryItem {
  teamId: number;
  role?: 'LEADER' | 'MEMBER' | string;
  title: string;
  teamSize?: string;
  preferredMood?: string;
  preferredAgeMin?: number;
  preferredAgeMax?: number;
  preferredEntryYearMin?: number;
  preferredEntryYearMax?: number;
  currentMemberCount?: number;
  targetMemberCount?: number;
  isOpen?: boolean;
  createdAt?: string;
}

export interface CreateTeamRequest {
  title: string;
  description: string;
  preferredMood: string;
  teamSize: string;
  preferredAgeMin: number;
  preferredAgeMax: number;
  preferredEntryYearMin: number;
  preferredEntryYearMax: number;
  inviteMemberIds: number[];
}

export interface CreateTeamResponse {
  teamId: number;
}

export interface TeamFriendSearchItem {
  memberId: number;
  nickname: string;
  universityName?: string;
  collegeName?: string;
}

export interface ActionApiResult {
  isSuccess: boolean;
  code: string | number;
  message: string;
}

export interface UpdateTeamRequest {
  title: string;
  description: string;
  preferredMood: string;
  preferredAgeMin: number;
  preferredAgeMax: number;
  preferredEntryYearMin: number;
  preferredEntryYearMax: number;
}
