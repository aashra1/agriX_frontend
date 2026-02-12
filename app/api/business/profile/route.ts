import axiosInstance from "@/lib/api/axios";
import { API } from "@/lib/api/endpoints";
import { getAuthToken } from "@/lib/cookie";

export const getBusinessProfile = async () => {
  try {
    const token = await getAuthToken();
    console.log("Token being sent:", token); // Debug log

    const response = await axiosInstance.get(API.BUSINESS.GET_PROFILE, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("Profile response:", response.data); // Debug log
    return response.data;
  } catch (err: any) {
    console.error("Get profile error:", err.response?.data || err.message);
    throw err;
  }
};

export const updateBusinessProfile = async (formData: FormData) => {
  try {
    const token = await getAuthToken();
    console.log("Update token:", token); // Debug log

    const response = await axiosInstance.put(
      API.BUSINESS.UPDATE_PROFILE,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      },
    );
    console.log("Update response:", response.data); // Debug log
    return response.data;
  } catch (err: any) {
    console.error("Update profile error:", err.response?.data || err.message);
    throw err;
  }
};
