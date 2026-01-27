'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { RetroButton } from '@/shared/ui/RetroButton';
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
  nextButtonVariant?: 'primary' | 'secondary' | 'neutral';
  isNextDisabled?: boolean;
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
  isNextDisabled = false,
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
          <div className="animate-fade-in-up">{children}</div>
        </div>

        <div className="fixed bottom-10 left-0 right-0 px-6 max-w-[480px] mx-auto z-10">
          <RetroButton
            fullWidth
            onClick={onNext}
            disabled={isNextDisabled}
            className="h-14 text-lg"
            variant={nextButtonVariant}
          >
            {nextLabel}
          </RetroButton>
        </div>
      </div>
    </>
  );
};
