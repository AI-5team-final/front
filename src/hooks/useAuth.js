import { useNavigate } from 'react-router-dom';
import useToken from './useToken';

const useAuth = () => {
  const navigate = useNavigate();
  const { setToken, removeToken, role } = useToken();

  const login = async (username, password, userRole) => {
    try {
      const res = await fetch('http://localhost:8080/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, role: userRole }),
      });

      if (!res.ok) throw new Error('아이디 또는 비밀번호가 일치하지 않습니다.');

      const { accessToken } = await res.json();
      setToken(accessToken);
      alert('로그인 성공!');
      navigate('/');
    } catch (err) {
      throw err;
    }
  };

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

  // ✅ 로그인 여부 체크용 플래그
  const isLoggedIn = !!localStorage.getItem('accessToken');

  return { login, logout, role, isLoggedIn };
};

export default useAuth;
