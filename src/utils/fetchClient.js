import { jwtDecode } from 'jwt-decode';
import config from '../config';
import useAuth from '../hooks/useAuth'; 
import { toast } from 'react-toastify';
// import Cookies from 'js-cookie';

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
  const { userInfo } = useAuth.getState();
  if (!userInfo) {
    console.warn("🔒 유저 정보 없음 → 토큰 갱신 시도 생략");
    return null;
  }

  try {
    // const rawToken = Cookies.get('XSRF-TOKEN');
    // const csrfToken = decodeURIComponent(rawToken || '').trim();
    // console.log(csrfToken, "fetch")
    
    const response = await fetch(`${config.baseURL}/auth/token/refresh`, {
      method: 'POST',
      credentials: 'include', //  refreshToken 쿠키 자동 포함
      // headers: {
      //   'Content-Type': 'application/json',       
      //   'X-XSRF-TOKEN': csrfToken,
      // },
      // body: JSON.stringify({})
    });
  

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
    toast.info('세션이 만료되어 다시 로그인 해주세요.');
  }
  
};

const fetchClient = async (url, options = {}) => {
  const { userInfo, setUser, logout, isLoggedIn } = useAuth.getState();
  let token = userInfo?.accessToken;
  
  // accessToken이 없거나 만료되었으면 갱신
  if (!token || isTokenExpired(token)) {
    try {
      
        token = await refreshAccessToken(); // 갱신된 토큰으로 교체
      

      // zustand userInfo 상태에 새 토큰 저장
      setUser({
        ...userInfo,
        accessToken: token,
      });

    } catch (err) {
      console.error('❌ 자동 갱신 실패:', err);
      logout(); // 상태 정리 후 로그인 페이지로 이동
      throw err;
    }
  }

  // const rawToken = Cookies.get('XSRF-TOKEN');
  // const csrfToken = decodeURIComponent(rawToken || '').trim();

  // FormData인 경우 토큰만 포함
  const headers = options.body instanceof FormData
    ? {
        ...(token && { Authorization:` Bearer ${token}` }),
        // ...(csrfToken && { 'X-XSRF-TOKEN': csrfToken }),
      }
    : {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token} `}),
        // ...(csrfToken && { 'X-XSRF-TOKEN': csrfToken }),
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
    const res = await fetch(`${config.baseURL}${url}`, fetchOptions);

    if (!res.ok && res.status >= 500) {
      reportError({
        error: new Error(`fetch 500 error on ${url}`),
        url,
      });
    }

    return res;
  } catch (err) {
    reportError({ err, url});
    console.error('fetchClient 에러:', err);
    throw err;
  }
};

export default fetchClient;