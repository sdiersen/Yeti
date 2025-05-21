import { FC, Fragment } from "react";
import { ItemType } from "../../types/transaction/itemType";
import { useNavigate } from "react-router-dom";
import DroppableArea from "../droppable/DroppableArea";
import LockModifyDelete from "../buttons/LockModifyDelete";
import EntryListByItemId from "../entry/EntryListByItemId";

interface ItemRowProps {
  item: ItemType;
  categoryId: number;
  remaining: number;
  isExpanded: boolean;
  toggleItem: (itemId: number) => void;
  handleDeleteItem: (itemId: number) => void;
}

const ItemRow: FC<ItemRowProps> = ({
  item,
  categoryId,
  remaining,
  isExpanded,
  toggleItem,
  handleDeleteItem,
}) => {
  const navigate = useNavigate();
  return (
    <Fragment key={`${categoryId}${item.id}`}>
      <DroppableArea
        key={item.id}
        id={`item-${item.id}`}
        categoryId={categoryId}
        itemId={item.id}>
        <tr
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
          <td className="text-end">
            <LockModifyDelete
              initialLocked={true}
              onModify={() => {
                navigate("/ModifyItem", { state: { item } });
              }}
              onDelete={() => {
                () => handleDeleteItem(item.id);
              }}
            />
          </td>
        </tr>
      </DroppableArea>
      {isExpanded && (
        <tr>
          <td colSpan={6}>
            <EntryListByItemId itemId={item.id} />
          </td>
        </tr>
      )}
    </Fragment>
  );
};
export default ItemRow;
