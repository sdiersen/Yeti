import { FC, Fragment, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../store";
import { deleteItem } from "../../store/slices/Transaction/ItemSlice";
import LockModifyDelete from "../buttons/LockModifyDelete";
import EntryListByItemId from "../entry/EntryListByItemId";
import DroppableArea from "../droppable/DroppableArea";
import { selectItemEntrySums } from "../../selectors/budgetSelectors";

interface ItemListByCategoryIdProps {
  categoryId: number;
}

const ItemListByCategoryId: FC<ItemListByCategoryIdProps> = ({
  categoryId,
}) => {
  const items = useSelector((state: RootState) => state.item.items).filter(
    (item) => item.categoryId === categoryId
  );
  const entrySums = useSelector(selectItemEntrySums);

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const [expandedItems, setExpandedItems] = useState<Record<number, boolean>>(
    {}
  );

  const handleDeleteItem = async (itemId: number) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        const result = await dispatch(deleteItem(itemId));
        if (result.success) {
          alert("Item deleted successfully!");
        } else {
          alert("Failed to delete item: ");
        }
      } catch (error) {
        console.error("Error deleting item:", error);
      }
    }
  };

  const toggleItem = (itemId: number) => {
    setExpandedItems((prev) => ({
      ...prev,
      [itemId]: !prev[itemId],
    }));
  };

  return (
    <>
      <table className="mt-0 pt-0" style={{ width: "100%" }}>
        <tbody>
          {items &&
            items.map((item) => {
              const totalSpent = entrySums[item.id] || 0; // Get the total spent for this item
              const remaining = item.budgetAmount - totalSpent; // Calculate the remaining budget

              return (
                <Fragment key={`${categoryId}${item.id}`}>
                  <DroppableArea
                    key={item.id}
                    id={`item-${item.id}`}
                    categoryId={categoryId}
                    itemId={item.id}>
                    <tr
                      style={{
                        backgroundColor: item.isExpense ? "#f8d7da" : "#d4edda", // Light red for expense, light green otherwise
                      }}
                      title={item.note}>
                      <td>
                        <i
                          className={`bi ${
                            expandedItems[item.id]
                              ? "bi-chevron-up"
                              : "bi-chevron-down"
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
                  {expandedItems[item.id] && (
                    <tr>
                      <td colSpan={6}>
                        <EntryListByItemId itemId={item.id} />
                      </td>
                    </tr>
                  )}
                </Fragment>
              );
            })}
        </tbody>
      </table>
    </>
  );
};
export default ItemListByCategoryId;
