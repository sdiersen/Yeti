import { FC } from "react";
import DateTime from "../ui/DateTime";
import { RootState } from "../../store";
import { useSelector } from "react-redux";

const TopTitleBar: FC = () => {
  const username = useSelector(
    (state: RootState) => state.account.data.account.username
  );
  return (
    <div className="top-title-bar">
      <div className="col-3 d-flex align-items-center">
        <DateTime />
      </div>
      <div className="col-6 text-center">
        <h1>Dashboard</h1>
      </div>
      <div className="col-3 d-flex justify-content-end align-items-center">
        <span>{`Welcome, ${username}`}</span>
      </div>
    </div>
  );
};
export default TopTitleBar;
