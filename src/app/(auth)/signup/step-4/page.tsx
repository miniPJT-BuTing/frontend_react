'use client';

import { useRouter } from 'next/navigation';
import Step4Avator from '@/features/signup/ui/steps/Step4';
import { SignupStepLayout } from '@/widgets/signup-layout/SignupStepLayout';

export default function Step4Page() {
  const router = useRouter();

  const handleComplete = () => {
    // Submit data logic here
    console.log('Signup Complete!');
    router.push('/home');
  };

  return (
    <SignupStepLayout
      step={4}
      totalSteps={4}
      title={<>프로필을{'\n'}완성해주세요!</>}
      subtitle="나만의 캐릭터를 만들어보세요."
      onNext={handleComplete}
      nextLabel="완료하기"
      nextButtonVariant="secondary"
    >
      <Step4Avator />
    </SignupStepLayout>
  );
}
