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

        if (response.status !== 200 || !response.data?.accessToken) {
            reportError({
                error: new Error('refresh 실패: accessToken 없음 또는 비정상 응답'),
                url: '/auth/token/refresh',
                status: response.status
            });
            logout();
            reject(null);
            return;
        }

        const { accessToken } = response.data;

        if (accessToken) {
            setUser({ ...userInfo, accessToken });
            resolve(accessToken);
        } else {
            logout();
            reject(null);
        }
        } catch (err) {
            console.error('refreshAccessToken 실패:', err);
            toast.info('세션이 만료되어 다시 로그인 해주세요.');
            reportError({ error: err, url: '/auth/token/refresh' });
            logout();
            reject(err);
        } finally {
        refreshPromise = null;
        }
    });

    return refreshPromise;
};
