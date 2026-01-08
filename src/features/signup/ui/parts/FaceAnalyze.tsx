import React from 'react';
import { RetroButton } from '@/shared/ui/RetroButton';

export default function FaceAnalyze() {
  return (
    <div className="flex flex-col gap-4 items-center">
      <div className="h-40 w-40 rounded-full bg-gray-200 border-2 border-black flex items-center justify-center">
        <span className="text-4xl">📷</span>
      </div>
      <RetroButton
        type="button"
        variant="secondary"
        className="h-12 w-full text-lg"
        onClick={() => alert('얼굴 분석 중... (Mock)')}
      >
        AI 얼굴 분석하기
      </RetroButton>
    </div>
  );
}