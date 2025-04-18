import axios from 'axios';
import config from '../config';
import useAuth from '../hooks/useAuth';
import { isTokenExpired, refreshAccessToken } from './tokenManager';
// import Cookies from 'js-cookie';


// Axios 인스턴스 생성
const axiosInstance = axios.create({
  baseURL: config.baseURL,
  withCredentials: true, // 쿠키 포함
  headers: {
    'Content-Type': 'application/json',
  }
});

// 요청 인터셉터: accessToken 자동 추가
// 모든 요청에 Authorization: Bearer 헤더를 자동으로 붙임
axiosInstance.interceptors.request.use(
  async (config) => {
    const { userInfo } = useAuth.getState();
    let token = userInfo?.accessToken;

    // 만료되거나 없을때 경우 자동으로 갱신
    if (!token || isTokenExpired(token)) {
      token = await refreshAccessToken();
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // CSRF 토큰 추가
    // const rawToken = Cookies.get('XSRF-TOKEN');
    // const csrfToken = decodeURIComponent(rawToken || '').trim();
    // if (csrfToken) {
    //   config.headers['X-XSRF-TOKEN'] = csrfToken;
    // }
    // config.withCredentials = true;

    return config;
  },
  (error) => {
    const { response } = error;

    if (response && response.status >= 500) {
      reportError({
        error,
        url: response.config?.url,
      });
    }
    Promise.reject(error)
  }
);



export default axiosInstance;