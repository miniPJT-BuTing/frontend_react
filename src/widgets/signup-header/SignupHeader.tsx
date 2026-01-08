'use client';

import React from 'react';
import { ProgressBar } from '@/shared/ui/ProgressBar';

interface SignupHeaderProps {
  step: number;
  totalSteps?: number;
  onBack?: () => void;
}

export const SignupHeader = ({ step, totalSteps = 6, onBack }: SignupHeaderProps) => {
  return (
    <div className="w-full px-6 py-4 flex flex-col gap-4">
      {/* Row 1: Back Button */}
      <div className="flex justify-start">
        <button onClick={onBack} className="text-3xl font-black hover:opacity-70 transition-opacity">
          {'<'}
        </button>
      </div>

      {/* Row 2: Progress Bar */}
      <ProgressBar current={step} total={totalSteps} />

      {/* Row 3: Step Badge */}
      <div className="flex justify-start">
        <div className="bg-[#F7ABCF] px-3 py-1 rounded-full border-2 border-black text-xs font-bold shadow-[2px_2px_0_0_rgba(0,0,0,1)]">
          Step {step}
        </div>
      </div>
    </div>
  );
};