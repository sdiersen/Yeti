import { FC } from "react";
import LogoutButton from "../../replaceable/account/LogoutButton";
import { useNavigate } from "react-router-dom";

const AdminDashboard: FC = () => {
  const navigate = useNavigate();
  return (
    <>
      <div>
        <h1>Admin Dashboard</h1>
        <p>Welcome to the admin dashboard!</p>
      </div>
      <button
        className="btn btn-success me-2"
        onClick={() => navigate("/AdminAccountScreen")}>
        Show Accounts
      </button>
      <LogoutButton classname="btn-primary" />
    </>
  );
};

export default AdminDashboard;
