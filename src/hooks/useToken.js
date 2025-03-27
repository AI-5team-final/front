import { jwtDecode } from 'jwt-decode';

export default function useToken() {
  const getToken = () => localStorage.getItem('accessToken');
  const removeToken = () => localStorage.removeItem('accessToken');

  const getRole = () => {
    const token = getToken();
    try {
      const decoded = token && jwtDecode(token);
      return decoded?.role || 'GUEST';
    } catch (e) {
      console.error("JWT decode error:", e);
      return 'GUEST';
    }
  };

  return { getToken, removeToken, getRole };
}