import { FC } from "react";
import {
  CategoryType,
  defaultCagegoryType,
} from "../../types/transaction/categoryType";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store";
import { useLocation, useNavigate } from "react-router-dom";
import { updateCategory } from "../../store/slices/Transaction/categorySlice";

const ModifyCategory: FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const location = useLocation();
  const category: CategoryType =
    location.state?.category || defaultCagegoryType;

  const handleSaveButton = async (event: React.FormEvent) => {
    event.preventDefault();
    const updatedCategory: CategoryType = {
      id: category.id,
      name: (event.target as HTMLFormElement).categoryName.value,
      description: (event.target as HTMLFormElement).description.value,
      createdOn: category.createdOn,
      modifiedOn: category.modifiedOn,
    };
    try {
      const result = await dispatch(updateCategory(updatedCategory));
      if (result.success) {
        alert("Category updated successfully!");
        navigate(-1); // For now just go back to the previous page
      } else {
        console.error(
          "Failed to update category:",
          result.messages,
          result.errors
        );
        for (const key in result.messages) {
          console.log(`${key}: ${result.messages[key]}`);
        }
        for (const key in result.errors) {
          console.log(`${key}: ${result.errors[key]}`);
        }
      }
    } catch (error) {
      console.error("Error updating category:", error);
    }
  };

  return (
    <div className="container">
      <h1>Modify Category</h1>
      <form onSubmit={handleSaveButton}>
        <div className="mb-3">
          <label htmlFor="categoryName" className="form-label">
            Category Name
          </label>
          <input
            type="text"
            className="form-control"
            id="categoryName"
            name="categoryName"
            defaultValue={category.name}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="description" className="form-label">
            Description
          </label>
          <textarea
            className="form-control"
            id="description"
            name="description"
            defaultValue={category.description}></textarea>
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
  );
};

export default ModifyCategory;
