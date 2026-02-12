import axiosInstance from "@/lib/api/axios";
import { API } from "@/lib/api/endpoints";

export const getAllCategories = async () => {
  try {
    const response = await axiosInstance.get(API.CATEGORY.GET_ALL);
    return response.data;
  } catch (err: any) {
    throw err;
  }
};

export const getCategoryById = async (id: string) => {
  try {
    const response = await axiosInstance.get(API.CATEGORY.GET_BY_ID(id));
    return response.data;
  } catch (err: any) {
    throw err;
  }
};
