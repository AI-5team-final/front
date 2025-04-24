import { useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import useAuth from './useAuth'; 
import { refreshAccessToken } from '../utils/tokenManager';


export default function useAutoRefreshToken() {
    const { userInfo, isLoggedIn } = useAuth();

    useEffect(() => {
        if (!isLoggedIn || !userInfo?.accessToken) return;
    
        const { accessToken } = userInfo;
    
        try {
            const decoded = jwtDecode(accessToken);
            const exp = decoded?.exp;
            const now = Math.floor(Date.now() / 1000);
            const timeLeft = exp - now;
            const refreshThreshold = 120; // 2분 전
            const waitTime = (timeLeft - refreshThreshold) * 1000;
    
            const timeoutId = setTimeout(() => {
                refreshAccessToken();
            }, waitTime > 0 ? waitTime : 0);
        
            return () => clearTimeout(timeoutId);
        } catch (err) {
            console.warn('accessToken decode 실패:', err);
        }
    }, [userInfo]);
}
