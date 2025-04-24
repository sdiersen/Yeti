import { FC, useEffect, useState } from "react";
import { RoleType } from "../../types/Identity/roleType";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getAllRoles } from "../../store/slices/Identity/roleSlice";
import { AppDispatch } from "../../store";

const ModifyAccount: FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [roles, setRoles] = useState<RoleType[]>([]);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const data = await dispatch(getAllRoles());
        if (data.success) {
          setRoles(data.data);
        } else {
          console.error("Failed to fetch roles:", data.messages, data.errors);
        }
      } catch (error) {
        console.error("Error fetching roles:", error);
      }
    };
    fetchRoles();
  }, [dispatch]);

  return (
    <div className="container mt-5">
      <h1>Modify Account</h1>
      <ul>
        {roles.map((role) => (
          <li key={role.id}>
            {role.roleNumber} - {role.roleName} - {role.description}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ModifyAccount;
