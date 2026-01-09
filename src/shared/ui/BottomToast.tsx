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
  duration = 3000,
  type = 'info',
}: BottomToastProps) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  if (!isVisible) return null;

  const bgColors = {
    success: 'bg-[#88D4AF]',
    error: 'bg-[#EB6344]',
    info: 'bg-white',
  };

  return (
    <div className="fixed bottom-24 left-6 right-6 z-50 animate-fade-in-up">
      <div className={`${bgColors[type]} rounded-xl border-2 border-black p-4 shadow-[4px_4px_0_0_rgba(0,0,0,1)] flex items-center justify-center text-center`}>
        <span className="font-bold text-lg">{message}</span>
      </div>
    </div>
  );
};
