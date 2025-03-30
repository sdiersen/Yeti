import { BaseModelType } from "../baseModelType";

export interface ItemType extends BaseModelType {
  name: string;
  note: string;
  isExpense: boolean;
  budgetAmount: number;
  currentAmount: number;
  categoryId: number;
}
