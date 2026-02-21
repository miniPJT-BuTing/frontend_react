import { publicApi } from '@/shared/api/apiInstance';
import { tokenStore } from '@/shared/auth/tokenStore';

// 로그인 → accessToken 저장
export async function login(payload: any) {
  const res = await publicApi.post('/auth/login', payload);
  tokenStore.set(res.data?.accessToken ?? null);
  return res.data;
}

// 로그아웃 → 토큰 제거
export async function logout() {
  await publicApi.post('/auth/logout');
  tokenStore.clear();
}

// 앱 시작 시 access 복구
export async function bootstrapAuth() {
  try {
    const res = await publicApi.post('/auth/refresh');
    tokenStore.set(res.data?.accessToken ?? null);
    return true;
  } catch {
    tokenStore.clear();
    return false;
  }
}
