import { BaseModelType } from "../baseModelType";

export interface CategoryItemType extends BaseModelType {
  name: string;
  note: string;
  isExpense: boolean;
  budgetAmount: number;
  currentAmount: number;
  categoryId: number;
}
