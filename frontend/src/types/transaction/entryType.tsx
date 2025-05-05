import { BaseModelType } from "../baseModelType";

export interface EntryType extends BaseModelType {
  entryDate: Date;
  amount: number;
  isExpense: boolean;
  note: string;
  itemId: number;
  categoryId: number;
}

export interface EntryTypeDTO {
  entryDate: Date;
  amount: number;
  isExpense: boolean;
  note: string;
  itemId: number;
  categoryId: number;
}

export const defaultEntryType: EntryType = {
  id: -1,
  createdOn: new Date(),
  modifiedOn: new Date(),
  entryDate: new Date(),
  amount: 0,
  isExpense: true,
  note: "",
  itemId: -1,
  categoryId: -1,
};

export const defaultEntryTypeDTO: EntryTypeDTO = {
  entryDate: new Date(),
  amount: 0,
  isExpense: true,
  note: "",
  itemId: -1,
  categoryId: -1,
};
