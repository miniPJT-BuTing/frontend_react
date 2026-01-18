'use client';

import Image from 'next/image';
import { Share2 } from 'lucide-react';
import ProfileIcon from '@/assets/icons/profile.png'; // Fallback avatar

export interface TeamCardProps {
  id: number;
  title: string;
  description?: string; // Optional now
  schoolName: string;
  averageId: number;
  averageAge: number;
  memberCount: number;
  memberImages?: string[];
  gender: 'MALE' | 'FEMALE';
  actionButton?: React.ReactNode;
}

import Link from 'next/link';

// ...

export default function TeamCard({
  id,
  title,
  schoolName,
  averageId,
  averageAge,
  memberCount,
  memberImages = [],
  gender,
  actionButton,
}: TeamCardProps) {
  return (
    <div className="flex w-full flex-col justify-between rounded-[24px] bg-white shadow-[0_2px_16px_rgba(0,0,0,0.04)] ring-1 ring-gray-100 overflow-hidden active:scale-[0.99] transition-transform duration-200">
      <div className="flex flex-col gap-3 p-5">
        {/* Header: Title & Share */}
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-[18px] font-bold text-gray-900 leading-tight line-clamp-2">
            {title}
          </h3>
          <button className="text-gray-400 hover:text-gray-600">
            <Share2 size={20} />
          </button>
        </div>

        {/* Info Line: N:N | School | AvgID | AvgAge */}
        <div className="flex items-center gap-2 text-[13px] font-medium text-gray-500">
          <span className="text-[#F7ABCF] font-bold">
            {memberCount}:{memberCount}
          </span>
          <span className="h-3 w-[1px] bg-gray-300"></span>
          <span className="truncate max-w-[80px]">{schoolName}</span>
          <span className="h-3 w-[1px] bg-gray-300"></span>
          <span>{averageId}학번</span>
          <span className="h-3 w-[1px] bg-gray-300"></span>
          <span>{averageAge}세</span>
        </div>

        {/* Member Avatars */}
        <div className="flex items-center -space-x-2 pt-1">
          {Array.from({ length: memberCount }).map((_, index) => (
            <div
              key={index}
              className="relative h-10 w-10 overflow-hidden rounded-full border-2 border-white bg-gray-100"
            >
              <Image
                src={memberImages[index] || ProfileIcon}
                alt={`Member ${index + 1}`}
                fill
                className="object-cover"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-auto p-3">
        {actionButton ? (
          actionButton
        ) : (
          <div className="flex items-center gap-2">
            <Link
              href={`/teams/${id}`}
              className="flex-1 rounded-xl bg-gray-100 py-3.5 text-center text-[13px] font-bold text-gray-600 transition-colors hover:bg-gray-200"
            >
              팀 프로필 보기
            </Link>
            <button className="flex-1 rounded-xl bg-[#F7ABCF] py-3.5 text-[13px] font-bold text-white shadow-sm transition-colors hover:bg-[#F281B5]">
              매칭 신청하기
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
