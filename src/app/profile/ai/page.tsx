'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { AxiosError } from 'axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ChevronLeft } from 'lucide-react';
import { analyzeMyFaceApi } from '@/features/ai/api/ai.api';
import type { AiAnalysisResult } from '@/features/ai/api/ai.types';
import { RetroButton } from '@/shared/ui/button/RetroButton';

export default function ProfileAiPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [result, setResult] = useState<AiAnalysisResult | null>(null);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const analyzeMutation = useMutation({
    mutationFn: (file: File) => analyzeMyFaceApi(file),
    onSuccess: async (analyzed) => {
      setResult(analyzed);
      await queryClient.invalidateQueries({ queryKey: ['member', 'me'] });
      alert('AI 얼굴 분석 결과가 프로필에 반영되었습니다.');
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        const message = (error.response?.data as { message?: string } | undefined)?.message;
        alert(message || 'AI 얼굴 분석에 실패했습니다.');
        return;
      }
      alert('AI 얼굴 분석에 실패했습니다.');
    },
  });

  const handlePickImage = () => {
    if (analyzeMutation.isPending) return;
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;

    const nextPreviewUrl = URL.createObjectURL(file);
    setPreviewUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return nextPreviewUrl;
    });

    analyzeMutation.mutate(file);
  };

  return (
    <main className="relative flex min-h-screen flex-col items-center text-slate-900">
      <div
        className="
          pointer-events-none absolute inset-x-0 top-0
          h-1/2 bg-gradient-to-b
          from-[var(--color-skyblue)] to-transparent
        "
      />

      <div
        className="
          pointer-events-none absolute inset-x-0 bottom-0
          h-1/4 bg-gradient-to-t
          from-[var(--color-skyblue)] to-transparent
        "
      />

      <div className="relative h-full w-full max-w-[480px] overflow-y-auto overflow-x-hidden scrollbar-hide p-6 pb-24">
        <header className="mb-8 flex items-center justify-between">
          <button
            type="button"
            onClick={() => router.back()}
            aria-label="뒤로가기"
            className="h-10 w-10 rounded-full border border-black bg-white flex items-center justify-center"
          >
            <ChevronLeft className="h-6 w-6 stroke-[3] text-black" />
          </button>

          <div className="rounded-full border border-black bg-gradient-to-b from-white to-[var(--color-blueGreen)] px-4 py-2 text-sm font-bold uppercase">
            ai analyze
          </div>
        </header>

        <section className="rounded-[22px] border border-black bg-white p-5">
          <div className="flex flex-col items-center gap-4 text-center">
            <button
              type="button"
              onClick={handlePickImage}
              disabled={analyzeMutation.isPending}
              className="
                relative flex h-44 w-44 items-center justify-center overflow-hidden
                rounded-full border border-black bg-[#F4F6FB]
                transition-transform
                active:translate-y-[2px] active:scale-95
                disabled:cursor-not-allowed disabled:opacity-60
              "
              aria-label="얼굴 사진 업로드"
            >
              {previewUrl ? (
                <Image
                  src={previewUrl}
                  alt="업로드한 얼굴 사진"
                  fill
                  sizes="176px"
                  unoptimized
                  className="h-full w-full rounded-full object-cover"
                />
              ) : (
                <span className="text-5xl">📷</span>
              )}
            </button>

            <p className="text-sm font-bold text-gray-700">
              {analyzeMutation.isPending ? '분석 중입니다...' : '사진을 눌러 AI 얼굴 분석하기'}
            </p>

            {result && (
              <div className="w-full rounded-xl border border-black bg-[#FFF6FB] p-4 text-left">
                <p className="text-sm font-black text-black">
                  {result.nickname || result.name || 'AI 분석 결과'}
                </p>
                {result.description ? (
                  <p className="mt-2 text-sm font-semibold text-gray-700">{result.description}</p>
                ) : null}
              </div>
            )}
          </div>
        </section>

        <div className="mt-6">
          <RetroButton
            type="button"
            onClick={handlePickImage}
            variant="yellow"
            className="w-full"
            disabled={analyzeMutation.isPending}
          >
            {analyzeMutation.isPending ? '분석 중...' : '사진 선택 후 분석'}
          </RetroButton>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
    </main>
  );
}
