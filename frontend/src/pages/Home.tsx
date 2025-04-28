import { FC } from "react";
import LogoutButton from "../components/account/LogoutButton";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import { useNavigate } from "react-router-dom";

const Home: FC = () => {
  const navigate = useNavigate();

  const username = useSelector(
    (state: RootState) => state.account.data.account.username
  );
  const roles = useSelector((state: RootState) => state.account.data.roleNames);

  const adminRoles = ["Admin", "SuperAdmin"];
  const isAdmin = roles.some((role) => adminRoles.includes(role));

  const isUser = roles.includes("User");

  const specialRoles = ["Moderator", "Creator", "Guest"];
  const hasSpecialRole = roles.some((role) => specialRoles.includes(role));

  return (
    <>
      <h1>{`Welcome to ${username}'s Home Page`}</h1>
      <p>This is the home page of our application.</p>
      <div className="d-flex">
        {isUser && (
          <button
            className="btn btn-primary me-2"
            onClick={() => alert("User button clicked!")}
          >
            User Button
          </button>
        )}
        {isAdmin && (
          <button
            className="btn btn-secondary me-2"
            onClick={() => navigate("/AdminDashboard")}
          >
            Admin Button
          </button>
        )}
        {hasSpecialRole && (
          <button
            className="btn btn-success me-2"
            onClick={() => alert("Special role button clicked!")}
          >
            Special Role Button
          </button>
        )}
      </div>
      <div className="mt-3">
        <LogoutButton />
      </div>
    </>
  );
};

export default Home;
