'use client';

import React from 'react';
import Image from 'next/image';
import { useCreateTeamStore } from '../../model/createTeam.store';
import { Plus, X } from 'lucide-react';
import profileIcon from '@/assets/icons/profile-nav.png';
import starIcon from '@/assets/icons/star.png';

export default function Step3Members() {
  const { memberCount, invitedMembers, setMembers } = useCreateTeamStore();

  const handleMemberCountChange = (count: number) => {
    setMembers({ memberCount: count });
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Member Count */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-1">
          <Image src={profileIcon} alt="profile" width={34} height={34} />
          <label className="text-base font-bold">인원 수</label>
        </div>
        <div className="flex gap-4">
          {[2, 3, 4].map((count) => (
            <button
              key={count}
              onClick={() => handleMemberCountChange(count)}
              className={`flex-1 py-3 rounded-2xl border text-lg font-bold transition-all ${
                memberCount === count
                  ? 'bg-[#F7ABCF] text-white border-[#F7ABCF]'
                  : 'bg-white text-gray-400 border-gray-200'
              }`}
            >
              {count}:{count}
            </button>
          ))}
        </div>
      </div>

      {/* Invite Members */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-1">
          <Image src={starIcon} alt="star" width={34} height={34} />
          <label className="text-base font-bold">팀원 초대</label>
        </div>
        <div className="flex items-center gap-2 mb-2">
          <input
            placeholder="친구 닉네임 검색"
            className="flex-1 h-12 rounded-full border border-gray-200 px-4 text-sm outline-none bg-white focus:border-[#F7ABCF]"
          />
          <button className="h-12 w-12 rounded-full bg-[#F7ABCF] text-white flex items-center justify-center">
            <Plus size={24} />
          </button>
        </div>

        {/* Invited List (Mock) */}
        <div className="flex flex-col gap-2">
          {invitedMembers.length === 0 && (
            <p className="text-sm text-gray-400 text-center py-4">아직 초대된 팀원이 없습니다.</p>
          )}
          {invitedMembers.map((member, idx) => (
            <div
              key={idx}
              className="flex justify-between items-center bg-gray-50 px-4 py-3 rounded-xl"
            >
              <span>{member}</span>
              <button className="text-gray-400">
                <X size={18} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
