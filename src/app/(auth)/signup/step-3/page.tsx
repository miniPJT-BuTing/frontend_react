'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { SignupStepLayout } from '@/widgets/signup/SignupStepLayout';
import { MbtiPicker, KeywordPicker, OneLiner } from '@/features/signup/ui/steps/step-3';

type FunnelStep = 'mbti' | 'keyword' | 'oneLiner';

export default function Step3Page() {
  const router = useRouter();
  const [funnelStep, setFunnelStep] = useState<FunnelStep>('mbti');
  const stepConfig = {
    mbti: {
      title: <>MBTI를 알려주세요!</>,
      subtitle: '',
      component: <MbtiPicker />,
    },
    keyword: {
      title: <>성격 키워드를 선택해주세요!</>,
      subtitle: '',
      component: <KeywordPicker />,
    },
    oneLiner: {
      title: <>자기소개 문구를 작성해주세요!</>,
      subtitle: '',
      component: <OneLiner />,
    },
  };

  const handleNext = () => {
    if (funnelStep === 'mbti') setFunnelStep('keyword');
    else if (funnelStep === 'keyword') setFunnelStep('oneLiner');
    else router.push('/signup/step-4');
  };

  const handleBack = () => {
    if (funnelStep === 'oneLiner') setFunnelStep('keyword');
    else if (funnelStep === 'keyword') setFunnelStep('mbti');
    else router.back();
  };

  const current = stepConfig[funnelStep];

  return (
    <SignupStepLayout
      step={3}
      totalSteps={4}
      title={current.title}
      subtitle={current.subtitle}
      onNext={handleNext}
      onBack={handleBack}
    >
      {current.component}
    </SignupStepLayout>
  );
}
