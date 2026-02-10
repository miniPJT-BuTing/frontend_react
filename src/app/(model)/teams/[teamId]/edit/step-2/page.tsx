'use client';

import { useRouter, useParams } from 'next/navigation';
import Step2Preference from '@/features/team/create-team/ui/steps/Step2Preference';
import { CreateTeamStepLayout } from '@/widgets/create-team-layout/CreateTeamStepLayout';

export default function EditTeamStep2Page() {
  const router = useRouter();
  const params = useParams();
  const teamId = params.teamId as string;

  const handleNext = () => {
    router.replace(`/teams/${teamId}/edit/step-3`);
  };

  const handleBack = () => {
    router.replace(`/teams/${teamId}/edit/step-1`);
  };

  return (
    <CreateTeamStepLayout
      step={2}
      totalSteps={3}
      title="어떤 팀과 만나고 싶나요? (수정)"
      subtitle="선호하는 상대방의 정보를 수정해주세요."
      onNext={handleNext}
      onBack={handleBack}
    >
      <Step2Preference />
    </CreateTeamStepLayout>
  );
}
