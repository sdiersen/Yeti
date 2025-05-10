import { FC, Fragment, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import ItemListByCategoryId from "../item/ItemListByCategoryId";
import { selectBudgetSums } from "../../selectors/budgetSelectors";

const UserBudget: FC = () => {
  const categories = useSelector(
    (state: RootState) => state.category.categories
  );
  const budgetSums = useSelector(selectBudgetSums);

  const [expandedCategories, setExpandedCategories] = useState<
    Record<number, boolean>
  >({});

  useEffect(() => {
    setExpandedCategories(
      Object.fromEntries(categories.map((category) => [category.id, true]))
    );
  }, [categories]);

  const sortedCategories = [...categories].sort((a, b) =>
    a.name.localeCompare(b.name)
  );
  const toggleCategory = (categoryId: number) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [categoryId]: !prev[categoryId],
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
                  Budget: {formatCurrency(budgetSums[category.id]?.budget || 0)}
                </td>
                <td className="fw-bold">
                  Spent: {formatCurrency(budgetSums[category.id]?.spent || 0)}
                </td>
              </tr>
              {expandedCategories[category.id] && (
                <tr>
                  <td colSpan={3}>
                    <ItemListByCategoryId categoryId={category.id} />
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
