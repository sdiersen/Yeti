import { FC, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store";
import { getAllCategories } from "../../store/slices/Transaction/categorySlice";
import { CategoryType } from "../../types/transaction/categoryType";
import LockModifyDelete from "../../components/buttons/LockModifyDelete";
import { deleteCategory } from "../../store/slices/Transaction/categorySlice";
import { useNavigate } from "react-router-dom";

const CategoryList: FC = () => {
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const handleDeleteCategory = async (categoryId: number) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      try {
        const result = await dispatch(deleteCategory(categoryId));
        if (result.success) {
          setCategories((prevCategories) =>
            prevCategories.filter((category) => category.id !== categoryId)
          );
          alert("Category deleted successfully!");
        } else {
          alert("Failed to delete category: ");
        }
      } catch (error) {
        console.error("Error deleting category:", error);
        alert("An unexpected error occurred while deleting the category.");
      }
    }
  };

  // Fetch categories when the component mounts
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await dispatch(getAllCategories());
        if (response.success) {
          setCategories(response.data);
        } else {
          for (const key in response.messages) {
            console.log(`${key}: ${response.messages[key]}`);
          }
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, [dispatch]);

  return (
    <>
      <h1>Category List</h1>
      <table className="table table-striped">
        <thead>
          <tr>
            <th className="text-start">Category Name</th>
            <th className="text-start">Description</th>
            <th className="text-start">Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((category) => (
            <tr key={category.id}>
              <td>{category.name}</td>
              <td>{category.description}</td>
              <td>
                <LockModifyDelete
                  initialLocked={true}
                  onModify={() => {
                    navigate("/ModifyCategory", { state: { category } });
                  }}
                  onDelete={() => handleDeleteCategory(category.id)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default CategoryList;
