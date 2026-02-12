import { http } from '@/shared/api/http';

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
    image?: string; // Optional
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

// 팀 상세 조회
export const getTeamDetail = async (teamId: string | number): Promise<TeamDetailResponse> => {
  const response = await http.get<BaseResponse<TeamDetailResponse>>(
    `/v1/teams/matching-posts/${teamId}`
  );
  return response.data.result;
};

export interface CreateTeamRequest {
  title: string;
  description: string;
  preferredMood: string; // ENUM
  teamSize: string; // ENUM
  preferredAgeMin: number;
  preferredAgeMax: number;
  preferredEntryYearMin: number; // 학번 (e.g. 20)
  preferredEntryYearMax: number;
  inviteMemberIds: number[];
}

export interface CreateTeamResponse {
  teamId: number;
}

// 팀 생성
export const createTeam = async (data: CreateTeamRequest): Promise<CreateTeamResponse> => {
  const response = await http.post<BaseResponse<CreateTeamResponse>>('/v1/teams', data);
  return response.data.result;
};

// 매칭 요청
export const requestMatching = async (targetTeamId: number): Promise<void> => {
  await http.post('/v1/match-requests', { targetTeamId });
};

export interface UpdateTeamRequest {
  title: string;
  description: string;
  preferredMood: string;
  preferredAgeMin: number;
  preferredAgeMax: number;
  preferredEntryYearMin: number;
  preferredEntryYearMax: number;
}

// 팀 수정
export const updateTeam = async (
  teamId: string | number,
  data: UpdateTeamRequest
): Promise<void> => {
  await http.patch(`/v1/teams/matching-posts/${teamId}`, data);
};

// 팀 삭제
export const deleteTeam = async (teamId: string | number): Promise<void> => {
  await http.delete(`/v1/teams/matching-posts/${teamId}`);
};

// 공통 응답 타입
interface BaseResponse<T> {
  isSuccess: boolean;
  code: string;
  message: string;
  result: T;
}
