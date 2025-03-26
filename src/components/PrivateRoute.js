import { Navigate } from "react-router-dom";
import useToken from "../hooks/useToken";

const PrivateRoute = ({ children }) => {
  const { getToken } = useToken();
  const token = getToken();
  
  if (!token) {
    return <Navigate to="/login" />;
  }

  return children;
}

export default PrivateRoute;