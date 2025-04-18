import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import config from '../config';
import useAuth from '../hooks/useAuth';
import { toast } from 'react-toastify';
// import Cookies from 'js-cookie';


// 토큰 유효성 검사 함수
// 요청 전에 JWT를 decode해서 만료되었는지 확인함
const isTokenExpired = (token) => {
  if (!token) return true;
  try {
    const { exp } = jwtDecode(token);
    const now = Date.now() / 1000;
    return exp < now;
  } catch (err) {
    return true;
  }
};


// accessToken을 갱신하는 함수
// 만료 시, /auth/token/refresh로 refreshToken을 보내서 새 accessToken을 발급받음
const refreshAccessToken = async () => {
  const { userInfo } = useAuth.getState();
  if (!userInfo) {
    console.warn("🔒 유저 정보 없음 → 토큰 갱신 시도 생략");
    return null;
  }
  
  try {
    // const rawToken = Cookies.get('XSRF-TOKEN');
    // const csrfToken = decodeURIComponent(rawToken || '').trim();
    // console.log(rawToken, csrfToken, "axios csrf");
    
    const response = await axios.post(`${config.baseURL}/auth/token/refresh`, null, {
      withCredentials: true, // 쿠키에 있는 refreshToken 전송
      // headers: {
      //   'Content-Type': 'application/json',
      //   'X-XSRF-TOKEN': csrfToken,
      // },
    });

    if (!response.ok) {
      const error = new Error(`토큰 갱신 실패: ${response.status}`);
      reportError({
        error,
        url: '/auth/token/refresh',
      });
  
      throw error;
    }

    const { accessToken } = response.data;

    if (accessToken) {
      const { userInfo, setUser } = useAuth.getState();
      setUser({ ...userInfo, accessToken });
      return accessToken;
    }
  } catch (err) {
    console.error('⚠️ 토큰 갱신 실패:', err);
    toast.info('세션이 만료되어 다시 로그인 해주세요.');
    reportError({
      err,
      url: '/auth/token/refresh',
    });
    throw err;
  }
};

// Axios 인스턴스 생성
const axiosInstance = axios.create({
  baseURL: config.baseURL,
  withCredentials: true, // 쿠키 포함
  headers: {
    'Content-Type': 'application/json',
  }
});

// 요청 인터셉터: accessToken 자동 추가
// 모든 요청에 Authorization: Bearer 헤더를 자동으로 붙임
axiosInstance.interceptors.request.use(
  async (config) => {
    const { isLoggedIn, userInfo } = useAuth.getState();
    let token = userInfo?.accessToken;

    // 만료되거나 없을때 경우 자동으로 갱신
    if (!token || isTokenExpired(token)) {
      try {
      
      
          token = await refreshAccessToken(); // 갱신된 토큰으로 교체
      
        
      } catch (err) {
        console.warn('🔒 accessToken 갱신 실패');
        throw err;
      }
    }


    // Authorization 헤더 추가
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // CSRF 토큰 추가
    // const rawToken = Cookies.get('XSRF-TOKEN');
    // const csrfToken = decodeURIComponent(rawToken || '').trim();
    // if (csrfToken) {
    //   config.headers['X-XSRF-TOKEN'] = csrfToken;
    // }
    // config.withCredentials = true;

    return config;
  },
  (error) => {
    const { response } = error;

    // 조건: 서버 오류(500 이상)만 report
    if (response && response.status >= 500) {
      reportError({
        error,
        url: response.config?.url,
      });
    }
    Promise.reject(error)
  }
);



export default axiosInstance;