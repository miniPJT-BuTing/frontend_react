'use client';

import Image from 'next/image';
import { useMemo, useState } from 'react';
import { AxiosError } from 'axios';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  acceptFriendRequestApi,
  getFriendRequestsApi,
  getFriendsApi,
  rejectFriendRequestApi,
  sendFriendRequestApi,
} from '@/features/friend/api/friend.api';
import { resolveProfileAnimalImage } from '@/shared/lib/profileAnimalImage';
import MemberProfileModal from '@/widgets/profile/MemberProfileModal';
import SectionTitle from '@/widgets/profile/ui/SectionTitle';
import CountBadge from '@/widgets/profile/ui/CountBadge';

function extractApiMessage(error: unknown, fallback: string) {
  if (error instanceof AxiosError) {
    const message = (error.response?.data as { message?: string } | undefined)?.message;
    return message || fallback;
  }
  if (error instanceof Error && error.message) {
    return error.message;
  }
  return fallback;
}

export default function FriendsPage() {
  const queryClient = useQueryClient();
  const [targetNickname, setTargetNickname] = useState('');
  const [selectedMemberId, setSelectedMemberId] = useState<number | null>(null);

  const {
    data: friendsPage,
    isLoading: isFriendsLoading,
    isError: isFriendsError,
  } = useQuery({
    queryKey: ['friends', 'list'],
    queryFn: () => getFriendsApi({ page: 0, size: 50 }),
  });

  const {
    data: requestsPage,
    isLoading: isRequestsLoading,
    isError: isRequestsError,
  } = useQuery({
    queryKey: ['friends', 'requests'],
    queryFn: () => getFriendRequestsApi({ page: 0, size: 50 }),
  });

  const sendRequestMutation = useMutation({
    mutationFn: (nickname: string) => sendFriendRequestApi(nickname),
    onSuccess: () => {
      setTargetNickname('');
      alert('친구 요청을 보냈습니다.');
    },
    onError: (error) => {
      alert(extractApiMessage(error, '친구 요청 전송에 실패했습니다.'));
    },
  });

  const acceptMutation = useMutation({
    mutationFn: (requestId: number) => acceptFriendRequestApi(requestId),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['friends', 'list'] }),
        queryClient.invalidateQueries({ queryKey: ['friends', 'preview'] }),
        queryClient.invalidateQueries({ queryKey: ['friends', 'requests'] }),
      ]);
    },
    onError: (error) => {
      alert(extractApiMessage(error, '친구 요청 수락에 실패했습니다.'));
    },
  });

  const rejectMutation = useMutation({
    mutationFn: (requestId: number) => rejectFriendRequestApi(requestId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['friends', 'requests'] });
    },
    onError: (error) => {
      alert(extractApiMessage(error, '친구 요청 거절에 실패했습니다.'));
    },
  });

  const friends = friendsPage?.content;
  const requests = requestsPage?.content ?? [];

  const isMutating = sendRequestMutation.isPending || acceptMutation.isPending || rejectMutation.isPending;

  const sortedFriends = useMemo(
    () =>
      [...(friends ?? [])].sort((a, b) => {
        const aTime = a.becameFriendsAt ? new Date(a.becameFriendsAt).getTime() : 0;
        const bTime = b.becameFriendsAt ? new Date(b.becameFriendsAt).getTime() : 0;
        return bTime - aTime;
      }),
    [friends]
  );

  const handleSendRequest = () => {
    const trimmed = targetNickname.trim();
    if (!trimmed) {
      alert('닉네임을 입력해주세요.');
      return;
    }
    sendRequestMutation.mutate(trimmed);
  };

  return (
    <div className="space-y-7 py-4">
      <section>
        <SectionTitle title="친구 추가" />
        <div className="rounded-[18px] border border-black bg-white p-4">
          <p className="text-[13px] font-semibold text-gray-500">
            닉네임으로 친구 요청을 보낼 수 있어요.
          </p>
          <div className="mt-3 flex gap-2">
            <input
              value={targetNickname}
              onChange={(event) => setTargetNickname(event.target.value)}
              placeholder="친구 닉네임 입력"
              className="h-11 flex-1 rounded-full border border-black px-4 text-[14px] outline-none"
              onKeyDown={(event) => {
                if (event.key === 'Enter') handleSendRequest();
              }}
              disabled={sendRequestMutation.isPending}
            />
            <button
              type="button"
              onClick={handleSendRequest}
              disabled={sendRequestMutation.isPending}
              className="rounded-full border border-black bg-[#FF9BC2] px-4 text-[13px] font-extrabold text-black disabled:opacity-60"
            >
              {sendRequestMutation.isPending ? '요청중...' : '요청'}
            </button>
          </div>
        </div>
      </section>

      <section>
        <SectionTitle title="받은 요청" rightSlot={<CountBadge count={requests.length} />} />
        <div className="rounded-[18px] border border-black bg-white p-4">
          {isRequestsLoading && <p className="text-sm text-gray-500">친구 요청을 불러오는 중...</p>}
          {isRequestsError && <p className="text-sm text-red-500">친구 요청을 불러오지 못했어요.</p>}

          {!isRequestsLoading && !isRequestsError && requests.length === 0 && (
            <p className="text-sm text-gray-500">받은 친구 요청이 없습니다.</p>
          )}

          <div className="space-y-3">
            {requests.map((request) => (
              <div
                key={request.requestId}
                className="rounded-[14px] border border-black bg-[#FFF9FC] p-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedMemberId(request.memberId)}
                    className="text-left"
                  >
                    <p className="text-[14px] font-extrabold text-black">{request.nickname}</p>
                    <p className="text-[12px] font-semibold text-gray-500">
                      {[request.universityName, request.collegeName].filter(Boolean).join(' ') || '학교 정보 없음'}
                    </p>
                  </button>

                  <div className="flex shrink-0 gap-2">
                    <button
                      type="button"
                      onClick={() => acceptMutation.mutate(request.requestId)}
                      disabled={isMutating}
                      className="rounded-full border border-black bg-[#D7F8FF] px-3 py-1 text-[12px] font-extrabold text-black disabled:opacity-60"
                    >
                      수락
                    </button>
                    <button
                      type="button"
                      onClick={() => rejectMutation.mutate(request.requestId)}
                      disabled={isMutating}
                      className="rounded-full border border-black bg-[#FFE1EE] px-3 py-1 text-[12px] font-extrabold text-black disabled:opacity-60"
                    >
                      거절
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section>
        <SectionTitle
          title="내 친구"
          rightSlot={<CountBadge count={friendsPage?.totalElements ?? sortedFriends.length} />}
        />
        <div className="rounded-[18px] border border-black bg-white p-4">
          {isFriendsLoading && <p className="text-sm text-gray-500">친구 목록을 불러오는 중...</p>}
          {isFriendsError && <p className="text-sm text-red-500">친구 목록을 불러오지 못했어요.</p>}

          {!isFriendsLoading && !isFriendsError && sortedFriends.length === 0 && (
            <p className="text-sm text-gray-500">아직 친구가 없어요.</p>
          )}

          <div className="space-y-3">
            {sortedFriends.map((friend) => {
              const profileImage = resolveProfileAnimalImage(friend.gender, friend.faceShapeName);
              return (
                <button
                  key={friend.memberId}
                  type="button"
                  onClick={() => setSelectedMemberId(friend.memberId)}
                  className="flex w-full items-center gap-3 rounded-[14px] border border-black bg-[#FFE1EE] px-3 py-2 text-left"
                >
                  <div className="relative size-12 overflow-hidden rounded-full border border-black bg-white">
                    {profileImage ? (
                      <Image
                        src={profileImage}
                        alt={`${friend.nickname} 프로필 이미지`}
                        fill
                        sizes="48px"
                        className="object-cover scale-[1.2]"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-xl">🙂</div>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[14px] font-extrabold text-black">{friend.nickname}</p>
                    <p className="truncate text-[12px] font-semibold text-gray-500">
                      {[friend.universityName, friend.collegeName].filter(Boolean).join(' ') || '학교 정보 없음'}
                    </p>
                  </div>

                  <div className="text-[11px] font-bold text-gray-500">{friend.mbti ?? '-'}</div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <MemberProfileModal
        memberId={selectedMemberId}
        isOpen={selectedMemberId !== null}
        onClose={() => setSelectedMemberId(null)}
      />
    </div>
  );
}
