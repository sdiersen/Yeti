import { FC, useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../store";
import {
  loginAccount,
  logout,
} from "../../../store/slices/Identity/accountSlice";
import { LoginFormValues } from "../types/loginSchema";

const Login: FC = () => {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useFormContext<LoginFormValues>();

  const dispatch = useDispatch<AppDispatch>();

  const { data } = useSelector((state: RootState) => state.account);

  useEffect(() => {
    if (data.account.id > 0) {
      (async () => {
        try {
          await dispatch(logout());
        } catch (error) {
          console.error("Error logging out:", error);
        }
      })();
    }
  });

  const onSubmit = async (data: LoginFormValues) => {
    const result = await dispatch(loginAccount(data.username, data.password));
    if (result.success) {
      // Handle successful login, e.g., redirect to home page
      console.log("Login successful");
    } else {
      // Handle login error
      console.error("Login failed:", result.messages);
      setTimeout(() => {
        console.log("Clearing username and password");
        data.username = "";
        data.password = "";
      }, 1000);
    }
  };

  return (
    <>
      <h1>Login now</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input {...register("username")} placeholder="Username" />
        <input
          type="password"
          {...register("password")}
          placeholder="Password"
        />
        <button type="submit">Login</button>
      </form>
    </>
  );
};

export default Login;
