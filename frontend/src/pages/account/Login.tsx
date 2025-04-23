import { FC, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import { loginAccount } from "../../store/slices/Identity/accountSlice";
import { useNavigate } from "react-router-dom";

const Login: FC = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { data } = useSelector((state: RootState) => state.account);

  useEffect(() => {
    if (data.account.id > 0) {
      navigate("/Home"); // Redirect to home page if already logged in
    }
  }, [data.account, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (username && password) {
      try {
        const result = await dispatch(loginAccount(username, password));
        if (result.success) {
          navigate("/Home"); // Redirect to home page after successful login
          return; //stop further execution
        }
        if (result.messages) {
          for (const key in result.messages) {
            alert(`${key}: ${result.messages[key]}`);
          }
          for (const key in result.errors) {
            alert(`${key}: ${result.errors[key]}`);
          }
          setUsername("");
          setPassword("");
        }
      } catch (error) {
        console.error("Error logging in:", error);
      }
    }
  };
  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="username">Username:</label>
        <input
          type="text"
          id="username"
          name="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <br />
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <br />
        <button type="submit">Login</button>
        <button type="button" onClick={() => navigate("/NewAccount")}>
          Create New Account
        </button>
      </form>
    </div>
  );
};

export default Login;
