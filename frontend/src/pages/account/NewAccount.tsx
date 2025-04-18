import { FC, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { newAccount } from "../../store/slices/Identity/accountSlice";
import { AppDispatch } from "../../store";

const NewAccount: FC = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    if (username && password) {
      try {
        const result = await dispatch(newAccount(username, password));
        if (result.success) {
          alert("Account created successfully!");
          navigate("/Login");
        } else {
          for (const key in result.messages) {
            alert(`${key}: ${result.messages[key]}`);
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
        <label htmlFor="password">Confirm Password:</label>
        <input
          type="password"
          id="confirm-password"
          name="confirm-password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <br />
        <button type="submit">Create Account</button>
        <button type="button" onClick={() => navigate("/Login")}>
          Back to Login
        </button>
        <button
          type="button"
          onClick={() => {
            setUsername("");
            setPassword("");
            setConfirmPassword("");
          }}
        >
          Clear
        </button>
      </form>
    </div>
  );
};

export default NewAccount;
