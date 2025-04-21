import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { toast } from 'react-toastify';
import axiosInstance from '../utils/axiosInstance';
import config from '../config';
import { jwtDecode } from 'jwt-decode';

const useAuth = create(
  persist(
    (set, get) => ({
      userInfo: null,
      isLoggedIn: false,
      isInitializing: true,

      setUser: (userData) => {
        const { accessToken, ...rest } = userData;
        const isValid = accessToken && typeof accessToken === 'string' && accessToken.length > 0;
      
        set({
          userInfo: { ...rest, accessToken },
          isLoggedIn: isValid,
        });
      },

      updateCredit: (newCredit) => {
        const currentUser = get().userInfo;
        if (!currentUser) return;
        set({ userInfo: { ...currentUser, credit: newCredit } });
      },

      initialize: async () => {
        set({ isInitializing: true });
        
        try {
          // csrf 한다면 여기 요청추가
          const res = await axiosInstance.get('/auth/token/me', { withCredentials: true });
          const data = res.data;

          set({
            userInfo: data,
            isLoggedIn: true,
            isInitializing: false,
          });

          console.log('로그인 상태 복원');
        } catch (err) {
          console.warn('로그인 상태 복원 실패:', err);
          reportError({
            error: err,
            url: '/auth/token/me',
          });
          set({ userInfo: null, isLoggedIn: false, isInitializing: false });
        }
      },

      login: async (username, password, role) => {
        try {
          const res = await fetch(`${config.baseURL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ username, password, role }),
          });

          if (res.status === 401) {
            throw new Error('아이디 또는 비밀번호가 잘못되었습니다.');
          }

          if (!res.ok) throw new Error('로그인 실패');

          const data = await res.json();

          // accessToken 유효성 검사
          try {
            jwtDecode(data.accessToken);
          } catch {
            throw new Error('유효하지 않은 accessToken');
          }

          return data;
        } catch (err) {
            if (err.message === '아이디 또는 비밀번호가 잘못되었습니다.') {
              throw err;
            } else {
              reportError({
                error: err,
                url: '/auth/login',
              });
          
              get().logout();
              throw err;
            }
          }
      },

      logout: async () => {
        try {
          await axiosInstance.post('/auth/token/logout');
          set({ userInfo: null, isLoggedIn: false });
          toast.success('로그아웃 되었습니다!');
        } catch (err) {
          toast.error('서버와의 연결에 실패했습니다.');
          reportError({
            error: err,
            url: '/auth/token/logout',
          });
        }
      },
    }),

    // localStorage 저장 설정 (accessToken은 제외)
    {
      name: 'auth-storage',
      partialize: (state) => {
        const { userInfo, isLoggedIn } = state;
        if (!userInfo) return { isLoggedIn };
        const { accessToken, ...safeUser } = userInfo;
        return { userInfo: safeUser, isLoggedIn };
      },
    }
  )
);

export default useAuth;
