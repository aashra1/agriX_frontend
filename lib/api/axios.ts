// lib/api/axios.ts
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
    console.log(`🟡 Axios request to: ${config.url}`);

    const isUploadDoc = config.url?.includes("/upload-document");

    if (isUploadDoc) {
      const tempToken = await getTempToken();
      console.log("Temp token exists:", !!tempToken);
      if (tempToken) {
        config.headers.Authorization = `Bearer ${tempToken}`;
        console.log("✅ Temp token attached");
      }
    } else {
      const token = await getAuthToken();
      console.log(`Auth token for ${config.url}:`, !!token);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        console.log(`✅ Token attached to ${config.url}`);
      } else {
        console.warn(`❌ No token found for ${config.url}`);
      }
    }

    // Log final headers (without exposing full token)
    console.log("Request headers:", {
      ...config.headers,
      Authorization: config.headers.Authorization
        ? "Bearer [HIDDEN]"
        : undefined,
    });

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default axiosInstance;
