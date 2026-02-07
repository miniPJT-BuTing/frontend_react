'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { X } from 'lucide-react';

export default function CreateNoticePage() {
  const router = useRouter();
  const params = useParams();
  const roomId = params.roomId as string;

  const [content, setContent] = useState('');

  const handleCancel = () => {
    router.back();
  };

  const handleSubmit = () => {
    if (!content.trim()) return;

    console.log('Notice Created:', { roomId, content });
    alert('공지사항이 등록되었습니다.');

    router.back();
  };

  return (
    <div className="flex min-h-screen flex-col bg-white">
      {/* Header */}
      <header className="flex h-14 w-full items-center justify-between border-b border-gray-100 px-4">
        <button onClick={handleCancel} className="p-1 -ml-1 text-black">
          <X size={26} />
        </button>

        <h1 className="text-lg font-bold text-black">공지사항 등록</h1>

        <button
          onClick={handleSubmit}
          disabled={!content.trim()}
          className={`text-[15px] font-bold ${content.trim() ? 'text-[#FF9BC2]' : 'text-gray-300'}`}
        >
          완료
        </button>
      </header>

      {/* Content */}
      <div className="flex-1 p-5">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="공지할 내용을 입력해주세요. (최대 300자)"
          maxLength={300}
          className="w-full h-64 resize-none text-[16px] leading-relaxed outline-none placeholder:text-gray-400"
          autoFocus
        />

        <div className="text-right text-xs text-gray-400 font-medium">{content.length} / 300</div>
      </div>
    </div>
  );
}
