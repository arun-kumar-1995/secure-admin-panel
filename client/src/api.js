import axios from "axios";
import { API_BASE_URL } from "./utils/constants";

// create base api
export const API = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});