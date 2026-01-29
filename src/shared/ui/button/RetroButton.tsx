import type { ButtonHTMLAttributes, ReactNode } from 'react';
import type { ButtonVariant } from './button.types';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  leftIcon?: ReactNode;
}

const baseStyles =
  'flex h-14 items-center justify-center gap-3 rounded-full border-2 border-black w-full ' +
  'text-base font-extrabold transition-colors';

const variantStyles: Record<ButtonVariant, string> = {
  primary: 'bg-[var(--color-primary)] text-black hover:bg-[var(--color-primaryHover)]',
  skyblue: 'bg-[var(--color-skyblue)] text-black hover:bg-[var(--color-skyblueHover)]',
  blueGreen: 'bg-[var(--color-blueGreen)] text-black hover:bg-[var(--color-blueGreenHover)]',
  yellow: 'bg-[var(--color-yellow)] text-black hover:bg-[var(--color-yellowHover)]',
  kakao: 'bg-[var(--color-kakao)] text-black hover:bg-[var(--color-kakaoHover)]',
};

export function RetroButton({
  children,
  className,
  variant = 'primary',
  leftIcon,
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={[baseStyles, variantStyles[variant], className ?? ''].filter(Boolean).join(' ')}
      {...props}
    >
      {leftIcon ? <span className="shrink-0">{leftIcon}</span> : null}
      {children}
    </button>
  );
}
