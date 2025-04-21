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

        try {
            // 만료되었거나 없을 때 토큰 자동 갱신
            if (!token || isTokenExpired(token)) {
                token = await refreshAccessToken();
            }

            // Authorization 헤더에 토큰 추가
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }

            // // CSRF 토큰 추가 (필요 시 사용)
            // const rawToken = Cookies.get('XSRF-TOKEN');
            // const csrfToken = decodeURIComponent(rawToken || '').trim();
            // if (csrfToken) {
            //   config.headers['X-XSRF-TOKEN'] = csrfToken;
            // }
            // config.withCredentials = true;

            return config;

        } catch (err) {
            // 토큰 갱신 실패 시 요청 중단
            console.warn('토큰 갱신 실패. 요청 중단');
            return Promise.reject(err);
        }
    },

    (error) => {
        const { response } = error;

        // 서버 오류 감지 시 에러 리포트 전송
        if (response && response.status >= 500) {
            reportError({
                error,
                url: response.config?.url,
            });
        }

        return Promise.reject(error); // 오류 응답 반환
    }
);

export default axiosInstance;