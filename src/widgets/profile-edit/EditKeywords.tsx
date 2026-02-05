'use client';

import { RetroButton } from '@/shared/ui/button/RetroButton';

// 임시 키워드 목록 (회원가입 로직에서 가져옴)
const KEYWORDS = [
  '활발한', '조용한', '웃긴', '진지한', '긍정적', '현실적', 
  '감성적', '이성적', '계획적', '즉흥적', '집순이', '밖순이',
  '술잘마심', '술찌', '맛집탐방', '운동', '게임', '여행'
];

type Props = {
  value: string[];
  onChange: (val: string[]) => void;
};

export function EditKeywords({ value, onChange }: Props) {
  const toggleKeyword = (keyword: string) => {
    if (value.includes(keyword)) {
      onChange(value.filter((k) => k !== keyword));
    } else {
      if (value.length >= 5) return; // 최대 5개 제한
      onChange([...value, keyword]);
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
        {KEYWORDS.map((keyword) => {
          const isSelected = value.includes(keyword);
          return (
            <button
              key={keyword}
              type="button"
              onClick={() => toggleKeyword(keyword)}
              className={`rounded-full border-2 px-4 py-2 text-sm font-bold transition-all ${
                isSelected
                  ? 'border-black bg-[#FF9BC2] text-black'
                  : 'border-gray-200 bg-white text-gray-400 hover:border-gray-300'
              }`}
            >
              {keyword}
            </button>
          );
        })}
      </div>
    </div>
  );
}
