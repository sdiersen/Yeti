import axios, { isAxiosError } from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:5238/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export const handleAxiosError = (
  error: unknown,
  dispatch: any,
  setErrors: (errors: { [key: string]: string[] }) => void,
  setMessages: (messages: { [key: string]: string[] }) => void,
  setSuccess: (success: boolean) => void
) => {
  if (isAxiosError(error)) {
    let errorMessage: string[] = []; //string array to hold error messages
    if (error.response?.data) {
      //it is an axios error, but we have data from server so use it.
      const { errors, messages } = error.response.data;
      if (Array.isArray(errors)) {
        errorMessage = [...errors];
      } else {
        errorMessage.push(errors);
      }
      dispatch(setMessages(messages || []));
    }
    if (error.message) {
      errorMessage.push(`Axios Message: ${error.message}`);
    }
    if (error.code) {
      errorMessage.push(`Axios Code: ${error.code}`);
    }
    if (error.response?.status) {
      errorMessage.push(`Axios Status: ${error.response.status.toString()}`);
    }
    dispatch(setErrors({ axioserrors: errorMessage }));
    dispatch(setSuccess(false)); // this assumes if there is an axios error, then success is always false.
  } else {
    dispatch(setErrors({ unknown: ["An unexpected error occurred."] }));
    dispatch(setSuccess(false));
  }
};

export default axiosInstance;
export { isAxiosError };
