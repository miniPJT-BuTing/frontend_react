import Image from 'next/image';
import type { FriendListItem } from '@/features/friend/api/friend.types';
import { resolveProfileAnimalImage } from '@/shared/lib/profileAnimalImage';
import SectionTitle from '@/widgets/profile/ui/SectionTitle';
import CountBadge from '@/widgets/profile/ui/CountBadge';

type Props = {
  friends: FriendListItem[];
  totalCount: number;
  isLoading: boolean;
  isError: boolean;
  onSelectMember: (memberId: number) => void;
};

export default function FriendsListSection({
  friends,
  totalCount,
  isLoading,
  isError,
  onSelectMember,
}: Props) {
  return (
    <section>
      <SectionTitle title="내 친구" rightSlot={<CountBadge count={totalCount} />} />
      <div className="rounded-[18px] border border-black bg-white p-4">
        {isLoading && <p className="text-sm text-gray-500">친구 목록을 불러오는 중...</p>}
        {isError && <p className="text-sm text-red-500">친구 목록을 불러오지 못했어요.</p>}

        {!isLoading && !isError && friends.length === 0 && <p className="text-sm text-gray-500">아직 친구가 없어요.</p>}

        <div className="space-y-3">
          {friends.map((friend) => {
            const profileImage = resolveProfileAnimalImage(friend.gender, friend.faceShapeName);
            return (
              <button
                key={friend.memberId}
                type="button"
                onClick={() => onSelectMember(friend.memberId)}
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
  );
}

