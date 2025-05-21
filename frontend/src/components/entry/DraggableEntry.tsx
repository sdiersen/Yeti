import { FC, useState } from "react";
import { EntryType } from "../../types/transaction/entryType";
import { useDraggable } from "@dnd-kit/core";
import "../../assets/css/shared/Colors.css";
import { DRAG_AND_DROP_TYPE } from "../../dnd/dndConstants";

const DraggableEntry: FC<{ entry: EntryType }> = ({ entry }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: `entry-${entry.id}`,
      data: { entry, type: DRAG_AND_DROP_TYPE.ENTRY },
    });

  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    visible: boolean;
  }>({ x: 0, y: 0, visible: false });

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      visible: true,
    });
  };

  const closeContextMenu = () => {
    setContextMenu({ x: 0, y: 0, visible: false });
  };

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
      title={entry.note}
      onContextMenu={handleContextMenu}>
      <td className="ps-4">
        {new Date(entry.entryDate)
          .toLocaleDateString("en-US", {
            month: "numeric",
            day: "numeric",
          })
          .replace(/\//g, "-")}
      </td>
      <td>Amount: {entry.amount}</td>
      {contextMenu.visible && (
        <div
          style={{
            position: "absolute",
            top: `${contextMenu.y}px`,
            left: `${contextMenu.x}px`,
            backgroundColor: "white",
            border: "1px solid #ccc",
            borderRadius: "4px",
            boxShadow: "0 2px 5px rgba(0, 0, 0, 0.2)",
            zIndex: 1000,
          }}
          onClick={closeContextMenu}>
          <ul style={{ listStyle: "none", margin: 0, padding: "8px" }}>
            <li
              style={{ padding: "4px 8px", cursor: "pointer" }}
              onClick={() => {
                alert("Modify Entry");
                closeContextMenu();
              }}>
              Edit Entry
            </li>
            <li
              style={{ padding: "4px 8px", cursor: "pointer" }}
              onClick={() => {
                alert("Delete Entry");
                closeContextMenu();
              }}>
              Delete Entry
            </li>
          </ul>
        </div>
      )}
    </tr>
  );
};

export default DraggableEntry;
