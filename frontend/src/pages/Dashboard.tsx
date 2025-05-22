import { FC } from "react";
import { Outlet } from "react-router-dom";
import RightSideBar from "../replaceable/dashboard/RightSideBar";
import TopTitleBar from "../replaceable/dashboard/TopTitleBar";
import LeftSideBar from "../replaceable/dashboard/LeftSideBar";
import "../assets/css/dashboard.css";

const Dashboard: FC = () => {
  const leftSideBarProps = {
    LinkTable: [
      {
        name: "Budget",
        links: [{ name: "User Budget", uri: "/UserBudget" }],
      },
      {
        name: "Admin",
        links: [
          { name: "User Management", uri: "/AdminAccountScreen" },
          { name: "Create User Account", uri: "/CreateUserAccount" },
        ],
      },
      {
        name: "Category",
        links: [
          { name: "Category List", uri: "/CategoryList" },
          { name: "Create Category", uri: "/CreateCategory" },
        ],
      },
      {
        name: "Item",
        links: [
          { name: "Item List", uri: "/ItemList" },
          { name: "Create Item", uri: "/CreateItem" },
        ],
      },
      {
        name: "Entry",
        links: [
          { name: "Entry List", uri: "/EntryList" },
          { name: "Create Entry", uri: "/CreateEntry" },
        ],
      },
      {
        name: "User",
        links: [{ name: "Account Settings", uri: "/" }],
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
