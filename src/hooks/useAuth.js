import { useNavigate } from 'react-router-dom';
import useToken from './useToken';

const useAuth = () => {
  const navigate = useNavigate();
  const { removeToken } = useToken();

  const logout = () => {
    removeToken();
    navigate('/login');
  };

  return { logout };
};

export default useAuth;