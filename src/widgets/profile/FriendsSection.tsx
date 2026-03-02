'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';
import { getFriendsApi } from '@/features/friend/api/friend.api';
import { resolveProfileAnimalImage } from '@/shared/lib/profileAnimalImage';
import SectionTitle from './ui/SectionTitle';
import CountBadge from './ui/CountBadge';
import EmptyInline from './ui/EmptyInline';

export default function FriendsSection() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['friends', 'preview'],
    queryFn: () => getFriendsApi({ page: 0, size: 10 }),
  });

  const friends = data?.content ?? [];
  const count = data?.totalElements ?? friends.length;

  return (
    <section>
      <SectionTitle title="FRIENDS" rightSlot={<CountBadge count={count} />} />

      <div className="rounded-[22px] border border-black bg-white p-4">
        {isLoading && <p className="text-[13px] font-semibold text-gray-500">친구 목록을 불러오는 중...</p>}

        {isError && (
          <p className="text-[13px] font-semibold text-red-500">친구 목록을 불러오지 못했어요.</p>
        )}

        {friends.length > 0 ? (
          <>
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[14px] font-extrabold text-black">내 친구</p>
                <p className="text-[12px] font-semibold text-gray-500">
                  친구 목록을 확인하고, 초대 링크로 친구를 추가할 수 있어요.
                </p>
              </div>

              <div className="shrink-0 flex gap-2">
                <Link
                  href="/friends"
                  className="rounded-full border border-black bg-[#D7F8FF] px-3 py-2 text-[12px] font-extrabold text-black active:translate-y-[1px]"
                >
                  목록 보기
                </Link>
              </div>
            </div>

            <div className="mt-3 flex gap-2">
              {friends.slice(0, 3).map((f) => {
                const profileImage = resolveProfileAnimalImage(f.gender, f.faceShapeName);
                return (
                  <div
                    key={f.memberId}
                    className="flex items-center gap-2 rounded-full border border-black bg-[#FFE1EE] px-3 py-2"
                  >
                    <div className="relative size-8 overflow-hidden rounded-full border border-black bg-white flex items-center justify-center text-sm">
                      {profileImage ? (
                        <Image
                          src={profileImage}
                          alt={`${f.nickname} 프로필 이미지`}
                          fill
                          sizes="32px"
                          className="object-cover scale-[1.2]"
                        />
                      ) : (
                        '🙂'
                      )}
                    </div>
                    <div className="leading-tight">
                      <p className="text-[12px] font-extrabold text-black">{f.nickname}</p>
                      <p className="text-[10px] font-semibold text-gray-500">
                        {f.universityName ?? '학교 미입력'}
                      </p>
                    </div>
                  </div>
                );
              })}

              {friends.length > 3 && (
                <div className="flex items-center rounded-full border border-black bg-white px-3 py-2 text-[12px] font-extrabold text-black">
                  +{friends.length - 3}
                </div>
              )}
            </div>
          </>
        ) : (
          <EmptyInline
            title="아직 친구가 없어요"
            desc="친구를 추가하면 팀 구성/미팅 진행이 더 편해져요!"
            actionLabel="친구 추가하기"
            href="/friends"
          />
        )}
      </div>
    </section>
  );
}
