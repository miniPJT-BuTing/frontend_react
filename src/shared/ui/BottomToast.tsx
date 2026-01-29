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

  const show = isVisible;

  const iconBg = {
    success: 'bg-[var(--color-success)]',
    error: 'bg-[var(--color-warning)]',
    info: 'bg-[var(--color-background)]',
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
          flex items-center gap-3
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
            flex h-5 w-5 items-center justify-center
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
