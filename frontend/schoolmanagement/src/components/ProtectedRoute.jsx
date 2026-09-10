import { Navigate, Outlet, useLocation } from "react-router-dom";

function ProtectedRoute({ roles }) {
  const location = useLocation();
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "null");

  if (!token || !user) {
    return <Navigate to="/" replace state={{ from: location.pathname }} />;
  }

  if (roles?.length && !roles.includes(user.role)) {
    const dashboard = user.role === "principal"
      ? "/admin-dashboard"
      : user.role === "teacher"
        ? "/dashboard"
        : "/student-dashboard";
    return <Navigate to={dashboard} replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;
