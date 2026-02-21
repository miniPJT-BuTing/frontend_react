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
  teamSize?: string;
  preferredMood?: string;
  preferredAgeMin?: number;
  preferredAgeMax?: number;
  preferredEntryYearMin?: number;
  preferredEntryYearMax?: number;
  currentMemberCount: number;
  targetMemberCount: number;
  universityName?: string;
  status?: string;
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
