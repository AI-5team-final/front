import { useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import axiosInstance from '../utils/axiosInstance';
import useAuth from './useAuth'; // zustand 훅
import { toast } from 'react-toastify';

export default function useAutoRefreshToken() {
    const { userInfo, setUser, logout, isLoggedIn } = useAuth();

    useEffect(() => {
    const tryRefreshToken = async () => {
        try {
            const response = await axiosInstance.post('/auth/token/refresh', {}, {
                withCredentials: true,
            });

            const { accessToken } = response.data;
            if (!accessToken) throw new Error('accessToken 없음');

            setUser({
                ...userInfo,
                accessToken,
            });

            console.log('새로고침 이후 accessToken 복구 완료');
        } catch (err) {
            console.warn('accessToken 복구 실패', err);
            toast.info('세션이 만료되어 다시 로그인 해주세요.');
            logout(); 
        }
    };

    if(!isLoggedIn){
        return;
    }
    if (!userInfo || !userInfo.accessToken) {
        tryRefreshToken();
        return;
    }

    // accessToken 있는 경우 → 만료 시간 체크해서 갱신 예약
    const { accessToken } = userInfo;
    if (!accessToken) return;

    try {
        const decoded = jwtDecode(accessToken);
        const exp = decoded?.exp;
        if (!exp) return;

        const now = Math.floor(Date.now() / 1000);
        const timeLeft = exp - now;
        const refreshThreshold = 120;
        const waitTime = (timeLeft - refreshThreshold) * 1000;

        const timeoutId = setTimeout(() => {
        tryRefreshToken();
        }, waitTime > 0 ? waitTime : 0);

        return () => clearTimeout(timeoutId);
    } catch (err) {
        console.warn('accessToken decode 실패:', err);
    }
    }, [userInfo]);
}
