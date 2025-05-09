import { FC, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store";
import { useLocation, useNavigate } from "react-router-dom";
import { defaultItemType, ItemType } from "../../types/transaction/itemType";
import { updateItem } from "../../store/slices/Transaction/ItemSlice";
import { getAllCategories } from "../../store/slices/Transaction/categorySlice";
import { CategoryType } from "../../types/transaction/categoryType";
import CurrencyInput from "react-currency-input-field";

const ModifyItem: FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const location = useLocation();
  const [budgetAmount, setBudgetAmount] = useState<string>("");
  const [currentAmount, setCurrentAmount] = useState<string>("");
  const [isExpense, setIsExpense] = useState<boolean>(true);
  const [name, setName] = useState<string>("");
  const [note, setNote] = useState<string>("");
  const item: ItemType = location.state?.item || defaultItemType;
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [categoryId, setCategoryId] = useState<number>(-1);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const result = await dispatch(getAllCategories());
        if (result.success) {
          setCategories(result.data);
        } else {
          for (const key in result.messages) {
            console.log(`${key}: ${result.messages[key]}`);
          }
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
    setCategoryId(item.categoryId ?? -1);
    setBudgetAmount(item.budgetAmount.toString() || "");
    setCurrentAmount(item.currentAmount.toString() || "");
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
      currentAmount: parseFloat(currentAmount.replace(/[^0-9.-]+/g, "")),
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
            <label htmlFor="currentAmount" className="form-label">
              Current Amount
            </label>
            <CurrencyInput
              id="currentAmount"
              name="currentAmount"
              className="form-control"
              placeholder="Enter current amount (leave blank for 0)"
              value={currentAmount}
              decimalsLimit={2}
              prefix="$"
              onValueChange={(value) => setCurrentAmount(value || "0.00")}
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
