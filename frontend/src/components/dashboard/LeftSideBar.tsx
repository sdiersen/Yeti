import { FC, useState } from "react";
import { Link } from "react-router-dom";

const LeftSideBar: FC = () => {
  const [isSideBarVisible, setIsSideBarVisible] = useState(true);

  const toggleSideBar = () => {
    setIsSideBarVisible((prev) => !prev);
  };

  return (
    <div
      className={`left-sidebar-container ${
        isSideBarVisible ? "show-left-sidebar" : "hide-left-sidebar"
      }`}
    >
      <div className="left-sidebar">
        <nav className="nav flex-column mt-3">
          <Link to="/AdminAccountScreen" className="nav-link">
            Admin Accounts
          </Link>
          <Link to="/CreateUserAccount" className="nav-link">
            Create New Account
          </Link>
        </nav>
      </div>
      <button className="sidebar-toggle" onClick={toggleSideBar}>
        <i
          className={`bi ${
            isSideBarVisible ? "bi-chevron-left" : "bi-chevron-right"
          }`}
        ></i>
      </button>
    </div>
  );
};
export default LeftSideBar;
