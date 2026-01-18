import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'neutral';
  fullWidth?: boolean;
}

export const RetroButton = ({
  children,
  className,
  variant = 'primary',
  fullWidth = false,
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

  return (
    <button
      className={`
        ${baseStyles}
        ${variantStyles[variant]}
        ${fullWidth ? 'w-full' : ''}
        ${className ?? ''}
      `}
      {...props}
    >
      {children}
    </button>
  );
};
