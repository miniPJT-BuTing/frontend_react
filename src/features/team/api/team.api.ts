import { apiInstance } from '@/shared/api/apiInstance';
import type { ApiResponse } from '@/shared/api/api.types';
import type {
  ActionApiResult,
  CreateTeamRequest,
  CreateTeamResponse,
  MatchingPostItem,
  MatchingPostListParams,
  TeamDetailResponse,
  TeamFriendSearchItem,
  UpdateTeamRequest,
} from './team.types';

export type {
  ActionApiResult,
  CreateTeamRequest,
  CreateTeamResponse,
  MatchingPostItem,
  MatchingPostListParams,
  TeamDetailResponse,
  TeamFriendSearchItem,
  UpdateTeamRequest,
} from './team.types';

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

const normalizeFriendSearchResult = (raw: unknown): TeamFriendSearchItem[] => {
  const toArray = (value: unknown): unknown[] => {
    if (Array.isArray(value)) return value;
    if (value && typeof value === 'object') {
      const obj = value as Record<string, unknown>;
      const candidates = ['content', 'items', 'list', 'friends', 'data'];
      for (const key of candidates) {
        if (Array.isArray(obj[key])) return obj[key] as unknown[];
      }
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

export const getTeamDetail = async (teamId: string | number): Promise<TeamDetailResponse> => {
  const response = await apiInstance.get<ApiResponse<TeamDetailResponse>>(
    `/v1/teams/matching-posts/${teamId}`
  );
  return response.data.result;
};

export const getMatchingPosts = async (
  params?: MatchingPostListParams
): Promise<MatchingPostItem[]> => {
  const response = await apiInstance.get<ApiResponse<unknown>>('/v1/teams/matching-posts', {
    params,
  });

  return normalizeMatchingPostList(response.data.result);
};

export const createTeam = async (data: CreateTeamRequest): Promise<CreateTeamResponse> => {
  const response = await apiInstance.post<ApiResponse<CreateTeamResponse>>('/v1/teams', data);
  return response.data.result;
};

export const requestMatching = async (targetTeamId: number): Promise<ActionApiResult> => {
  const response = await apiInstance.post<ApiResponse<null>>('/v1/match-requests', { targetTeamId });
  return {
    isSuccess: response.data.isSuccess,
    code: response.data.code,
    message: response.data.message,
  };
};

export const respondMatchRequest = async (
  matchRequestId: number,
  accept: boolean
): Promise<ActionApiResult> => {
  const response = await apiInstance.patch<ApiResponse<null>>(`/v1/match-requests/${matchRequestId}/respond`, {
    accept,
  });
  return {
    isSuccess: response.data.isSuccess,
    code: response.data.code,
    message: response.data.message,
  };
};

export const respondTeamInvitation = async (
  invitationId: number,
  accept: boolean
): Promise<ActionApiResult> => {
  const response = await apiInstance.patch<ApiResponse<null>>(`/v1/teams/invitations/${invitationId}/respond`, {
    accept,
  });
  return {
    isSuccess: response.data.isSuccess,
    code: response.data.code,
    message: response.data.message,
  };
};

export const searchFriendsForTeamInvite = async (
  keyword: string
): Promise<TeamFriendSearchItem[]> => {
  const response = await apiInstance.get<ApiResponse<unknown>>('/v1/teams/friends/search', {
    params: {
      keyword,
      nickname: keyword,
    },
  });

  return normalizeFriendSearchResult(response.data.result);
};

export const updateTeam = async (
  teamId: string | number,
  data: UpdateTeamRequest
): Promise<void> => {
  await apiInstance.patch(`/v1/teams/matching-posts/${teamId}`, data);
};

export const deleteTeam = async (teamId: string | number): Promise<void> => {
  await apiInstance.delete(`/v1/teams/matching-posts/${teamId}`);
};
