import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { toast } from 'react-toastify';
import axiosInstance from '../utils/axiosInstance';
import config from '../config';

const useAuth = create(
  persist(
    (set, get) => ({
      userInfo: null,
      isLoggedIn: false,
      // isInitializing: true,

      setUser: (userData) => {
        // accessToken은 메모리에만 저장하고 persist에는 제외됨
        const { accessToken, ...rest } = userData;
        set({ userInfo: { ...rest, accessToken }, isLoggedIn: true });
      },

      updateCredit: (newCredit) => {
        const currentUser = get().userInfo;
        if (!currentUser) return;
        set({ userInfo: { ...currentUser, credit: newCredit } });
      },

      // initialize: async () => {
      //   set({isInitializing: false})
      //   // set({ isInitializing: true });
        
      //   // try {
      //   //   const res = await axiosInstance.get('/auth/token/me', { withCredentials: true });
      //   //   const data = res.data;

      //   //   set({
      //   //     userInfo: data,
      //   //     isLoggedIn: true,
      //   //     isInitializing: false,
      //   //   });

      //   //   console.log('로그인 상태 복원');
      //   // } catch (err) {
      //   //   console.warn('🚫 로그인 상태 복원 실패:', err);
      //   //   set({ userInfo: null, isLoggedIn: false, isInitializing: false });
      //   // }
      // },

      login: async (username, password, role) => {
        try {
          const res = await fetch(`${config.baseURL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ username, password, role }),
          });

          if (!res.ok) throw new Error('로그인 실패');

          const data = await res.json();

          // accessToken은 메모리에만 저장, persist 대상에서 제외됨
          get().setUser({
            ...data,
            accessToken: data.accessToken,
          });

          toast.success('로그인 성공!');
        } catch (err) {
          toast.error('로그인 실패: 아이디 또는 비밀번호 확인');
          throw err;
        }
      },

      logout: async () => {
        try {
          await axiosInstance.post('/auth/token/logout');
          set({ userInfo: null, isLoggedIn: false });
          toast.success('로그아웃 되었습니다!');
        } catch (err) {
          toast.error('서버와의 연결에 실패했습니다.');
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
