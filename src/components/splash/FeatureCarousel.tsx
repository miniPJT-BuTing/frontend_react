'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { BadgeCheck, Users, Heart } from 'lucide-react';
import FeatureCard from './FeatureCard';

const FEATURES = [
  {
    title: '학생 인증',
    desc: '학교 이메일 인증을 통해\n신뢰할 수 있는 만남을 보장합니다.',
    icon: BadgeCheck,
    tone: 'blue' as const,
  },
  {
    title: '3:3 과팅',
    desc: '친구들과 함께 시작해요.\n부담 없이 자연스럽게 연결!',
    icon: Users,
    tone: 'pink' as const,
  },
  {
    title: '취향 매칭',
    desc: '내 취향 기반으로\n딱 맞는 인연을 추천해요.',
    icon: Heart,
    tone: 'mint' as const,
  },
] as const;

export default function FeatureCarousel() {
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const [active, setActive] = useState(0);
  const count = useMemo(() => FEATURES.length, []);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;

    const update = () => {
      const first = el.querySelector<HTMLElement>('[data-feature-card]');
      if (!first) return;

      const gap = 16; // gap-4
      const step = first.offsetWidth + gap;
      const idx = Math.round(el.scrollLeft / step);

      setActive(Math.max(0, Math.min(count - 1, idx)));
    };

    update();
    el.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);

    return () => {
      el.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, [count]);

  const scrollToIndex = (idx: number) => {
    const el = scrollerRef.current;
    if (!el) return;

    const first = el.querySelector<HTMLElement>('[data-feature-card]');
    if (!first) return;

    const gap = 16;
    const step = first.offsetWidth + gap;
    el.scrollTo({ left: idx * step, behavior: 'smooth' });
  };

  return (
    <div className="mt-12 w-full">
      <div
        ref={scrollerRef}
        className={[
          'flex snap-x snap-mandatory gap-4 overflow-x-auto scrollbar-hide scroll-smooth',
          'px-6',
        ].join(' ')}
      >
        {FEATURES.map((f, i) => (
          <FeatureCard
            key={f.title}
            title={f.title}
            desc={f.desc}
            icon={f.icon}
            tone={f.tone}
            data-feature-card={i === 0 ? '' : undefined}
          />
        ))}

        <div className="w-2 shrink-0" />
      </div>

      <div className="mt-5 flex justify-center gap-2">
        {FEATURES.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => scrollToIndex(i)}
            className={[
              'h-2 rounded-full transition-all duration-300',
              i === active ? 'w-10 bg-primary/70' : 'w-2 bg-border',
            ].join(' ')}
            aria-label={`feature-${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
