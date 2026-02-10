'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { X, Clock, User } from 'lucide-react';

// Mock Vote Data
const MOCK_VOTE = {
  id: 'v1',
  title: '첫 만남 장소 투표 🍻',
  authorName: '디자인요정',
  isMultiple: false,
  isAnonymous: false,
  deadline: '2026.02.10 18:00',
  options: [
    { id: 'opt1', text: '강남역 10번 출구', count: 2 },
    { id: 'opt2', text: '홍대입구역 9번 출구', count: 1 },
    { id: 'opt3', text: '건대입구역 2번 출구', count: 0 },
  ],
  totalVotes: 3,
};

export default function VoteDetailPage() {
  const router = useRouter();
  const params = useParams();
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const handleSubmit = () => {
    if (!selectedOption) return;
    alert(`'${MOCK_VOTE.options.find(o => o.id === selectedOption)?.text}'에 투표했습니다!`);
    router.back();
  };

  return (
    <div className="flex min-h-screen flex-col bg-white">
      {/* Header */}
      <header className="flex h-14 w-full items-center justify-between border-b border-gray-100 px-4">
        <button onClick={() => router.back()} className="p-1 -ml-1 text-black">
          <X size={26} />
        </button>
        <h1 className="text-lg font-bold text-black">투표</h1>
        <div className="w-8" /> {/* Spacer */}
      </header>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-5 pb-24">
        
        {/* Vote Info */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-black mb-2">{MOCK_VOTE.title}</h2>
          <div className="flex items-center gap-3 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <User size={12} /> {MOCK_VOTE.authorName}
            </span>
            <span className="flex items-center gap-1">
              <Clock size={12} /> {MOCK_VOTE.deadline} 마감
            </span>
          </div>
          <div className="mt-2 flex gap-2">
             {MOCK_VOTE.isMultiple && <span className="text-[10px] bg-gray-100 px-1.5 py-0.5 rounded text-gray-600">복수선택</span>}
             {MOCK_VOTE.isAnonymous && <span className="text-[10px] bg-gray-100 px-1.5 py-0.5 rounded text-gray-600">익명투표</span>}
          </div>
        </div>

        {/* Options */}
        <div className="space-y-3">
          {MOCK_VOTE.options.map((option) => {
            const isSelected = selectedOption === option.id;
            const percent = MOCK_VOTE.totalVotes > 0 ? (option.count / MOCK_VOTE.totalVotes) * 100 : 0;
            
            return (
              <div 
                key={option.id}
                onClick={() => setSelectedOption(option.id)}
                className={`relative overflow-hidden rounded-xl border-2 p-4 cursor-pointer transition-all ${isSelected ? 'border-black bg-white' : 'border-gray-100 bg-white'}`}
              >
                {/* Progress Bar Background */}
                <div 
                  className="absolute left-0 top-0 bottom-0 bg-[#FFF0F5] z-0 transition-all duration-500"
                  style={{ width: `${percent}%` }}
                />

                <div className="relative z-10 flex items-center justify-between">
                  <span className={`font-bold ${isSelected ? 'text-black' : 'text-gray-700'}`}>
                    {option.text}
                  </span>
                  
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-gray-400">{option.count}명</span>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${isSelected ? 'border-black bg-[#FF9BC2]' : 'border-gray-300 bg-white'}`}>
                      {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 text-center text-xs text-gray-400">
          {MOCK_VOTE.totalVotes}명이 참여함
        </div>

      </div>

      {/* Bottom Button */}
      <div className="fixed bottom-0 left-0 w-full p-5 bg-white border-t border-gray-100">
        <button
          onClick={handleSubmit}
          disabled={!selectedOption}
          className={`w-full h-14 rounded-full font-bold text-lg transition-all ${selectedOption ? 'bg-[#FF9BC2] text-white active:scale-95' : 'bg-gray-200 text-gray-400'}`}
        >
          투표하기
        </button>
      </div>
    </div>
  );
}
