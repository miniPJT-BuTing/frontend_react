'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { SignupStepLayout } from '@/widgets/signup/SignupStepLayout';
import { FaceAnalyze, AnimalPicker } from '@/features/signup/ui/steps/step-4';

type Mode = 'analyze' | 'picker';
type PickSource = 'ai' | 'manual';

export default function Step4Page() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>('analyze');
  const [pickSource, setPickSource] = useState<PickSource>('ai');

  const handleComplete = () => {
    console.log('Signup Complete!');
    router.push('/home');
  };

  const goAnalyze = () => {
    setPickSource('ai');
    setMode('analyze');
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
      <div className="flex flex-col gap-6">
        {mode === 'analyze' && (
          <FaceAnalyze
            onSkip={() => {
              setPickSource('manual');
              setMode('picker');
            }}
            onComplete={() => {
              setPickSource('ai');
              setMode('picker');
            }}
          />
        )}

        {mode === 'picker' && (
          <>
            {pickSource === 'manual' && (
              <div className="rounded-xl border border-black bg-[var(--color-yellow)] p-4 text-center text-sm font-bold">
                AI 얼굴 분석을 건너뛰었어요 😊 <br />
                <span className="text-black/80">나를 닮은 동물을 직접 선택해주세요!</span>
              </div>
            )}

            {pickSource === 'ai' && (
              <div className="rounded-xl border border-black bg-[var(--color-yellow)] p-4 text-center text-sm font-bold">
                얼굴 분석 결과를 기반으로 추천된 동물이에요 🐾 <br />
                마음에 들지 않으면 직접 변경할 수도 있어요!
              </div>
            )}

            <AnimalPicker onBackToAnalyze={goAnalyze} />
          </>
        )}
      </div>
    </SignupStepLayout>
  );
}
