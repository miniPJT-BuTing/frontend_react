import React from 'react';

type Props = {
  onSkip: () => void;
  onComplete: () => void;
};

export function FaceAnalyze({ onSkip, onComplete }: Props) {
  const handleAnalyze = () => {
    alert('얼굴 분석 중... (Mock)');
    onComplete();
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold">AI 얼굴 분석하기</h3>

        <button
          type="button"
          onClick={onSkip}
          className="
            rounded-full border border-black
            bg-[var(--color-yellow)] px-3 py-1
            text-xs font-extrabold text-black
            active:translate-y-[1px]
          "
        >
          건너뛰기
        </button>
      </div>

      <div className="flex flex-col items-center gap-3">
        <button
          type="button"
          onClick={handleAnalyze}
          className="
            flex h-40 w-40 items-center justify-center
            rounded-full border border-black bg-white
            transition-transform
            hover:bg-gray-50
            active:translate-y-[2px] active:scale-95
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/60
          "
          aria-label="AI 얼굴 분석하기"
        >
          <span className="text-4xl">📷</span>
        </button>

        <p className="text-sm font-bold text-gray-700">사진을 눌러 얼굴 분석하기</p>
      </div>
    </div>
  );
}
