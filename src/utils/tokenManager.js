import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import config from '../config';
import useAuth from '../hooks/useAuth';
import { toast } from 'react-toastify';

let refreshPromise = null;

export const isTokenExpired = (token) => {
    if (!token) return true;
    try {
        const { exp } = jwtDecode(token);
        return Date.now() / 1000 > exp;
    } catch {
        return true;
    }
};

export const refreshAccessToken = async () => {
    if (refreshPromise) return refreshPromise;

    const { userInfo, setUser, logout } = useAuth.getState();

    refreshPromise = new Promise(async (resolve, reject) => {
        try {
            const response = await axios.post(`${config.baseURL}/auth/token/refresh`, null, {
                withCredentials: true,
            });

            const { accessToken } = response.data || {};

            if (response.status !== 200 || !accessToken) {
                reportError({
                    error: new Error('refresh 실패: accessToken 없음 또는 비정상 응답'),
                    url: '/auth/token/refresh',
                    status: response.status,
                });
        
                // 비정상 응답일 경우만 logout
                logout();
                reject(null);
                return;
            }

            // 정상적으로 accessToken 발급됨
            setUser({ ...userInfo, accessToken });
            resolve(accessToken);
        } catch (err) {
            const isNetworkError = !err.response;

            if (isNetworkError) {
                toast.error('서버에 연결할 수 없습니다. 인터넷 연결을 확인해주세요.');
            } else {
                reportError({
                    error: err,
                    url: '/auth/token/refresh',
                    status: err.response?.status,
                });
                toast.info('토큰 갱신에 실패했습니다. 다시 시도해주세요.');
                logout(); 
            }

            reject(err);
        } finally {
            refreshPromise = null;
        }
    });

    return refreshPromise;
};
