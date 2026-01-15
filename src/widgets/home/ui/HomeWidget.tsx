'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Search, Heart, Star, MessageCircle } from 'lucide-react';
import MainHeader from '@/widgets/header/MainHeader';
import TeamCard, { TeamCardProps } from '@/widgets/team-card/TeamCard';

// Assets
import HomeBackground from '@/assets/images/home_background.png';

// Dummy Data
const TODAY_PICKS: TeamCardProps[] = [
  {
    id: 101,
    title: '오늘 밤 치맥 하실 분?',
    schoolName: '서울대',
    averageId: 21,
    averageAge: 22,
    memberCount: 3,
    gender: 'MALE',
  },
  {
    id: 102,
    title: '전시회 관람 동아리',
    schoolName: '홍익대',
    averageId: 20,
    averageAge: 24,
    memberCount: 2,
    gender: 'FEMALE',
  },
];

const MY_MATCHED_TEAM: TeamCardProps = {
  id: 999,
  title: '강남역 맛집 탐험대 🍝',
  schoolName: '연세대',
  averageId: 19,
  averageAge: 23,
  memberCount: 4,
  gender: 'FEMALE',
};

export default function HomeWidget() {
  const searchParams = useSearchParams();

  return (
    <div className="relative flex h-full flex-col overflow-y-auto scrollbar-hide pb-24">
      {/* Background Image */}
      <div className="fixed top-0 left-1/2 z-0 h-full w-full max-w-[480px] -translate-x-1/2">
        <Image src={HomeBackground} alt="Home Background" fill priority className="h-full w-full" />
      </div>

      {/* Main Header */}
      <MainHeader />

      {/* Search Bar */}
      <div className="relative z-10 px-5 mt-4 mb-6">
        <Link href={`/matching/filter?${searchParams.toString()}`} className="relative block drop-shadow-sm">
          <div className="w-full rounded-2xl bg-white/90 backdrop-blur-sm py-3.5 pl-11 pr-4 text-sm text-gray-400">
            어떤 팀을 찾고 계신가요?
          </div>
          <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
        </Link>
      </div>

      <div className="relative z-10 flex flex-col gap-10 px-5">
        {/* Section 1: MY MEETING */}
        <section>
          <div className="mb-4 flex items-center justify-center gap-2">
            <Heart className="fill-[#F7ABCF] text-[#4E5D94]" size={20} />
            <h2 className="text-xl text-[#4E5D94] font-dnf tracking-wide">MY MEETING</h2>
            <Heart className="fill-[#F7ABCF] text-[#4E5D94]" size={20} />
          </div>

          {/* Matched Team Card */}
          <TeamCard
            {...MY_MATCHED_TEAM}
            actionButton={
              <Link
                href={`/chats/${MY_MATCHED_TEAM.id}`}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#F7ABCF] py-4 text-[15px] font-bold text-white transition-colors hover:bg-[#F281B5]"
              >
                <MessageCircle size={20} />
                채팅하러 가기
              </Link>
            }
          />
        </section>

        {/* Section 2: TODAY PICK */}
        <section>
          <div className="mb-4 flex items-center justify-center gap-2 relative">
            <div className="flex items-center gap-2">
              <Star className="fill-[#FDEA8C] text-[#4E5D94]" size={24} />
              <h2 className="text-xl text-[#4E5D94] font-dnf tracking-wide">TODAY PICK</h2>
              <Star className="fill-[#FDEA8C] text-[#4E5D94]" size={24} />
            </div>
            <Link
              href="/matching"
              className="absolute right-0 text-xs font-bold text-gray-300 hover:text-gray-500"
            >
              ALL
            </Link>
          </div>

          <div className="flex flex-col gap-4">
            {TODAY_PICKS.map((team) => (
              <TeamCard key={team.id} {...team} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
