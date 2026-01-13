import React, { useEffect } from 'react';

interface BottomToastProps {
  message: string;
  isVisible: boolean;
  onClose: () => void;
  duration?: number;
  type?: 'success' | 'error' | 'info';
}

export const BottomToast = ({
  message,
  isVisible,
  onClose,
  duration = 2200,
  type = 'info',
}: BottomToastProps) => {
  useEffect(() => {
    if (!isVisible) return;
    const t = setTimeout(onClose, duration);
    return () => clearTimeout(t);
  }, [isVisible, duration, onClose]);

  // 항상 렌더링해서 exit 애니메이션 가능
  const show = isVisible;

  const iconBg = {
    success: 'bg-[#BFEBD6]',
    error: 'bg-[#F7ABCF]',
    info: 'bg-[#CFE9FF]',
  }[type];

  const iconText = {
    success: '✓',
    error: '!',
    info: 'i',
  }[type];

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-[7rem] z-50 flex justify-center px-4">
      <div
        className={`
          flex items-center gap-2
          rounded-full
          bg-black/70
          px-4 py-2
          text-white
          backdrop-blur
          transition-all duration-300 ease-out
          ${show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}
        `}
        role="status"
        aria-live="polite"
      >
        <div
          className={`
            flex h-6 w-6 items-center justify-center
            rounded-full
            ${iconBg}
            text-[12px] font-bold text-black
          `}
          aria-hidden
        >
          {iconText}
        </div>

        <span className="text-sm font-medium leading-none">{message}</span>
      </div>
    </div>
  );
};
