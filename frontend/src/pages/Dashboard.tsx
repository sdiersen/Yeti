import { FC } from "react";
import { Outlet } from "react-router-dom";
import RightSideBar from "../components/dashboard/RightSideBar";
import TopTitleBar from "../components/dashboard/TopTitleBar";
import LeftSideBar from "../components/dashboard/LeftSideBar";
import "../assets/css/dashboard.css";

const Dashboard: FC = () => {
  const leftSideBarProps = {
    LinkTable: [
      {
        name: "Admin",
        links: [
          { name: "User Management", uri: "/AdminAccountScreen" },
          { name: "Create User Account", uri: "/CreateUserAccount" },
        ],
      },
    ],
  };

  return (
    <div className="dashboard-container">
      {/* Top Title Bar */}
      <TopTitleBar />
      <div className="dashboard-content">
        {/* Left Navigation Bar */}
        <LeftSideBar {...leftSideBarProps} />

        {/* Main Content Area */}
        <div className="main-content">
          <Outlet />
        </div>
        {/* Right Sidebar */}
        <RightSideBar />
      </div>
    </div>
  );
};

export default Dashboard;
