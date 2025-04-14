import { useEffect } from 'react';
import axiosClient from '../utils/axiosInstance.js';
import useToken from './useToken';
import { useUser } from '../context/UserContext';
import { jwtDecode } from 'jwt-decode';

export default function useAutoRefreshToken() {
  const { token, setToken, removeToken } = useToken();
  const { updateUserInfoFromToken } = useUser();

  useEffect(() => {
    if (!token) return;

    // JWT 디코딩해서 accessToken exp 시점(만료 시간) 가져옴
    // const decoded = JSON.parse(atob(token.split('.')[1]));
    const decoded = jwtDecode(token);
    const exp = decoded?.exp;

    if (!exp) return;

    const now = Math.floor(Date.now() / 1000);
    const timeLeft = exp - now;

    // 만료 120초 전 토큰 갱신 예약
    const refreshThreshold = 120;

    // setTimeout으로 백그라운드에서 자동 요청함
    const timeoutId = setTimeout(async () => {
      try {
        const response = await axiosClient.post('/auth/token/refresh', {}, { withCredentials: true });
        const { accessToken } = response.data;
        if (accessToken) {
          setToken(accessToken);

          // 디코딩 후 Context에 유저 정보 갱신
          const decodedNew = jwtDecode(accessToken);
          updateUserInfoFromToken(decodedNew);

          console.log('accessToken 자동 갱신 + 유저 정보 업데이트');        
          
        }
      } catch (err) {
        // RT도 만료되었거나 잘못되면 로그인 페이지로 리디렉션
        console.error('accessToken 자동 갱신 실패', err);
        removeToken();
        window.location.href = '/login';
      }
    }, (timeLeft - refreshThreshold) * 1000);

    return () => clearTimeout(timeoutId);
  }, [token]);
}