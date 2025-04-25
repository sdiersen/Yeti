import { BaseModelType, defaultBaseModelType } from "../baseModelType";

export interface AccountRoleType extends BaseModelType {
  accountId: number;
  roleId: number;
}

export const defaultAccountRoleType: AccountRoleType = {
  ...defaultBaseModelType,
  accountId: 0,
  roleId: 0,
};
