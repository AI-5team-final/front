import { jwtDecode } from 'jwt-decode';
import config from '../config';
import useAuth from '../hooks/useAuth'; 

const isTokenExpired = (token) => {
  if (!token) return true;
  try {
    const { exp } = jwtDecode(token);
    return Date.now() / 1000 > exp;
  } catch {
    return true;
  }
};

const refreshAccessToken = async () => {
  try {
    const response = await fetch(`${config.baseURL}/auth/token/refresh`, {
      method: 'POST',
      credentials: 'include', //  refreshToken 쿠키 자동 포함

    });
  
    if (!response.ok) {
      throw new Error('refreshToken 만료 또는 서버 오류');
    }

    const data = await response.json(); // JSON 파싱
    const { accessToken } = data;

    if (accessToken) {
      const { userInfo, setUser } = useAuth.getState();
      setUser({ ...userInfo, accessToken });
      return accessToken;
    }

    return null;
  }catch (err) {
    console.error('⚠️ 토큰 갱신 실패:', err);
    throw err;
  }
  
};

const fetchClient = async (endpoint, options = {}) => {
  const { userInfo, setUser, logout } = useAuth.getState();
  let token = userInfo?.accessToken;

  // accessToken이 없거나 만료되었으면 갱신
  if (!token || isTokenExpired(token)) {
    try {
      token = await refreshAccessToken();

      // zustand userInfo 상태에 새 토큰 저장
      setUser({
        ...userInfo,
        accessToken: token,
      });

      console.log('accessToken 갱신 완료');
    } catch (err) {
      console.error('❌ 자동 갱신 실패:', err);
      logout(); // 상태 정리 후 로그인 페이지로 이동
      throw err;
    }
  }

  // FormData인 경우 토큰만 포함
  const headers = options.body instanceof FormData
    ? { ...(token && { Authorization: `Bearer ${token}` }) }
    : {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      };

  const fetchOptions = {
    method: 'GET',
    credentials: 'include',
    ...options,
    headers: {
      ...headers,
      ...(options.headers || {}),
    },
  };

  try {
    const response = await fetch(`${config.baseURL}${endpoint}`, fetchOptions);

    return response;
  } catch (err) {
    console.error('❌ fetchClient 에러:', err);
    throw err;
  }
};

export default fetchClient;