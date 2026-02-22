'use client';

import { Suspense, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { SignupStepLayout } from '@/widgets/signup';
import { EmailVerifyForm } from '@/features/signup/ui/steps/step-1';
import { useSignupStore } from '@/features/signup/model';

function Step1Content() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setProfile = useSignupStore((s) => s.setProfile);

  useEffect(() => {
    const signupToken = searchParams.get('signupToken') ?? '';
    const providerName = searchParams.get('providerName') ?? '';
    const nickname = searchParams.get('nickname') ?? '';

    if (!signupToken && !providerName && !nickname) return;

    setProfile({
      ...(signupToken ? { signUpToken: signupToken } : {}),
      ...(providerName ? { providerName } : {}),
      ...(nickname ? { nickname } : {}),
    });
  }, [searchParams, setProfile]);

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

export default function Step1Page() {
  return (
    <Suspense fallback={null}>
      <Step1Content />
    </Suspense>
  );
}
