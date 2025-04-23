import { BaseModelType } from "../baseModelType";
import { RoleType } from "./roleType";

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

export interface LoginDTO {
  username: string;
  password: string;
}

export interface RegisterDTO {
  username: string;
  password: string;
}

export interface UpdateAccountDTO {
  account: AccountType;
  roles: number[];
}

export const defaultUpdateAccountDTO: UpdateAccountDTO = {
  account: defaultAccount,
  roles: [],
};

export interface AccountLoggedInDTO {
  account: AccountType;
  roleNames: string[];
}

export const defaultAccountLoggedInDTO: AccountLoggedInDTO = {
  account: defaultAccount,
  roleNames: [],
};

export interface AccountWithRolesDTO {
  account: AccountType;
  roles: RoleType[];
}
