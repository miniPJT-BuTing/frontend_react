'use client';

import { RetroButton } from '@/shared/ui/button/RetroButton';
import { PERSONALITY_KEYWORDS, type PersonalityKeywordKey } from '@/shared/lib/personalityKeyword';

type Props = {
  value: string[]; // List of Keys (e.g. ['ROMANTIC_TENSION', ...])
  onChange: (val: string[]) => void;
};

export function EditKeywords({ value, onChange }: Props) {
  const toggleKeyword = (key: string) => {
    if (value.includes(key)) {
      onChange(value.filter((k) => k !== key));
    } else {
      if (value.length >= 5) return; // 최대 5개 제한
      onChange([...value, key]);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <label className="text-base font-bold text-black">성격 키워드</label>
        <span className="text-xs font-bold text-gray-500">
          최대 5개 선택 ({value.length}/5)
        </span>
      </div>

      <div className="flex flex-wrap gap-2">
        {PERSONALITY_KEYWORDS.map((item) => {
          const isSelected = value.includes(item.key);
          return (
            <button
              key={item.key}
              type="button"
              onClick={() => toggleKeyword(item.key)}
              className={`rounded-full border-2 px-4 py-2 text-sm font-bold transition-all ${
                isSelected
                  ? 'border-black bg-[#FF9BC2] text-black'
                  : 'border-gray-200 bg-white text-gray-400 hover:border-gray-300'
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
