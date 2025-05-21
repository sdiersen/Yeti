import { FC, useEffect, useState } from "react";
import { RoleType } from "../../types/Identity/roleType";
import { getAllRoles } from "../../store/slices/Identity/roleSlice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store";

interface EditAccountRolesProps {
  selectedRoles: number[];
  onRoleChange: (roleNumber: number) => void;
}

const EditAccountRoles: FC<EditAccountRolesProps> = ({
  selectedRoles,
  onRoleChange,
}) => {
  const dispatch = useDispatch<AppDispatch>();
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
    <div className="mb-3">
      <label className="form-label">Roles</label>
      <div className="form-text mb-2">
        {selectedRoles.length <= 0 && <strong>No roles selected</strong>}
      </div>
      <div>
        {roles.map((role) => (
          <div
            key={role.roleNumber}
            className="form-check"
            title={role.description}
          >
            <input
              type="checkbox"
              className="form-check-input"
              id={`role-${role.roleNumber}`}
              checked={selectedRoles.includes(role.roleNumber)}
              onChange={() => onRoleChange(role.roleNumber)}
            />
            <label
              htmlFor={`role-${role.roleNumber}`}
              className="form-check-label"
            >
              {role.roleName}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EditAccountRoles;
