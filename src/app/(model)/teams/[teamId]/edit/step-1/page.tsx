'use client';

import { useRouter, useParams } from 'next/navigation';
import Step1Basic from '@/features/team/create-team/ui/steps/Step1Basic';
import { CreateTeamStepLayout } from '@/widgets/create-team-layout/CreateTeamStepLayout';

export default function EditTeamStep1Page() {
  const router = useRouter();
  const params = useParams();
  const teamId = params.teamId as string;

  const handleNext = () => {
    router.replace(`/teams/${teamId}/edit/step-2`);
  };

  const handleBack = () => {
    router.back(); // 뒤로가기 시 상세 페이지로 (수정 취소)
  };

  return (
    <CreateTeamStepLayout 
      step={1} 
      totalSteps={3}
      onNext={handleNext} 
      onBack={handleBack}
      nextLabel="다음"
    >
      <Step1Basic />
    </CreateTeamStepLayout>
  );
}
