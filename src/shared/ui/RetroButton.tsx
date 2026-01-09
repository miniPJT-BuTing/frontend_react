import React from 'react';

interface RetroButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'neutral';
  isActive?: boolean; // For toggle state (stay pressed)
  fullWidth?: boolean;
}

export const RetroButton = ({
  children,
  className,
  variant = 'primary',
  isActive = false,
  fullWidth = false,
  ...props
}: RetroButtonProps) => {
  const baseStyles =
    'flex items-center justify-center rounded-full border-2 border-gray-600 font-extrabold transition-all duration-75';
  
  // Variants based on SplashButtons colors
  const variantStyles = {
    primary: 'bg-yellow text-textPrimary', // Yellow
    secondary: 'bg-primary text-textPrimary', // Pink
    neutral: 'bg-surface text-textPrimary', // Default/White
  };

  const shadowStyles = isActive
    ? 'translate-y-[2px] shadow-[0_2px_0_0_#171719]' // Pressed state
    : 'shadow-[0_4px_0_0_#171719] active:translate-y-[2px] active:shadow-[0_2px_0_0_#171719]'; // Normal state with active animation

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${shadowStyles} ${fullWidth ? 'w-full' : ''} ${className || ''}`}
      {...props}
    >
      {children}
    </button>
  );
};
