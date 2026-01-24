'use client';
import { Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import TeamPickCard from '@/widgets/home/ui/TeamPickCard';

// Dummy Data
const picks = [
  {
    id: 't1',
    title: '동아대 디자인과랑 4:4 미팅해요',
    meta: ['4:4', '동아대 등', '23학번', '22세'],
    members: 4,
    bookmarked: false,
    status: 'idle' as const,
  },
  {
    id: 't2',
    title: '동아대 디자인과랑 4:4 미팅해요',
    meta: ['4:4', '동아대 등', '23학번', '22세'],
    members: 4,
    bookmarked: true,
    status: 'waiting' as const,
  },
  {
    id: 't3',
    title: '코딩 좋아하는 사람 모여라',
    meta: ['4:4', '동아대 등', '23학번', '22세'],
    members: 4,
    bookmarked: true,
    status: 'idle' as const,
  },
  {
    id: 't4',
    title: '맛집 탐방 동아리',
    meta: ['4:4', '동아대 등', '23학번', '22세'],
    members: 4,
    bookmarked: true,
    status: 'idle' as const,
  },
  {
    id: 't5',
    title: '롤 5인큐 구함 (플레 이상)',
    meta: ['4:4', '동아대 등', '23학번', '22세'],
    members: 4,
    bookmarked: true,
    status: 'idle' as const,
  },
  {
    id: 't6',
    title: '여행 가고 싶다',
    meta: ['4:4', '동아대 등', '23학번', '22세'],
    members: 4,
    bookmarked: true,
    status: 'idle' as const,
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
      {/* Search & Filter Section */}
      <div className="relative z-10 mb-2">
        <Link
          href={`/matching/filter?${searchParams.toString()}`}
          className="relative flex items-center gap-2 rounded-full border-2 border-[#5863D6] bg-white px-4 py-3 shadow-[0_6px_0_rgba(88,99,214,0.15)]"
        >
          <Search size={20} className="opacity-70 text-gray-400" />
          <span className="w-full text-[14px] text-[#9AA3B2]">관심사, 제목 검색</span>
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
      <div className="relative z-10 flex-1 overflow-y-auto pb-24 scrollbar-hide">
        <div className="flex flex-col gap-4">
          <div className="mb-2">
            <h2 className="text-sm font-semibold text-gray-600">
              추천 팀 <span className="text-[#F7ABCF]">{picks.length}</span>
            </h2>
          </div>

          {picks.map((p) => (
            <TeamPickCard
              key={p.id}
              title={p.title}
              meta={p.meta}
              members={p.members}
              bookmarked={p.bookmarked}
              status={p.status}
              onClickProfile={() => console.log('팀 프로필 보기', p.id)}
              onClickRequest={() => console.log('매칭 요청', p.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
