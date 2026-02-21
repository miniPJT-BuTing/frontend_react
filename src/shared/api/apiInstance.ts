import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { tokenStore } from '@/shared/auth/tokenStore';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL?.trim() || 'http://localhost:8080';

const common = {
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
};

export const publicApi = axios.create(common);
export const authApi = axios.create(common);

authApi.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = tokenStore.get();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

let isRefreshing = false;
let queue: Array<(token: string | null) => void> = [];

function flush(token: string | null) {
  queue.forEach((cb) => cb(token));
  queue = [];
}
async function refreshAccessToken(): Promise<string | null> {
  try {
    const res = await publicApi.post('/auth/refresh');
    const token = res.data?.accessToken;
    if (!token) return null;
    tokenStore.set(token);
    return token;
  } catch {
    return null;
  }
}

authApi.interceptors.response.use(
  (r) => r,
  async (error: AxiosError<any>) => {
    const status = error.response?.status;
    const original = error.config as
      | (InternalAxiosRequestConfig & { _retry?: boolean })
      | undefined;

    if (status === 401 && original && !original._retry) {
      original._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          queue.push((token) => {
            if (!token) return reject(error);
            original.headers.Authorization = `Bearer ${token}`;
            resolve(authApi(original));
          });
        });
      }

      isRefreshing = true;
      const newToken = await refreshAccessToken();
      isRefreshing = false;
      flush(newToken);

      if (!newToken) {
        tokenStore.clear();
        return Promise.reject(error);
      }

      original.headers.Authorization = `Bearer ${newToken}`;
      return authApi(original);
    }

    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const apiInstance = authApi;
