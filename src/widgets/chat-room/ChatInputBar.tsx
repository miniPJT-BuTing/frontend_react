'use client';

import { Plus, Send } from 'lucide-react';
import { useState } from 'react';

type Props = {
  onSend: (text: string) => void;
  onPlusClick: () => void;
};

export default function ChatInputBar({ onSend, onPlusClick }: Props) {
  const [text, setText] = useState('');

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!text.trim()) return;
    onSend(text);
    setText('');
  };

  return (
    <div className="fixed bottom-0 left-0 w-full border-t border-gray-100 bg-white px-4 py-3 pb-[calc(12px+env(safe-area-inset-bottom))]">
      <div className="mx-auto flex max-w-[480px] items-center gap-3">
        <button
          type="button"
          onClick={onPlusClick}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition-colors hover:bg-gray-200 active:scale-95"
        >
          <Plus size={24} />
        </button>

        <form onSubmit={handleSubmit} className="flex flex-1 items-center gap-2">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="메시지를 입력하세요"
            className="flex-1 rounded-full border border-gray-200 bg-gray-50 px-4 py-2.5 text-[15px] outline-none transition-all focus:border-[#FF9BC2] focus:bg-white"
          />
          <button
            type="submit"
            disabled={!text.trim()}
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-all ${
              text.trim()
                ? 'bg-[#FF9BC2] text-white active:scale-95'
                : 'bg-gray-200 text-gray-400'
            }`}
          >
            <Send size={18} className="ml-0.5" />
          </button>
        </form>
      </div>
    </div>
  );
}
