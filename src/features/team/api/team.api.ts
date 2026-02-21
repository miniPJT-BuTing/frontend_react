import { apiInstance } from '@/shared/api/apiInstance';

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

const normalizeMatchingPostList = (raw: unknown): MatchingPostItem[] => {
  const list = extractArrayFromUnknown(raw);
  const normalized: MatchingPostItem[] = [];

  for (const item of list) {
    if (!item || typeof item !== 'object') continue;

    const obj = item as Record<string, unknown>;
    const leaderInfo =
      obj.leaderInfo && typeof obj.leaderInfo === 'object'
        ? (obj.leaderInfo as Record<string, unknown>)
        : undefined;

    const teamId = toNumber(obj.teamId ?? obj.id);
    const title = String(obj.title ?? obj.teamTitle ?? '');

    if (!teamId || !title.trim()) continue;

    const currentMemberCount = toNumber(obj.currentMemberCount ?? obj.memberCount ?? obj.currentCount) ?? 0;
    const targetMemberCount = toNumber(obj.targetMemberCount ?? obj.teamSizeCount ?? obj.targetCount) ?? 0;
    const teamSize = typeof obj.teamSize === 'string' ? obj.teamSize : undefined;
    const preferredMood = typeof obj.preferredMood === 'string' ? obj.preferredMood : undefined;
    const preferredAgeMin = toNumber(obj.preferredAgeMin);
    const preferredAgeMax = toNumber(obj.preferredAgeMax);
    const preferredEntryYearMin = toNumber(obj.preferredEntryYearMin);
    const preferredEntryYearMax = toNumber(obj.preferredEntryYearMax);
    const universityName =
      typeof obj.universityName === 'string'
        ? obj.universityName
        : typeof leaderInfo?.universityName === 'string'
          ? leaderInfo.universityName
          : undefined;
    const status = typeof obj.status === 'string' ? obj.status : undefined;

    normalized.push({
      teamId,
      title,
      currentMemberCount,
      targetMemberCount: targetMemberCount || currentMemberCount,
      ...(teamSize ? { teamSize } : {}),
      ...(preferredMood ? { preferredMood } : {}),
      ...(preferredAgeMin !== undefined ? { preferredAgeMin } : {}),
      ...(preferredAgeMax !== undefined ? { preferredAgeMax } : {}),
      ...(preferredEntryYearMin !== undefined ? { preferredEntryYearMin } : {}),
      ...(preferredEntryYearMax !== undefined ? { preferredEntryYearMax } : {}),
      ...(universityName ? { universityName } : {}),
      ...(status ? { status } : {}),
    });
  }

  return normalized;
};

// 팀 상세 조회
export const getTeamDetail = async (teamId: string | number): Promise<TeamDetailResponse> => {
  const response = await apiInstance.get<BaseResponse<TeamDetailResponse>>(
    `/v1/teams/matching-posts/${teamId}`
  );
  return response.data.result;
};

// 매칭 게시글 목록 조회
export const getMatchingPosts = async (
  params?: MatchingPostListParams
): Promise<MatchingPostItem[]> => {
  const response = await apiInstance.get<BaseResponse<unknown>>('/v1/teams/matching-posts', {
    params,
  });

  return normalizeMatchingPostList(response.data.result);
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

const normalizeFriendSearchResult = (raw: unknown): TeamFriendSearchItem[] => {
  const toArray = (value: unknown): unknown[] => {
    if (Array.isArray(value)) return value;
    if (value && typeof value === 'object') {
      const obj = value as Record<string, unknown>;
      const candidates = ['content', 'items', 'list', 'friends', 'data'];
      for (const key of candidates) {
        if (Array.isArray(obj[key])) return obj[key] as unknown[];
      }
      // 단일 객체로 내려오는 경우 대비
      if ('memberId' in obj || 'id' in obj) return [obj];
    }
    return [];
  };

  const source = toArray(raw);
  const normalized: TeamFriendSearchItem[] = [];

  for (const item of source) {
    if (!item || typeof item !== 'object') continue;
    const obj = item as Record<string, unknown>;

    const rawId = obj.memberId ?? obj.id;
    const memberId = Number(rawId);
    const nickname = String(obj.nickname ?? obj.name ?? '');

    if (!Number.isFinite(memberId) || !nickname.trim()) continue;

    const universityName = typeof obj.universityName === 'string' ? obj.universityName : undefined;
    const collegeName = typeof obj.collegeName === 'string' ? obj.collegeName : undefined;

    normalized.push({
      memberId,
      nickname,
      ...(universityName ? { universityName } : {}),
      ...(collegeName ? { collegeName } : {}),
    });
  }

  return normalized;
};

// 팀 생성
export const createTeam = async (data: CreateTeamRequest): Promise<CreateTeamResponse> => {
  const response = await apiInstance.post<BaseResponse<CreateTeamResponse>>('/v1/teams', data);
  return response.data.result;
};

// 매칭 요청
export const requestMatching = async (targetTeamId: number): Promise<ActionApiResult> => {
  const response = await apiInstance.post<BaseResponse<null>>('/v1/match-requests', { targetTeamId });
  return {
    isSuccess: response.data.isSuccess,
    code: response.data.code,
    message: response.data.message,
  };
};

// 매칭 요청 수락/거절
export const respondMatchRequest = async (
  matchRequestId: number,
  accept: boolean
): Promise<ActionApiResult> => {
  const response = await apiInstance.patch<BaseResponse<null>>(
    `/v1/match-requests/${matchRequestId}/respond`,
    {
      accept,
    }
  );
  return {
    isSuccess: response.data.isSuccess,
    code: response.data.code,
    message: response.data.message,
  };
};

// 팀 초대 수락/거절
export const respondTeamInvitation = async (
  invitationId: number,
  accept: boolean
): Promise<ActionApiResult> => {
  const response = await apiInstance.patch<BaseResponse<null>>(`/v1/teams/invitations/${invitationId}/respond`, {
    accept,
  });
  return {
    isSuccess: response.data.isSuccess,
    code: response.data.code,
    message: response.data.message,
  };
};

// 친구 검색 (팀 초대용)
export const searchFriendsForTeamInvite = async (
  keyword: string
): Promise<TeamFriendSearchItem[]> => {
  const response = await apiInstance.get<BaseResponse<unknown>>('/v1/teams/friends/search', {
    params: {
      // 백엔드 파라미터 명이 정해지지 않은 구간 대비
      keyword,
      nickname: keyword,
    },
  });

  return normalizeFriendSearchResult(response.data.result);
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
  await apiInstance.patch(`/v1/teams/matching-posts/${teamId}`, data);
};

// 팀 삭제
export const deleteTeam = async (teamId: string | number): Promise<void> => {
  await apiInstance.delete(`/v1/teams/matching-posts/${teamId}`);
};

// 공통 응답 타입
interface BaseResponse<T> {
  isSuccess: boolean;
  code: string;
  message: string;
  result: T;
}
