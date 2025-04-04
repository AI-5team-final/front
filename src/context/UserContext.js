import { createContext, useContext, useState } from 'react';
import { jwtDecode } from 'jwt-decode';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState(null);
  

  const updateCredit = (newCredit) => {
    setUserInfo((prev) => ({
      ...prev,
      credit: newCredit
    }));
  };

  const updateUserInfoFromToken = (token) => {
    if (!token) return;
    try {
      const decoded = jwtDecode(token);
      setUserInfo((prev) => ({
        ...prev,
        name: decoded?.name || prev?.name,
        email: decoded?.sub || prev?.email,
        phone: decoded?.phone || prev?.phone,
        credit: decoded?.credit || prev?.credit,
        // role: decoded?.role || prev?.role
      }));
    } catch (err) {
      console.error('❌ 토큰 디코딩 실패:', err);
    }
  };

  return (
    <UserContext.Provider value={{ userInfo, setUserInfo, updateCredit, updateUserInfoFromToken }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
