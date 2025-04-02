import { Navigate } from "react-router-dom";
import useToken from "../hooks/useToken";

const PrivateRoute = ({ children, allowedRoles = [] }) => {
  const { token, role } = useToken();
  
  // 토큰이 없으면 로그인 페이지로
  if (!token) {
    console.log('토큰이 없어서 로그인 페이지로 리다이렉트');
    return <Navigate to="/login" />;
  }

  // role이 없으면 로그인 페이지로
  if (!role) {
    console.log('role이 없어서 로그인 페이지로 리다이렉트');
    return <Navigate to="/login" />;
  }

  // 특정 role만 허용하는 경우
  if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    console.log('허용되지 않은 role이어서 메인 페이지로 리다이렉트');
    return <Navigate to="/" />;
  }

  console.log('인증 성공, 컨텐츠 렌더링');
  return children;
}

export default PrivateRoute;