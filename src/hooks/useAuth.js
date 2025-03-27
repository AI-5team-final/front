import { useNavigate } from 'react-router-dom';
import useToken from './useToken';

const useAuth = () => {
  const navigate = useNavigate();
  const { removeToken } = useToken();

  const logout = async () => {
    try {
      const accessToken = localStorage.getItem('accessToken');

      await fetch('http://localhost:8080/auth/token/logout', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`
        },
        credentials: 'include' // refreshToken 쿠키와 함께 보낼 때 필요
      });
    } catch (err) {
      console.warn('서버 로그아웃 실패:', err);
    } finally {
      removeToken();
      navigate('/login');
    }
  };

  return { logout };
};

export default useAuth;