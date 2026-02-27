'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { SignupStepLayout } from '@/widgets/signup/SignupStepLayout';
import { useSignupStore } from '@/features/signup/model';
import {
  NicknameForm,
  AgeStudentIdForm,
  CollegeSelect,
  GenderForm,
} from '@/features/signup/ui/steps/step-2';

type FunnelStep = 'nickname' | 'basic' | 'college' | 'gender';

export default function Step2Page() {
  const router = useRouter();
  const [funnelStep, setFunnelStep] = useState<FunnelStep>('nickname');
  const selectedCollegeId = useSignupStore((s) => s.collegeId);
  const stepConfig = {
    nickname: {
      title: <>닉네임을 알려주세요!</>,
      subtitle: '',
      component: <NicknameForm />,
    },
    basic: {
      title: <>나이와 학번을 알려주세요!</>,
      subtitle: '',
      component: <AgeStudentIdForm />,
    },
    college: {
      title: <>소속 단과대를 알려주세요!</>,
      subtitle: '',
      component: <CollegeSelect />,
    },
    gender: {
      title: <>성별을{'\n'}선택해주세요!</>,
      subtitle: '매칭 상대를 찾을 때 참고할게요.',
      component: <GenderForm />,
    },
  };

  const handleNext = () => {
    if (funnelStep === 'nickname') setFunnelStep('basic');
    else if (funnelStep === 'basic') setFunnelStep('college');
    else if (funnelStep === 'college') {
      if (!selectedCollegeId) {
        alert('소속 단과대를 먼저 선택해주세요.');
        return;
      }
      setFunnelStep('gender');
    }
    else router.push('/signup/step-3');
  };

  const handleBack = () => {
    if (funnelStep === 'gender') setFunnelStep('college');
    else if (funnelStep === 'college') setFunnelStep('basic');
    else if (funnelStep === 'basic') setFunnelStep('nickname');
    else router.back();
  };

  const current = stepConfig[funnelStep];

  return (
    <SignupStepLayout
      step={2}
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
