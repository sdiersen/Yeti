import { FC } from "react";

const RightSideBar: FC = () => {
  return (
    <div className="right-sidebar">
      {/* Calendar Section */}
      <div className="section">
        <h5>Calendar</h5>
        <p>Calendar content goes here.</p>
      </div>

      {/* Notifications Section */}
      <div className="section">
        <h5>Notifications</h5>
        <p>Notification content goes here.</p>
      </div>

      {/* Notes Section */}
      <div className="section">
        <h5>Notes</h5>
        <p>Notes content goes here.</p>
      </div>
    </div>
  );
};

export default RightSideBar;
