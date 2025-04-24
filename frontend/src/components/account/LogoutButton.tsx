import { FC } from "react";
import { AppDispatch } from "../../store";
import { useDispatch } from "react-redux";
import { logout } from "../../store/slices/Identity/accountSlice";
import { useNavigate } from "react-router-dom";

interface LogoutButtonProps {
  classname?: string;
}

const LogoutButton: FC<LogoutButtonProps> = ({ classname }) => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const classes = classname ? classname : "btn-success";

  const handleLogout = () => {
    dispatch(logout());
    navigate("/Login", { replace: true });
  };
  return (
    <button className={`btn ${classes}`} onClick={handleLogout}>
      Logout
    </button>
  );
};

export default LogoutButton;
