import { FC, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { newAccount } from "../../store/slices/Identity/accountSlice";
import { AppDispatch, RootState } from "../../store";

const NewAccount: FC = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const accountState = useSelector((state: RootState) => state.account);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    if (username && password) {
      try {
        await dispatch(newAccount(username, password));
        console.log("Account state after dispatch: ", accountState);
        if (accountState.success) {
          alert("Account created successfully!");
          navigate("/Login");
        } else {
          for (const key in accountState.messages) {
            alert(`${key}: ${accountState.messages[key]}`);
          }
        }
      } catch (error) {
        console.error("Error creating account:", error);
      }
    }
  };
  return (
    <div>
      <h1>Create New Account</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="username">Username:</label>
        <input
          type="text"
          id="username"
          name="username"
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <br />
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          name="password"
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <br />
        <label htmlFor="password">Confirm Password:</label>
        <input
          type="password"
          id="confirm-password"
          name="confirm-password"
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <button type="submit">Create Account</button>
      </form>
    </div>
  );
};

export default NewAccount;
