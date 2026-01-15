'use client';

import { useState } from 'react';
import { X, RefreshCcw } from 'lucide-react';
import DualRangeSlider from '@/shared/ui/DualRangeSlider';

interface MatchingFilterProps {
  onClose: () => void;
  onApply: (filters: FilterState) => void;
}

export interface FilterState {
  keywords: string[];
  ageRange: [number, number];
  studentIdRange: [number, number];
}

const KEYWORDS = [
  '조용한', '활발한', '술고래', '알쓰', 
  '흡연', '비흡연', '게임', '운동', 
  '여행', '맛집탐방', 'E성향', 'I성향'
];

export default function MatchingFilter({ onClose, onApply }: MatchingFilterProps) {
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([]);
  const [ageRange, setAgeRange] = useState<[number, number]>([20, 28]);
  const [studentIdRange, setStudentIdRange] = useState<[number, number]>([19, 24]);

  const toggleKeyword = (keyword: string) => {
    if (selectedKeywords.includes(keyword)) {
      setSelectedKeywords(prev => prev.filter(k => k !== keyword));
    } else {
      setSelectedKeywords(prev => [...prev, keyword]);
    }
  };

  const handleReset = () => {
    setSelectedKeywords([]);
    setAgeRange([20, 28]);
    setStudentIdRange([19, 24]);
  };

  const handleApply = () => {
    onApply({
      keywords: selectedKeywords,
      ageRange,
      studentIdRange
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-[480px] rounded-t-[24px] bg-white p-6 pb-10 shadow-xl animate-in slide-in-from-bottom duration-300">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">필터 설정</h2>
          <div className="flex items-center gap-3">
            <button 
              onClick={handleReset}
              className="flex items-center gap-1 text-xs font-medium text-gray-400 hover:text-gray-600"
            >
              <RefreshCcw size={12} />
              초기화
            </button>
            <button onClick={onClose} className="p-1">
              <X size={24} className="text-gray-900" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-8">
          {/* Keywords */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-gray-900">선호하는 키워드</h3>
            <div className="flex flex-wrap gap-2">
              {KEYWORDS.map((keyword) => (
                <button
                  key={keyword}
                  onClick={() => toggleKeyword(keyword)}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                    selectedKeywords.includes(keyword)
                      ? 'bg-[#FF4F78] text-white border border-[#FF4F78]'
                      : 'bg-white text-gray-500 border border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  {keyword}
                </button>
              ))}
            </div>
          </div>

          {/* Age Slider */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-gray-900">나이 (만)</h3>
            <div className="px-1">
              <DualRangeSlider
                min={20}
                max={35}
                initialMin={ageRange[0]}
                initialMax={ageRange[1]}
                unit="세"
                onChange={setAgeRange}
              />
            </div>
          </div>

          {/* Student ID Slider */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-gray-900">학번</h3>
            <div className="px-1">
              <DualRangeSlider
                min={15}
                max={25}
                initialMin={studentIdRange[0]}
                initialMax={studentIdRange[1]}
                unit="학번"
                onChange={setStudentIdRange}
              />
            </div>
          </div>
        </div>

        {/* Apply Button */}
        <button
          onClick={handleApply}
          className="mt-10 w-full rounded-xl bg-[#FF4F78] py-4 text-base font-bold text-white shadow-lg shadow-[#FF4F78]/20 active:scale-[0.98] transition-transform"
        >
          필터 적용하기
        </button>
      </div>
    </div>
  );
}
