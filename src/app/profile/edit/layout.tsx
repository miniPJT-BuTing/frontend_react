import type { ReactNode } from 'react';

export default function ProfileEditLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex min-h-screen flex-col items-center text-slate-900">
      <div
        className="
          pointer-events-none absolute inset-x-0 top-0
          h-1/2
          bg-gradient-to-b
          from-[var(--color-skyblue)]
          to-transparent
        "
      />

      <div
        className="
          pointer-events-none absolute inset-x-0 bottom-0
          h-1/4
          bg-gradient-to-t
          from-[var(--color-skyblue)]
          to-transparent
        "
      />

      <div className="relative h-full w-full max-w-[480px] overflow-y-auto overflow-x-hidden scrollbar-hide">
        {children}
      </div>
    </div>
  );
}
