import { Navigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import Loading from './Loading';

const PrivateRoute = ({ children, allowedRoles = [] }) => {
  const { userInfo, isLoggedIn, isInitializing } = useAuth();

  if (isInitializing) {
    return <Loading text={"로딩중입니다."} />;
  }

  if (!isLoggedIn || !userInfo) {
    console.log(isLoggedIn, userInfo)
    console.log('로그인 상태 아님 → 로그인 페이지로 리다이렉트');
    return <Navigate to="/login" replace />;
  }

  // 역할 기반 보호 (필요한 경우만 활성화)
  // if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
  //   console.log('권한 없음 → 메인 페이지로');
  //   return <Navigate to="/" replace />;
  // }

  return children;
};

export default PrivateRoute;