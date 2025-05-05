import { FC, FormEvent, useEffect, useState } from "react";
import { AppDispatch } from "../../store";
import { useDispatch } from "react-redux";
import { getAllCategories } from "../../store/slices/Transaction/categorySlice";
import { CategoryType } from "../../types/transaction/categoryType";
import { getAllItems } from "../../store/slices/Transaction/ItemSlice";
import { ItemType } from "../../types/transaction/itemType";
import { useLocation, useNavigate } from "react-router-dom";
import { EntryTypeDTO } from "../../types/transaction/entryType";
import { newEntry } from "../../store/slices/Transaction/entrySlice";

const CreateEntry: FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [items, setItems] = useState<ItemType[]>([]); // Assuming you have a ItemDTO defined
  const location = useLocation();
  const [categoryId, setCategoryId] = useState<number>(-1); // Get initial categoryId from location state
  const [itemId, setItemId] = useState<number>(-1); // Get initial itemId from location state
  const [note, setNote] = useState<string>("");
  const [isExpense, setIsExpense] = useState<boolean>(true);
  const [amount, setAmount] = useState<string>("0.00");
  const [entryDate, setEntryDate] = useState<Date>(new Date());
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const result = await dispatch(getAllCategories());
        if (result.success) {
          setCategories(result.data);
        } else {
          for (const key in result.messages) {
            alert(`${key}: ${result.messages[key]}`);
          }
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
        alert("An unexpected error occurred while fetching categories.");
      }
    };
    const fetchItems = async () => {
      try {
        const result = await dispatch(getAllItems());
        if (result.success) {
          setItems(result.data);
        } else {
          for (const key in result.messages) {
            alert(`${key}: ${result.messages[key]}`);
          }
        }
      } catch (error) {
        console.error("Error fetching items:", error);
        alert("An unexpected error occurred while fetching items.");
      }
    };
    fetchCategories();
    fetchItems();
    setCategoryId(location.state?.categoryId ?? -1); // Get initial categoryId from location state
    setItemId(location.state?.itemId ?? -1); // Get initial itemId from location state
  }, [dispatch]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const entryToCreate = {
      categoryId,
      itemId,
      note,
      isExpense,
      amount: parseFloat(amount.replace(/[^0-9.-]+/g, "")),
      entryDate,
    } as EntryTypeDTO; // Replace with your actual EntryDTO type

    try {
      const result = await dispatch(newEntry(entryToCreate));
      if (result.success) {
        alert("Entry created successfully!");
        navigate(-1); // For now just go back to the previous page
      }
    } catch (error) {
      console.error("Error creating entry:", error);
    }
  };

  return (
    <>
      <h1>Create Entry</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="amount" className="form-label">
            Amount
          </label>
          <input
            type="text"
            className="form-control"
            id="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
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
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="isExpense" className="form-label">
            Is Expense?
          </label>
          <input
            type="checkbox"
            id="isExpense"
            checked={isExpense}
            onChange={(e) => setIsExpense(e.target.checked)}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="categoryId" className="form-label">
            Category
          </label>
          <select
            id="categoryId"
            value={categoryId}
            onChange={(e) => setCategoryId(parseInt(e.target.value))}>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-3">
          <label htmlFor="itemId" className="form-label">
            Item
          </label>
          <select
            id="itemId"
            value={itemId}
            onChange={(e) => setItemId(parseInt(e.target.value))}>
            {items.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-3">
          <label htmlFor="entryDate" className="form-label">
            Entry Date
          </label>
          <input
            type="date"
            className="form-control"
            id="entryDate"
            value={entryDate.toISOString().split("T")[0]}
            onChange={(e) => setEntryDate(new Date(e.target.value))}
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Create Entry
        </button>
        <button className="btn btn-secondary" onClick={() => navigate(-1)}>
          Cancel
        </button>
      </form>
    </>
  );
};

export default CreateEntry;
