import { Navigate } from "react-router-dom";
import useToken from "../hooks/useToken";

const PrivateRoute = ({ children, allowedRoles = [] }) => {
  const { token, role } = useToken();
  
  if (!token) {
    return <Navigate to="/login" />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    return <Navigate to="/" />;
  }

  return children;
}

export default PrivateRoute;