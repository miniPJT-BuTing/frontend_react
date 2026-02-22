'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { AxiosError } from 'axios';
import { SignupStepLayout } from '@/widgets/signup/SignupStepLayout';
import { FaceAnalyze, AnimalPicker } from '@/features/signup/ui/steps/step-4';
import { useSignupStore } from '@/features/signup/model';
import { completeSignupApi } from '@/features/signup/api/signup.api';
import type { PersonalityKeywordKey } from '@/shared/lib/personalityKeyword';

type Mode = 'analyze' | 'picker';
type PickSource = 'ai' | 'manual';

export default function Step4Page() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>('analyze');
  const [pickSource, setPickSource] = useState<PickSource>('ai');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const signupState = useSignupStore();

  const handleComplete = async () => {
    if (isSubmitting) return;

    const entryYearMatch = signupState.studentId.match(/\d+/)?.[0];
    const entryYear = entryYearMatch ? Number(entryYearMatch) % 100 : NaN;
    const gender = signupState.gender === 'male' ? 'M' : signupState.gender === 'female' ? 'W' : null;
    const mbti = signupState.mbti?.trim() ?? '';
    const collegeIdFromText = Number(signupState.college);
    const collegeId =
      signupState.collegeId ?? (Number.isFinite(collegeIdFromText) && collegeIdFromText > 0 ? collegeIdFromText : null);
    const bio = signupState.oneLiner.trim();
    const keywords = signupState.keywords as PersonalityKeywordKey[];

    const missingFields: string[] = [];
    if (!signupState.signUpToken) missingFields.push('signupToken');
    if (!signupState.email.trim()) missingFields.push('universityEmail');
    if (!signupState.universityDomainId) missingFields.push('universityDomainId');
    if (!signupState.nickname.trim()) missingFields.push('nickname');
    if (!signupState.age) missingFields.push('age');
    if (!gender) missingFields.push('gender');
    if (!mbti || mbti.length !== 4) missingFields.push('mbti');
    if (!Number.isFinite(entryYear)) missingFields.push('entryYear');
    if (keywords.length !== 3) missingFields.push('personalityTypes(3개)');
    if (!collegeId) missingFields.push('collegeId');

    if (missingFields.length > 0) {
      alert(`회원가입에 필요한 정보가 부족합니다: ${missingFields.join(', ')}`);
      return;
    }

    const signupGender = gender as 'M' | 'W';

    try {
      setIsSubmitting(true);
      await completeSignupApi({
        signUpToken: signupState.signUpToken,
        nickname: signupState.nickname.trim(),
        universityEmail: signupState.email.trim(),
        universityDomainId: signupState.universityDomainId!,
        age: signupState.age!,
        gender: signupGender,
        mbti,
        entryYear,
        personalityTypes: keywords,
        ...(bio ? { bio } : {}),
        collegeId: collegeId!,
      });

      signupState.reset();
      alert('회원가입이 완료되었습니다.');
      router.replace('/');
    } catch (error) {
      if (error instanceof AxiosError) {
        const message = (error.response?.data as { message?: string } | undefined)?.message;
        alert(message || '회원가입에 실패했습니다.');
      } else {
        alert('회원가입에 실패했습니다.');
      }
    } finally {
      setIsSubmitting(false);
    }
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
      nextLabel={isSubmitting ? '처리중...' : '완료하기'}
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
