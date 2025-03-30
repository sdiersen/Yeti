import { BaseModelType } from "../baseModelType";

export interface EntryType extends BaseModelType {
  entryDate: Date;
  amount: number;
  isExpense: boolean;
  note: string;
  itemId: number;
  categoryId: number;
}
