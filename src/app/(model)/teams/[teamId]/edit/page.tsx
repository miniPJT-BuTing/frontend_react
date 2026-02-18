'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { use } from 'react';
import { useCreateTeamStore } from '@/features/team/create-team/model/createTeam.store';
import { getTeamDetail } from '@/features/team/api/team.api';
import { TEAM_MOOD_LABEL_TO_KEY, type TeamMoodKey } from '@/shared/lib/personalityKeyword';

// Enum Helper (Reverse Mapping)
const mapTeamSize = (size: string): number => {
  if (size === 'TWO_ON_TWO') return 2;
  if (size === 'THREE_ON_THREE') return 3;
  if (size === 'FOUR_ON_FOUR') return 4;
  if (size === 'FIVE_ON_FIVE') return 5;
  if (size === 'SIX_ON_SIX') return 6;
  return 2;
};

const mapMood = (mood: string): string[] => {
  if (!mood) return [];
  
  const trimmed = mood.trim();
  
  // 1. 이미 Key인 경우 (ROMANTIC_TENSION)
  if (Object.values(TEAM_MOOD_LABEL_TO_KEY).includes(trimmed as TeamMoodKey)) {
    return [trimmed];
  }

  // 2. Label인 경우 (연애 텐션) -> Key로 변환
  const key = TEAM_MOOD_LABEL_TO_KEY[trimmed];
  if (key) return [key];

  // 3. 매칭 안 되면 원본 반환 (혹시 모를 상황 대비)
  return [trimmed];
};

export default function EditTeamPage({ params }: { params: Promise<{ teamId: string }> }) {
  const router = useRouter();
  const { teamId } = use(params);
  const setAllData = useCreateTeamStore((state) => state.setAllData);

  useEffect(() => {
    const init = async () => {
      try {
        const data = await getTeamDetail(teamId);
        
        console.log('Loaded Mood:', data.preferredMood); // 디버깅용

        setAllData({
          title: data.title,
          introduction: data.description,
          atmosphere: mapMood(data.preferredMood), // Key 그대로 전달
          minStudentId: data.preferredEntryYearMin,
          maxStudentId: data.preferredEntryYearMax,
          minAge: data.preferredAgeMin,
          maxAge: data.preferredAgeMax,
          memberCount: mapTeamSize(data.teamSize),
          // 수정 플로우에서 초대 목록도 id+닉네임 형태로 보존
          invitedMembers: data.members
            ? data.members
                .filter((m) => m.role !== 'LEADER')
                .map((m) => ({ memberId: m.id, nickname: m.nickname }))
            : [],
        });
        
        router.replace(`/teams/${teamId}/edit/step-1`);
      } catch (error) {
        console.error('Failed to load team data:', error);
        alert('팀 정보를 불러오는데 실패했습니다.');
        router.back();
      }
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
