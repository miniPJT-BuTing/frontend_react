'use client';

import { useRouter } from 'next/navigation';
import Step1Basic from '@/features/team/create-team/ui/steps/Step1Basic';
import { CreateTeamStepLayout } from '@/widgets/create-team-layout/CreateTeamStepLayout';

export default function CreateTeamStep1Page() {
  const router = useRouter();

  const handleNext = () => {
    router.push('/teams/new/step-2');
  };

  return (
    <CreateTeamStepLayout step={1} onNext={handleNext}>
      <Step1Basic />
    </CreateTeamStepLayout>
  );
}
