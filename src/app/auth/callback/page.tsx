'use client';

import { Suspense, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { reissueApi } from '@/features/auth/api/auth.api';
import { tokenStore } from '@/shared/auth/tokenStore';

function pickString(value: string | null) {
  return value ?? '';
}

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const isSuccess = searchParams.get('isSuccess') === 'true';
    const isFirstLogin = searchParams.get('isFirstLogin') === 'true';
    const code = pickString(searchParams.get('code'));

    if (!isSuccess) {
      alert(`소셜 로그인에 실패했습니다. (code: ${code || 'unknown'})`);
      router.replace('/login');
      return;
    }

    if (isFirstLogin) {
      const signupToken = pickString(searchParams.get('signupToken'));
      const nickname = pickString(searchParams.get('nickname'));
      const providerName = pickString(searchParams.get('providerName'));

      const nextParams = new URLSearchParams();
      if (signupToken) nextParams.set('signupToken', signupToken);
      if (nickname) nextParams.set('nickname', nickname);
      if (providerName) nextParams.set('providerName', providerName);

      router.replace(
        `/signup/step-1${nextParams.toString() ? `?${nextParams.toString()}` : ''}` as never
      );
      return;
    }

    (async () => {
      try {
        const result = await reissueApi();
        const accessToken = result.accessToken ?? null;

        if (accessToken) {
          tokenStore.set(accessToken);
        }
      } catch {
      } finally {
        router.replace('/home');
      }
    })();
  }, [router, searchParams]);

  return (
    <div className="flex min-h-screen items-center justify-center text-sm text-slate-600">
      로그인 처리 중...
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={null}>
      <AuthCallbackContent />
    </Suspense>
  );
}
