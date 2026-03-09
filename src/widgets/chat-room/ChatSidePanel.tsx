'use client';

import { X, User, Vote, Megaphone, LogOut } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import MemberProfileModal from '@/widgets/profile/MemberProfileModal';

export type ChatDrawerMember = {
  memberId: number;
  nickname: string;
  isLeader?: boolean;
  isMe: boolean;
};

export type ChatDrawerVote = {
  voteId: string;
  title: string;
  status: string;
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
  members: ChatDrawerMember[];
  votes: ChatDrawerVote[];
};

export default function ChatSidePanel({ isOpen, onClose, members, votes }: Props) {
  const router = useRouter();
  const params = useParams();
  const roomId = params.roomId as string;
  const [selectedMemberId, setSelectedMemberId] = useState<number | null>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleVoteClick = (voteId: string) => {
    router.push(`/chats/${roomId}/vote/${voteId}`);
    onClose();
  };

  return (
    <>
      <div
        className={`fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
        onClick={onClose}
      />

      <div
        className={`fixed top-0 right-0 z-[70] h-full w-[85%] max-w-[320px] bg-white shadow-2xl transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between px-5 h-14 border-b border-gray-100">
          <h2 className="text-lg font-bold text-black">채팅방 서랍</h2>
          <button onClick={onClose} className="p-1 -mr-2 text-gray-500 active:text-black">
            <X size={24} />
          </button>
        </div>

        <div className="flex flex-col h-[calc(100%-56px)] overflow-y-auto pb-6">
          <div className="px-5 py-6 border-b border-gray-100">
            <div className="flex items-center gap-2 mb-4">
              <User size={18} className="text-black" />
              <h3 className="text-[15px] font-bold text-black">대화상대 ({members.length})</h3>
            </div>

            {members.length === 0 ? (
              <p className="text-xs text-gray-400">참여 멤버 정보를 불러오는 중입니다.</p>
            ) : (
              <ul className="space-y-3">
                {members.map((member) => (
                  <li key={member.memberId} className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-[#E1F5FF] flex items-center justify-center text-lg border border-gray-100">
                      🐣
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => setSelectedMemberId(member.memberId)}
                        className="text-[14px] font-medium text-gray-800 underline-offset-2 hover:underline"
                      >
                        {member.nickname}
                      </button>
                      {member.isMe && (
                        <span className="text-[10px] font-bold text-gray-400 border border-gray-200 px-1 rounded">
                          나
                        </span>
                      )}
                      {member.isLeader && (
                        <span className="text-[10px] font-bold text-[#FF9BC2] border border-[#FF9BC2] px-1 rounded">
                          방장
                        </span>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="px-5 py-6">
            <div className="flex items-center gap-2 mb-4">
              <Megaphone size={18} className="text-black" />
              <h3 className="text-[15px] font-bold text-black">공지 및 투표</h3>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => {
                  router.push(`/chats/${roomId}/notice/new`);
                  onClose();
                }}
                className="w-full flex items-center gap-3 p-3 bg-gray-50 rounded-xl active:bg-gray-100 transition-colors"
              >
                <div className="h-8 w-8 rounded-full bg-white flex items-center justify-center shrink-0 border border-gray-200">
                  <Megaphone size={14} className="text-gray-500" />
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-[13px] font-bold text-black">공지 등록/수정</span>
                  <span className="text-[11px] text-gray-400">현재 공지를 업데이트합니다.</span>
                </div>
              </button>

              {votes.length === 0 && (
                <div className="rounded-xl border border-dashed border-gray-200 p-3 text-[12px] text-gray-400">
                  아직 생성된 투표가 없습니다.
                </div>
              )}

              {votes.map((vote) => (
                <button
                  key={vote.voteId}
                  onClick={() => handleVoteClick(vote.voteId)}
                  className="w-full flex items-center gap-3 p-3 bg-gray-50 rounded-xl active:bg-gray-100 transition-colors"
                >
                  <div className="h-8 w-8 rounded-full bg-white flex items-center justify-center shrink-0 border border-gray-200">
                    <Vote size={14} className="text-[#FF9BC2]" />
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-[13px] font-bold text-black">{vote.title}</span>
                    <span
                      className={`text-[11px] font-bold ${
                        vote.status === 'OPEN' ? 'text-[#FF9BC2]' : 'text-gray-400'
                      }`}
                    >
                      {vote.status === 'OPEN' ? '진행중' : '마감됨'}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="mt-auto px-5 pt-6">
            <button className="flex items-center gap-2 text-gray-400 py-2">
              <LogOut size={18} />
              <span className="text-[14px] font-bold">채팅방 나가기(준비 중)</span>
            </button>
          </div>
        </div>
      </div>

      <MemberProfileModal
        memberId={selectedMemberId}
        isOpen={selectedMemberId !== null}
        onClose={() => setSelectedMemberId(null)}
      />
    </>
  );
}
