import { FC, Fragment, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import { deleteItem } from "../../store/slices/Transaction/ItemSlice";
import LockModifyDelete from "../buttons/LockModifyDelete";
import { useNavigate } from "react-router-dom";
import "../../assets/css/Item.css"; // Assuming you have a CSS file for styling

const ItemList: FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const items = useSelector((state: RootState) => state.item.items);
  const categories = useSelector(
    (state: RootState) => state.category.categories
  );

  const [expandedCategories, setExpandedCategories] = useState<
    Record<number, boolean>
  >({});

  useEffect(() => {
    setExpandedCategories(
      Object.fromEntries(categories.map((category) => [category.id, true]))
    );
  }, [categories]);

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
        alert("An unexpected error occurred while deleting the item.");
      }
    }
  };

  const toggleCategory = (categoryId: number) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }));
  };

  const sortedCategories = [...categories].sort((a, b) =>
    a.name.localeCompare(b.name)
  );

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  return (
    <>
      <h1>Item List</h1>
      <table className="table table-light">
        <tbody>
          {sortedCategories.map((category) => {
            const filteredItems = items.filter(
              (item) => item.categoryId === category.id
            );
            const isExpanded = expandedCategories[category.id] || false;

            return (
              <Fragment key={category.id}>
                {/* Category name */}
                <tr className="thick-border-bottom">
                  <td
                    colSpan={6}
                    className="text-start fw-bold"
                    title={category.description}>
                    <i
                      className={`bi ${
                        isExpanded ? "bi-chevron-up" : "bi-chevron-down"
                      } me-2`}
                      style={{ cursor: "pointer" }}
                      onClick={() => toggleCategory(category.id)}></i>
                    {category.name}
                    <button
                      className="btn btn-primary btn-sm float-end me-2"
                      onClick={() => {
                        navigate("/CreateItem", {
                          state: { categoryId: category.id },
                        });
                      }}>
                      {`Create ${category.name} Item`}
                    </button>
                  </td>
                </tr>

                {/* Blank row if there are no items */}
                {filteredItems.length === 0 && isExpanded && (
                  <tr>
                    <td colSpan={6}>&nbsp;</td>
                  </tr>
                )}

                {/* Column headings (only if there are items) */}
                {filteredItems.length > 0 && isExpanded && (
                  <tr className="fw-bold">
                    <td className="text-start">Name</td>
                    <td className="text-start">Note</td>
                    <td className="text-start">Is Expense</td>
                    <td className="text-start">Budget Amount</td>
                    <td className="text-start">Actions</td>
                  </tr>
                )}

                {/* Items under the category */}
                {isExpanded &&
                  filteredItems.map((item) => (
                    <tr key={item.id}>
                      <td>{item.name}</td>
                      <td>{item.note}</td>
                      <td>{item.isExpense ? "Yes" : "No"}</td>
                      <td>{formatCurrency(item.budgetAmount)}</td>
                      <td>
                        <LockModifyDelete
                          initialLocked={true}
                          onModify={() => {
                            navigate("/ModifyItem", { state: { item } });
                          }}
                          onDelete={() => handleDeleteItem(item.id)}
                        />
                      </td>
                    </tr>
                  ))}

                {/* Blank row after items if there are any */}
                {isExpanded && filteredItems.length > 0 && (
                  <tr>
                    <td colSpan={6}>&nbsp;</td>
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

export default ItemList;
