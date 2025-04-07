import { createContext, useContext, useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState(() => {
    const saved = localStorage.getItem('userInfo');
    return saved ? JSON.parse(saved) : null;
  });

  // 💾 userInfo 변경될 때 localStorage에 동기화
  useEffect(() => {
    if (userInfo) {
      localStorage.setItem('userInfo', JSON.stringify(userInfo));
    } else {
      localStorage.removeItem('userInfo');
    }
  }, [userInfo]);

  // 💳 크레딧 업데이트 함수
  const updateCredit = (newCredit) => {
    setUserInfo((prev) => ({
      ...prev,
      credit: newCredit,
    }));
  };

  // 🔓 토큰 기반 유저 정보 업데이트
  const updateUserInfoFromToken = (token) => {
    if (!token) return;
    try {
      const decoded = jwtDecode(token);
      setUserInfo((prev) => ({
        ...prev,
        name: decoded?.name ?? prev?.name,
        email: decoded?.sub ?? prev?.email,
        phone: decoded?.phone ?? prev?.phone,
        credit: decoded?.credit ?? prev?.credit,
        // role: decoded?.role ?? prev?.role
      }));
    } catch (err) {
      console.error('❌ 토큰 디코딩 실패:', err);
    }
  };

  return (
    <UserContext.Provider
      value={{ userInfo, setUserInfo, updateCredit, updateUserInfoFromToken }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);