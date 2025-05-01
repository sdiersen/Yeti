import { BaseModelType, defaultBaseModelType } from "../baseModelType";

export interface ItemType extends BaseModelType {
  name: string;
  note: string;
  isExpense: boolean;
  budgetAmount: number;
  currentAmount: number;
  categoryId: number;
}
export const defaultItemType: ItemType = {
  ...defaultBaseModelType,
  name: "",
  note: "",
  isExpense: true,
  budgetAmount: 0,
  currentAmount: 0,
  categoryId: -1,
};

export interface ItemDTO {
  name: string;
  note: string;
  isExpense: boolean;
  budgetAmount: number;
  currentAmount: number;
  categoryId: number;
}

export const defaultItemDTO: ItemDTO = {
  name: "",
  note: "",
  isExpense: true,
  budgetAmount: 0,
  currentAmount: 0,
  categoryId: -1,
};
