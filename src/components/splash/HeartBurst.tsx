'use client';

import { useEffect } from 'react';
import { Heart } from 'lucide-react';

type Props = {
  x: number;
  y: number;
  onDone: () => void;
};

export default function HeartBurst({ x, y, onDone }: Props) {
  useEffect(() => {
    const t = setTimeout(onDone, 900);
    return () => clearTimeout(t);
  }, [onDone]);

  const dx = Math.random() * 60 - 30;
  const scale = 0.75 + Math.random() * 0.6;
  const rotate = Math.random() * 30 - 15;

  return (
    <div
      className="pointer-events-none fixed z-50 animate-heart-float"
      style={{
        left: x,
        top: y,
        transform: `translate(${dx}px, -30px) scale(${scale}) rotate(${rotate}deg)`,
      }}
    >
      <Heart className="h-7 w-7 fill-like text-like drop-shadow-sm" />
    </div>
  );
}
