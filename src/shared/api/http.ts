import axios from 'axios';

// 환경 변수에서 API URL 가져오기

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';

// 임시 테스트용 유저 ID (백엔드 DB에 존재하는 ID여야 함)
const TEST_USER_ID = 1;

export const http = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    // 백엔드 테스트를 위해 강제로 User-ID 주입
    'X-User-Id': TEST_USER_ID,
  },
});

// 응답 인터셉터 (에러 로깅 등)
http.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);
