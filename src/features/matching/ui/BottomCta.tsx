'use client';

import { RetroButton } from '@/shared/ui/button/RetroButton';

export default function BottomCta({ text, onClick }: { text: string; onClick: () => void }) {
  return (
    <div className="fixed bottom-6 left-0 right-0 z-10 px-6">
      <div className="mx-auto w-full max-w-[480px]">
        <RetroButton fullWidth onClick={onClick} className="h-14 text-lg">
          {text}
        </RetroButton>
      </div>
    </div>
  );
}
