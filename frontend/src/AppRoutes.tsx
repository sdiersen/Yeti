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

const AppRoutes: FC = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Login />} />
      <Route path="/Login" element={<Login />} />
      <Route path="/Unauthorized" element={<Unauthorized />} />
      <Route path="/NewAccount" element={<NewAccount />} />
      <Route path="/Dashboard" element={<Dashboard />} />

      {/* User Routes */}
      <Route element={<ProtectedRoute requiredRoles={["User"]} />}>
        <Route path="/Home" element={<Home />} />
      </Route>

      {/* Admin Routes */}
      <Route element={<ProtectedRoute requiredRoles={["Admin"]} />}>
        <Route path="/AdminDashboard" element={<AdminDashboard />} />
        <Route path="/AdminAccountScreen" element={<AdminAccountScreen />} />
        <Route path="/CreateUserAccount" element={<CreateUserAccount />} />
      </Route>

      {/* Admin or User Routes */}
      <Route element={<ProtectedRoute requiredRoles={["Admin", "User"]} />}>
        <Route path="/ModifyAccount" element={<ModifyAccount />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
