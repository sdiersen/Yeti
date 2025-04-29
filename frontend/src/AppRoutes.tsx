import { FC } from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/account/Login";
import NewAccount from "./pages/account/NewAccount";
import Unauthorized from "./Unauthorized";
import ProtectedRoute from "./ProtectedRoute";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminAccountScreen from "./pages/admin/AdminAccountScreen";
import ModifyAccount from "./pages/account/ModifyAccount";
import CreateUserAccount from "./pages/admin/CreateUserAccount";
import Dashboard from "./pages/Dashboard";
import Unknown from "./pages/Unknown";

const AppRoutes: FC = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/Login" element={<Login />} />
      <Route path="/Unauthorized" element={<Unauthorized />} />
      <Route path="/NewAccount" element={<NewAccount />} />

      {/* User Routes */}
      <Route element={<ProtectedRoute requiredRoles={["User"]} />}>
        <Route path="/" element={<Dashboard />}>
          <Route path="Home" element={<Home />} />
        </Route>
      </Route>

      {/* Admin Routes */}
      <Route element={<ProtectedRoute requiredRoles={["Admin"]} />}>
        <Route path="/" element={<Dashboard />}>
          <Route path="AdminDashboard" element={<AdminDashboard />} />
          <Route path="AdminAccountScreen" element={<AdminAccountScreen />} />
          <Route path="CreateUserAccount" element={<CreateUserAccount />} />
        </Route>
      </Route>

      {/* Admin or User Routes */}
      <Route element={<ProtectedRoute requiredRoles={["Admin", "User"]} />}>
        <Route path="/" element={<Dashboard />}>
          <Route path="ModifyAccount" element={<ModifyAccount />} />
        </Route>
      </Route>

      <Route path="*" element={<Unknown />} />
    </Routes>
  );
};

export default AppRoutes;
