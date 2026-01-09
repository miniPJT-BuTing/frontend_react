import React from 'react';
import { useSignupStore } from '../../model/signup.store';
import { RetroButton } from '@/shared/ui/RetroButton';

const KEYWORDS = [
  '활발한', '조용한', '미식가', '여행러',
  '운동', '게임', '독서', '음악',
  '영화', '카페', '술', '반려동물'
];

export default function KeywordPicker() {
  const { keywords, setPersonality } = useSignupStore();

  const toggleKeyword = (keyword: string) => {
    if (keywords.includes(keyword)) {
      setPersonality({ keywords: keywords.filter((k) => k !== keyword) });
    } else {
      if (keywords.length >= 5) return; // Limit to 5
      setPersonality({ keywords: [...keywords, keyword] });
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <label className="text-lg font-bold">키워드 (최대 5개)</label>
      <div className="flex flex-wrap gap-2">
        {KEYWORDS.map((keyword) => (
          <RetroButton
            key={keyword}
            type="button"
            variant="neutral"
            className={`h-10 px-4 text-sm ${keywords.includes(keyword) ? '!bg-[#F7ABCF]' : ''}`}
            isActive={keywords.includes(keyword)}
            onClick={() => toggleKeyword(keyword)}
          >
            {keyword}
          </RetroButton>
        ))}
      </div>
    </div>
  );
}
