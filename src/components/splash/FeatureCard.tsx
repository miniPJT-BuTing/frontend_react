import type { LucideIcon } from 'lucide-react';

type Props = React.HTMLAttributes<HTMLDivElement> & {
  title: string;
  desc: string;
  icon: LucideIcon;
  tone?: 'blue' | 'pink' | 'mint';
};

const TONE = {
  blue: {
    blob: 'bg-blue-100/70',
    badge: 'bg-blue-50',
    icon: 'text-blue-500',
  },
  pink: {
    blob: 'bg-pink-100/70',
    badge: 'bg-pink-50',
    icon: 'text-pink-500',
  },
  mint: {
    blob: 'bg-emerald-100/70',
    badge: 'bg-emerald-50',
    icon: 'text-emerald-500',
  },
} as const;

export default function FeatureCard({ title, desc, icon: Icon, tone = 'blue', ...rest }: Props) {
  const t = TONE[tone];

  return (
    <article
      {...rest}
      className={[
        'relative w-[300px] shrink-0 snap-start overflow-hidden rounded-[24px]',
        'bg-white px-7 py-8 text-left',
        'border border-border/60',
        'transition-transform duration-200',
        rest.className ?? '',
      ].join(' ')}
    >
      <div
        className={`pointer-events-none absolute -right-10 -top-12 h-40 w-40 rounded-full ${t.blob}`}
      />
      <div
        className={`pointer-events-none absolute -right-2 -top-2 h-24 w-24 rounded-full ${t.blob}`}
      />

      <div
        className={[
          'inline-flex h-10 w-10 items-center justify-center',
          'rounded-md',
          t.badge,
        ].join(' ')}
      >
        <Icon className={`h-5 w-5 ${t.icon}`} />
      </div>

      <h3 className="mt-6 text-[20px] font-semibold tracking-[-0.02em] text-foreground">{title}</h3>

      <p className="mt-3 whitespace-pre-line text-[14px] leading-relaxed text-textSecondary">
        {desc}
      </p>
    </article>
  );
}
