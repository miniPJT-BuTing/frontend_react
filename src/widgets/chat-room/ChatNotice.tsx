'use client';

import { Megaphone } from 'lucide-react';

type Props = {
  content: string;
};

export default function ChatNotice({ content }: Props) {
  return (
    <div className="bg-white/95 px-4 py-3 border-b border-gray-100 shadow-sm flex items-start gap-3 z-40">
      <Megaphone size={20} className="text-[#FF9BC2] shrink-0 mt-0.5" />
      <p className="text-[13px] font-medium text-gray-700 leading-snug line-clamp-2">
        {content}
      </p>
    </div>
  );
}
