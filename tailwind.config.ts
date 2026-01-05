import type { Config } from 'tailwindcss';
import scrollbarHide from 'tailwind-scrollbar-hide';
import { colors, fonts, borderRadius, boxShadow } from './src/shared/styles';

const config: Config = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/entities/**/*.{js,ts,jsx,tsx,mdx}',
    './src/features/**/*.{js,ts,jsx,tsx,mdx}',
    './src/shared/**/*.{js,ts,jsx,tsx,mdx}',
    './src/widgets/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors,
      fontFamily: fonts,
      borderRadius,
      boxShadow,
      keyframes: {
        'heart-float': {
          '0%': { opacity: '0', transform: 'translateY(0) scale(0.6)' },
          '20%': { opacity: '1' },
          '100%': { opacity: '0', transform: 'translateY(-90px) scale(1)' },
        },
      },
      animation: {
        'heart-float': 'heart-float 0.9s ease-out forwards',
      },
    },
  },
  plugins: [scrollbarHide],
};

export default config;
