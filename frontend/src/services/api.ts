// filepath: src/services/api.ts
import axios from "axios";

const api = axios.create({
  baseURL: "https://api.example.com",
});

export default api;
