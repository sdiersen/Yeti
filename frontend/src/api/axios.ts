import axios, { isAxiosError } from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:5238/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
export { isAxiosError };
