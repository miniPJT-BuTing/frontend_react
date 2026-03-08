import { apiInstance } from '@/shared/api/apiInstance';
import type { ApiResponse } from '@/shared/api/api.types';
import type {
  ActionApiResult,
  CreateTeamRequest,
  CreateTeamResponse,
  MatchRequestListParams,
  MatchRequestSummaryItem,
  MyTeamSummaryItem,
  MatchingPostItem,
  MatchingPostListParams,
  TeamInvitationSummaryItem,
  TeamDetailResponse,
  TeamFriendSearchItem,
  UpdateTeamRequest,
} from './team.types';

export type {
  ActionApiResult,
  CreateTeamRequest,
  CreateTeamResponse,
  MatchRequestListParams,
  MatchRequestSummaryItem,
  MyTeamSummaryItem,
  MatchingPostItem,
  MatchingPostListParams,
  TeamInvitationSummaryItem,
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

const toStringSafe = (value: unknown): string | undefined =>
  typeof value === 'string' ? value : undefined;

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
    const leaderMemberId = toNumber(obj.leaderMemberId ?? obj.leaderId ?? leaderInfo?.memberId);
    const myRole = toStringSafe(obj.myRole ?? obj.role);
    const isMine = typeof obj.isMine === 'boolean' ? obj.isMine : undefined;
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
    const createdAt = toStringSafe(obj.createdAt);
    const status = typeof obj.status === 'string' ? obj.status : undefined;

    normalized.push({
      teamId,
      title,
      currentMemberCount,
      targetMemberCount: targetMemberCount || currentMemberCount,
      ...(leaderMemberId !== undefined ? { leaderMemberId } : {}),
      ...(myRole ? { myRole } : {}),
      ...(isMine !== undefined ? { isMine } : {}),
      ...(teamSize ? { teamSize } : {}),
      ...(preferredMood ? { preferredMood } : {}),
      ...(preferredAgeMin !== undefined ? { preferredAgeMin } : {}),
      ...(preferredAgeMax !== undefined ? { preferredAgeMax } : {}),
      ...(preferredEntryYearMin !== undefined ? { preferredEntryYearMin } : {}),
      ...(preferredEntryYearMax !== undefined ? { preferredEntryYearMax } : {}),
      ...(createdAt ? { createdAt } : {}),
      ...(universityName ? { universityName } : {}),
      ...(status ? { status } : {}),
    });
  }

  return normalized;
};

const normalizeMatchRequestList = (raw: unknown): MatchRequestSummaryItem[] => {
  const root = raw && typeof raw === 'object' ? (raw as Record<string, unknown>) : null;
  const list = extractArrayFromUnknown(root?.requests ?? root);
  const normalized: MatchRequestSummaryItem[] = [];

  for (const item of list) {
    if (!item || typeof item !== 'object') continue;
    const obj = item as Record<string, unknown>;

    const matchRequestId = toNumber(obj.matchRequestId ?? obj.id);
    if (matchRequestId === undefined) continue;

    normalized.push({
      matchRequestId,
      ...(toStringSafe(obj.status) ? { status: String(obj.status) } : {}),
      ...(toStringSafe(obj.requestedAtAgo) ? { requestedAtAgo: String(obj.requestedAtAgo) } : {}),
      ...(toStringSafe(obj.opponentTeamTitle) ? { opponentTeamTitle: String(obj.opponentTeamTitle) } : {}),
      ...(toStringSafe(obj.opponentTeamSize) ? { opponentTeamSize: String(obj.opponentTeamSize) } : {}),
      ...(toStringSafe(obj.opponentPreferredMood)
        ? { opponentPreferredMood: String(obj.opponentPreferredMood) }
        : {}),
      ...(toNumber(obj.opponentPreferredEntryYearMin) !== undefined
        ? { opponentPreferredEntryYearMin: toNumber(obj.opponentPreferredEntryYearMin) }
        : {}),
      ...(toNumber(obj.opponentPreferredEntryYearMax) !== undefined
        ? { opponentPreferredEntryYearMax: toNumber(obj.opponentPreferredEntryYearMax) }
        : {}),
    });
  }

  return normalized;
};

