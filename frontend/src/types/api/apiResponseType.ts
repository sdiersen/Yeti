export interface ApiResponseDataType<T = any> {
  data: T;
  messages: string[];
  errors: string[];
  success: boolean;
}

export interface ApiResponseType {
  messages: string[];
  errors: string[];
  success: boolean;
}
