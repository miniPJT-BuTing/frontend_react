'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { use } from 'react';
import { useCreateTeamStore } from '@/features/team/create-team/model/createTeam.store';

// Mock API Call
const fetchTeamData = async (teamId: string) => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  return {
    title: '동아대 디자인과랑 4:4 미팅해요! 🎨',
    introduction:
      '안녕하세요! 저희는 동아대학교 산업디자인과 재학 중인 4명입니다. \n 시험 끝나고 다 같이 신나게 놀고 싶어서 글 올려요! \n 술게임도 좋아하고 맛집 탐방도 좋아해요. 부담 없이 연락 주세요! 😊',
    atmosphere: ['활발한', '술게임', '맛집탐방'], // 상세 페이지와 일치시킴 (키워드가 정확해야 함)
    minStudentId: 20,
    maxStudentId: 24,
    minAge: 20,
    maxAge: 25,
    memberCount: 4,
    invitedMembers: ['m1', 'm2'], // 실제 멤버 ID 등
  };
};

export default function EditTeamPage({ params }: { params: Promise<{ teamId: string }> }) {
  const router = useRouter();
  const { teamId } = use(params);
  const setAllData = useCreateTeamStore((state) => state.setAllData);

  useEffect(() => {
    const init = async () => {
      const data = await fetchTeamData(teamId);
      setAllData(data);
      router.replace(`/teams/${teamId}/edit/step-1`);
    };

    init();
  }, [teamId, setAllData, router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-white">
      <div className="text-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#FF9BC2] border-t-transparent mx-auto mb-4" />
        <p className="text-gray-500 font-bold">팀 정보를 불러오는 중...</p>
      </div>
    </div>
  );
}
