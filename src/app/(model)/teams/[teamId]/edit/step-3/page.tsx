'use client';

import { useRouter, useParams } from 'next/navigation';
import { CreateTeamStepLayout } from '@/widgets/create-team-layout/CreateTeamStepLayout';
import { useCreateTeamStore } from '@/features/team/create-team/model/createTeam.store';
import { updateTeam, type UpdateTeamRequest } from '@/features/team/api/team.api';

export default function EditTeamStep3Page() {
  const router = useRouter();
  const params = useParams();
  const teamId = params.teamId as string;
  const store = useCreateTeamStore();

  const handleComplete = async () => {
    try {
      const requestData: UpdateTeamRequest = {
        title: store.title,
        description: store.introduction,
        // atmosphere는 이제 Enum Key 배열입니다.
        preferredMood: store.atmosphere[0] || 'ANY_MOOD',
        preferredAgeMin: store.minAge || 20,
        preferredAgeMax: store.maxAge || 30,
        preferredEntryYearMin: store.minStudentId || 0,
        preferredEntryYearMax: store.maxStudentId || 99,
      };

      await updateTeam(teamId, requestData);
      
      alert('팀 정보가 수정되었습니다!');
      store.reset();
      router.back(); // 상세 페이지로 복귀
    } catch (error) {
      console.error('Failed to update team:', error);
      // 백엔드 에러 메시지 표시 (Error 객체이면 message 사용, 아니면 기본 메시지)
      const message = error instanceof Error ? error.message : '팀 수정에 실패했습니다.';
      alert(message);
    }
  };

  const handleBack = () => {
    router.replace(`/teams/${teamId}/edit/step-2`);
  };

  return (
    <CreateTeamStepLayout
      step={3}
      totalSteps={3}
      title="수정 완료"
      subtitle="팀 정보를 수정하시겠습니까?"
      onNext={handleComplete}
      onBack={handleBack}
      nextLabel="수정 완료"
    >
      <div className="p-4 text-center text-gray-500">
        <p>팀원 정보는 수정할 수 없습니다.</p>
        <p className="text-sm mt-2">수정을 완료하려면 아래 버튼을 눌러주세요.</p>
      </div>
    </CreateTeamStepLayout>
  );
}
