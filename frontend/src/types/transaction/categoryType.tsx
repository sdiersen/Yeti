import { BaseModelType, defaultBaseModelType } from "../baseModelType";

export interface CategoryType extends BaseModelType {
  name: string;
  description: string;
}

export const defaultCagegoryType: CategoryType = {
  ...defaultBaseModelType,
  name: "",
  description: "",
};

export interface CategoryDTO {
  name: string;
  description: string;
}
