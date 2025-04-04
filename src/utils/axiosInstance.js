import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

// 토큰 유효성 검사 함수
// 요청 전에 JWT를 decode해서 만료되었는지 확인함
const isTokenExpired = (token) => {
  if (!token) return true;
  try {
    const { exp } = jwtDecode(token);
    const now = Date.now() / 1000;
    return exp < now;
  } catch (err) {
    return true;
  }
};

// accessToken을 LocalStorage에서 꺼내는 함수
const getAccessToken = () => {
  return localStorage.getItem('accessToken');
};

// accessToken을 갱신하는 함수
// 만료 시, /auth/token/refresh로 refreshToken을 보내서 새 accessToken을 발급받음
const refreshAccessToken = async () => {
  try {
    const response = await axios.post('http://localhost:8080/auth/token/refresh', null, {
      withCredentials: true, // 쿠키에 있는 refreshToken 전송
    });

    const { accessToken } = response.data;

    // 새로운 토큰을 갱신한 후 localStorage에 덮어씀
    if (accessToken) {
      localStorage.setItem('accessToken', accessToken);
      return accessToken;
    }
  } catch (err) {
    console.error('⚠️ 토큰 갱신 실패:', err);
    throw err;
  }
};

// Axios 인스턴스 생성
const axiosInstance = axios.create({
  baseURL: 'http://localhost:8080',
  withCredentials: true, // 쿠키 포함
  headers: {
    'Content-Type': 'application/json',
  }
});

// 요청 인터셉터: accessToken 자동 추가
// 모든 요청에 Authorization: Bearer 헤더를 자동으로 붙임
axiosInstance.interceptors.request.use(
  async (config) => {
    let token = getAccessToken();

    // 만료된 경우 자동으로 갱신
    if (isTokenExpired(token)) {
      try {
        token = await refreshAccessToken(); // 갱신된 토큰으로 교체
      } catch (err) {
        console.warn('🔒 accessToken 갱신 실패');
        throw err;
      }
    }

    config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// 응답 인터셉터: 토큰 만료 시 재시도 로직도 추가하고 싶다면 여기에서 구현 가능

export default axiosInstance;