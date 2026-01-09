import React from 'react';
import splashBg from '@/assets/images/main-background.jpg';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="flex min-h-screen flex-col items-center text-slate-900"
      style={{
        backgroundImage: `url(${splashBg.src})`,
        backgroundRepeat: 'repeat',
        backgroundSize: 'auto 122%',
      }}
    >
      {/* max-w-[480px] to match mobile view constraint typically used in this project */}
      <div className="w-full max-w-[480px] flex-1">{children}</div>
    </div>
  );
}
