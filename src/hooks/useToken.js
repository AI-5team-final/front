import { jwtDecode } from 'jwt-decode';
import { useState, useEffect } from 'react';

export default function useToken() {
  const [token, setToken] = useState(() => localStorage.getItem('accessToken'));
  const [role, setRole] = useState(() => {
    const storedToken = localStorage.getItem('accessToken');
    if (storedToken) {
      try {
        const decoded = jwtDecode(storedToken);
        return decoded?.role || null;
      } catch (e) {
        console.error("JWT 디코딩 오류:", e);
        return null;
      }
    }
    return null;
  });

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const userRole = decoded?.role || null;
        setRole(userRole);
      } catch (e) {
        console.error("JWT 디코딩 오류:", e);
        setRole(null);
        removeToken();
      }
    } else {
      setRole(null);
    }
  }, [token]);

  const setTokenValue = (newToken) => {
    localStorage.setItem('accessToken', newToken);
    setToken(newToken);
  };

  const removeToken = () => {
    localStorage.removeItem('accessToken');
    setToken(null);
    setRole(null);
  };

  return { 
    token, 
    role,
    setToken: setTokenValue, 
    removeToken 
  };
}