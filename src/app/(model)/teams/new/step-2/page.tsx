'use client';

import { useRouter } from 'next/navigation';
import Step2Preference from '@/features/team/create-team/ui/steps/Step2Preference';
import { CreateTeamStepLayout } from '@/widgets/create-team-layout/CreateTeamStepLayout';

export default function CreateTeamStep2Page() {
  const router = useRouter();

  const handleNext = () => {
    router.push('/teams/new/step-3');
  };

  return (
    <CreateTeamStepLayout
      step={2}
      title="어떤 팀과 만나고 싶나요?"
      subtitle="선호하는 상대방의 정보를 알려주세요."
      onNext={handleNext}
    >
      <Step2Preference />
    </CreateTeamStepLayout>
  );
}