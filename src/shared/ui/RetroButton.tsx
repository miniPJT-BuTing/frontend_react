import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'neutral';
  fullWidth?: boolean;
  isActive?: boolean;
}

export const RetroButton = ({
  children,
  className,
  variant = 'primary',
  fullWidth = false,
  isActive = false,
  ...props
}: ButtonProps) => {
  const baseStyles = `
    flex items-center justify-center gap-3
    h-14
    rounded-full
    border border-black
    font-semibold
    transition-colors
    disabled:opacity-50
  `;

  const variantStyles = {
    primary: 'bg-[#FEFED0] text-black hover:bg-[#FBFBC8]',
    secondary: 'bg-[#F7ABCF] text-black hover:bg-[#F4A0C6]',
    neutral: 'bg-white text-black hover:bg-slate-50',
  };

  const activeStyles = isActive
    ? `
        ring-2 ring-black
        translate-y-[1px]
        shadow-[0_2px_0_0_rgba(0,0,0,1)]
      `
    : '';

  return (
    <button
      className={`
        ${baseStyles}
        ${variantStyles[variant]}
        ${fullWidth ? 'w-full' : ''}
        ${activeStyles}
        ${className ?? ''}
      `}
      {...props}
    >
      {children}
    </button>
  );
};
