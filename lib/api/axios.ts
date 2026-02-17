import axios from "axios";
import { getAuthToken, getTempToken } from "@/lib/cookie";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5001";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  async (config) => {
    const isUploadDoc = config.url?.includes("/upload-document");

    if (isUploadDoc) {
      const tempToken = await getTempToken();
      if (tempToken) {
        config.headers.Authorization = `Bearer ${tempToken}`;
        console.log("Using temp token for document upload");
      } else {
        console.warn("No temp token found for document upload");
      }
    } else {
      const token = await getAuthToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default axiosInstance;
