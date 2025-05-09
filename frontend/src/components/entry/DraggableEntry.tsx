import { FC } from "react";
import { EntryType } from "../../types/transaction/entryType";
import { useDraggable } from "@dnd-kit/core";
import LockModifyDelete from "../buttons/LockModifyDelete";
import "../../assets/css/shared/Colors.css";

const DraggableEntry: FC<{ entry: EntryType }> = ({ entry }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: `entry-${entry.id}`,
      data: { entry },
    });

  const style = {
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
    opacity: isDragging ? 0.5 : 1,
    padding: "8px",
    margin: "4px",
    borderRadius: "4px",
    border: "1px solid #ccc",
    cursor: "grab",
  };

  return (
    <tr
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      key={entry.id}
      className={entry.isExpense ? "text-expense" : "text-income"}
      title={entry.note}>
      <td className="ps-4">
        {new Date(entry.entryDate)
          .toLocaleDateString("en-US", {
            month: "numeric",
            day: "numeric",
          })
          .replace(/\//g, "-")}
      </td>
      <td>Amount: {entry.amount}</td>
      <td className="text-end">
        <LockModifyDelete
          initialLocked={true}
          onModify={() => {
            // Handle modify action
          }}
          onDelete={() => {
            // Handle delete action
          }}
        />
      </td>
    </tr>
  );
};

export default DraggableEntry;
