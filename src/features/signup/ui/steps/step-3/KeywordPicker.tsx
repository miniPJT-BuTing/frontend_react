import React from 'react';
import { useSignupStore } from '@/features/signup/model';
import KeywordGrid from '@/shared/ui/KeywordGrid';
import {
  PERSONALITY_KEYWORDS,
  PERSONALITY_KEY_TO_LABEL,
  type PersonalityKeywordKey,
} from '@/shared/lib/personalityKeyword';

export function KeywordPicker() {
  const { keywords: selectedKeys, setPersonality } = useSignupStore();

  const toggleKeyword = (label: string) => {
    const found = PERSONALITY_KEYWORDS.find((k) => k.label === label);
    if (!found) return;

    const key = found.key;

    if (selectedKeys.includes(key)) {
      setPersonality({ keywords: selectedKeys.filter((k) => k !== key) });
    } else {
      if (selectedKeys.length >= 3) return;
      setPersonality({ keywords: [...selectedKeys, key] });
    }
  };

  const selectedLabels = (selectedKeys as PersonalityKeywordKey[])
    .map((k) => PERSONALITY_KEY_TO_LABEL[k])
    .filter(Boolean);

  return (
    <div className="flex flex-col gap-3">
      <KeywordGrid
        keywords={PERSONALITY_KEYWORDS.map((k) => k.label)}
        selected={selectedLabels}
        onToggle={toggleKeyword}
      />
      <p className="text-xs text-right text-gray-500">최대 3개까지 선택할 수 있어요.</p>
    </div>
  );
}
