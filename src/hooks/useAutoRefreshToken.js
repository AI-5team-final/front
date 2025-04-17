import { useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import axiosInstance from '../utils/axiosInstance';
import useAuth from './useAuth'; // zustand 훅


export default function useAutoRefreshToken() {
    const { userInfo, setUser, logout } = useAuth();

    useEffect(() => {
    if (!userInfo) return;

    try {
        const decoded = jwtDecode(userInfo?.accessToken);
        const exp = decoded?.exp;

        if (!exp) return;

        const now = Math.floor(Date.now() / 1000);
        const timeLeft = exp - now;

        const refreshThreshold = 120; // 2분 전 미리 갱신
        const waitTime = (timeLeft - refreshThreshold) * 1000;

        const timeoutId = setTimeout(async () => {
        try {
            const response = await axiosInstance.post('/auth/token/refresh', {}, {
            withCredentials: true,
            });

            const { accessToken } = response.data;

            if (accessToken) {
            const decodedNew = jwtDecode(accessToken);
            // 유저 정보 갱신 (accessToken + 유저 상태 통합)
            setUser({
                ...userInfo,
                ...decodedNew,
                accessToken,
            });

            console.log('accessToken 자동 갱신 완료');
            }
        } catch (err) {
            console.error('accessToken 자동 갱신 실패:', err);
            logout(); // zustand에서 처리하도록
        }
        }, waitTime > 0 ? waitTime : 0);

        return () => clearTimeout(timeoutId);
    } catch (err) {
        console.warn('accessToken decode 실패:', err);
    }
    }, [userInfo]);
}