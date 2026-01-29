'use client';

import { useRouter } from 'next/navigation';
import FaceAnalyze from '@/features/signup/ui/parts/FaceAnalyze';
import AnimalPicker from '@/features/signup/ui/parts/AnimalPicker';
import { SignupStepLayout } from '@/widgets/signup/SignupStepLayout';

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
    >
      <div className="flex flex-col gap-8">
        <FaceAnalyze />
        <AnimalPicker />
      </div>
    </SignupStepLayout>
  );
}
