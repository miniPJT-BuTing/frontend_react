'use client';

import { useRouter } from 'next/navigation';
import { ReactNode, useEffect, useState } from 'react';
import { reissueApi } from '@/features/auth/api/auth.api';
import { tokenStore } from '@/shared/auth/tokenStore';

export default function RequireAccessToken({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [isAllowed, setIsAllowed] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const ensureAccessToken = async () => {
      const skipAuthGuardOnce =
        typeof window !== 'undefined' &&
        new URLSearchParams(window.location.search).get('skipAuth') === '1';

      if (skipAuthGuardOnce) {
        if (isMounted) setIsAllowed(true);
        router.replace(window.location.pathname as never);
        return;
      }

      const currentToken = tokenStore.get();
      if (currentToken) {
        if (isMounted) setIsAllowed(true);
        return;
      }

      try {
        const result = await reissueApi();
        const nextToken = result.accessToken ?? null;

        if (nextToken) {
          tokenStore.set(nextToken);
          if (isMounted) setIsAllowed(true);
          return;
        }
      } catch {
      }

      tokenStore.clear();
      if (isMounted) router.replace('/splash');
    };

    ensureAccessToken();

    return () => {
      isMounted = false;
    };
  }, [router]);

  if (!isAllowed) return null;

  return <>{children}</>;
}
