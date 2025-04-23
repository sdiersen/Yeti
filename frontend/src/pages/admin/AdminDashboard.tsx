import { FC } from "react";
import LogoutButton from "../../components/account/LogoutButton";
import AdminAccountScreen from "./AdminAccountScreen";

const AdminDashboard: FC = () => {
  return (
    <>
      <div>
        <h1>Admin Dashboard</h1>
        <p>Welcome to the admin dashboard!</p>
        <AdminAccountScreen />
      </div>
      <LogoutButton />
    </>
  );
};

export default AdminDashboard;
