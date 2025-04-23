import { FC } from "react";
import { AppDispatch } from "../../store";
import { useDispatch } from "react-redux";
import { logout } from "../../store/slices/Identity/accountSlice";
import { useNavigate } from "react-router-dom";

const LogoutButton: FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/Login", { replace: true });
  };
  return <button onClick={handleLogout}>Logout</button>;
};

export default LogoutButton;
