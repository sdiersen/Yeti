import { FC, useState } from "react";
import { Link } from "react-router-dom";
import { LeftSideBarProps } from "../../types/dashboard/leftSideBarType";
import LogoutButton from "../account/LogoutButton";

const LeftSideBar: FC<LeftSideBarProps> = (props) => {
  const toc = props.LinkTable;
  const [isSideBarVisible, setIsSideBarVisible] = useState(true);

  const toggleSideBar = () => {
    setIsSideBarVisible((prev) => !prev);
  };

  return (
    <div
      className={`left-sidebar-container ${
        isSideBarVisible ? "show-left-sidebar" : "hide-left-sidebar"
      }`}>
      <div className="left-sidebar">
        <nav className="nav flex-column mt-3">
          {toc.map((linkGroup, index) => (
            <div key={index} className="nav-group">
              <h5 className="nav-title">{linkGroup.name}</h5>
              {linkGroup.links.map((link, linkIndex) => (
                <Link key={linkIndex} to={link.uri} className="nav-link">
                  {link.name}
                </Link>
              ))}
            </div>
          ))}
        </nav>
        <LogoutButton />
      </div>
      <button className="sidebar-toggle" onClick={toggleSideBar}>
        <i
          className={`bi ${
            isSideBarVisible ? "bi-chevron-left" : "bi-chevron-right"
          }`}></i>
      </button>
    </div>
  );
};
export default LeftSideBar;
