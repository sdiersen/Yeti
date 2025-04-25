export interface BaseModelType {
  id: number;
  createdOn: Date;
  modifiedOn: Date;
}

export const defaultBaseModelType: BaseModelType = {
  id: 0,
  createdOn: new Date(0),
  modifiedOn: new Date(0),
};
