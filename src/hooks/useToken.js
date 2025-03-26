import { jwtDecode } from 'jwt-decode';

export default function useToken() {
  const getToken = () => localStorage.getItem('accessToken');
  const removeToken = () => localStorage.removeItem('accessToken');
  
  const getRole = () => {
    const token = getToken();
    if (!token) return null;
    return jwtDecode(token).roles[0];
  };

  return { getToken, removeToken, getRole };
}