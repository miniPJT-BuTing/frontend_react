import type { ReactNode } from 'react';

export default function TeamsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col items-center bg-gray-50">
      <div className="mx-auto w-full max-w-[480px] flex-1 bg-white min-h-screen relative shadow-lg">
        {children}
      </div>
    </div>
  );
}
