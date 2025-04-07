import config from '../config';
import { getAccessToken } from '../utils/tokenUtils';

const fetchClient = async (endpoint, options = {}) => {
  const token = getAccessToken();

  const defaultHeaders = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };

  const fetchOptions = {
    method: 'GET',
    credentials: 'include',
    ...options,
    headers: {
      ...defaultHeaders,
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
