import React from 'react';

interface ProgressBarProps {
  current: number;
  total: number;
}

export const ProgressBar = ({ current, total }: ProgressBarProps) => {
  const progress = Math.min((current / total) * 100, 100);

  return (
    <div className="w-full h-2 bg-white/50 rounded-full overflow-hidden border border-black/50">
      <div
        className="h-full bg-[#A3D2FE] transition-all duration-300 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};
