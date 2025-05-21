import { FC, Fragment, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../store";
import { deleteItem } from "../../store/slices/Transaction/ItemSlice";
import EntryListByItemId from "../entry/EntryListByItemId";
import { selectItemEntrySums } from "../../selectors/budgetSelectors";
import DroppableItemRow from "./DroppableItemRow";

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
                  <DroppableItemRow
                    id={`item-${item.id}`}
                    item={item}
                    remaining={remaining}
                    isExpanded={expandedItems[item.id]}
                    toggleItem={toggleItem}
                    handleDeleteItem={handleDeleteItem}
                  />
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
