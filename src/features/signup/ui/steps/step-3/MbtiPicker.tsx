import React from 'react';
import { useSignupStore } from '@/features/signup/model';
import { MbtiSelector } from '@/shared/ui/MbtiSelector';

export function MbtiPicker() {
  const { mbti, setPersonality } = useSignupStore();

  return (
    <MbtiSelector value={mbti} onChange={(nextMbti) => setPersonality({ mbti: nextMbti })} />
  );
}
