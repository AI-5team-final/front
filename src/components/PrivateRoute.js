import { Navigate } from "react-router-dom";
import useToken from "../hooks/useToken";

const PrivateRoute = ({ children, allowedRoles = [] }) => {
  const { token, role } = useToken();
  
  if (!token) {
    console.log('토큰 없음 → 로그인으로 리다이렉트');
    return <Navigate to="/login" replace />;
  }

  if (!role) {
    console.log('유저 role 없음 → 로그인으로 리다이렉트');
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    console.log('접근 권한 없음 → 메인으로');
    return <Navigate to="/" replace />;
  }

  console.log('인증 성공 → 컨텐츠 렌더링');
  return children;
};


export default PrivateRoute;