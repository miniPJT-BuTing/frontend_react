'use client';

import KeywordGrid from '@/shared/ui/KeywordGrid';
import {
  PERSONALITY_KEYWORDS,
  PERSONALITY_KEY_TO_LABEL,
  type PersonalityKeywordKey,
} from '@/shared/lib/personalityKeyword';
import { PERSONALITY_KEYWORD_LIMIT } from '@/shared/constants/profile';
import type { PersonalityKeywordItem } from '@/features/member/api/member.types';

type Props = {
  value: PersonalityKeywordKey[];
  onChange: (val: PersonalityKeywordKey[]) => void;
  options?: PersonalityKeywordItem[];
};

export function EditKeywords({ value, onChange, options }: Props) {
  const keywordOptions = options ?? PERSONALITY_KEYWORDS.map((keyword) => ({
    code: keyword.key,
    description: keyword.label,
  }));

  const toggleKeyword = (label: string) => {
    const found = keywordOptions.find((keyword) => keyword.description === label);
    if (!found) return;

    const key = found.code as PersonalityKeywordKey;

    if (value.includes(key)) {
      onChange(value.filter((selectedKey) => selectedKey !== key));
    } else {
      if (value.length >= PERSONALITY_KEYWORD_LIMIT) return;
      onChange([...value, key]);
    }
  };

  const selectedLabels = value.map((key) => PERSONALITY_KEY_TO_LABEL[key]).filter(Boolean);

  return (
    <div className="flex flex-col gap-3">
      <KeywordGrid
        keywords={keywordOptions.map((keyword) => keyword.description)}
        selected={selectedLabels}
        onToggle={toggleKeyword}
      />
      <p className="text-xs text-right text-gray-500">
        최대 {PERSONALITY_KEYWORD_LIMIT}개까지 선택할 수 있어요.
      </p>
    </div>
  );
}
