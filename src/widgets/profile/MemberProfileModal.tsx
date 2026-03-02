'use client';

import { useEffect, useMemo } from 'react';
import Image from 'next/image';
import { AxiosError } from 'axios';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { X } from 'lucide-react';
import { getMemberProfileById } from '@/features/member/api/member.api';
import { sendFriendRequestApi } from '@/features/friend/api/friend.api';
import { PERSONALITY_KEY_TO_LABEL, type PersonalityKeywordKey } from '@/shared/lib/personalityKeyword';
import { resolveProfileAnimalImage } from '@/shared/lib/profileAnimalImage';

type Props = {
  memberId: number | null;
  isOpen: boolean;
  onClose: () => void;
};

const toKeywordLabel = (keyword: string): string => {
  const mapped = PERSONALITY_KEY_TO_LABEL[keyword as PersonalityKeywordKey];
  return mapped ?? keyword;
};

export default function MemberProfileModal({ memberId, isOpen, onClose }: Props) {
  const queryClient = useQueryClient();
  const { data, isLoading, isError } = useQuery({
    queryKey: ['member', 'profile', memberId],
    queryFn: async () => getMemberProfileById(memberId!),
    enabled: isOpen && !!memberId,
  });
  const sendFriendRequestMutation = useMutation({
    mutationFn: (nickname: string) => sendFriendRequestApi(nickname),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['friends', 'requests'] });
      alert('친구 요청을 보냈습니다.');
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        const message = (error.response?.data as { message?: string } | undefined)?.message;
        alert(message || '친구 요청에 실패했습니다.');
        return;
      }
      if (error instanceof Error && error.message) {
        alert(error.message);
        return;
      }
      alert('친구 요청에 실패했습니다.');
    },
  });

  useEffect(() => {
    if (!isOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen]);

  const keywordLabels = useMemo(
    () => (data?.personalityTypes ?? []).map((keyword) => toKeywordLabel(keyword)).slice(0, 3),
    [data?.personalityTypes]
  );
  const profileImage = useMemo(
    () => resolveProfileAnimalImage(data?.gender, data?.faceShape),
    [data?.gender, data?.faceShape]
  );

  if (!isOpen) return null;

  const genderText = data?.gender === 'M' ? '남자' : data?.gender === 'W' ? '여자' : '-';
  const genderSymbol = data?.gender === 'M' ? '♂' : data?.gender === 'W' ? '♀' : '';
  const studentId = typeof data?.entryYear === 'number' ? data.entryYear : '-';
  const age = typeof data?.age === 'number' ? data.age : '-';
  const mbti = data?.mbtiCode ?? '-';
  const intro = data?.bio ?? '아직 등록된 자기소개가 없어요.';
  const schoolLine = [data?.universityName, data?.collegeName].filter(Boolean).join(' ');

  return (
    <div className="fixed inset-0 z-[120]">
      <button type="button" aria-label="닫기" onClick={onClose} className="absolute inset-0 bg-black/45" />

      <div className="absolute inset-0 flex items-center justify-center px-6">
        <section className="relative w-full max-w-[360px] rounded-[28px] border border-black bg-white px-6 pb-6 pt-5 shadow-[0_12px_28px_rgba(0,0,0,0.2)]">
          <button
            type="button"
            onClick={onClose}
            aria-label="닫기"
            className="absolute right-4 top-4 rounded-full p-1 text-gray-500 hover:bg-gray-100"
          >
            <X size={20} />
          </button>

          {isLoading && <p className="py-20 text-center text-sm text-gray-500">프로필 불러오는 중...</p>}

          {isError && <p className="py-20 text-center text-sm text-red-500">프로필을 불러오지 못했어요.</p>}

          {!isLoading && !isError && data && (
            <div className="flex flex-col items-center text-center">
              <div className="relative mb-3 mt-3 flex h-[92px] w-[92px] items-center justify-center overflow-hidden rounded-full border border-gray-300 bg-[#F2F4F8] text-[36px]">
                {profileImage ? (
                  <Image
                    src={profileImage}
                    alt="프로필 이미지"
                    fill
                    sizes="92px"
                    className="object-cover scale-[1.22]"
                  />
                ) : (
                  '🐣'
                )}
              </div>

              <h3 className="text-[24px] font-extrabold leading-tight text-[#3F3F74]">
                {data.nickname}
                <span className="ml-1 text-[18px] align-middle text-[#8A8AB8]">{genderSymbol}</span>
              </h3>

              <p className="mt-1 text-[13px] font-semibold text-[#9A9AB3]">{schoolLine || '학교 정보 없음'}</p>

              {keywordLabels.length > 0 && (
                <div className="mt-3 flex flex-wrap justify-center gap-2">
                  {keywordLabels.map((keyword) => (
                    <span
                      key={keyword}
                      className="rounded-full bg-[#F7B7D8] px-3 py-1 text-[11px] font-bold text-white"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              )}

              <div className="mt-4 grid w-full grid-cols-4 gap-y-2 text-center">
                <div className="text-[12px] font-semibold text-[#6F6F9C]">학번</div>
                <div className="text-[14px] font-bold text-[#3F3F74]">{studentId}</div>
                <div className="text-[12px] font-semibold text-[#6F6F9C]">나이</div>
                <div className="text-[14px] font-bold text-[#3F3F74]">{age}</div>
                <div className="text-[12px] font-semibold text-[#6F6F9C]">성별</div>
                <div className="text-[14px] font-bold text-[#3F3F74]">{genderText}</div>
                <div className="text-[12px] font-semibold text-[#6F6F9C]">MBTI</div>
                <div className="text-[14px] font-bold text-[#3F3F74]">{mbti}</div>
              </div>

              <div className="mt-4 w-full rounded-[14px] bg-[#F8EEF7] px-4 py-3 text-left text-[13px] leading-relaxed text-[#5E5E7E]">
                {intro}
              </div>

              <button
                type="button"
                onClick={() => sendFriendRequestMutation.mutate(data.nickname)}
                disabled={sendFriendRequestMutation.isPending}
                className="mt-5 w-full rounded-full border border-black bg-[#F5A7CE] py-3 text-[15px] font-extrabold text-[#4A3E59]"
              >
                {sendFriendRequestMutation.isPending ? '요청 중...' : '친구 추가하기'}
              </button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
