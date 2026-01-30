'use client';

import { TeamDetailHeader } from '@/widgets/team-detail/TeamDetailHeader';
import { TeamTitleSection } from '@/widgets/team-detail/TeamTitleSection';
import { TeamMembersRow } from '@/widgets/team-detail/TeamMembersRow';
import { TeamSpecs } from '@/widgets/team-detail/TeamSpecs';
import { TeamIntroduction } from '@/widgets/team-detail/TeamIntroduction';
import { TeamActionFooter } from '@/widgets/team-detail/TeamActionFooter';

// Mock Data
const mockTeamData = {
  id: 't1',
  title: '동아대 디자인과랑 4:4 미팅해요! 🎨',
  createdAt: '01.29',
  specs: {
    memberCount: 4,
    university: '동아대 등',
    avgStudentId: 23,
    avgAge: 22.5,
    prefMood: '활발한, 술게임, 맛집탐방',
    prefStudentId: '20~24학번',
    prefAge: '20~25세',
  },
  introduction:
    '안녕하세요! 저희는 동아대학교 산업디자인과 재학 중인 4명입니다. \n 시험 끝나고 다 같이 신나게 놀고 싶어서 글 올려요! \n 술게임도 좋아하고 맛집 탐방도 좋아해요. 부담 없이 연락 주세요! 😊',
  members: [
    {
      id: 'm1',
      nickname: '디자인요정',
      isLeader: true,
      schoolName: '동아대',
      major: '산업디자인',
      avatarColor: '#FFE1EE',
    },
    {
      id: 'm2',
      nickname: '과제지옥',
      isLeader: false,
      schoolName: '동아대',
      major: '시각디자인',
      avatarColor: '#E1F5FF',
    },
    {
      id: 'm3',
      nickname: '포토샵장인',
      isLeader: false,
      schoolName: '동아대',
      major: '패션디자인',
      avatarColor: '#E1FFE4',
    },
    {
      id: 'm4',
      nickname: '마감임박',
      isLeader: false,
      schoolName: '동아대',
      major: '산업디자인',
      avatarColor: '#FFF8E1',
    },
  ],
};

export default function TeamPage({ params }: { params: { teamId: string } }) {
  const handleRequest = () => {
    alert('매칭 요청을 보냈습니다! (Mock)');
  };

  return (
    <main className="flex h-screen flex-col bg-white">
      <TeamDetailHeader />

      <div className="flex-1 overflow-y-auto pb-4 scrollbar-hide">
        <TeamTitleSection title={mockTeamData.title} createdAt={mockTeamData.createdAt} />
        <TeamMembersRow members={mockTeamData.members} />
        <div className="h-px w-full bg-gray-100 my-2" /> {/* Divider */}
        <TeamSpecs data={mockTeamData.specs} />
        <TeamIntroduction content={mockTeamData.introduction} />
      </div>

      <TeamActionFooter onClickRequest={handleRequest} />
    </main>
  );
}
