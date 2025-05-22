import { FC } from "react";
import { Route, Routes } from "react-router-dom";
import NewAccount from "./pages/account/NewAccount";
import Unauthorized from "./Unauthorized";
import ProtectedRoute from "./ProtectedRoute";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminAccountScreen from "./pages/admin/AdminAccountScreen";
import ModifyAccount from "./pages/account/ModifyAccount";
import CreateUserAccount from "./pages/admin/CreateUserAccount";
import Dashboard from "./pages/Dashboard";
import Unknown from "./pages/Unknown";
import CreateCategory from "./replaceable/category/CreateCategory";
import CategoryList from "./replaceable/category/CategoryList";
import ModifyCategory from "./replaceable/category/ModifyCategory";
import CreateItem from "./replaceable/item/CreateItem";
import ItemList from "./replaceable/item/ItemList";
import ModifyItem from "./replaceable/item/ModifyItem";
import CreateEntry from "./replaceable/entry/CreateEntry";
import EntryList from "./replaceable/entry/EntryList";
import UserBudget from "./replaceable/BudgetViews/UserBudget";
import { LoginProvider } from "./pages/login/components/LoginProvder";

const AppRoutes: FC = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/Login" element={<LoginProvider />} />
      <Route path="/Unauthorized" element={<Unauthorized />} />
      <Route path="/NewAccount" element={<NewAccount />} />

      {/* User Routes */}
      <Route element={<ProtectedRoute requiredRoles={["User"]} />}>
        <Route path="/" element={<Dashboard />}>
          <Route path="CreateCategory" element={<CreateCategory />} />
          <Route path="CategoryList" element={<CategoryList />} />
          <Route path="ModifyCategory" element={<ModifyCategory />} />
          <Route path="CreateItem" element={<CreateItem />} />
          <Route path="ItemList" element={<ItemList />} />
          <Route path="ModifyItem" element={<ModifyItem />} />
          <Route path="CreateEntry" element={<CreateEntry />} />
          <Route path="EntryList" element={<EntryList />} />
          <Route path="UserBudget" element={<UserBudget />} />
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
