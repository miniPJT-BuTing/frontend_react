import type { ButtonHTMLAttributes, ReactNode } from 'react';

type Variant = 'primary' | 'secondary' | 'neutral' | 'kakao';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  fullWidth?: boolean;
  leftIcon?: ReactNode;
}

const baseStyles =
  'flex h-14 items-center justify-center gap-3 rounded-full border-2 border-black ' +
  'text-base font-extrabold transition-all ' +
  'shadow-[0_4px_0_0_rgba(0,0,0,1)] ' +
  'active:translate-y-[2px] active:shadow-[0_2px_0_0_rgba(0,0,0,1)]';

const variantStyles: Record<Variant, string> = {
  primary: 'bg-[var(--color-primary)] text-black hover:bg-[var(--color-primaryHover)]',
  secondary: 'bg-[var(--color-accent)] text-black hover:bg-[var(--color-accentSoft)]',
  kakao: 'bg-[var(--color-kakao)] text-black hover:bg-[var(--color-kakaoHover)]',
  neutral: 'bg-white text-black hover:bg-slate-50',
};

export function ShadowButton({
  children,
  className,
  variant = 'primary',
  fullWidth = false,
  leftIcon,
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={[baseStyles, variantStyles[variant], fullWidth ? 'w-full' : '', className ?? '']
        .filter(Boolean)
        .join(' ')}
      {...props}
    >
      {leftIcon ? <span className="shrink-0">{leftIcon}</span> : null}
      {children}
    </button>
  );
}
