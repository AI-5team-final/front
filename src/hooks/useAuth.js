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

  const logout = () => {
    removeToken();
    navigate('/login');
  };

  return { login, logout, role };
};

export default useAuth;