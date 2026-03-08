'use client';

import { useFriendsPage } from '@/features/friend/model/useFriendsPage';
import MemberProfileModal from '@/widgets/profile/MemberProfileModal';
import FriendAddSection from '@/widgets/friends/FriendAddSection';
import FriendRequestsSection from '@/widgets/friends/FriendRequestsSection';
import FriendsListSection from '@/widgets/friends/FriendsListSection';

export default function FriendsPage() {
  const {
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
    isSendingRequest,
    handleSendRequest,
    acceptRequest,
    rejectRequest,
  } = useFriendsPage();

  return (
    <div className="space-y-7 py-4">
      <FriendAddSection
        targetNickname={targetNickname}
        isSendingRequest={isSendingRequest}
        onNicknameChange={setTargetNickname}
        onSendRequest={handleSendRequest}
      />

      <FriendRequestsSection
        requests={requests}
        isLoading={isRequestsLoading}
        isError={isRequestsError}
        isMutating={isMutating}
        onSelectMember={setSelectedMemberId}
        onAccept={acceptRequest}
        onReject={rejectRequest}
      />

      <FriendsListSection
        friends={sortedFriends}
        totalCount={friendsPage?.totalElements ?? sortedFriends.length}
        isLoading={isFriendsLoading}
        isError={isFriendsError}
        onSelectMember={setSelectedMemberId}
      />

      <MemberProfileModal
        memberId={selectedMemberId}
        isOpen={selectedMemberId !== null}
        onClose={() => setSelectedMemberId(null)}
      />
    </div>
  );
}
