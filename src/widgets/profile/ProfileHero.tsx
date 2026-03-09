'use client';

import { useMemo } from 'react';
import { RotateCw } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getMyProfile } from '@/features/member/api/member.api';
import { PERSONALITY_KEY_TO_LABEL, type PersonalityKeywordKey } from '@/shared/lib/personalityKeyword';

const toKeywordLabel = (keyword: string): string => {
  const mapped = PERSONALITY_KEY_TO_LABEL[keyword as PersonalityKeywordKey];
  return mapped ?? keyword;
};

export default function ProfileHero() {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['member', 'me'],
    queryFn: getMyProfile,
  });

  const keywordLabels = useMemo(
    () => (data?.personalityTypes ?? []).map((keyword) => toKeywordLabel(keyword)).slice(0, 5),
    [data?.personalityTypes]
  );

  if (isLoading) {
    return (
      <section className="flex min-h-[180px] items-center justify-center text-center text-sm text-slate-500">
        프로필 정보를 불러오는 중...
      </section>
    );
  }

  if (isError || !data) {
    return (
      <section className="flex min-h-[180px] flex-col items-center justify-center gap-3 text-center">
        <p className="text-sm text-slate-500">프로필 정보를 불러오지 못했어요.</p>
        <button
          type="button"
          onClick={() => void refetch()}
          className="inline-flex items-center gap-2 rounded-full border border-black bg-white px-4 py-2 text-xs font-extrabold text-black active:translate-y-[1px]"
        >
          <RotateCw className="h-3.5 w-3.5" />
          다시 시도
        </button>
      </section>
    );
  }

  const school = data.universityName ?? '학교 정보 없음';
  const ageText = typeof data.age === 'number' ? `${data.age}세` : '나이 미입력';
  const mbtiText = data.mbtiCode ?? 'MBTI 미입력';
  const intro = data.bio ?? '자기소개가 아직 없어요.';
  const aiAnimal = data.faceShape ?? '미분석';

  return (
    <section className="rounded-[22px] border border-black bg-white p-5">
      <div className="flex flex-col items-center text-center">
        <div className="relative size-28 overflow-hidden rounded-full border border-black bg-[#EAF4FF]">
          <div className="absolute inset-0 flex items-center justify-center text-4xl">🙂</div>
        </div>

        <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-black bg-[#FF9BC2] px-3 py-[4px] text-[12px] font-extrabold text-black">
          <span>AI 분석 결과</span>
          <span className="font-black">{aiAnimal}</span>
        </div>

        <h1 className="mt-3 text-[18px] font-extrabold text-black leading-tight">
          {data.nickname}님의 프로필
        </h1>

        <p className="mt-1 text-[12px] font-semibold text-gray-500">
          {school} · {ageText} · {mbtiText}
        </p>

        {keywordLabels.length > 0 && (
          <div className="mt-3 flex flex-wrap justify-center gap-2">
            {keywordLabels.map((keyword) => (
              <span
                key={keyword}
                className="rounded-full border border-black bg-[#FFE1EE] px-3 py-[4px] text-[12px] font-extrabold text-black"
              >
                #{keyword}
              </span>
            ))}
          </div>
        )}

        <p className="mt-3 w-full rounded-[16px] border border-black bg-[#F7F7F7] px-4 py-3 text-[13px] font-semibold text-black">
          {intro}
        </p>
      </div>
    </section>
  );
}
