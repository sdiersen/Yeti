import { FC, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AppDispatch } from "../../store";
import { createCategory } from "../../store/slices/Transaction/categorySlice";
import { CategoryDTO } from "../../types/transaction/categoryType";

const CreateCategory: FC = () => {
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (name && description) {
      try {
        const result = await dispatch(
          createCategory({ name, description } as CategoryDTO)
        );
        if (result.success) {
          alert("Category created successfully!");
          navigate(-1); // For now just go back to the previous page
        } else {
          for (const key in result.messages) {
            console.log(`${key}: ${result.messages[key]}`);
          }
        }
      } catch (error) {
        console.error("Error creating category:", error);
      }
    }
  };
  return (
    <>
      <h1>Create Category</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="categoryName" className="form-label">
            Category Name
          </label>
          <input
            onChange={(e) => setName(e.target.value)}
            value={name}
            type="text"
            className="form-control"
            id="categoryName"
            name="categoryName"
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="description" className="form-label">
            Description
          </label>
          <textarea
            onChange={(e) => setDescription(e.target.value)}
            value={description}
            className="form-control"
            id="description"
            name="description"
            rows={3}
            required></textarea>
        </div>
        <button type="submit" className="btn btn-primary">
          Create Category
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

export default CreateCategory;
