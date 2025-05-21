import { useNavigate } from "react-router-dom";
import { ItemType } from "../../types/transaction/itemType";
import { FC } from "react";
import { useDroppable } from "@dnd-kit/core";
import LockModifyDelete from "../buttons/LockModifyDelete";

interface DroppableItemRowProps {
  id: string;
  item: ItemType;
  remaining: number;
  isExpanded: boolean;
  toggleItem: (itemId: number) => void;
  handleDeleteItem: (itemId: number) => void;
}

const DroppableItemRow: FC<DroppableItemRowProps> = ({
  id,
  item,
  remaining,
  isExpanded,
  toggleItem,
  handleDeleteItem,
}) => {
  const navigate = useNavigate();
  const { setNodeRef, isOver } = useDroppable({
    id,
    data: { categoryId: item.categoryId, itemId: item.id },
  });

  const style = {
    padding: "16px",
    margin: "8px",
    borderColor: isOver ? "#d4edda" : "#f8f9fa",
    border: "1px solid #ccc",
    borderRadius: "4px",
  };

  return (
    <tr
      ref={setNodeRef}
      style={style}
      className={`${
        item.isExpense ? "background-expense" : "background-income"
      }`}
      title={item.note}>
      <td>
        <i
          className={`bi ${
            isExpanded ? "bi-chevron-up" : "bi-chevron-down"
          } me-2`}
          style={{ cursor: "pointer" }}
          onClick={() => toggleItem(item.id)}></i>
        {item.name}
        <i
          className="bi bi-plus-circle ms-2"
          style={{ cursor: "pointer" }}
          onClick={() => {
            navigate("/createentry", {
              state: { itemId: item.id },
            });
          }}></i>
      </td>
      <td>Budget: {item.budgetAmount}</td>
      <td>Remaining: {remaining}</td>
      {/* <td className="text-end">
        <LockModifyDelete
          initialLocked={true}
          onModify={() => {
            navigate("/ModifyItem", { state: { item } });
          }}
          onDelete={() => {
            () => handleDeleteItem(item.id);
          }} 
        />
      </td>*/}
    </tr>
  );
};

export default DroppableItemRow;
