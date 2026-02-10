'use client';

import { useRouter, useParams } from 'next/navigation';
import Step3Members from '@/features/team/create-team/ui/steps/Step3Members';
import { CreateTeamStepLayout } from '@/widgets/create-team-layout/CreateTeamStepLayout';
import { useCreateTeamStore } from '@/features/team/create-team/model/createTeam.store';

export default function EditTeamStep3Page() {
  const router = useRouter();
  const params = useParams();
  const teamId = params.teamId as string;
  const store = useCreateTeamStore();

  const handleComplete = () => {
    // TODO: Call API to update team data (PUT /teams/{teamId})
    console.log('Team Updated!', store); // Updated data is in store
    
    alert('팀 정보가 수정되었습니다!');
    router.back(); // 상세 페이지로 돌아감 (히스토리 스택 제거)
  };

  const handleBack = () => {
    router.replace(`/teams/${teamId}/edit/step-2`);
  };

  return (
    <CreateTeamStepLayout
      step={3}
      totalSteps={3}
      title="누구와 함께 하시나요? (수정)"
      subtitle="팀원을 변경하거나 초대해보세요."
      onNext={handleComplete}
      onBack={handleBack}
      nextLabel="수정 완료"
    >
      <Step3Members />
    </CreateTeamStepLayout>
  );
}
