import { FC, Fragment, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ItemType } from "../../types/transaction/itemType";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store";
import {
  deleteItem,
  getAllItemsByCategoryId,
} from "../../store/slices/Transaction/ItemSlice";
import LockModifyDelete from "../buttons/LockModifyDelete";
import EntryListByItemId from "../entry/EntryListByItemId";
import DroppableArea from "../droppable/DroppableArea";

interface ItemListByCategoryIdProps {
  categoryId: number;
  onCalculateBudget: (sum: number) => void;
  onCalculateSpent: (sum: number) => void;
}

const ItemListByCategoryId: FC<ItemListByCategoryIdProps> = ({
  categoryId,
  onCalculateBudget,
  onCalculateSpent,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [items, setItems] = useState<ItemType[]>([]);
  // @ts-ignore: spentSum is intentionally not used.
  const [spentSum, setSpentSum] = useState<Record<number, number>>({});
  const [expandedItems, setExpandedItems] = useState<Record<number, boolean>>(
    {}
  );

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const result = await dispatch(getAllItemsByCategoryId(categoryId));
        if (result.success) {
          setItems(result.data);
          setExpandedItems(
            Object.fromEntries(result.data.map((item) => [item.id, true]))
          );
          const sum = result.data.reduce(
            (total, item) => total + item.budgetAmount,
            0
          );
          onCalculateBudget(sum);
        } else {
          for (const key in result.messages) {
            console.log(`${key}: ${result.messages[key]}`);
          }
        }
      } catch (error) {
        console.error("Error fetching items:", error);
      }
    };
    fetchItems();
  }, [dispatch, categoryId]);

  const handleDeleteItem = async (itemId: number) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        const result = await dispatch(deleteItem(itemId));
        if (result.success) {
          setItems((prevItems) =>
            prevItems.filter((item) => item.id !== itemId)
          );
          alert("Item deleted successfully!");
        } else {
          alert("Failed to delete item: ");
        }
      } catch (error) {
        console.error("Error deleting item:", error);
      }
    }
  };

  const updateSpentSum = (itemId: number, sum: number) => {
    setSpentSum((prev) => {
      const updatedSums = { ...prev, [itemId]: sum };
      const totalSum = Object.values(updatedSums).reduce(
        (total, itemSum) => total + itemSum,
        0
      );
      onCalculateSpent(totalSum);
      return updatedSums;
    });
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
            items.map((item) => (
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
                    <td>Remaining: {item.currentAmount}</td>
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
                      <EntryListByItemId
                        itemId={item.id}
                        onCalculateSpent={(sum) => updateSpentSum(item.id, sum)}
                      />
                    </td>
                  </tr>
                )}
              </Fragment>
            ))}
        </tbody>
      </table>
    </>
  );
};
export default ItemListByCategoryId;
