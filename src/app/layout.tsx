import type { Metadata } from 'next';
import './globals.css';
import Providers from './providers';
import { ColorInitializer } from '@/shared/providers/ColorInitializer';

export const metadata: Metadata = {
  title: 'BuTing',
  manifest: '/manifest.json',
  themeColor: '#ffffff',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>
        <ColorInitializer />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
