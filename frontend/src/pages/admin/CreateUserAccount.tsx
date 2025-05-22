import { FC, useState } from "react";
import { AppDispatch } from "../../store";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { adminCreateAccount } from "../../store/slices/Identity/accountSlice";
import { UpdateAccountDTO } from "../../types/Identity/accountType";
import EditAccountRoles from "../../replaceable/account/EditAccountRoles";

const CreateUserAccount: FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [selectedRoles, setSelectedRoles] = useState<number[]>([]);

  const handleRoleChange = (roleNumber: number) => {
    setSelectedRoles((prevSelected) =>
      prevSelected.includes(roleNumber)
        ? prevSelected.filter((num) => num !== roleNumber)
        : [...prevSelected, roleNumber]
    );
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const acct: UpdateAccountDTO = {
      account: {
        id: 0,
        username: (event.target as HTMLFormElement).username.value,
        password: (event.target as HTMLFormElement).password.value.trim(),
        isActive: (event.target as HTMLFormElement).isActive.checked,
        isLocked: (event.target as HTMLFormElement).isLocked.checked,
        lastLogin: new Date(0),
        createdOn: new Date(0),
        modifiedOn: new Date(0),
      },
      roles: selectedRoles,
    };

    if (
      acct.account.username &&
      acct.account.password &&
      acct.roles.length > 0
    ) {
      try {
        const result = await dispatch(adminCreateAccount(acct));
        if (result.success) {
          navigate("/AdminAccountScreen");
          alert("User account created successfully!");
          return;
        }
      } catch (error) {
        console.error("Error creating user account:", error);
      }
    } else {
      alert("Please fill in all fields.");
    }
  };

  return (
    <>
      <div className="container mt-5">
        <h1>Create User Account</h1>
        <form onSubmit={handleSubmit} className="mt-4">
          <div className="mb-3">
            <label htmlFor="username" className="form-label">
              Username
            </label>
            <input
              type="text"
              className="form-control"
              id="username"
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              type="password"
              className="form-control"
              id="password"
              required
            />
          </div>
          <div className="mb-3 form-check">
            <input
              type="checkbox"
              className="form-check-input mb-3"
              id="isActive"
              defaultChecked
            />
            <label className="form-check-label" htmlFor="isActive">
              Is Active
            </label>
            <input
              type="checkbox"
              className="form-checkbox ms-4 mb-3"
              id="isLocked"
            />
            <label className="form-check-label" htmlFor="isLocked">
              Is Locked
            </label>
          </div>
          <div className="mb-3">
            <h3>Roles</h3>
            <EditAccountRoles
              selectedRoles={selectedRoles}
              onRoleChange={handleRoleChange}
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Create Account
          </button>
        </form>
      </div>
    </>
  );
};

export default CreateUserAccount;
