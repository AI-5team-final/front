import { jwtDecode } from 'jwt-decode';
import { useState, useEffect } from 'react';

const decodeToken = (token) => {
  if (!token) return null;
  try {
    const decoded = jwtDecode(token);
    return {
      role: decoded?.role || null,
      name: decoded?.name || null,
      sub: decoded?.sub || null,
      exp: decoded?.exp || null,
      iat: decoded?.iat || null
    };
  } catch (e) {
    console.error("JWT 디코딩 오류:", e);
    return null;
  }
};

export default function useToken() {
  const [token, setToken] = useState(() => localStorage.getItem('accessToken'));
  const [decodedInfo, setDecodedInfo] = useState(() => {
    const storedToken = localStorage.getItem('accessToken');
    return decodeToken(storedToken);
  });

  useEffect(() => {
    if (token) {
      const info = decodeToken(token);
      console.log('=== JWT 토큰 디버깅 ===');
      console.log('전체 토큰:', token);
      console.log('디코딩된 정보:', {
        sub: info.sub,           // 사용자 식별자
        name: info.name,         // 사용자 이름
        role: info.role,         // 사용자 역할
      });
      console.log('=====================');
      setDecodedInfo(info);
    } else {
      setDecodedInfo(null);
    }
  }, [token]);

  const setTokenValue = (newToken) => {
    console.log('=== 새 토큰 설정 ===');
    console.log('새로운 토큰:', newToken);
    localStorage.setItem('accessToken', newToken);
    setToken(newToken);
    console.log('=====================');
  };

  const removeToken = () => {
    console.log('=== 토큰 제거 ===');
    localStorage.removeItem('accessToken');
    setToken(null);
    setDecodedInfo(null);
    console.log('=====================');
  };

  return { 
    token, 
    role: decodedInfo?.role,
    name: decodedInfo?.name,
    setToken: setTokenValue, 
    removeToken 
  };
}