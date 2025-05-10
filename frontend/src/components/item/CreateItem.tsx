import { FC, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import { useNavigate } from "react-router-dom";
import { ItemDTO } from "../../types/transaction/itemType";
import { createItem } from "../../store/slices/Transaction/ItemSlice";
import CurrencyInput from "react-currency-input-field";

const CreateItem: FC = () => {
  const categories = useSelector(
    (state: RootState) => state.category.categories
  );

  const [name, setName] = useState<string>("");
  const [note, setNote] = useState<string>("");
  const [isExpense, setIsExpense] = useState<boolean>(true);
  const [budgetAmount, setBudgetAmount] = useState<string>("0.00");
  const [currentAmount, setCurrentAmount] = useState<string>("0.00");
  const [categoryId, setCategoryId] = useState<number>(-1);

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const itemToCreate = {
      name,
      note,
      isExpense,
      budgetAmount: parseFloat(budgetAmount.replace(/[^0-9.-]+/g, "")),
      currentAmount: parseFloat(currentAmount.replace(/[^0-9.-]+/g, "")),
      categoryId,
    } as ItemDTO;

    if (name) {
      try {
        const result = await dispatch(createItem(itemToCreate));
        if (result.success) {
          alert("Item created successfully!");
          navigate(-1); // For now just go back to the previous page
        } else {
          for (const key in result.messages) {
            console.log(`${key}: ${result.messages[key]}`);
          }
        }
      } catch (error) {
        console.error("Error creating item:", error);
      }
    }
  };

  return (
    <>
      <h1>Create Item</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="itemName" className="form-label">
            Name
          </label>
          <input
            onChange={(e) => setName(e.target.value)}
            value={name}
            type="text"
            className="form-control"
            id="itemName"
            name="itemName"
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="note" className="form-label">
            Note
          </label>
          <textarea
            onChange={(e) => setNote(e.target.value)}
            value={note}
            className="form-control"
            id="note"
            name="note"
            rows={3}></textarea>
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
            defaultValue={budgetAmount}
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
            defaultValue={currentAmount}
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
            onChange={(e) => setCategoryId(Number(e.target.value))}
            value={categoryId}
            className="form-select"
            id="categoryId"
            name="categoryId">
            <option value={-1} disabled>
              Select a category
            </option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        <button type="submit" className="btn btn-primary">
          Create Item
        </button>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => {
            navigate(-1);
          }}>
          Cancel
        </button>
      </form>
    </>
  );
};

export default CreateItem;
