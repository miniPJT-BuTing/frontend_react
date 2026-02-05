'use client';

import { X, User, Vote, Megaphone, LogOut } from 'lucide-react';
import { useEffect } from 'react';

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

// Mock Data for Panel
const MEMBERS = [
  { id: 'm1', name: '나', isLeader: false, isMe: true },
  { id: 'm2', name: '디자인요정', isLeader: true, isMe: false },
  { id: 'm3', name: '과제지옥', isLeader: false, isMe: false },
  { id: 'm4', name: '포토샵장인', isLeader: false, isMe: false },
];

const VOTES = [
  { id: 'v1', title: '첫 만남 장소 투표', status: 'ongoing' },
  { id: 'v2', title: '메뉴 선정', status: 'closed' },
];

export default function ChatSidePanel({ isOpen, onClose }: Props) {
  // 패널이 열렸을 때 백그라운드 스크롤 막기
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

  return (
    <>
      {/* Backdrop (Overlay) */}
      {/* isOpen일 때만 보이고, 클릭 시 닫힘 */}
      <div
        className={`fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
        onClick={onClose}
      />

      {/* Side Panel */}
      <div
        className={`fixed top-0 right-0 z-[70] h-full w-[85%] max-w-[320px] bg-white shadow-2xl transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 h-14 border-b border-gray-100">
          <h2 className="text-lg font-bold text-black">채팅방 서랍</h2>
          <button onClick={onClose} className="p-1 -mr-2 text-gray-500 active:text-black">
            <X size={24} />
          </button>
        </div>

        {/* Content (Scrollable) */}
        <div className="flex flex-col h-[calc(100%-56px)] overflow-y-auto pb-6">
          
          {/* Section 1: Members */}
          <div className="px-5 py-6 border-b border-gray-100">
            <div className="flex items-center gap-2 mb-4">
              <User size={18} className="text-black" />
              <h3 className="text-[15px] font-bold text-black">대화상대 ({MEMBERS.length})</h3>
            </div>
            <ul className="space-y-3">
              {MEMBERS.map((member) => (
                <li key={member.id} className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-[#E1F5FF] flex items-center justify-center text-lg border border-gray-100">
                    🐣
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[14px] font-medium text-gray-800">
                      {member.name}
                    </span>
                    {member.isMe && (
                      <span className="text-[10px] font-bold text-gray-400 border border-gray-200 px-1 rounded">나</span>
                    )}
                    {member.isLeader && (
                      <span className="text-[10px] font-bold text-[#FF9BC2] border border-[#FF9BC2] px-1 rounded">방장</span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Section 2: Notice & Votes */}
          <div className="px-5 py-6">
             <div className="flex items-center gap-2 mb-4">
              <Megaphone size={18} className="text-black" />
              <h3 className="text-[15px] font-bold text-black">공지 및 투표</h3>
            </div>
            
            <div className="space-y-3">
               {/* Mock Notices */}
               <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                 <div className="h-8 w-8 rounded-full bg-white flex items-center justify-center shrink-0 border border-gray-200">
                   <Megaphone size={14} className="text-gray-500" />
                 </div>
                 <div className="flex flex-col">
                   <span className="text-[13px] font-bold text-black">욕설 금지 공지</span>
                   <span className="text-[11px] text-gray-400">2026.02.01</span>
                 </div>
               </div>

               {/* Mock Votes */}
               {VOTES.map((vote) => (
                 <div key={vote.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl active:bg-gray-100 transition-colors cursor-pointer">
                    <div className="h-8 w-8 rounded-full bg-white flex items-center justify-center shrink-0 border border-gray-200">
                      <Vote size={14} className="text-[#FF9BC2]" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[13px] font-bold text-black">{vote.title}</span>
                      <span className={`text-[11px] font-bold ${vote.status === 'ongoing' ? 'text-[#FF9BC2]' : 'text-gray-400'}`}>
                        {vote.status === 'ongoing' ? '진행중' : '마감됨'}
                      </span>
                    </div>
                 </div>
               ))}
            </div>
          </div>

          {/* Bottom Action (Footer of Sidebar) */}
          <div className="mt-auto px-5 pt-6">
             <button className="flex items-center gap-2 text-gray-400 hover:text-red-500 transition-colors py-2">
               <LogOut size={18} />
               <span className="text-[14px] font-bold">채팅방 나가기</span>
             </button>
          </div>
        </div>
      </div>
    </>
  );
}
