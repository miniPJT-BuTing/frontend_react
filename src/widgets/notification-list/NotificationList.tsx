'use client';

import { Bell, Heart, MessageCircle } from 'lucide-react';

interface Notification {
  id: number;
  type: 'MATCH' | 'MESSAGE' | 'SYSTEM';
  title: string;
  message: string;
  time: string;
  isRead: boolean;
}

const DUMMY_NOTIFICATIONS: Notification[] = [
  {
    id: 1,
    type: 'MATCH',
    title: '매칭 성공!',
    message: "'맛집 탐방' 팀과 매칭되었습니다. 지금 바로 확인해보세요!",
    time: '방금 전',
    isRead: false,
  },
  {
    id: 2,
    type: 'MESSAGE',
    title: '새로운 메시지',
    message: '새로운 메시지가 도착했습니다.',
    time: '10분 전',
    isRead: false,
  },
  {
    id: 3,
    type: 'SYSTEM',
    title: '회원가입 환영',
    message: '부팅에 오신 것을 환영합니다! 프로필을 완성해보세요.',
    time: '1일 전',
    isRead: true,
  },
];

export default function NotificationList() {
  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'MATCH':
        return <Heart size={20} className="text-[#F7ABCF]" fill="currentColor" />;
      case 'MESSAGE':
        return <MessageCircle size={20} className="text-[#88D4AF]" />;
      case 'SYSTEM':
        return <Bell size={20} className="text-[#FBE264]" />;
    }
  };

  return (
    <div className="flex flex-col">
      {DUMMY_NOTIFICATIONS.map((noti) => (
        <div
          key={noti.id}
          className={`flex gap-4 border-b border-gray-50 p-5 transition-colors active:bg-gray-50 ${
            !noti.isRead ? 'bg-[#FFF0F6]/30' : 'bg-white'
          }`}
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white shadow-sm border border-gray-100">
            {getIcon(noti.type)}
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-sm font-bold text-gray-900">{noti.title}</h3>
              <span className="text-[10px] text-gray-400">{noti.time}</span>
            </div>
            <p className="text-xs text-gray-600 leading-relaxed line-clamp-2">
              {noti.message}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
