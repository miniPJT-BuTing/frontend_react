import { apiInstance, publicApi } from '@/shared/api/apiInstance';
import { tokenStore } from '@/shared/auth/tokenStore';

export async function login(payload: Record<string, unknown>) {
  const res = await publicApi.post('/v1/auth/login', payload);
  tokenStore.set(res.data?.accessToken ?? null);
  return res.data;
}

export async function logout() {
  await apiInstance.post('/v1/auth/logout');
  tokenStore.clear();
}

export async function bootstrapAuth() {
  try {
    const res = await publicApi.post('/v1/auth/reissue');
    const authorization = res.headers.authorization;
    const accessToken =
      typeof authorization === 'string' && authorization.toLowerCase().startsWith('bearer ')
        ? authorization.slice(7).trim()
        : null;

    if (!accessToken) {
      tokenStore.clear();
      return false;
    }

    tokenStore.set(accessToken);
    return true;
  } catch {
    tokenStore.clear();
    return false;
  }
}
