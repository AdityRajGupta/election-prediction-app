import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" replace />;

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    if (user.role === "ADMIN") return <Navigate to="/admin" replace />;
    if (user.role === "WORKER") return <Navigate to="/worker" replace />;
    if (user.role === "LEADER") return <Navigate to="/leader" replace />;
  }

  return children;
};

export default ProtectedRoute;
