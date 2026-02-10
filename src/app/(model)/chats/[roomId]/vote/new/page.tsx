'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { X, Plus, Minus, Clock, CheckSquare, EyeOff } from 'lucide-react';

export default function CreateVotePage() {
  const router = useRouter();
  const params = useParams();
  const roomId = params.roomId as string;

  const [title, setTitle] = useState('');
  const [options, setOptions] = useState(['', '']); // 기본 2개
  const [allowMultiple, setAllowMultiple] = useState(false);
  const [anonymous, setAnonymous] = useState(false);
  const [hasDeadline, setHasDeadline] = useState(false);
  const [deadline, setDeadline] = useState('');

  // 항목 추가
  const addOption = () => {
    if (options.length >= 10) return;
    setOptions([...options, '']);
  };

  // 항목 삭제
  const removeOption = (index: number) => {
    if (options.length <= 2) return;
    const newOptions = options.filter((_, i) => i !== index);
    setOptions(newOptions);
  };

  // 항목 입력 핸들러
  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleSubmit = () => {
    if (!title.trim() || options.some((opt) => !opt.trim())) {
      alert('제목과 항목을 모두 입력해주세요.');
      return;
    }

    if (hasDeadline && !deadline) {
      alert('마감 시간을 설정해주세요.');
      return;
    }

    // TODO: API Call to create vote
    console.log('Vote Created:', { roomId, title, options, allowMultiple, anonymous, hasDeadline, deadline });
    
    alert('투표가 생성되었습니다.');
    router.back();
  };

  return (
    <div className="flex min-h-screen flex-col bg-white">
      {/* Header */}
      <header className="flex h-14 w-full items-center justify-between border-b border-gray-100 px-4">
        <button onClick={() => router.back()} className="p-1 -ml-1 text-black">
          <X size={26} />
        </button>
        <h1 className="text-lg font-bold text-black">투표 생성</h1>
        <button 
          onClick={handleSubmit}
          className="text-[15px] font-bold text-[#FF9BC2]"
        >
          완료
        </button>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-5 pb-10">
        
        {/* Title */}
        <div className="mb-8">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="투표 제목을 입력해주세요"
            className="w-full text-xl font-bold placeholder:text-gray-300 outline-none"
            autoFocus
          />
        </div>

        {/* Options */}
        <div className="space-y-3 mb-8">
          <label className="text-sm font-bold text-gray-500">투표 항목</label>
          {options.map((opt, index) => (
            <div key={index} className="flex items-center gap-2">
              <input
                type="text"
                value={opt}
                onChange={(e) => handleOptionChange(index, e.target.value)}
                placeholder={`항목 ${index + 1}`}
                className="flex-1 h-12 rounded-xl border border-gray-200 px-4 outline-none focus:border-black transition-colors"
              />
              {options.length > 2 && (
                <button onClick={() => removeOption(index)} className="text-gray-400 p-2">
                  <Minus size={20} />
                </button>
              )}
            </div>
          ))}
          <button
            onClick={addOption}
            className="w-full h-12 rounded-xl border border-dashed border-gray-300 flex items-center justify-center gap-2 text-gray-500 font-bold active:bg-gray-50"
          >
            <Plus size={20} />
            항목 추가
          </button>
        </div>

        {/* Settings */}
        <div className="space-y-4">
          <label className="text-sm font-bold text-gray-500">설정</label>
          
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between py-2 cursor-pointer" onClick={() => setHasDeadline(!hasDeadline)}>
              <div className="flex items-center gap-3">
                <Clock size={20} className="text-gray-400" />
                <span className="text-[15px] font-medium">마감시간 설정</span>
              </div>
              <div className={`w-11 h-6 rounded-full relative transition-colors ${hasDeadline ? 'bg-[#FF9BC2]' : 'bg-gray-200'}`}>
                <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${hasDeadline ? 'left-6' : 'left-1'}`} />
              </div>
            </div>
            
            {hasDeadline && (
              <input
                type="datetime-local"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full h-12 rounded-xl border border-gray-200 px-4 text-sm outline-none focus:border-black transition-colors bg-gray-50"
              />
            )}
          </div>

          <div className="flex items-center justify-between py-2 cursor-pointer" onClick={() => setAllowMultiple(!allowMultiple)}>
            <div className="flex items-center gap-3">
              <CheckSquare size={20} className="text-gray-400" />
              <span className="text-[15px] font-medium">복수 선택 허용</span>
            </div>
             <div className={`w-11 h-6 rounded-full relative transition-colors ${allowMultiple ? 'bg-[#FF9BC2]' : 'bg-gray-200'}`}>
              <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${allowMultiple ? 'left-6' : 'left-1'}`} />
            </div>
          </div>

          <div className="flex items-center justify-between py-2 cursor-pointer" onClick={() => setAnonymous(!anonymous)}>
            <div className="flex items-center gap-3">
              <EyeOff size={20} className="text-gray-400" />
              <span className="text-[15px] font-medium">익명 투표</span>
            </div>
             <div className={`w-11 h-6 rounded-full relative transition-colors ${anonymous ? 'bg-[#FF9BC2]' : 'bg-gray-200'}`}>
              <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${anonymous ? 'left-6' : 'left-1'}`} />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
