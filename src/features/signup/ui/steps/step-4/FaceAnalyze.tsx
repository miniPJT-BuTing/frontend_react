import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { AxiosError } from 'axios';
import { analyzeFaceApi } from '@/features/ai/api/ai.api';
import type { AiAnalysisResult, AiGender } from '@/features/ai/api/ai.types';

type Props = {
  onSkip: () => void;
  gender: AiGender | null;
  onComplete: (result: AiAnalysisResult) => void;
};

export function FaceAnalyze({ onSkip, gender, onComplete }: Props) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [result, setResult] = useState<AiAnalysisResult | null>(null);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handleAnalyzeClick = () => {
    if (isAnalyzing) return;
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';

    if (!file) return;
    if (!gender) {
      alert('성별 정보가 필요해요. 이전 단계에서 성별을 먼저 선택해주세요.');
      return;
    }

    try {
      setIsAnalyzing(true);
      const nextPreviewUrl = URL.createObjectURL(file);
      setPreviewUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return nextPreviewUrl;
      });

      const analyzed = await analyzeFaceApi(gender, file);
      setResult(analyzed);
      alert('AI 얼굴 분석이 완료되었습니다.');
      onComplete(analyzed);
    } catch (error) {
      if (error instanceof AxiosError) {
        const message = (error.response?.data as { message?: string } | undefined)?.message;
        alert(message || 'AI 얼굴 분석에 실패했습니다.');
      } else {
        alert('AI 얼굴 분석에 실패했습니다.');
      }
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />

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
          onClick={handleAnalyzeClick}
          disabled={isAnalyzing}
          className="
            relative flex h-40 w-40 items-center justify-center overflow-hidden
            rounded-full border border-black bg-white
            transition-transform
            hover:bg-gray-50
            active:translate-y-[2px] active:scale-95
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/60
          "
          aria-label="AI 얼굴 분석하기"
        >
          {previewUrl ? (
            <Image
              src={previewUrl}
              alt="업로드한 얼굴 사진"
              fill
              sizes="160px"
              unoptimized
              className="h-full w-full rounded-full object-cover"
            />
          ) : (
            <span className="text-4xl">📷</span>
          )}
        </button>

        <p className="text-sm font-bold text-gray-700">
          {isAnalyzing ? '분석 중입니다...' : '사진을 눌러 얼굴 분석하기'}
        </p>

        {result && (
          <div className="w-full rounded-xl border border-black bg-white p-4 text-sm">
            <p className="font-extrabold text-black">{result.nickname || result.name || '분석 결과'}</p>
            {result.description ? <p className="mt-1 text-gray-700">{result.description}</p> : null}
          </div>
        )}
      </div>
    </div>
  );
}
