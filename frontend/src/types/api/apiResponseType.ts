export interface ApiResponseDataType<T = any> {
  data: T;
  messages: { [key: string]: string[] };
  errors: { [key: string]: string[] };
  success: boolean;
}

export const defaultApiResponseDataType: ApiResponseDataType = {
  data: {},
  messages: {},
  errors: {},
  success: false,
};

export interface ApiResponseType {
  messages: { [key: string]: string[] };
  errors: { [key: string]: string[] };
  success: boolean;
}

export const defaultApiResponseType: ApiResponseType = {
  messages: {},
  errors: {},
  success: false,
};
