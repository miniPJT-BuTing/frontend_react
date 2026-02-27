'use client';

import { useState } from 'react';
import MemberProfileModal from '@/widgets/profile/MemberProfileModal';

// 왕관 아이콘 (이모지로 대체하거나 에셋 사용 가능, 여기선 텍스트/이모지로 처리)
// 실제 프로젝트에선 import CrownIcon from '@/assets/icons/crown.png'; 등을 사용 권장

type Member = {
  id: string;
  nickname: string;
  avatarColor: string;
  isLeader: boolean;
  schoolName: string; // e.g. 동아대
  major: string; // e.g. 시각디자인
};

type Props = {
  members: Member[];
};

export function TeamMembersRow({ members }: Props) {
  const [selectedMemberId, setSelectedMemberId] = useState<number | null>(null);

  return (
    <>
      <section className="px-5 pb-6">
        {/* 가로 스크롤 가능하게 처리 (멤버가 많을 경우 대비) */}
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
          {members.map((member) => (
            <button
              type="button"
              key={member.id}
              onClick={() => {
                const numericId = Number(member.id);
                if (!Number.isFinite(numericId)) return;
                setSelectedMemberId(numericId);
              }}
              className="flex w-[80px] shrink-0 flex-col items-center"
            >
              {/* Avatar Container */}
              <div className="relative mb-2">
                {member.isLeader && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-[18px]">
                    👑
                  </div>
                )}
                <div
                  className="flex h-[70px] w-[70px] items-center justify-center rounded-full border border-black bg-[#FFE1EE] text-[30px]"
                  style={{ backgroundColor: member.avatarColor }}
                >
                  {/* 추후 실제 이미지 <Image ... /> 로 교체 */}
                  🐣
                </div>
              </div>

              {/* Info */}
              <span className="mb-0.5 w-full truncate text-center text-[14px] font-bold text-black">
                {member.nickname}
              </span>
              <span className="text-center text-[11px] font-medium leading-tight text-gray-500">
                {member.schoolName}
                <br />
                {member.major}
              </span>
            </button>
          ))}
        </div>
      </section>

      <MemberProfileModal
        memberId={selectedMemberId}
        isOpen={selectedMemberId !== null}
        onClose={() => setSelectedMemberId(null)}
      />
    </>
  );
}
