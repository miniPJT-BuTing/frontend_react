'use client';

import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getMatchRequestDetail,
  getMatchRequests,
  getReceivedTeamInvitations,
  respondMatchRequest,
  respondTeamInvitation,
  type MatchRequestSummaryItem,
  type TeamInvitationSummaryItem,
} from '@/features/team/api/team.api';
import { extractApiMessage } from '@/shared/lib/apiError';
import {
  formatAgeRange,
  formatEntryYearRange,
  formatRequestStatusLabel,
  formatTeamMoodLabel,
  formatTeamSizeLabel,
} from '@/shared/lib/teamFormat';

const sortByLatestId = <T extends { matchRequestId?: number; invitationId?: number }>(a: T, b: T) => {
  const aId = a.matchRequestId ?? a.invitationId ?? 0;
  const bId = b.matchRequestId ?? b.invitationId ?? 0;
  return bId - aId;
};

const getMatchMeta = (request: MatchRequestSummaryItem): string[] =>
  [
    formatTeamSizeLabel(request.opponentTeamSize),
    formatTeamMoodLabel(request.opponentPreferredMood),
    formatEntryYearRange(request.opponentPreferredEntryYearMin, request.opponentPreferredEntryYearMax),
  ].filter((value): value is string => Boolean(value));

const getInvitationMeta = (invitation: TeamInvitationSummaryItem): string[] =>
  [
    formatTeamSizeLabel(invitation.teamSize),
    formatTeamMoodLabel(invitation.preferredMood),
    formatEntryYearRange(invitation.preferredEntryYearMin, invitation.preferredEntryYearMax),
    formatAgeRange(invitation.preferredAgeMin, invitation.preferredAgeMax),
  ].filter((value): value is string => Boolean(value));

