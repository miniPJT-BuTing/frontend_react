'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { X, RefreshCcw } from 'lucide-react';
import DualRangeSlider from '@/shared/ui/DualRangeSlider';

const KEYWORDS = [
  '조용한', '활발한', '술고래', '알쓰', 
  '흡연', '비흡연', '게임', '운동', 
  '여행', '맛집탐방', 'E성향', 'I성향'
];

function FilterPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Initial State from URL
  const initialKeywords = searchParams.get('keywords')?.split(',') || [];
  const initialMinAge = Number(searchParams.get('minAge')) || 20;
  const initialMaxAge = Number(searchParams.get('maxAge')) || 28;
  const initialMinId = Number(searchParams.get('minId')) || 19;
  const initialMaxId = Number(searchParams.get('maxId')) || 24;

  const [selectedKeywords, setSelectedKeywords] = useState<string[]>(initialKeywords);
  const [ageRange, setAgeRange] = useState<[number, number]>([initialMinAge, initialMaxAge]);
  const [studentIdRange, setStudentIdRange] = useState<[number, number]>([initialMinId, initialMaxId]);

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
    const params = new URLSearchParams();
    if (selectedKeywords.length > 0) params.set('keywords', selectedKeywords.join(','));
    params.set('minAge', ageRange[0].toString());
    params.set('maxAge', ageRange[1].toString());
    params.set('minId', studentIdRange[0].toString());
    params.set('maxId', studentIdRange[1].toString());

    router.push(`/matching?${params.toString()}`);
  };

  return (
    <div className="flex h-full flex-col bg-white">
      {/* Header */}
      <header className="flex h-[60px] items-center justify-between border-b border-gray-100 px-5">
        <h1 className="text-lg font-bold text-gray-900">필터</h1>
        <div className="flex items-center gap-4">
          <button 
            onClick={handleReset}
            className="flex items-center gap-1 text-xs font-medium text-gray-400 hover:text-gray-600"
          >
            <RefreshCcw size={14} />
            초기화
          </button>
          <button onClick={() => router.back()} className="p-1">
            <X size={24} className="text-gray-900" />
          </button>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-5 pb-24">
        <div className="space-y-10">
          {/* Keywords */}
          <div className="space-y-4">
            <h3 className="text-base font-bold text-gray-900">선호하는 키워드</h3>
            <div className="flex flex-wrap gap-2">
              {KEYWORDS.map((keyword) => (
                <button
                  key={keyword}
                  onClick={() => toggleKeyword(keyword)}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                    selectedKeywords.includes(keyword)
                      ? 'bg-[#F7ABCF] text-white border border-[#F7ABCF]'
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
            <h3 className="text-base font-bold text-gray-900">나이 (만)</h3>
            <div className="px-1 pt-2">
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
            <h3 className="text-base font-bold text-gray-900">학번</h3>
            <div className="px-1 pt-2">
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
      </div>

      {/* Bottom Apply Button */}
      <div className="fixed bottom-0 left-1/2 z-50 w-full max-w-[480px] -translate-x-1/2 bg-white p-5 pb-[calc(20px+env(safe-area-inset-bottom))] shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
        <button
          onClick={handleApply}
          className="w-full rounded-xl bg-[#F7ABCF] py-4 text-base font-bold text-white shadow-lg shadow-[#F7ABCF]/20 active:scale-[0.98] transition-transform"
        >
          필터 적용하기
        </button>
      </div>
    </div>
  );
}

export default function FilterPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <FilterPageContent />
    </Suspense>
  );
}
