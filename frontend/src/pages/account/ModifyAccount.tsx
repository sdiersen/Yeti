import { FC, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { AppDispatch } from "../../store";
import {
  AccountWithRolesDTO,
  defaultAccountWithRolesDTO,
  UpdateAccountDTO,
} from "../../types/Identity/accountType";
import { updateAccount } from "../../store/slices/Identity/accountSlice";
import EditAccountRoles from "../../components/account/EditAccountRoles";

const ModifyAccount: FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const location = useLocation();
  const userInfo: AccountWithRolesDTO =
    location.state?.userInfo || defaultAccountWithRolesDTO;

  const [selectedRoles, setSelectedRoles] = useState<number[]>(
    userInfo.roles.map((role) => role.roleNumber || 0)
  );

  const handleRoleChange = (roleNumber: number) => {
    setSelectedRoles((prevSelected) =>
      prevSelected.includes(roleNumber)
        ? prevSelected.filter((num) => num !== roleNumber)
        : [...prevSelected, roleNumber]
    );
  };

  const handleSaveButton = async (event: React.FormEvent) => {
    event.preventDefault();
    const updateAccountDTO: UpdateAccountDTO = {
      account: {
        id: userInfo.account.id,
        username: (event.target as HTMLFormElement).username.value,
        password:
          (event.target as HTMLFormElement).password.value.trim() ||
          userInfo.account.password,
        isActive: (event.target as HTMLFormElement).isActive.checked,
        isLocked: (event.target as HTMLFormElement).isLocked.checked,
        lastLogin: userInfo.account.lastLogin,
        createdOn: userInfo.account.createdOn,
        modifiedOn: userInfo.account.modifiedOn,
      },
      roles: selectedRoles,
    };
    try {
      const result = await dispatch(updateAccount(updateAccountDTO));
      if (result.success) {
        alert("Account updated successfully!");
        navigate("/AdminAccountScreen");
      } else {
        console.error(
          "Failed to update account:",
          result.messages,
          result.errors
        );
        for (const key in result.messages) {
          console.log(`${key}: ${result.messages[key]}`);
        }
        for (const key in result.errors) {
          console.log(`${key}: ${result.errors[key]}`);
        }
      }
    } catch (error) {
      console.error("Error updating account:", error);
    }
  };

  return (
    <div className="container mt-5">
      <h1>Modify Account</h1>
      <form className="mt-4" onSubmit={handleSaveButton}>
        <div className="mb-3">
          <label htmlFor="username" className="form-label">
            Username
          </label>
          <input
            type="text"
            className="form-control"
            id="username"
            defaultValue={userInfo.account.username}
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
            placeholder="Leave blank to keep current password"
          />
        </div>
        <div className="mb-3">
          <label htmlFor="isActive" className="form-label me-2">
            Active
          </label>
          <input
            type="checkbox"
            className="form-check-input"
            id="isActive"
            defaultChecked={userInfo.account.isActive}
          />
          <label htmlFor="isLocked" className="form-check-label ms-4 me-2">
            Locked
          </label>
          <input
            type="checkbox"
            className="form-check-input"
            id="isLocked"
            defaultChecked={userInfo.account.isLocked}
          />
        </div>
        <EditAccountRoles
          selectedRoles={selectedRoles}
          onRoleChange={handleRoleChange}
        />
        <button type="submit" className="btn btn-primary">
          Save Changes
        </button>
        <button
          type="button"
          className="btn btn-secondary ms-2"
          onClick={() => navigate("/AdminAccountScreen")}>
          Cancel
        </button>
      </form>
    </div>
  );
};

export default ModifyAccount;
