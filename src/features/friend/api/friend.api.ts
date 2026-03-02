import { apiInstance } from '@/shared/api/apiInstance';
import type { ApiResponse } from '@/shared/api/api.types';
import type {
  FriendListItem,
  FriendPageParams,
  FriendPageResult,
  FriendRequestItem,
} from './friend.types';

type UnknownRecord = Record<string, unknown>;

const asRecord = (value: unknown): UnknownRecord | null =>
  value && typeof value === 'object' ? (value as UnknownRecord) : null;

const toNumber = (value: unknown): number | undefined => {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value !== 'string' || !value.trim()) return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
};

const toStringSafe = (value: unknown): string | undefined => {
  if (typeof value === 'string') return value;
  return undefined;
};

const toStringArray = (value: unknown): string[] => {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => toStringSafe(item)?.trim())
    .filter((item): item is string => Boolean(item));
};

const toApiError = (message: string, code: number | string) => {
  const error = new Error(message) as Error & { code?: number | string };
  error.code = code;
  return error;
};

const requireSuccess = <T,>(response: ApiResponse<T | null>, fallbackMessage: string): T => {
  if (response.isSuccess && response.result !== null) return response.result;
  throw toApiError(response.message || fallbackMessage, response.code);
};

const requireSuccessWithoutResult = (
  response: ApiResponse<unknown>,
  fallbackMessage: string
): void => {
  if (!response.isSuccess) {
    throw toApiError(response.message || fallbackMessage, response.code);
  }
};

const emptyPage = <T,>(): FriendPageResult<T> => ({
  content: [],
  totalElements: 0,
  totalPages: 0,
  size: 0,
  number: 0,
  numberOfElements: 0,
  first: true,
  last: true,
  empty: true,
});

const normalizePageMeta = <T,>(raw: UnknownRecord, content: T[]): FriendPageResult<T> => {
  const totalElements = toNumber(raw.totalElements) ?? content.length;
  const size = toNumber(raw.size) ?? content.length;
  const number = toNumber(raw.number) ?? 0;
  const totalPages = toNumber(raw.totalPages) ?? (size > 0 ? Math.ceil(totalElements / size) : 0);
  const numberOfElements = toNumber(raw.numberOfElements) ?? content.length;
  const first = raw.first === true || number <= 0;
  const last = raw.last === true || (totalPages > 0 ? number >= totalPages - 1 : true);
  const empty = raw.empty === true || content.length === 0;

  return {
    content,
    totalElements,
    totalPages,
    size,
    number,
    numberOfElements,
    first,
    last,
    empty,
  };
};

const normalizeFriendListPage = (raw: unknown): FriendPageResult<FriendListItem> => {
  const pageObj = asRecord(raw);
  if (!pageObj) return emptyPage<FriendListItem>();

  const rawContent = Array.isArray(pageObj.content) ? pageObj.content : [];
  const content = rawContent
    .map((item): FriendListItem | null => {
      const itemObj = asRecord(item);
      if (!itemObj) return null;

      const friendInfo = asRecord(itemObj.friendInfo);
      if (!friendInfo) return null;

      const memberId = toNumber(friendInfo.memberId);
      const nickname = toStringSafe(friendInfo.nickname)?.trim();
      if (memberId === undefined || !nickname) return null;

      return {
        memberId,
        nickname,
        universityName: toStringSafe(friendInfo.universityName)?.trim(),
        collegeName: toStringSafe(friendInfo.collegeName)?.trim(),
        entryYear: toNumber(friendInfo.entryYear),
        age: toNumber(friendInfo.age),
        gender: toStringSafe(friendInfo.gender)?.trim(),
        mbti: toStringSafe(friendInfo.mbti)?.trim(),
        bio: toStringSafe(friendInfo.bio)?.trim(),
        faceShapeName: toStringSafe(friendInfo.faceShapeName)?.trim(),
        personalityTypes: toStringArray(friendInfo.personalityTypes),
        becameFriendsAt: toStringSafe(itemObj.becameFriendsAt)?.trim(),
      };
    })
    .filter((item): item is FriendListItem => item !== null);

  return normalizePageMeta(pageObj, content);
};

const normalizeFriendRequestPage = (raw: unknown): FriendPageResult<FriendRequestItem> => {
  const pageObj = asRecord(raw);
  if (!pageObj) return emptyPage<FriendRequestItem>();

  const rawContent = Array.isArray(pageObj.content) ? pageObj.content : [];
  const content = rawContent
    .map((item): FriendRequestItem | null => {
      const itemObj = asRecord(item);
      if (!itemObj) return null;

      const requester = asRecord(itemObj.requester);
      if (!requester) return null;

      const requestId = toNumber(itemObj.requestId);
      const memberId = toNumber(requester.memberId);
      const nickname = toStringSafe(requester.nickname)?.trim();
      if (requestId === undefined || memberId === undefined || !nickname) return null;

      return {
        requestId,
        memberId,
        nickname,
        universityName: toStringSafe(requester.universityName)?.trim(),
        collegeName: toStringSafe(requester.collegeName)?.trim(),
        entryYear: toNumber(requester.entryYear),
        faceShapeName: toStringSafe(requester.faceShapeName)?.trim(),
        requestedAt: toStringSafe(itemObj.requestedAt)?.trim(),
        status: toStringSafe(itemObj.status)?.trim(),
      };
    })
    .filter((item): item is FriendRequestItem => item !== null);

  return normalizePageMeta(pageObj, content);
};

export const getFriendsApi = async (
  params: FriendPageParams = {}
): Promise<FriendPageResult<FriendListItem>> => {
  const response = await apiInstance.get<ApiResponse<unknown>>('/v1/friends', {
    params,
  });
  const result = requireSuccess(response.data, '친구 목록 조회에 실패했습니다.');
  return normalizeFriendListPage(result);
};

export const getFriendRequestsApi = async (
  params: FriendPageParams = {}
): Promise<FriendPageResult<FriendRequestItem>> => {
  const response = await apiInstance.get<ApiResponse<unknown>>('/v1/friends/requests', {
    params,
  });
  const result = requireSuccess(response.data, '친구 요청 목록 조회에 실패했습니다.');
  return normalizeFriendRequestPage(result);
};

export const sendFriendRequestApi = async (targetNickname: string): Promise<void> => {
  const response = await apiInstance.post<ApiResponse<null>>('/v1/friends/requests', {
    targetNickname: targetNickname.trim(),
  });
  requireSuccessWithoutResult(response.data, '친구 요청 전송에 실패했습니다.');
};

export const acceptFriendRequestApi = async (requestId: number): Promise<void> => {
  const response = await apiInstance.post<ApiResponse<null>>(`/v1/friends/requests/${requestId}/accept`);
  requireSuccessWithoutResult(response.data, '친구 요청 수락에 실패했습니다.');
};

export const rejectFriendRequestApi = async (requestId: number): Promise<void> => {
  const response = await apiInstance.post<ApiResponse<null>>(`/v1/friends/requests/${requestId}/reject`);
  requireSuccessWithoutResult(response.data, '친구 요청 거절에 실패했습니다.');
};
