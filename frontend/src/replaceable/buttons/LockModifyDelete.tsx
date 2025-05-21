import { FC, useState } from "react";

interface LockModifyDeleteProps {
  initialLocked: boolean;
  onModify: () => void;
  onDelete: () => void;
}

const LockModifyDelete: FC<LockModifyDeleteProps> = ({
  initialLocked,
  onModify,
  onDelete,
}) => {
  const [isLocked, setIsLocked] = useState(initialLocked);
  const toggleLock = () => {
    setIsLocked((prev) => !prev);
  };
  return (
    <>
      <button
        className="btn btn-warning btn-sm me-2"
        title={isLocked ? "Unlock Account" : "Lock Account"}
        onClick={toggleLock}>
        {isLocked ? "Unlock" : "Lock"}
      </button>
      <button
        className="btn btn-primary btn-sm me-2"
        title="Modify Account"
        onClick={onModify}
        disabled={isLocked}>
        Edit
      </button>
      <button
        className="btn btn-danger btn-sm"
        title="Delete Account"
        onClick={onDelete}
        disabled={isLocked}>
        Delete
      </button>
    </>
  );
};
export default LockModifyDelete;
