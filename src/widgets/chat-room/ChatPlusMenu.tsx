'use client';

import { useRouter, useParams } from 'next/navigation';
import { Megaphone, Vote, Image as ImageIcon, Camera, MapPin, Calendar, FileText, Smile } from 'lucide-react';

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

const MENU_ITEMS = [
  { id: 'notice', label: '공지 등록', icon: Megaphone, color: 'bg-yellow-100 text-yellow-600' },
  { id: 'vote', label: '투표 생성', icon: Vote, color: 'bg-blue-100 text-blue-600' },
  { id: 'album', label: '앨범', icon: ImageIcon, color: 'bg-green-100 text-green-600' },
  { id: 'camera', label: '카메라', icon: Camera, color: 'bg-red-100 text-red-600' },
  { id: 'calendar', label: '일정', icon: Calendar, color: 'bg-purple-100 text-purple-600' },
  { id: 'location', label: '장소 공유', icon: MapPin, color: 'bg-orange-100 text-orange-600' },
  { id: 'file', label: '파일', icon: FileText, color: 'bg-gray-100 text-gray-600' },
  { id: 'emoticon', label: '이모티콘', icon: Smile, color: 'bg-pink-100 text-pink-600' },
];

export default function ChatPlusMenu({ isOpen, onClose }: Props) {
  const router = useRouter();
  const params = useParams();
  const roomId = params.roomId as string;

  const handleClick = (itemId: string, itemLabel: string) => {
    if (itemId === 'notice') {
      router.push(`/chats/${roomId}/notice/new`);
      onClose();
      return;
    }

    if (itemId === 'vote') {
      router.push(`/chats/${roomId}/vote/new`);
      onClose();
      return;
    }

    alert(`${itemLabel} 기능은 준비 중입니다!`);
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-[60] bg-black/40 backdrop-blur-[2px] transition-opacity duration-300 ${
          isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
        onClick={onClose}
      />

      {/* Bottom Sheet Panel */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-[70] mx-auto w-full max-w-[480px] rounded-t-[24px] bg-white pb-8 pt-6 shadow-[0_-4px_20px_rgba(0,0,0,0.1)] transition-transform duration-300 ease-out ${
          isOpen ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        {/* Drag Handle Indicator */}
        <div className="mx-auto mb-6 h-1 w-10 rounded-full bg-gray-300" />

        <div className="grid grid-cols-4 gap-y-6 px-4">
          {MENU_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => handleClick(item.id, item.label)}
              className="flex flex-col items-center gap-2 transition-transform active:scale-95"
            >
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-full text-xl ${item.color}`}
              >
                <item.icon size={24} />
              </div>
              <span className="text-[12px] font-medium text-gray-600">{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
