'use client';

import { useRouter } from 'next/navigation';
import Step3Members from '@/features/team/create-team/ui/steps/Step3Members';
import { CreateTeamStepLayout } from '@/widgets/create-team-layout/CreateTeamStepLayout';
import { useCreateTeamStore } from '@/features/team/create-team/model/createTeam.store';
import { createTeam, type CreateTeamRequest } from '@/features/team/api/team.api';

// Enum Helper
const getTeamSizeEnum = (count: number): string => {
  switch (count) {
    case 2:
      return 'TWO_ON_TWO';
    case 3:
      return 'THREE_ON_THREE';
    case 4:
      return 'FOUR_ON_FOUR';
    case 5:
      return 'FIVE_ON_FIVE';
    default:
      return 'SIX_ON_SIX';
  }
};

export default function CreateTeamStep3Page() {
  const router = useRouter();
  const store = useCreateTeamStore();

  const handleComplete = async () => {
    try {
      const requestData: CreateTeamRequest = {
        title: store.title,
        description: store.introduction,
        // atmosphere는 이제 Enum Key 배열입니다. API는 단일 Enum을 요구하므로 첫 번째 값을 사용하거나 로직 수정 필요.
        // 여기서는 첫 번째 선택 값을 사용하고, 없으면 ANY_MOOD를 보냅니다.
        preferredMood: store.atmosphere[0] || 'ANY_MOOD',
        teamSize: getTeamSizeEnum(store.memberCount),
        preferredAgeMin: store.minAge || 20,
        preferredAgeMax: store.maxAge || 30,
        preferredEntryYearMin: store.minStudentId || 0,
        preferredEntryYearMax: store.maxStudentId || 99,
        inviteMemberIds: store.invitedMembers.map((member) => member.memberId),
      };

      const result = await createTeam(requestData);

      console.log('Team Created! ID:', result.teamId);
      store.reset(); // 스토어 초기화
      router.push('/home'); // 생성 후 홈으로 이동 (또는 내 팀 상세 페이지)
    } catch (error) {
      console.error('Failed to create team:', error);
      alert('팀 생성에 실패했습니다. (API 오류)');
    }
  };

  return (
    <CreateTeamStepLayout
      step={3}
      title="누구와 함께 하시나요?"
      subtitle="팀원을 초대해보세요."
      onNext={handleComplete}
      nextLabel="팀 생성하기"
    >
      <Step3Members />
    </CreateTeamStepLayout>
  );
}
