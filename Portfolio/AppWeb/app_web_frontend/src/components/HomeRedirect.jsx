import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const HomeRedirect = () => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="login" replace />;
  }
  return <Navigate to="/projects" replace />;
};

export default HomeRedirect;
