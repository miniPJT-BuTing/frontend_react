import type { ButtonHTMLAttributes, ReactNode } from 'react';

type Variant = 'primary' | 'kakao' | 'skyblue' | 'blueGreen' | 'yellow';

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  label: ReactNode;
  leftIcon?: ReactNode;
  variant?: Variant;
  maxWidthClassName?: string;
};

const base =
  'flex h-14 w-full items-center justify-center gap-3 rounded-full border-2 border-black text-base font-extrabold ' +
  'shadow-[0_4px_0_0_rgba(0,0,0,1)] active:translate-y-[2px] active:shadow-[0_2px_0_0_rgba(0,0,0,1)]';

const variantClass: Record<Variant, string> = {
  primary: 'bg-[var(--color-primary)] hover:bg-[var(--color-primaryHover)]',
  kakao: 'bg-[var(--color-kakao)] hover:bg-[var(--color-kakaoHover)]',
  skyblue: 'bg-[var(--color-skyblue)] hover:bg-[var(--color-skyblueHover)]',
  blueGreen: 'bg-[var(--color-blueGreen)] hover:bg-[var(--color-blueGreenHover)]',
  yellow: 'bg-[var(--color-yellow)] hover:bg-[var(--color-yellowHover)]',
};

export function ShadowButton({
  label,
  leftIcon,
  variant = 'primary',
  className = '',
  ...rest
}: Props) {
  return (
    <button type="button" className={[base, variantClass[variant], className].join(' ')} {...rest}>
      {leftIcon ? <span className="shrink-0">{leftIcon}</span> : null}
      <span>{label}</span>
    </button>
  );
}
