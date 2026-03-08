import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  acceptFriendRequestApi,
  getFriendRequestsApi,
  getFriendsApi,
  rejectFriendRequestApi,
  sendFriendRequestApi,
} from '@/features/friend/api/friend.api';
import { extractApiMessage } from '@/shared/lib/apiError';

export const useFriendsPage = () => {
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

  return {
    targetNickname,
    setTargetNickname,
    selectedMemberId,
    setSelectedMemberId,
    friendsPage,
    requests,
    sortedFriends,
    isFriendsLoading,
    isFriendsError,
    isRequestsLoading,
    isRequestsError,
    isMutating,
    isSendingRequest: sendRequestMutation.isPending,
    handleSendRequest,
    acceptRequest: (requestId: number) => acceptMutation.mutate(requestId),
    rejectRequest: (requestId: number) => rejectMutation.mutate(requestId),
  };
};

