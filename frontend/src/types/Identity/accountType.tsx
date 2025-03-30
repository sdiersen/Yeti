import { BaseModelType } from "../baseModelType";

export interface AccountType extends BaseModelType {
  username: string;
  password: string;
  lastLogin: Date;
  isActive: boolean;
  isLocked: boolean;
}
