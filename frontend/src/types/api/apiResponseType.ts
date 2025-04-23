export interface ApiResponseDataType<T = any> {
  data: T;
  messages: { [key: string]: string[] };
  errors: { [key: string]: string[] };
  success: boolean;
}

export interface ApiResponseType {
  messages: { [key: string]: string[] };
  errors: { [key: string]: string[] };
  success: boolean;
}
