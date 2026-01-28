'use client';

import { useRouter } from 'next/navigation';
import Step3Members from '@/features/team/create-team/ui/steps/Step3Members';
import { CreateTeamStepLayout } from '@/widgets/create-team-layout/CreateTeamStepLayout';

export default function CreateTeamStep3Page() {
  const router = useRouter();

  const handleComplete = () => {
    // Submit logic here
    console.log('Team Created!');
    router.push('/home'); // Redirect to home after creation
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