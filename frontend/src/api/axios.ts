import axios, { isAxiosError } from "axios";
import {
  ApiResponseDataType,
  ApiResponseType,
  defaultApiResponseDataType,
} from "../types/api/apiResponseType";

const axiosInstance = axios.create({
  baseURL: "http://localhost:5238/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export const handleAxiosErrorTyped = <T>(
  error: any
): ApiResponseDataType<T> => {
  let response: ApiResponseDataType<T> = {
    data: null as unknown as T,
    messages: {},
    errors: {},
    success: false,
  };

  if (isAxiosError(error)) {
    if (error.response?.data) {
      const { data, messages, errors } = error.response
        .data as ApiResponseDataType<T>;
      response.data = data;
      response.messages = messages || {};
      response.errors = errors || {};
    }
    if (error.message) {
      response.errors["axios"] = [`Axios Message: ${error.message}`];
    }
    if (error.code) {
      response.errors["axios"] = [
        ...(response.errors["axios"] || {}),
        `Axios Code: ${error.code}`,
      ];
    }
    if (error.response?.status) {
      response.errors["axios"] = [
        ...(response.errors["axios"] || []),
        `Axios Status: ${error.response.status.toString()}`,
      ];
    }
  } else {
    response = defaultApiResponseDataType as ApiResponseDataType<T>;
    response.errors["unknown"] = ["Unknown error occurred"];
    response.errors["unknonw"].push(error.message);
    response.success = false;
  }
  return response;
};

export const handleAxiosError = (error: any): ApiResponseType => {
  const response: ApiResponseType = {
    messages: {},
    errors: {},
    success: false,
  };

  if (error.response?.data) {
    const { messages, errors } = error.response.data as ApiResponseType;
    response.messages = messages || {};
    response.errors = errors || {};
  }
  if (error.message) {
    response.errors["axios"] = [`Axios Message: ${error.message}`];
  }
  if (error.code) {
    response.errors["axios"] = [
      ...(response.errors["axios"] || []),
      `Axios Code: ${error.code}`,
    ];
  }
  if (error.response?.status) {
    response.errors["axios"] = [
      ...(response.errors["axios"] || []),
      `Axios Status: ${error.response.status.toString()}`,
    ];
  } else {
    response.errors["unknown"] = ["Unknown error occurred"];
    response.errors["unknonw"].push(error.message);
    response.success = false;
  }
  return response;
};

export default axiosInstance;
export { isAxiosError };