export default function NotificationsPage() {
  const queryClient = useQueryClient();
  const [selectedMatchRequestId, setSelectedMatchRequestId] = useState<number | null>(null);

  const {
    data: receivedMatchRequestsData,
    isLoading: isMatchRequestsLoading,
    isError: isMatchRequestsError,
  } = useQuery({
    queryKey: ['match-requests', 'notifications', 'received'],
    queryFn: () => getMatchRequests({ type: 'received' }),
  });

  const {
    data: receivedInvitationsData,
    isLoading: isInvitationsLoading,
    isError: isInvitationsError,
  } = useQuery({
    queryKey: ['teams', 'invitations', 'received'],
    queryFn: getReceivedTeamInvitations,
  });

  const {
    data: selectedMatchDetail,
    isLoading: isSelectedDetailLoading,
    isError: isSelectedDetailError,
  } = useQuery({
    queryKey: ['match-requests', 'detail', selectedMatchRequestId],
    queryFn: () => getMatchRequestDetail(selectedMatchRequestId!),
    enabled: selectedMatchRequestId !== null,
  });

  const receivedMatchRequests = useMemo(
    () => [...(receivedMatchRequestsData ?? [])].sort(sortByLatestId),
    [receivedMatchRequestsData]
  );
  const receivedInvitations = useMemo(
    () => [...(receivedInvitationsData ?? [])].sort(sortByLatestId),
    [receivedInvitationsData]
  );

  const matchRespondMutation = useMutation({
    mutationFn: ({ id, accept }: { id: number; accept: boolean }) => respondMatchRequest(id, accept),
    onSuccess: async (response, variables) => {
      alert(
        response.message ||
          (response.isSuccess
            ? variables.accept
              ? '매칭 요청을 수락했습니다.'
              : '매칭 요청을 거절했습니다.'
            : '요청이 처리되지 않았습니다.')
      );
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['match-requests', 'notifications', 'received'] }),
        queryClient.invalidateQueries({ queryKey: ['match-requests', 'my-meeting'] }),
        queryClient.invalidateQueries({ queryKey: ['match-requests', 'detail', variables.id] }),
      ]);
    },
    onError: (error) => {
      alert(extractApiMessage(error, '매칭 요청 응답에 실패했습니다.'));
    },
  });

  const invitationRespondMutation = useMutation({
    mutationFn: ({ id, accept }: { id: number; accept: boolean }) => respondTeamInvitation(id, accept),
    onSuccess: async (response, variables) => {
      alert(
        response.message ||
          (response.isSuccess
            ? variables.accept
              ? '팀 초대를 수락했습니다.'
              : '팀 초대를 거절했습니다.'
            : '요청이 처리되지 않았습니다.')
      );
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['teams', 'invitations', 'received'] }),
        queryClient.invalidateQueries({ queryKey: ['teams', 'me'] }),
      ]);
    },
    onError: (error) => {
      alert(extractApiMessage(error, '팀 초대 응답에 실패했습니다.'));
    },
  });

  const activeMatchActionId = matchRespondMutation.isPending ? matchRespondMutation.variables?.id : null;
  const activeInvitationActionId = invitationRespondMutation.isPending
    ? invitationRespondMutation.variables?.id
    : null;

  return (
    <div className="space-y-5 py-4">
      <section className="rounded-[18px] border border-black bg-white p-4">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-sm font-extrabold text-black">받은 매칭 요청</h2>
          <span className="rounded-full border border-black bg-[#FEFED0] px-2 py-0.5 text-[11px] font-bold text-black">
            {receivedMatchRequests.length}건
          </span>
        </div>

        {isMatchRequestsLoading && <p className="mt-3 text-sm text-gray-500">매칭 요청을 불러오는 중...</p>}
        {isMatchRequestsError && <p className="mt-3 text-sm text-red-500">매칭 요청을 불러오지 못했어요.</p>}

        {!isMatchRequestsLoading && !isMatchRequestsError && receivedMatchRequests.length === 0 && (
          <p className="mt-3 text-sm text-gray-500">받은 매칭 요청이 없습니다.</p>
        )}

        <div className="mt-3 space-y-3">
          {receivedMatchRequests.map((request) => {
            const isPending = request.status?.toUpperCase() === 'PENDING';
            const isSelected = selectedMatchRequestId === request.matchRequestId;

            return (
              <div key={request.matchRequestId} className="rounded-[14px] border border-black bg-[#FFF9FC] p-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[14px] font-extrabold text-black">
                      {request.opponentTeamTitle || `매칭 요청 #${request.matchRequestId}`}
                    </p>
                    <p className="mt-1 text-[12px] font-semibold text-gray-500">
                      {getMatchMeta(request).join(' | ') || '상세 정보 없음'}
                    </p>
                    <p className="mt-1 text-[11px] font-bold text-gray-400">
                      상태: {formatRequestStatusLabel(request.status)} ·{' '}
                      {request.requestedAtAgo || '요청 시간 정보 없음'}
                    </p>
                  </div>

                  <div className="flex shrink-0 flex-col gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        setSelectedMatchRequestId((prev) =>
                          prev === request.matchRequestId ? null : request.matchRequestId
                        )
                      }
                      className="rounded-full border border-black bg-white px-3 py-1 text-[12px] font-extrabold text-black"
                    >
                      {isSelected ? '상세 닫기' : '상세 보기'}
                    </button>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          matchRespondMutation.mutate({
                            id: request.matchRequestId,
                            accept: true,
                          })
                        }
                        disabled={!isPending || activeMatchActionId === request.matchRequestId}
                        className="rounded-full border border-black bg-[#BDE0FE] px-3 py-1 text-[12px] font-extrabold text-black disabled:opacity-60"
                      >
                        수락
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          matchRespondMutation.mutate({
                            id: request.matchRequestId,
                            accept: false,
                          })
                        }
                        disabled={!isPending || activeMatchActionId === request.matchRequestId}
                        className="rounded-full border border-black bg-[#FFE1EE] px-3 py-1 text-[12px] font-extrabold text-black disabled:opacity-60"
                      >
                        거절
                      </button>
                    </div>
                  </div>
                </div>

                {isSelected && (
                  <div className="mt-3 rounded-[12px] border border-dashed border-black/30 bg-white/90 p-3">
                    {isSelectedDetailLoading && (
                      <p className="text-[12px] font-semibold text-gray-500">상세 정보를 불러오는 중...</p>
                    )}
                    {isSelectedDetailError && (
                      <p className="text-[12px] font-semibold text-red-500">상세 정보를 불러오지 못했어요.</p>
                    )}
                    {!isSelectedDetailLoading && !isSelectedDetailError && selectedMatchDetail && (
                      <div className="space-y-1 text-[12px] font-semibold text-gray-700">
                        <p>요청 ID: {selectedMatchDetail.matchRequestId}</p>
                        <p>상태: {formatRequestStatusLabel(selectedMatchDetail.status)}</p>
                        <p>상대 팀: {selectedMatchDetail.opponentTeamTitle || '-'}</p>
                        <p>
                          선호 조건:{' '}
                          {[
                            formatTeamSizeLabel(selectedMatchDetail.opponentTeamSize),
                            formatTeamMoodLabel(selectedMatchDetail.opponentPreferredMood),
                            formatEntryYearRange(
                              selectedMatchDetail.opponentPreferredEntryYearMin,
                              selectedMatchDetail.opponentPreferredEntryYearMax
                            ),
                            formatAgeRange(
                              selectedMatchDetail.opponentPreferredAgeMin,
                              selectedMatchDetail.opponentPreferredAgeMax
                            ),
                          ]
                            .filter((value): value is string => Boolean(value))
                            .join(' | ') || '-'}
                        </p>
                        {typeof selectedMatchDetail.chatRoomId === 'number' && (
                          <p>채팅방 ID: {selectedMatchDetail.chatRoomId}</p>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      <section className="rounded-[18px] border border-black bg-white p-4">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-sm font-extrabold text-black">받은 팀 초대</h2>
          <span className="rounded-full border border-black bg-[#FEFED0] px-2 py-0.5 text-[11px] font-bold text-black">
            {receivedInvitations.length}건
          </span>
        </div>

        {isInvitationsLoading && <p className="mt-3 text-sm text-gray-500">팀 초대를 불러오는 중...</p>}
        {isInvitationsError && <p className="mt-3 text-sm text-red-500">팀 초대를 불러오지 못했어요.</p>}

        {!isInvitationsLoading && !isInvitationsError && receivedInvitations.length === 0 && (
          <p className="mt-3 text-sm text-gray-500">받은 팀 초대가 없습니다.</p>
        )}

        <div className="mt-3 space-y-3">
          {receivedInvitations.map((invitation) => {
            const isPending = invitation.status?.toUpperCase() === 'PENDING';

            return (
              <div key={invitation.invitationId} className="rounded-[14px] border border-black bg-[#F5FBFF] p-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[14px] font-extrabold text-black">
                      {invitation.teamTitle || `팀 초대 #${invitation.invitationId}`}
                    </p>
                    <p className="mt-1 text-[12px] font-semibold text-gray-500">
                      {getInvitationMeta(invitation).join(' | ') || '상세 정보 없음'}
                    </p>
                    <p className="mt-1 text-[11px] font-bold text-gray-400">
                      상태: {formatRequestStatusLabel(invitation.status)}
                    </p>
                  </div>

                  <div className="flex shrink-0 gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        invitationRespondMutation.mutate({
                          id: invitation.invitationId,
                          accept: true,
                        })
                      }
                      disabled={!isPending || activeInvitationActionId === invitation.invitationId}
                      className="rounded-full border border-black bg-[#BDE0FE] px-3 py-1 text-[12px] font-extrabold text-black disabled:opacity-60"
                    >
                      수락
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        invitationRespondMutation.mutate({
                          id: invitation.invitationId,
                          accept: false,
                        })
                      }
                      disabled={!isPending || activeInvitationActionId === invitation.invitationId}
                      className="rounded-full border border-black bg-[#FFE1EE] px-3 py-1 text-[12px] font-extrabold text-black disabled:opacity-60"
                    >
                      거절
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
