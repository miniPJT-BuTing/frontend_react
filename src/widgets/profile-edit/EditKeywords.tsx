'use client';

import KeywordGrid from '@/shared/ui/KeywordGrid';
import {
  PERSONALITY_KEYWORDS,
  PERSONALITY_KEY_TO_LABEL,
  type PersonalityKeywordKey,
} from '@/shared/lib/personalityKeyword';

type Props = {
  value: PersonalityKeywordKey[];
  onChange: (val: PersonalityKeywordKey[]) => void;
};

export function EditKeywords({ value, onChange }: Props) {
  const toggleKeyword = (label: string) => {
    const found = PERSONALITY_KEYWORDS.find((keyword) => keyword.label === label);
    if (!found) return;

    const key = found.key;

    if (value.includes(key)) {
      onChange(value.filter((selectedKey) => selectedKey !== key));
    } else {
      if (value.length >= 3) return;
      onChange([...value, key]);
    }
  };

  const selectedLabels = value.map((key) => PERSONALITY_KEY_TO_LABEL[key]).filter(Boolean);

  return (
    <div className="flex flex-col gap-3">
      <KeywordGrid
        keywords={PERSONALITY_KEYWORDS.map((keyword) => keyword.label)}
        selected={selectedLabels}
        onToggle={toggleKeyword}
      />
      <p className="text-xs text-right text-gray-500">최대 3개까지 선택할 수 있어요.</p>
    </div>
  );
}
