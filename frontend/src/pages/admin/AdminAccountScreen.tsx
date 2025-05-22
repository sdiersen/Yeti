import { FC, useEffect, useState } from "react";
import { AccountWithRolesDTO } from "../../types/Identity/accountType";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axios";
import { ApiResponseDataType } from "../../types/api/apiResponseType";
import LogoutButton from "../../replaceable/account/LogoutButton";

const AdminAccountScreen: FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [accounts, setAccounts] = useState<AccountWithRolesDTO[]>([]); // Replace 'any' with your actual account type
  const navigate = useNavigate();

  useEffect(() => {
    const fectchAccounts = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axiosInstance.get<
          ApiResponseDataType<AccountWithRolesDTO[]>
        >("/account/GetAllAccounts");
        setAccounts(response.data.data);
      } catch (error) {
        setError("Failed to fetch accounts. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fectchAccounts();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  const deleteAccount = async (accountId: number) => {
    setLoading(true);
    setError(null);
    try {
      await axiosInstance.delete(`/account/DeleteAccount/${accountId}`);
      setAccounts((prevAccounts) =>
        prevAccounts.filter((account) => account.account.id !== accountId)
      );
    } catch (error) {
      setError("Failed to delete account. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Account List</h1>
      <div className="d-flex">
        <button
          className="btn btn-primary"
          onClick={() => navigate("/CreateUserAccount")}>
          Create New Account
        </button>
        <button
          className="btn btn-secondary ms-4"
          onClick={() => navigate("/AdminDashboard")}>
          Back to Admin Screen
        </button>
        <LogoutButton classname="btn-danger ms-4" />
      </div>
      <table className="table table-striped">
        <thead>
          <tr>
            <th className="text-start">Username</th>
            <th className="text-start">Active</th>
            <th className="text-start">Locked</th>
            <th className="text-start">Last Login</th>
            <th className="text-start">Roles</th>
            <th className="text-start">Actions</th>
          </tr>
        </thead>
        <tbody>
          {accounts.map((accountWithRoles) => (
            <tr key={accountWithRoles.account.id}>
              <td className="text-start">
                {accountWithRoles.account.username}
              </td>
              <td className="text-start">
                {accountWithRoles.account.isActive ? "Yes" : "No"}
              </td>
              <td className="text-start">
                {accountWithRoles.account.isLocked ? "Yes" : "No"}
              </td>
              <td className="text-start">
                {new Date(accountWithRoles.account.lastLogin).toLocaleString()}
              </td>
              <td className="text-start">
                {accountWithRoles.roles.map((role) => role.roleName).join(", ")}
              </td>
              <td className="text-start">
                {/* <LockModifyDelete
                  initialLocked={true}
                  onModify={() => {
                    navigate("/ModifyAccount", {
                      state: { userInfo: accountWithRoles },
                    });
                  }}
                  onDelete={() => {
                    if (
                      window.confirm(
                        "Are you sure you want to delete this account?"
                      )
                    ) {
                      deleteAccount(accountWithRoles.account.id);
                    }
                  }}
                /> */}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminAccountScreen;
