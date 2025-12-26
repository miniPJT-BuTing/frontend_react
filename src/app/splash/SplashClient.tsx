'use client';

import { useCallback, useState } from 'react';

import SplashHero from '@/components/splash/SplashHero';
import FeatureCarousel from '@/components/splash/FeatureCarousel';
import SplashActions from '@/components/splash/SplashActions';
import HeartBurst from '@/components/splash/HeartBurst';

type Heart = { id: number; x: number; y: number };

export default function SplashClient() {
  const [hearts, setHearts] = useState<Heart[]>([]);

  const burstHearts = useCallback((x: number, y: number) => {
    const now = Date.now();
    const batch = Array.from({ length: 6 }).map((_, i) => ({
      id: now + i,
      x,
      y,
    }));
    setHearts((prev) => [...prev, ...batch]);
  }, []);

  const removeHeart = useCallback((id: number) => {
    setHearts((prev) => prev.filter((h) => h.id !== id));
  }, []);

  return (
    <main className="relative min-h-dvh overflow-hidden bg-background text-foreground">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 left-1/2 h-[380px] w-[380px] -translate-x-1/2 rounded-full bg-primary/25 blur-3xl" />
        <div className="absolute -bottom-28 -left-20 h-[320px] w-[320px] rounded-full bg-accent/40 blur-3xl" />
      </div>

      <div className="relative mx-auto flex min-h-dvh w-full max-w-md flex-col px-6">
        <SplashHero onLogoBurst={burstHearts} />

        <section className="flex flex-1 flex-col justify-center">
          <div className="flex flex-col items-center text-center">
            <FeatureCarousel />
          </div>
        </section>

        <SplashActions />
      </div>

      {hearts.map((h) => (
        <HeartBurst key={h.id} x={h.x} y={h.y} onDone={() => removeHeart(h.id)} />
      ))}
    </main>
  );
}
