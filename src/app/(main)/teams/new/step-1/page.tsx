'use client';

import { useRouter } from 'next/navigation';
import Step1Basic from '@/features/team/create-team/ui/steps/Step1Basic';
import { CreateTeamStepLayout } from '@/widgets/create-team-layout/CreateTeamStepLayout';
import { useCreateTeamStore } from '@/features/team/create-team/model/createTeam.store';

export default function CreateTeamStep1Page() {
  const router = useRouter();
  const { title, introduction } = useCreateTeamStore();

  const handleNext = () => {
    router.push('/teams/new/step-2');
  };

  const isNextDisabled = !title.trim() || !introduction.trim();

  return (
    <CreateTeamStepLayout step={1} onNext={handleNext} isNextDisabled={isNextDisabled}>
      <Step1Basic />
    </CreateTeamStepLayout>
  );
}
