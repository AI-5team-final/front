import { jwtDecode } from 'jwt-decode';
import config from '../config';
import useAuth from '../hooks/useAuth'; 
import { toast } from 'react-toastify';
import { isTokenExpired, refreshAccessToken } from './tokenManager';
// import Cookies from 'js-cookie';


const fetchClient = async (url, options = {}) => {
  const { userInfo, setUser, logout, isLoggedIn } = useAuth.getState();
  let token = userInfo?.accessToken;
  
  // accessToken이 없거나 만료되었으면 갱신
  if (!token || isTokenExpired(token)) {
    token = await refreshAccessToken();
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