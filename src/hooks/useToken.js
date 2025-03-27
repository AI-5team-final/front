import { jwtDecode } from 'jwt-decode';
import { useState, useEffect } from 'react';

export default function useToken() {
  const [token, setToken] = useState(() => localStorage.getItem('accessToken'));
  const [role, setRole] = useState(null);

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setRole(decoded?.role || null);
      } catch (e) {
        console.error("Token decode error:", e);
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