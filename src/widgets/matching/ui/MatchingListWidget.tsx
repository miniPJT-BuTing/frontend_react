'use client';

import { Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import MainHeader from '@/widgets/header/MainHeader';
import TeamCard, { TeamCardProps } from '@/widgets/team-card/TeamCard';

import HomeBackground from '@/assets/images/home_background.png';

// Dummy Data
const DUMMY_TEAMS: TeamCardProps[] = [
  {
    id: 1,
    title: '코딩 좋아하는 사람 모여라',
    schoolName: '서울과기대',
    averageId: 23,
    averageAge: 23,
    memberCount: 3,
    gender: 'MALE',
  },
  {
    id: 2,
    title: '맛집 탐방 동아리',
    schoolName: '이화여대',
    averageId: 21,
    averageAge: 21,
    memberCount: 4,
    gender: 'FEMALE',
  },
  {
    id: 3,
    title: '롤 5인큐 구함 (플레 이상)',
    schoolName: '고려대',
    averageId: 20,
    averageAge: 24,
    memberCount: 3,
    gender: 'MALE',
  },
  {
    id: 4,
    title: '여행 가고 싶다',
    schoolName: '연세대',
    averageId: 22,
    averageAge: 22,
    memberCount: 2,
    gender: 'FEMALE',
  },
];

export default function MatchingListWidget() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Parse Filters
  const keywords = searchParams.get('keywords')?.split(',').filter(Boolean) || [];
  const minAge = searchParams.get('minAge');
  const maxAge = searchParams.get('maxAge');
  const minId = searchParams.get('minId');
  const maxId = searchParams.get('maxId');

  const hasAgeFilter = minAge && maxAge;
  const hasIdFilter = minId && maxId;
  const hasFilters = keywords.length > 0 || hasAgeFilter || hasIdFilter;

  const removeKeyword = (keywordToRemove: string) => {
    const newKeywords = keywords.filter((k) => k !== keywordToRemove);
    const params = new URLSearchParams(searchParams.toString());
    if (newKeywords.length > 0) {
      params.set('keywords', newKeywords.join(','));
    } else {
      params.delete('keywords');
    }
    router.push(`/matching?${params.toString()}`);
  };

  const removeAgeFilter = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete('minAge');
    params.delete('maxAge');
    router.push(`/matching?${params.toString()}`);
  };

  const removeIdFilter = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete('minId');
    params.delete('maxId');
    router.push(`/matching?${params.toString()}`);
  };

  return (
    <div className="relative flex h-full flex-col">
      {/* Background Image */}
      <div className="fixed top-0 left-1/2 z-0 h-full w-full max-w-[480px] -translate-x-1/2 pointer-events-none">
        <Image src={HomeBackground} alt="Home Background" fill priority className="h-full w-full" />
      </div>

      {/* Main Header */}
      <MainHeader />

      {/* Search & Filter Section */}
      <div className="relative z-10 px-5 mt-4 mb-2">
        <Link href={`/matching/filter?${searchParams.toString()}`} className="relative block drop-shadow-sm">
          <div className="w-full rounded-2xl bg-white/90 backdrop-blur-sm py-3.5 pl-11 pr-4 text-sm text-gray-400">
            관심사, 제목 검색
          </div>
          <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          {hasFilters && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2">
               <SlidersHorizontal size={20} className="text-[#F7ABCF]" />
            </div>
          )}
        </Link>

        {/* Active Filters */}
        {hasFilters && (
          <div className="mt-4 flex flex-wrap gap-2 animate-in fade-in slide-in-from-top-1 duration-200">
            {keywords.map((keyword) => (
              <button
                key={keyword}
                onClick={() => removeKeyword(keyword)}
                className="flex items-center gap-1 rounded-full bg-white/80 backdrop-blur-sm px-3 py-1.5 text-xs font-bold text-[#F7ABCF] shadow-sm border border-white/50"
              >
                {keyword}
                <X size={12} />
              </button>
            ))}
            {hasAgeFilter && (
              <button
                onClick={removeAgeFilter}
                className="flex items-center gap-1 rounded-full bg-white/80 backdrop-blur-sm px-3 py-1.5 text-xs font-bold text-[#F7ABCF] shadow-sm border border-white/50"
              >
                {minAge}~{maxAge}세
                <X size={12} />
              </button>
            )}
            {hasIdFilter && (
              <button
                onClick={removeIdFilter}
                className="flex items-center gap-1 rounded-full bg-white/80 backdrop-blur-sm px-3 py-1.5 text-xs font-bold text-[#F7ABCF] shadow-sm border border-white/50"
              >
                {minId}~{maxId}학번
                <X size={12} />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="relative z-10 flex-1 overflow-y-auto p-5 pb-24 scrollbar-hide">
        <div className="flex flex-col gap-4">
          <div className="mb-2">
            <h2 className="text-sm font-semibold text-gray-600">
              추천 팀 <span className="text-[#F7ABCF]">{DUMMY_TEAMS.length}</span>
            </h2>
          </div>

          {DUMMY_TEAMS.map((team) => (
            <TeamCard key={team.id} {...team} />
          ))}
        </div>
      </div>
    </div>
  );
}
