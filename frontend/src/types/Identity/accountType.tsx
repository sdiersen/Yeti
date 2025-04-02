import { BaseModelType } from "../baseModelType";

export interface AccountType extends BaseModelType {
  username: string;
  password: string;
  lastLogin: Date;
  isActive: boolean;
  isLocked: boolean;
}

export const defaultAccount: AccountType = {
  id: 0,
  username: "",
  password: "",
  lastLogin: new Date(0),
  isActive: true,
  isLocked: false,
  createdOn: new Date(0),
  modifiedOn: new Date(0),
};
