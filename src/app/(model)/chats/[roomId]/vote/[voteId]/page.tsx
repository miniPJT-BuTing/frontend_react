'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { X, Clock, User } from 'lucide-react';
import { deleteChatVote, getChatVote, submitChatVote, type VoteInfoResponse } from '@/features/chat/api/chat.api';
import { getMyProfile } from '@/features/member/api/member.api';

const toNumber = (value: string): number | null => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

export default function VoteDetailPage() {
  const router = useRouter();
  const params = useParams();
  const roomId = params.roomId as string;
  const voteId = params.voteId as string;

  const [vote, setVote] = useState<VoteInfoResponse | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<number[]>([]);
  const [myMemberId, setMyMemberId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVote = async () => {
      setLoading(true);
      setError(null);
      try {
        const [voteResult, profileResult] = await Promise.allSettled([getChatVote(roomId, voteId), getMyProfile()]);

        if (voteResult.status !== 'fulfilled') {
          throw new Error('vote fetch failed');
        }

        const response = voteResult.value;
        setVote(response);
        setSelectedOptions(response.mySelections);

        if (profileResult.status === 'fulfilled') {
          setMyMemberId(profileResult.value.memberId);
        }
      } catch {
        setError('투표 정보를 불러오지 못했어요.');
      } finally {
        setLoading(false);
      }
    };

    fetchVote();
  }, [roomId, voteId]);

  const totalVotes = useMemo(() => {
    if (!vote) return 0;
    return vote.options.reduce((sum, option) => sum + option.count, 0);
  }, [vote]);

  const canDeleteVote = !!vote && myMemberId !== null && vote.creator === myMemberId;

  const handleSelectOption = (optionIdText: string) => {
    if (!vote || vote.status !== 'OPEN') return;
    const optionId = toNumber(optionIdText);
    if (optionId === null) return;

    if (!vote.multiple) {
      setSelectedOptions([optionId]);
      return;
    }

    setSelectedOptions((prev) =>
      prev.includes(optionId) ? prev.filter((selected) => selected !== optionId) : [...prev, optionId]
    );
  };

  const handleSubmit = async () => {
    if (!vote || selectedOptions.length === 0) return;

    setSubmitting(true);
    setError(null);
    try {
      const updatedVote = await submitChatVote(roomId, vote.voteId, selectedOptions);
      setVote(updatedVote);
      setSelectedOptions(updatedVote.mySelections);
    } catch {
      setError('투표 제출에 실패했습니다. 다시 시도해 주세요.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!vote || !canDeleteVote) return;
    if (!window.confirm('이 투표를 삭제하시겠어요?')) return;

    setDeleting(true);
    setError(null);
    try {
      await deleteChatVote(roomId, vote.voteId);
      router.replace(`/chats/${roomId}`);
    } catch {
      setError('투표 삭제에 실패했습니다. 다시 시도해 주세요.');
      setDeleting(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <header className="flex h-14 w-full items-center justify-between border-b border-gray-100 px-4">
        <button onClick={() => router.back()} className="p-1 -ml-1 text-black">
          <X size={26} />
        </button>
        <h1 className="text-lg font-bold text-black">투표</h1>
        {canDeleteVote ? (
          <button
            onClick={handleDelete}
            disabled={deleting || submitting || loading}
            className={`text-sm font-bold ${deleting ? 'text-gray-300' : 'text-red-500'}`}
          >
            삭제
          </button>
        ) : (
          <div className="w-8" />
        )}
      </header>

      <div className="flex-1 overflow-y-auto p-5 pb-24">
        {loading && <p className="text-sm text-gray-500">투표 정보를 불러오는 중...</p>}
        {!loading && error && <p className="text-sm text-red-500">{error}</p>}

        {!loading && !error && vote && (
          <>
            <div className="mb-8">
              <h2 className="text-xl font-bold text-black mb-2">{vote.title}</h2>
              <div className="flex items-center gap-3 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <User size={12} /> {vote.nickname}
                </span>
                <span className="flex items-center gap-1">
                  <Clock size={12} /> {vote.status === 'OPEN' ? '진행 중' : '마감됨'}
                </span>
              </div>

              {vote.description && <p className="mt-3 text-sm text-gray-600">{vote.description}</p>}

              <div className="mt-2 flex gap-2">
                {vote.multiple && (
                  <span className="text-[10px] bg-gray-100 px-1.5 py-0.5 rounded text-gray-600">복수선택</span>
                )}
                {vote.anonymous && (
                  <span className="text-[10px] bg-gray-100 px-1.5 py-0.5 rounded text-gray-600">익명투표</span>
                )}
              </div>
            </div>

            <div className="space-y-3">
              {vote.options.map((option) => {
                const optionId = toNumber(option.optionId);
                const isSelected = optionId !== null && selectedOptions.includes(optionId);
                const percent = totalVotes > 0 ? (option.count / totalVotes) * 100 : 0;

                return (
                  <div
                    key={option.optionId}
                    onClick={() => handleSelectOption(option.optionId)}
                    className={`relative overflow-hidden rounded-xl border-2 p-4 transition-all ${
                      vote.status === 'OPEN' ? 'cursor-pointer' : 'cursor-default'
                    } ${isSelected ? 'border-black bg-white' : 'border-gray-100 bg-white'}`}
                  >
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
                        <div
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                            isSelected ? 'border-black bg-[#FF9BC2]' : 'border-gray-300 bg-white'
                          }`}
                        >
                          {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 text-center text-xs text-gray-400">{totalVotes}명이 참여함</div>
          </>
        )}
      </div>

      <div className="fixed bottom-0 left-0 w-full p-5 bg-white border-t border-gray-100">
        <button
          onClick={handleSubmit}
          disabled={loading || !vote || vote.status !== 'OPEN' || selectedOptions.length === 0 || submitting || deleting}
          className={`w-full h-14 rounded-full font-bold text-lg transition-all ${
            !loading && vote && vote.status === 'OPEN' && selectedOptions.length > 0 && !submitting && !deleting
              ? 'bg-[#FF9BC2] text-white active:scale-95'
              : 'bg-gray-200 text-gray-400'
          }`}
        >
          {vote?.status === 'OPEN' ? '투표하기' : '마감된 투표입니다'}
        </button>
      </div>
    </div>
  );
}
