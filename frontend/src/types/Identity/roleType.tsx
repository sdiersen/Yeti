import { BaseModelType } from "../baseModelType";

export interface RoleType extends BaseModelType {
  roleName: string;
  description: string;
  roleNumber: number;
}
