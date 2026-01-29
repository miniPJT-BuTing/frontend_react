'use client';

import { useRouter } from 'next/navigation';
import { SignupStepLayout } from '@/widgets/signup';
import { EmailVerifyForm } from '@/features/signup/ui/steps/step-1';

export default function Step1Page() {
  const router = useRouter();

  return (
    <SignupStepLayout
      step={1}
      totalSteps={4}
      title={<>학교 인증하고{'\n'}부팅을 시작해볼까요?</>}
      subtitle="학교 이메일 인증을 통해 안전한 미팅을 할 수 있어요."
      onNext={() => router.push('/signup/step-2')}
    >
      <EmailVerifyForm />
    </SignupStepLayout>
  );
}
