import { FC, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../store";
import { useLocation, useNavigate } from "react-router-dom";
import { defaultItemType, ItemType } from "../../types/transaction/itemType";
import { updateItem } from "../../store/slices/Transaction/ItemSlice";
import CurrencyInput from "react-currency-input-field";

const ModifyItem: FC = () => {
  const categories = useSelector(
    (state: RootState) => state.category.categories
  );

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const location = useLocation();
  const [budgetAmount, setBudgetAmount] = useState<string>("");
  const [isExpense, setIsExpense] = useState<boolean>(true);
  const [name, setName] = useState<string>("");
  const [note, setNote] = useState<string>("");
  const item: ItemType = location.state?.item || defaultItemType;
  const [categoryId, setCategoryId] = useState<number>(-1);

  useEffect(() => {
    setCategoryId(item.categoryId ?? -1);
    setBudgetAmount(item.budgetAmount.toString() || "");
    setIsExpense(item.isExpense ?? true);
    setName(item.name || "");
    setNote(item.note || "");
  }, [dispatch]);

  const handleSaveButton = async (event: React.FormEvent) => {
    event.preventDefault();
    const updatedItem: ItemType = {
      id: item.id,
      name,
      note,
      isExpense,
      budgetAmount: parseFloat(budgetAmount.replace(/[^0-9.-]+/g, "")),
      categoryId,
      createdOn: item.createdOn,
      modifiedOn: item.modifiedOn,
    };
    try {
      const result = await dispatch(updateItem(updatedItem));
      if (result.success) {
        alert("Item updated successfully!");
        navigate(-1); // For now just go back to the previous page
      } else {
        for (const key in result.messages) {
          console.log(`${key}: ${result.messages[key]}`);
        }
        for (const key in result.errors) {
          console.log(`${key}: ${result.errors[key]}`);
        }
      }
    } catch (error) {
      console.error("Error updating item:", error);
      alert("An unexpected error occurred while updating the item.");
    }
  };

  return (
    <>
      <div className="container">
        <h1>Modify Item</h1>
        <form onSubmit={handleSaveButton}>
          <div className="mb-3">
            <label htmlFor="itemName" className="form-label">
              Name
            </label>
            <input
              type="text"
              className="form-control"
              id="itemName"
              name="itemName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter item name"
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="note" className="form-label">
              Note
            </label>
            <input
              type="text"
              className="form-control"
              id="note"
              name="note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Enter note"
            />
          </div>
          <div className="mb-3 form-check">
            <input
              onChange={(e) => setIsExpense(e.target.checked)}
              checked={isExpense}
              type="checkbox"
              className="form-check-input"
              id="isExpense"
            />
            <label className="form-check-label" htmlFor="isExpense">
              Is Expense?
            </label>
          </div>
          <div className="mb-3">
            <label htmlFor="budgetAmount" className="form-label">
              Budget Amount
            </label>
            <CurrencyInput
              id="budgetAmount"
              name="budgetAmount"
              className="form-control"
              placeholder="Enter budget amount"
              value={budgetAmount}
              decimalsLimit={2}
              prefix="$"
              onValueChange={(value) => setBudgetAmount(value || "0.00")}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="categoryId" className="form-label">
              Category
            </label>
            <select
              className="form-select"
              id="categoryId"
              name="categoryId"
              value={categoryId}
              onChange={(e) => setCategoryId(Number(e.target.value))}>
              <option value="-1">Select Category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          <button type="submit" className="btn btn-primary">
            Save Changes
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => {
              navigate(-1);
            }}>
            Back
          </button>
        </form>
      </div>
    </>
  );
};

export default ModifyItem;
