import { FC } from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/account/Login";
import NewAccount from "./pages/account/NewAccount";

const AppRoutes: FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/Login" element={<Login />} />
      <Route path="/NewAccount" element={<NewAccount />} />
    </Routes>
  );
};

export default AppRoutes;
