'use client';

import React from 'react';
import { ChevronLeft } from 'lucide-react';
import { ProgressBar } from '@/shared/ui/ProgressBar';

interface SignupHeaderProps {
  step: number;
  totalSteps?: number;
  onBack?: () => void;
}

export const SignupHeader = ({ step, totalSteps = 6, onBack }: SignupHeaderProps) => {
  return (
    <div className="w-full px-6 py-4 flex flex-col gap-6">
      <div className="flex justify-start">
        <button
          onClick={onBack}
          className="
            w-10 h-10
            flex items-center justify-center
            rounded-full
            border border-black
            bg-white
            transition-all
          "
        >
          <ChevronLeft className="w-6 h-6 text-black stroke-[3]" />
        </button>
      </div>

      {/* <ProgressBar current={step} total={totalSteps} /> */}

      <div className="flex justify-start">
        <div
          className="
      px-4 py-2
      rounded-full
      border border-black
      text-lg font-bold uppercase
      bg-gradient-to-b
      from-[#FFFFFF]
      to-[#68D0E7]
      text-black
    "
        >
          STEP {step}
        </div>
      </div>
    </div>
  );
};
