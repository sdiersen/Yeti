import { FC } from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/account/Login";
import NewAccount from "./pages/account/NewAccount";
import Unauthorized from "./Unauthorized";
import ProtectedRoute from "./ProtectedRoute";
import AdminDashboard from "./pages/admin/AdminDashboard";

const AppRoutes: FC = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/Unauthorized" element={<Unauthorized />} />
      <Route path="/Login" element={<Login />} />
      <Route path="/NewAccount" element={<NewAccount />} />

      {/* User Routes */}
      <Route element={<ProtectedRoute requiredRoles={["User"]} />}>
        <Route path="/" element={<Home />} />
      </Route>

      {/* Admin Routes */}
      <Route element={<ProtectedRoute requiredRoles={["Admin"]} />}>
        <Route path="/AdminDashboard" element={<AdminDashboard />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
