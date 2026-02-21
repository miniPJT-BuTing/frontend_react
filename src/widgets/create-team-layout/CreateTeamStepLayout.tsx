'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { RetroButton } from '@/shared/ui/button/RetroButton';
import { CreateTeamHeader } from '@/widgets/create-team-header/CreateTeamHeader';

interface CreateTeamStepLayoutProps {
  step: number;
  totalSteps?: number;
  title?: React.ReactNode;
  subtitle?: string;
  children: React.ReactNode;
  onNext: () => void;
  onBack?: () => void;
  nextLabel?: string;
  nextButtonVariant?: 'neutral' | 'primary' | 'skyblue' | 'blueGreen' | 'yellow' | 'kakao';
}

export const CreateTeamStepLayout = ({
  step,
  totalSteps = 3,
  title,
  subtitle,
  children,
  onNext,
  onBack,
  nextLabel = '다음',
  nextButtonVariant = 'primary',
}: CreateTeamStepLayoutProps) => {
  const router = useRouter();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };

  return (
    <>
      <CreateTeamHeader step={step} totalSteps={totalSteps} onBack={handleBack} />
      <div className="container mx-auto min-h-[calc(100vh-140px)] max-w-[480px] p-6 relative flex flex-col">
        <div className="flex-1 flex flex-col gap-8 pb-24">
          {(title || subtitle) && (
            <div className="bg-white rounded-2xl rounded-tl-none p-6 border border-black shadow-[4px_4px_0_0_rgba(0,0,0,1)] animate-fade-in">
              {title && <h1 className="text-xl font-black whitespace-pre-wrap">{title}</h1>}
              {subtitle && <p className="text-gray-500 mt-2">{subtitle}</p>}
            </div>
          )}

          <div className="animate-fade-in-up">{children}</div>
        </div>

        <div className="fixed bottom-6 left-0 right-0 px-6 max-w-[480px] mx-auto z-10">
          <RetroButton onClick={onNext} className="h-14 text-lg w-full" variant={nextButtonVariant}>
            {nextLabel}
          </RetroButton>
        </div>
      </div>
    </>
  );
};
