import { jwtDecode } from 'jwt-decode';

export default function useToken() {
  const getToken = () => localStorage.getItem('accessToken');
  const removeToken = () => localStorage.removeItem('accessToken');
  const getRole = () => {
    const token = getToken();
    return token ? jwtDecode(token).roles[0] : 'GUEST';
  };

  return { getToken, removeToken, getRole };
} 