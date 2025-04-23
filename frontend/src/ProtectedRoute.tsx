import { FC } from "react";
import { useSelector } from "react-redux";
import { RootState } from "./store";
import { Navigate, Outlet } from "react-router-dom";

interface ProtectedRouteProps {
  requiredRoles: string[];
}

const ProtectedRoute: FC<ProtectedRouteProps> = ({ requiredRoles }) => {
  const { data } = useSelector((state: RootState) => state.account);

  // Check if the user is logged in and has the required roles
  const hasAccess =
    data.account.id > 0 &&
    data.roleNames.length > 0 &&
    data.roleNames.some((role) => requiredRoles.includes(role));

  if (data.account.id <= 0) {
    // Redirect to login if the user is not logged in
    return <Navigate to="/Login" />;
  }

  if (!hasAccess) {
    // Redirect to an unauthorized page if the user doesn't have access
    return <Navigate to="/Unauthorized" />;
  }

  // Render the child components if the user has access
  return <Outlet />;
};

export default ProtectedRoute;
