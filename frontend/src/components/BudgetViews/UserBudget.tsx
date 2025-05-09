import { FC, Fragment, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store";
import { getAllCategories } from "../../store/slices/Transaction/categorySlice";
import { CategoryType } from "../../types/transaction/categoryType";
import ItemListByCategoryId from "../item/ItemListByCategoryId";

const UserBudget: FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [expandedCategories, setExpandedCategories] = useState<
    Record<number, boolean>
  >({});
  const [budgetSums, setBudgetSums] = useState<Record<number, number>>({});
  const [spentSums, setSpentSums] = useState<Record<number, number>>({});

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await dispatch(getAllCategories());
        if (response.success) {
          setCategories(response.data);
          setExpandedCategories(
            Object.fromEntries(
              response.data.map((category) => [category.id, true])
            )
          );
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

  const sortedCategories = [...categories].sort((a, b) =>
    a.name.localeCompare(b.name)
  );
  const toggleCategory = (categoryId: number) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }));
  };

  const updateBudget = (categoryId: number, sum: number) => {
    setBudgetSums((prev) => ({
      ...prev,
      [categoryId]: sum,
    }));
  };

  const updateSpent = (categoryId: number, sum: number) => {
    setSpentSums((prev) => ({
      ...prev,
      [categoryId]: sum,
    }));
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  return (
    <>
      <h1>User Budget</h1>
      <table className="table table-light">
        <tbody>
          {sortedCategories.map((category) => (
            <Fragment key={category.id}>
              <tr>
                <td className="text-start fw-bold">
                  <i
                    className={`bi ${
                      expandedCategories[category.id]
                        ? "bi-chevron-up"
                        : "bi-chevron-down"
                    } me-2`}
                    style={{ cursor: "pointer" }}
                    onClick={() => toggleCategory(category.id)}></i>
                  {category.name}
                </td>
                <td className="fw-bold">
                  Budget: {formatCurrency(budgetSums[category.id] || 0)}
                </td>
                <td className="fw-bold">
                  Spent: {formatCurrency(spentSums[category.id] || 0)}
                </td>
              </tr>
              {expandedCategories[category.id] && (
                <tr>
                  <td colSpan={3}>
                    <ItemListByCategoryId
                      categoryId={category.id}
                      onCalculateBudget={(sum) =>
                        updateBudget(category.id, sum)
                      }
                      onCalculateSpent={(sum) => updateSpent(category.id, sum)}
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

export default UserBudget;
