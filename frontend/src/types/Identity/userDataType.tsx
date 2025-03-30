import { BaseModelType } from "../baseModelType";

export interface UserDataType extends BaseModelType {
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
}
