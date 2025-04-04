import { useNavigate } from 'react-router-dom';
import useToken from './useToken';
import { useUser } from '../context/UserContext'; // 1. context import
import { CgLogIn } from 'react-icons/cg';

const useAuth = () => {
  const navigate = useNavigate();
  const { setToken, removeToken, role } = useToken();
  const { setUserInfo } = useUser(); // 2. setter 가져오기

  const login = async (username, password, userRole) => {
    try {
      const res = await fetch('http://localhost:8080/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, role: userRole }),
      });

      if (!res.ok) throw new Error('아이디 또는 비밀번호가 일치하지 않습니다.');


      // 3. 전체 응답 구조 받아오기
      const { accessToken, name, email, credit, phone } = await res.json();

      // 4. 저장
      setToken(accessToken);
      setUserInfo({ name, email, credit, phone }); // Context에 저장하여 전역에서 사용

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
        credentials: 'include'
      });
    } catch (err) {
      console.warn('서버 로그아웃 실패:', err);
    } finally {
      removeToken();
      navigate('/login');
    }
  };

  const isLoggedIn = !!localStorage.getItem('accessToken');

  return { login, logout, role, isLoggedIn };
};

export default useAuth;