const normalizeReceivedTeamInvitations = (raw: unknown): TeamInvitationSummaryItem[] => {
  const list = extractArrayFromUnknown(raw);
  const normalized: TeamInvitationSummaryItem[] = [];

  for (const item of list) {
    if (!item || typeof item !== 'object') continue;
    const obj = item as Record<string, unknown>;
    const teamInfo =
      obj.teamInfo && typeof obj.teamInfo === 'object'
        ? (obj.teamInfo as Record<string, unknown>)
        : ({} as Record<string, unknown>);

    const invitationId = toNumber(obj.invitationId ?? obj.id);
    if (invitationId === undefined) continue;

    normalized.push({
      invitationId,
      ...(toStringSafe(obj.status) ? { status: String(obj.status) } : {}),
      ...(toStringSafe(obj.createdAt) ? { createdAt: String(obj.createdAt) } : {}),
      ...(toNumber(teamInfo.teamId) !== undefined ? { teamId: toNumber(teamInfo.teamId) } : {}),
      ...(toStringSafe(teamInfo.title) ? { teamTitle: String(teamInfo.title) } : {}),
      ...(toStringSafe(teamInfo.teamSize) ? { teamSize: String(teamInfo.teamSize) } : {}),
      ...(toStringSafe(teamInfo.preferredMood) ? { preferredMood: String(teamInfo.preferredMood) } : {}),
      ...(toNumber(teamInfo.preferredAgeMin) !== undefined ? { preferredAgeMin: toNumber(teamInfo.preferredAgeMin) } : {}),
      ...(toNumber(teamInfo.preferredAgeMax) !== undefined ? { preferredAgeMax: toNumber(teamInfo.preferredAgeMax) } : {}),
      ...(toNumber(teamInfo.preferredEntryYearMin) !== undefined
        ? { preferredEntryYearMin: toNumber(teamInfo.preferredEntryYearMin) }
        : {}),
      ...(toNumber(teamInfo.preferredEntryYearMax) !== undefined
        ? { preferredEntryYearMax: toNumber(teamInfo.preferredEntryYearMax) }
        : {}),
      ...(toNumber(teamInfo.currentMemberCount) !== undefined
        ? { currentMemberCount: toNumber(teamInfo.currentMemberCount) }
        : {}),
      ...(toNumber(teamInfo.targetMemberCount) !== undefined
        ? { targetMemberCount: toNumber(teamInfo.targetMemberCount) }
        : {}),
    });
  }

  return normalized;
};

const normalizeMyTeams = (raw: unknown): MyTeamSummaryItem[] => {
  const list = extractArrayFromUnknown(raw);
  const normalized: MyTeamSummaryItem[] = [];

  for (const item of list) {
    if (!item || typeof item !== 'object') continue;
    const obj = item as Record<string, unknown>;

    const teamId = toNumber(obj.teamId ?? obj.id);
    const title = toStringSafe(obj.title)?.trim();
    if (teamId === undefined || !title) continue;

    const role = toStringSafe(obj.role)?.trim();
    const isOpen = typeof obj.isOpen === 'boolean' ? obj.isOpen : undefined;

    normalized.push({
      teamId,
      title,
      ...(role ? { role } : {}),
      ...(toStringSafe(obj.teamSize) ? { teamSize: String(obj.teamSize) } : {}),
      ...(toStringSafe(obj.preferredMood) ? { preferredMood: String(obj.preferredMood) } : {}),
      ...(toNumber(obj.preferredAgeMin) !== undefined ? { preferredAgeMin: toNumber(obj.preferredAgeMin) } : {}),
      ...(toNumber(obj.preferredAgeMax) !== undefined ? { preferredAgeMax: toNumber(obj.preferredAgeMax) } : {}),
      ...(toNumber(obj.preferredEntryYearMin) !== undefined
        ? { preferredEntryYearMin: toNumber(obj.preferredEntryYearMin) }
        : {}),
      ...(toNumber(obj.preferredEntryYearMax) !== undefined
        ? { preferredEntryYearMax: toNumber(obj.preferredEntryYearMax) }
        : {}),
      ...(toNumber(obj.currentMemberCount) !== undefined
        ? { currentMemberCount: toNumber(obj.currentMemberCount) }
        : {}),
      ...(toNumber(obj.targetMemberCount) !== undefined
        ? { targetMemberCount: toNumber(obj.targetMemberCount) }
        : {}),
      ...(isOpen !== undefined ? { isOpen } : {}),
      ...(toStringSafe(obj.createdAt) ? { createdAt: String(obj.createdAt) } : {}),
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

export const getMatchRequests = async (params: MatchRequestListParams): Promise<MatchRequestSummaryItem[]> => {
  const response = await apiInstance.get<ApiResponse<unknown>>('/v1/match-requests', {
    params,
  });
  return normalizeMatchRequestList(response.data.result);
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

export const getReceivedTeamInvitations = async (): Promise<TeamInvitationSummaryItem[]> => {
  const response = await apiInstance.get<ApiResponse<unknown>>('/v1/teams/invitations/received');
  return normalizeReceivedTeamInvitations(response.data.result);
};

export const getMyTeamsApi = async (): Promise<MyTeamSummaryItem[]> => {
  const response = await apiInstance.get<ApiResponse<unknown>>('/v1/teams/me');
  return normalizeMyTeams(response.data.result);
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
