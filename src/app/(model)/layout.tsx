import type { ReactNode } from 'react';
import RequireAccessToken from '@/shared/auth/RequireAccessToken';

export default function ModelLayout({ children }: { children: ReactNode }) {
  return <RequireAccessToken>{children}</RequireAccessToken>;
}
