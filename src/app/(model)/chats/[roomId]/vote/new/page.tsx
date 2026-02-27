'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { X, Plus, Minus, Clock, CheckSquare, EyeOff } from 'lucide-react';
import { createChatVote } from '@/features/chat/api/chat.api';

const toDateTimeLocalWithSeconds = (value: string): string => {
  if (!value) return value;
  return value.length === 16 ? `${value}:00` : value;
};

const makeDefaultDeadline = () => {
  const nextDay = new Date(Date.now() + 24 * 60 * 60 * 1000);
  const year = nextDay.getFullYear();
  const month = String(nextDay.getMonth() + 1).padStart(2, '0');
  const day = String(nextDay.getDate()).padStart(2, '0');
  const hours = String(nextDay.getHours()).padStart(2, '0');
  const minutes = String(nextDay.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day}T${hours}:${minutes}:00`;
};

export default function CreateVotePage() {
  const router = useRouter();
  const params = useParams();
  const roomId = params.roomId as string;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [options, setOptions] = useState(['', '']);
  const [allowMultiple, setAllowMultiple] = useState(false);
  const [anonymous, setAnonymous] = useState(false);
  const [hasDeadline, setHasDeadline] = useState(false);
  const [deadline, setDeadline] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addOption = () => {
    if (options.length >= 10) return;
    setOptions((prev) => [...prev, '']);
  };

  const removeOption = (index: number) => {
    if (options.length <= 2) return;
    setOptions((prev) => prev.filter((_, i) => i !== index));
  };

  const handleOptionChange = (index: number, value: string) => {
    setOptions((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  };

  const handleSubmit = async () => {
    const trimmedTitle = title.trim();
    const trimmedOptions = options.map((option) => option.trim());
    const hasInvalidOption = trimmedOptions.some((option) => option.length === 0);

    if (!trimmedTitle || hasInvalidOption) {
      setError('제목과 항목을 모두 입력해주세요.');
      return;
    }

    if (hasDeadline && !deadline) {
      setError('마감 시간을 설정해주세요.');
      return;
    }

    const deadLine = hasDeadline ? toDateTimeLocalWithSeconds(deadline) : makeDefaultDeadline();

    setSubmitting(true);
    setError(null);
    try {
      const created = await createChatVote(roomId, {
        title: trimmedTitle,
        description: description.trim() || trimmedTitle,
        options: trimmedOptions.map((text, index) => ({ text, order: index + 1 })),
        isMultiple: allowMultiple,
        isAnonymous: anonymous,
        deadLine,
      });
      router.replace(`/chats/${roomId}/vote/${created.voteId}`);
    } catch {
      setError('투표 생성에 실패했습니다. 입력값을 확인하고 다시 시도해 주세요.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <header className="flex h-14 w-full items-center justify-between border-b border-gray-100 px-4">
        <button onClick={() => router.back()} className="p-1 -ml-1 text-black">
          <X size={26} />
        </button>
        <h1 className="text-lg font-bold text-black">투표 생성</h1>
        <button
          onClick={handleSubmit}
          disabled={submitting}
          className={`text-[15px] font-bold ${submitting ? 'text-gray-300' : 'text-[#FF9BC2]'}`}
        >
          완료
        </button>
      </header>

      <div className="flex-1 overflow-y-auto p-5 pb-10">
        <div className="mb-6">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="투표 제목을 입력해주세요"
            className="w-full text-xl font-bold placeholder:text-gray-300 outline-none"
            autoFocus
          />
        </div>

        <div className="mb-8">
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="투표 설명을 입력해주세요 (선택)"
            className="min-h-20 w-full resize-none rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-black transition-colors"
            maxLength={300}
          />
        </div>

        <div className="space-y-3 mb-8">
          <label className="text-sm font-bold text-gray-500">투표 항목</label>
          {options.map((option, index) => (
            <div key={index} className="flex items-center gap-2">
              <input
                type="text"
                value={option}
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

        <div className="space-y-4">
          <label className="text-sm font-bold text-gray-500">설정</label>

          <div className="flex flex-col gap-2">
            <div
              className="flex items-center justify-between py-2 cursor-pointer"
              onClick={() => setHasDeadline((prev) => !prev)}
            >
              <div className="flex items-center gap-3">
                <Clock size={20} className="text-gray-400" />
                <span className="text-[15px] font-medium">마감시간 설정</span>
              </div>
              <div
                className={`w-11 h-6 rounded-full relative transition-colors ${
                  hasDeadline ? 'bg-[#FF9BC2]' : 'bg-gray-200'
                }`}
              >
                <div
                  className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${
                    hasDeadline ? 'left-6' : 'left-1'
                  }`}
                />
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

          <div
            className="flex items-center justify-between py-2 cursor-pointer"
            onClick={() => setAllowMultiple((prev) => !prev)}
          >
            <div className="flex items-center gap-3">
              <CheckSquare size={20} className="text-gray-400" />
              <span className="text-[15px] font-medium">복수 선택 허용</span>
            </div>
            <div
              className={`w-11 h-6 rounded-full relative transition-colors ${
                allowMultiple ? 'bg-[#FF9BC2]' : 'bg-gray-200'
              }`}
            >
              <div
                className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${
                  allowMultiple ? 'left-6' : 'left-1'
                }`}
              />
            </div>
          </div>

          <div
            className="flex items-center justify-between py-2 cursor-pointer"
            onClick={() => setAnonymous((prev) => !prev)}
          >
            <div className="flex items-center gap-3">
              <EyeOff size={20} className="text-gray-400" />
              <span className="text-[15px] font-medium">익명 투표</span>
            </div>
            <div
              className={`w-11 h-6 rounded-full relative transition-colors ${
                anonymous ? 'bg-[#FF9BC2]' : 'bg-gray-200'
              }`}
            >
              <div
                className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${
                  anonymous ? 'left-6' : 'left-1'
                }`}
              />
            </div>
          </div>
        </div>

        {error && <p className="mt-6 text-sm text-red-500">{error}</p>}
      </div>
    </div>
  );
}
